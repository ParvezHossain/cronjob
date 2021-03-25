const get_maschine_details = require('../machine-details');
const get_details_auf = require('../auftrag-details');
const { connection, connection_v2 } = require('../../connection/conn');

module.exports = function only_cycle_timeloss(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info) {
    const maschine = get_maschine_details(bde_nr);
    const machineBez = maschine.maschinenbez.trim();
    const halleBez = maschine.halle_name.trim();
    const maschinenGruppe = maschine.maschinengruppe.trim();
    const bediener = maschine.bediener;
    const OEE_JN = maschine.oee === false ? 0 : 1;
    const OEE_MA = maschine.oee_100 === false ? 0 : 1;
    // end_time = `${end_time}:00`;

    const diff = new Date(current_hour) - new Date(last_one_hour);
    const zeit_ameldung = diff / 1000 / 60 / 60;

    const teile_wkz = get_details_auf(auftrag_nr, bde_nr);

    const teileNr = teile_wkz.teil;
    const teileBez = teile_wkz.teile_bez;
    const baugruppe = teile_wkz.baugruppe;
    const nester = teile_wkz.nester;
    const fachzahl = teile_wkz.fachzahl;
    const auftrag_no = teile_wkz.auf_nr;
    const werkzeugID = teile_wkz.werkzeugnr;
    const te = teile_wkz.theory_zyklus;
    const kundenNr = teile_wkz.kundennr;
    const auftragArt = teile_wkz.auf_art;
    const arbeitsgang = teile_wkz.arbgang;

    const SchichtModelleID = shift_info.shift_code;
    const SchichtModelleBez = shift_info.shift_name;

    const correction_query = `SELECT SUM(MengeRueck) AS MengeRueck, SUM(MengeAuss) AS MengeAuss FROM t_data_correction WHERE MaschineNr = ${id_machine} and  Auftrag_Nr = '${auftrag_nr}' AND SchichtModelleID = '${SchichtModelleID}' AND DateKey = '${shift_info.actual_date}' and inserted_time BETWEEN '${last_one_hour}' AND  '${current_hour}'`;

    connection.query(correction_query, function (error, results, fields) {
        if (error) {
            console.log(error.stack);
            throw error;
        } else {
            const person_type = "";

            if (shift_info.is_working == 1 || shift_info.is_working == 0) {
                //date section
                const date_key = shift_info.actual_date;
                const begin_date = shift_info.actual_date;
                const end_key = date_key.replace(/-|\//g, "");
                const full_date = date_key;
                const month_name = new Date(date_key).toLocaleString("default", { month: "long" });
                const calendar_year = new Date(date_key).getFullYear();
                const month_of_year = new Date(date_key).getMonth() + 1;

                // Get week of the year
                Date.prototype.getWeek = function () {
                    var onejan = new Date(this.getFullYear(), 0, 1);
                    return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
                };

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
                        throw error;
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
                            if (error) throw error;

                            // for row(OEE bad)
                            const query_ins_oee_bad = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-3','prod_BP','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${shiftwise_bad_oee}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_BP','${person_type}','')`;

                            connection_v2.query(query_ins_oee_bad, (error, results, fields) => {
                                if (error) throw error;

                                const sql_prod_time = `SELECT SUM(Masch_Splitt) AS Masch_Splitt FROM t_zeiten_bde WHERE MaschineNr='${bde_nr}' AND Auftrag_Nr='${auftrag_nr}' AND (NakaBez='Prod' OR UnterbrechungsgrundeNr=0) AND DateKey='${date_key}' AND type_of_data='h_mac' AND SchichtModelleID = '${SchichtModelleID}'`;

                                connection_v2.query(sql_prod_time, (error, results, fields) => {
                                    if (error) throw error;

                                    // console.log("results: ", results);
                                    for (let index = 0; index < results.length; index++) {
                                        var total_production_time = results[index].Masch_Splitt;
                                    }

                                    const total_oee_zeit = shiftwise_good_oee + shiftwise_bad_oee;
                                    const verlus_time = parseFloat(total_production_time) - parseFloat(total_oee_zeit);

                                    // prod_ctl
                                    const query_ins_oee_verlus = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data,PersonTyp,status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-4','prod_ctl','Prod','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_nr}','${oee_start_time}','${end_time}',0,0,'${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','${verlus_time}','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','prod_ctl','${person_type}','')`;

                                    connection_v2.query(query_ins_oee_verlus, (error, results, fields) => {
                                        if (error) throw error;
                                    });

                                });
                            });
                        });

                    }
                });
            }
        }
    });
}