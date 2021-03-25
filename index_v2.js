
// Dependencies
var mysql = require('mysql');

// mySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'parvez',
    port: 3308,
    password: '',
    database: 'diecast'
});

connection.connect();

var connection_v2 = mysql.createConnection({
    host: 'localhost',
    user: 'parvez',
    port: 3308,
    password: '',
    database: 'bde_zeiten'
});

connection_v2.connect();

/* 

Dynamic Date Creation
// All about Date Object
const date_obj = new Date();
const today_date = `${date_obj.getFullYear()}-${date_obj.getMonth() + 1}-${date_obj.getDate()}`;

// Getting the indivitual values
const year = date_obj.getFullYear();
const month = date_obj.getMonth() + 1;
const date = date_obj.getDate();
const hours = date_obj.getHours();
const minutes = date_obj.getMinutes();
const seconds = date_obj.getSeconds();
// Getting the indivitual values END

// prints date & time in YYYY-MM-DD HH:MM:SS format
const last_one_hour = (year + "-" + month + "-" + date + " " + (hours - 1) + ":" + minutes + ":" + seconds);
const current_hour = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints date & time in HH:MM:SS format
const start_time = (hours - 1) + ":" + minutes + ":" + seconds;
const end_time = hours + ":" + minutes + ":" + seconds;
// All about Date Object END
*/

// Manual Date creation

// All about Date Object
const date_obj = new Date();
const today_date = `2021-03-23`;

// prints date & time in YYYY-MM-DD HH:MM:SS format
const last_one_hour = `2021-03-23 21:00:00`;
const current_hour = `2021-03-23 22:00:00`;

// prints date & time in HH:MM:SS format
const start_time = `21:00:00`;
// const end_time = `22:00:00`;
const end_time = `22:00`;
// All about Date Object END

const halleBez = "Bendenweg";


const query_location = `SELECT bde_nr, id_machine FROM t_location WHERE test_machine=0 and app_type = 'DAQ'  ORDER BY id_machine ASC`;

connection.query(query_location, function (error, results, fields) {
    if (error) {
        connection.end();
        throw error
    };

    for (let index = 0; index < results.length; index++) {
        const bde_nr = results[index].bde_nr;
        const id_machine = results[index].id_machine;
        // B2B21 //204
        // B4C60 //225
        if (bde_nr === "B2B21") {
            let shift_info = get_shift_data_halle(bde_nr, last_one_hour, current_hour, halleBez);

            const count_auftrags_hourly = `SELECT t_giessparameter_${id_machine}.error_type, t_giessparameter_${id_machine}.schuss_nr, t_giessparameter_${id_machine}.zeit as entry_time, t_giessparameter_${id_machine}.recipe_nr as active_recipe, t_location.bde_nr, t_location.id_machine as maschineID, t_giessparameter_${id_machine}.auftrags_list as auftrag_nr FROM t_giessparameter_${id_machine}, t_location WHERE t_location.id_machine=${id_machine} AND t_giessparameter_${id_machine}.masch_status = 0 AND DATE_FORMAT(t_giessparameter_${id_machine}.zeit,'%Y-%m-%d %H:00:00') BETWEEN '${last_one_hour}' AND  '${current_hour}' GROUP BY t_giessparameter_${id_machine}.auftrags_list`;

            connection.query(count_auftrags_hourly, function (error, results, fields) {
                if (error) {
                    connection.end();
                    throw error;
                } else {
                    if (results.length > 0) {
                        for (let index = 0; index < results.length; index++) {
                            const auftrag_nr = results[index].auftrag_nr;

                            const good_records = `SELECT count(schuss_nr) as total_shot FROM t_giessparameter_${id_machine} WHERE zeit BETWEEN '${last_one_hour}' AND  '${current_hour}' AND FIND_IN_SET(${auftrag_nr}, auftrags_list)  AND masch_status = 0`;

                            connection.query(good_records, function (error, results, fields) {
                                if (error) throw error;

                                for (let index = 0; index < results.length; index++) {
                                    var good_shot_per_hour = results[index].total_shot;
                                }
                                const bad_shot_per_hour = 0;

                                prepare_and_ins(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info);
                            });
                        }

                    } else {

                        if ((shift_info.is_working == 1 || shift_info.is_working == 0) && shift_info.endtime === end_time) {
                            //get auftrag_nr from t_zeiten_bde table where nakaBez=prod and masch_splitt>0 with distinct auftrag_nr
                            const sql_production = `SELECT Auftrag_Nr, sum(Masch_Splitt) as masch FROM t_zeiten_bde where MaschineNr='${bde_nr}' and NakaBez='Prod' and DateKey='${shift_info.actual_date}' and SchichtModelleID='${shift_info.shift_code}' and type_of_data='h_mac' group by Auftrag_Nr`;

                            connection_v2.query(sql_production, (error, results, fields) => {
                                if (error) throw error

                                for (let index = 0; index < results.length; index++) {
                                    const auftrag_nr = results[index].Auftrag_Nr;
                                    const masch = results[index].masch;

                                    if (masch > 0) {
                                        const good_records = `SELECT count(schuss_nr) as total_shot FROM t_giessparameter_${id_machine} WHERE error_type='N' and zeit BETWEEN '${last_one_hour}' AND '${current_hour}' AND auftrags_list = '${auftrag_nr}'  AND masch_status = 0`;


                                        connection.query(good_records, (error, results, fields) => {
                                            if (error) throw error


                                            for (let index = 0; index < results.length; index++) {
                                                const good_shot_per_hour = results[index].total_shot;
                                                const bad_shot_per_hour = 0;

                                                only_cycle_timeloss(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info);

                                            }
                                        })
                                    } else {
                                        connection_v2.end();
                                    }
                                }
                            })
                        }
                    }
                }
            });
        }
    }
});

function get_shift_data_halle(bde_nr, l_hour, c_hour, halle) {

    let shift_obj = {
        "date": "2021-03-22",
        "shift_id": "176",
        "shift_code": "B02",
        "shift_name": "Spät",
        "total_hours": "8:0",
        "hour": "14:00",
        "starttime": "14:00",
        "endtime": "22:00",
        "status": "0",
        "is_working": "1",
        "actual_date": "2021-03-22",
        "nr_bez": "B02 - Spät",
        "date_f": "22-03-2021",
        "calculate": "1"
    }
    return shift_obj;

}

function prepare_and_ins(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info) {

    const maschine = get_maschine_details(bde_nr);

    const machineBez = maschine.maschinenbez.trim();
    const halleBez = maschine.halle_name.trim();
    const maschinenGruppe = maschine.maschinengruppe.trim();
    const bediener = maschine.bediener;
    const OEE_JN = maschine.oee === false ? 0 : 1;
    const OEE_MA = maschine.oee_100 === false ? 0 : 1;
    // end_time = `${end_time}:00`;

    const diff = new Date(current_hour) - new Date(last_one_hour);
    const zeit_ameldung = ((diff / 1000) / 60 / 60);

    const teile_wkz = get_details_auf(auftrag_nr, bde_nr);

    const teileNr = teile_wkz.teil
    const teileBez = teile_wkz.teile_bez
    const baugruppe = teile_wkz.baugruppe
    const nester = teile_wkz.nester
    const fachzahl = teile_wkz.fachzahl
    const auftrag_no = teile_wkz.auf_nr
    const werkzeugID = teile_wkz.werkzeugnr
    const te = teile_wkz.theory_zyklus
    const kundenNr = teile_wkz.kundennr
    const auftragArt = teile_wkz.auf_art
    const arbeitsgang = teile_wkz.arbgang

    const SchichtModelleID = shift_info.shift_code;
    const SchichtModelleBez = shift_info.shift_name;

    const correction_query = `SELECT SUM(MengeRueck) AS MengeRueck, SUM(MengeAuss) AS MengeAuss FROM t_data_correction WHERE MaschineNr = ${id_machine} and  Auftrag_Nr = '${auftrag_nr}' AND SchichtModelleID = '${SchichtModelleID}' AND DateKey = '${shift_info.actual_date}' and inserted_time BETWEEN '${last_one_hour}' AND  '${current_hour}'`;

    connection.query(correction_query, function (error, results, fields) {
        if (error) {
            console.log(error.stack);
            connection.end()
            throw error;
        } else {
            let corr_good = 0;
            let corr_bad = 0;

            for (let index = 0; index < results.length; index++) {
                corr_good = results[index].MengeRueck;
                corr_bad = results[index].MengeAuss;
            }

            if (fachzahl > 0) {
                good_shot_per_hour = (good_shot_per_hour * fachzahl) - corr_bad;
                bad_shot_per_hour = corr_bad;
            } else {
                good_shot_per_hour = (good_shot_per_hour * nester) - corr_bad;
                bad_shot_per_hour = corr_bad;
            }

            const person_type = '';

            if (shift_info.is_working == 1 || shift_info.is_working == 0) {

                //date section
                const date_key = shift_info.actual_date;
                const begin_date = shift_info.actual_date;
                const end_key = date_key.replace(/-|\//g, "");
                const full_date = date_key;
                const month_name = new Date(date_key).toLocaleString('default', { month: 'long' });
                const calendar_year = new Date(date_key).getFullYear();
                const month_of_year = new Date(date_key).getMonth() + 1;

                // Get week of the year
                Date.prototype.getWeek = function () {
                    var onejan = new Date(this.getFullYear(), 0, 1);
                    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                }

                var today = new Date();
                const year_week = today.getWeek();

                let modified_month = month_of_year < 10 ? `0${month_of_year}` : month_of_year;
                let modified_week = year_week < 10 ? `0${year_week}` : year_week;

                const year_month = `${calendar_year}-${modified_month}`;
                const week_of_year = `${calendar_year}-${modified_week}`;

                //insert into t_zeiten_bde only q_mac row
                const q_mac_query = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data, PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-1','q_mac','','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${start_time}','${end_time}','${bad_shot_per_hour}','${good_shot_per_hour}','${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','0','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','q_mac','${person_type}','')`;

                connection_v2.query(q_mac_query, function (error, results, fields) {
                    if (error) throw error

                    if (end_time === shift_info.endtime) {

                        const oee_start_time = `${shift_info.starttime}:00`;

                        // Calculate PROD_GP
                        const sql_prod_GP_BP = `SELECT Te AS te_60_sec, SUM(MengeAuss) AS bad_parts, SUM(MengeRueck) AS good_parts FROM t_zeiten_bde WHERE MaschineNr='${bde_nr}' AND Auftrag_Nr='${auftrag_nr}' AND DateKey='${date_key}' AND type_of_data='q_mac' AND SchichtModelleID = '${SchichtModelleID}'`;

                        connection_v2.query(sql_prod_GP_BP, function (error, results, fields) {
                            if (error) {
                                throw error
                            } else {
                                for (let index = 0; index < results.length; index++) {
                                    var good = results[index].good_parts;
                                    var bad = results[index].bad_parts;
                                    var te = results[index].te_60_sec;
                                }
                                const shiftwise_good_oee = ((good * te) / 3600).toFixed(4);
                                const shiftwise_bad_oee = ((bad * te) / 3600).toFixed(4);

                                // for row(OEE good)
                                const query_ins_oee_good = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-2','prod_GP','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${shiftwise_good_oee}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_GP','${person_type}','')`;

                                connection_v2.query(query_ins_oee_good, (error, results, fields) => {
                                    if (error) throw error

                                    // for row(OEE bad)
                                    const query_ins_oee_bad = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-3','prod_BP','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${shiftwise_bad_oee}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_BP','${person_type}','')`;

                                    connection_v2.query(query_ins_oee_bad, (error, results, fields) => {
                                        if (error) throw error

                                        const sql_prod_time = `SELECT SUM(Masch_Splitt) AS Masch_Splitt FROM t_zeiten_bde WHERE MaschineNr='${bde_nr}' AND Auftrag_Nr='${auftrag_nr}' AND (NakaBez='Prod' OR UnterbrechungsgrundeNr=0) AND DateKey='${date_key}' AND type_of_data='h_mac' AND SchichtModelleID = '${SchichtModelleID}'`;

                                        connection_v2.query(sql_prod_time, (error, results, fields) => {
                                            if (error) throw error

                                            // console.log("results: ", results);
                                            for (let index = 0; index < results.length; index++) {
                                                var total_production_time = results[index].Masch_Splitt;
                                            }

                                            const total_oee_zeit = shiftwise_good_oee + shiftwise_bad_oee;
                                            const verlus_time = (parseFloat(total_production_time) - parseFloat(total_oee_zeit));

                                            // prod_ctl
                                            const query_ins_oee_verlus = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp,status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-4','prod_ctl','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_nr}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${verlus_time}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_ctl','${person_type}','')`;

                                            connection_v2.query(query_ins_oee_verlus, (error, results, fields) => {
                                                if (error) throw error
                                            })
                                            connection_v2.end()
                                        })
                                    })
                                })
                                connection.end();
                            }
                        })
                    }
                });
            }
            // connection.end();

        }
    });

}

function only_cycle_timeloss(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info) {
    const maschine = get_maschine_details(bde_nr);

    const machineBez = maschine.maschinenbez.trim();
    const halleBez = maschine.halle_name.trim();
    const maschinenGruppe = maschine.maschinengruppe.trim();
    const bediener = maschine.bediener;
    const OEE_JN = maschine.oee === false ? 0 : 1;
    const OEE_MA = maschine.oee_100 === false ? 0 : 1;
    // end_time = `${end_time}:00`;

    const diff = new Date(current_hour) - new Date(last_one_hour);
    const zeit_ameldung = ((diff / 1000) / 60 / 60);

    const teile_wkz = get_details_auf(auftrag_nr, bde_nr);

    const teileNr = teile_wkz.teil
    const teileBez = teile_wkz.teile_bez
    const baugruppe = teile_wkz.baugruppe
    const nester = teile_wkz.nester
    const fachzahl = teile_wkz.fachzahl
    const auftrag_no = teile_wkz.auf_nr
    const werkzeugID = teile_wkz.werkzeugnr
    const te = teile_wkz.theory_zyklus
    const kundenNr = teile_wkz.kundennr
    const auftragArt = teile_wkz.auf_art
    const arbeitsgang = teile_wkz.arbgang

    const SchichtModelleID = shift_info.shift_code;
    const SchichtModelleBez = shift_info.shift_name;

    const correction_query = `SELECT SUM(MengeRueck) AS MengeRueck, SUM(MengeAuss) AS MengeAuss FROM t_data_correction WHERE MaschineNr = ${id_machine} and  Auftrag_Nr = '${auftrag_nr}' AND SchichtModelleID = '${SchichtModelleID}' AND DateKey = '${shift_info.actual_date}' and inserted_time BETWEEN '${last_one_hour}' AND  '${current_hour}'`;

    connection.query(correction_query, function (error, results, fields) {
        if (error) {
            console.log(error.stack);
            connection.end()
            throw error;
        } else {
            const person_type = '';

            if (shift_info.is_working == 1 || shift_info.is_working == 0) {

                //date section
                const date_key = shift_info.actual_date;
                const begin_date = shift_info.actual_date;
                const end_key = date_key.replace(/-|\//g, "");
                const full_date = date_key;
                const month_name = new Date(date_key).toLocaleString('default', { month: 'long' });
                const calendar_year = new Date(date_key).getFullYear();
                const month_of_year = new Date(date_key).getMonth() + 1;

                // Get week of the year
                Date.prototype.getWeek = function () {
                    var onejan = new Date(this.getFullYear(), 0, 1);
                    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                }

                var today = new Date();
                const year_week = today.getWeek();

                let modified_month = month_of_year < 10 ? `0${month_of_year}` : month_of_year;
                let modified_week = year_week < 10 ? `0${year_week}` : year_week;

                const year_month = `${calendar_year}-${modified_month}`;
                const week_of_year = `${calendar_year}-${modified_week}`;

                const oee_start_time = `${shift_info.starttime}:00`;

                // Calculate PROD_GP
                const sql_prod_GP_BP = `SELECT Te AS te_60_sec, SUM(MengeAuss) AS bad_parts, SUM(MengeRueck) AS good_parts FROM t_zeiten_bde WHERE MaschineNr='${bde_nr}' AND Auftrag_Nr='${auftrag_nr}' AND DateKey='${date_key}' AND type_of_data='q_mac' AND SchichtModelleID = '${SchichtModelleID}'`;

                connection_v2.query(sql_prod_GP_BP, function (error, results, fields) {
                    if (error) {
                        throw error
                    } else {
                        for (let index = 0; index < results.length; index++) {
                            var good = results[index].good_parts;
                            var bad = results[index].bad_parts;
                            var te = results[index].te_60_sec;
                        }
                        const shiftwise_good_oee = ((good * te) / 3600).toFixed(4);
                        const shiftwise_bad_oee = ((bad * te) / 3600).toFixed(4);

                        // for row(OEE good)
                        const query_ins_oee_good = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-2','prod_GP','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${shiftwise_good_oee}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_GP','${person_type}','')`;

                        connection_v2.query(query_ins_oee_good, (error, results, fields) => {
                            if (error) throw error

                            // for row(OEE bad)
                            const query_ins_oee_bad = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-3','prod_BP','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${shiftwise_bad_oee}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_BP','${person_type}','')`;

                            connection_v2.query(query_ins_oee_bad, (error, results, fields) => {
                                if (error) throw error

                                const sql_prod_time = `SELECT SUM(Masch_Splitt) AS Masch_Splitt FROM t_zeiten_bde WHERE MaschineNr='${bde_nr}' AND Auftrag_Nr='${auftrag_nr}' AND (NakaBez='Prod' OR UnterbrechungsgrundeNr=0) AND DateKey='${date_key}' AND type_of_data='h_mac' AND SchichtModelleID = '${SchichtModelleID}'`;

                                connection_v2.query(sql_prod_time, (error, results, fields) => {
                                    if (error) throw error

                                    // console.log("results: ", results);
                                    for (let index = 0; index < results.length; index++) {
                                        var total_production_time = results[index].Masch_Splitt;
                                    }

                                    const total_oee_zeit = shiftwise_good_oee + shiftwise_bad_oee;
                                    const verlus_time = (parseFloat(total_production_time) - parseFloat(total_oee_zeit));

                                    // prod_ctl
                                    const query_ins_oee_verlus = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp,status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-4','prod_ctl','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_nr}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${verlus_time}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_ctl','${person_type}','')`;

                                    connection_v2.query(query_ins_oee_verlus, (error, results, fields) => {
                                        if (error) throw error
                                    })
                                    connection_v2.end()
                                })
                            })
                        })
                        connection.end();
                    }
                })

            }
            // connection.end();

        }
    });
}

function get_maschine_details(bde_nr) {
    let maschine_data_obj = {
        "id": "183",
        "maschinenr": "B4C60",
        "maschinenbez": "Fertigung Zentrierpl.8HP50",
        "hersteller": null,
        "modell": "",
        "baujahr": "",
        "aktiv_inaktiv": true,
        "maschinengruppe": "Zentrierplatte",
        "maschinengruppe_rep": null,
        "maschinengruppe_tpm": "Zentrierplatte",
        "halle": "Bendenweg",
        "oee": true,
        "oee_100": false,
        "isnutzgrad": true,
        "ausschuss": true,
        "produktivitaet": true,
        "produktivitaet_100": false,
        "automatisiert": true,
        "bediener": "1",
        "verteilzeit": "0",
        "nutzgrad": "70",
        "stundensatz": "0",
        "stillstand_sec": "0",
        "castvisu": false,
        "prodvisu": true,
        "capacity": true,
        "planvisu": true,
        "docvisu": true,
        "shiftvisu": true,
        "tpmvisu": true,
        "mesvisu": true,
        "leanvisu": true,
        "processvisu": true,
        "qualivisu": true,
        "taskvisu": true,
        "masch_code": "",
        "oee_percentage": "80",
        "nutzung_percentage": "70",
        "oee_color_below": true,
        "nutzung_color_below": true,
        "ausschuss_percenatge": "3",
        "auss_color_below": true,
        "prod_percentage": "90",
        "prod_color_below": true,
        "arbeitsgang_id": "164",
        "kosten_percentage": "0",
        "daqlocation": "",
        "daqtime": "0",
        "daqtype": "",
        "daqconf": "",
        "hersteller_name": null,
        "halle_name": "Bendenweg",
        "hallenr": "2",
        "maschinengruppe_name": "Zentrierplatte",
        "maschinengruppe_rep_name": null,
        "arbeitsgang_name": "\tFräsen",
        "maschinengruppe_tpm_name": "Zentrierplatte",
        "nr_bez": "B4C60 - Fertigung Zentrierpl.8HP50",
        "hersteller_id": "0",
        "halle_id": "3",
        "gruppe_id": "88",
        "gruppe_rep_id": "0",
        "gruppe_tpm_id": "547",
        "is_erp": true,
        "is_edited": true
    }

    return maschine_data_obj;
}

function get_details_auf(auftrag_nr, bde_nr) {
    const data = {
        "teil": 123456789,
        "teile_bez": '',
        "zyklus_zeit": 0,
        "nester": 2,
        "fachzahl": 2,
        "auf_nr": 84624,
        "werkzeugID": 12345,
        "theory_zyklus": 1.5,
        "kundennr": '1234',
        "werkzeugnr": 'xxxxx',
        "auf_art": '123',
        "arbgang": 'arbgang',
        "baugruppe": 'baugruppe'
    }
    return data;
}

