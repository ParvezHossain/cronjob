const { connection_v2 } = require('../../connection/conn');
const get_maschine_details = require('../machine-details');

module.exports = function prepareCapaData(bde_nr, shift_info, shift_start_time, shift_end_time) {

    const start_time = `${shift_info.starttime}`;
    const end_time = `${shift_info.end_time}`;

    const good_shot_per_hour = 0;
    const bad_shot_per_hour = 0;

    // loop through multiple auf_list($row_nest['auftrag_nr'])
    // $machine_id = $row['bde_nr'];


    //3. get machine data from SD_maschinen sql server
    const maschine = get_maschine_details(bde_nr);

    const machine_no = bde_nr;
    const machineBez = maschine.maschinenbez.trim();
    const halleBez = maschine.halle_name.trim();
    const maschinenGruppe = maschine.maschinengruppe.trim();
    const bediener = maschine.bediener;
    const OEE_JN = maschine.oee === false ? 0 : 1;
    const OEE_MA = maschine.oee_100 === false ? 0 : 1;

    const teileNr = 0;
    const teileBez = 0;
    const baugruppe = 0;;
    const nester = 2;
    const fachzahl = 0;
    const auftrag_no = 0;

    const werkzeugID = 0; //;
    const te = 0;
    const kundenNr = 0;
    const auftragArt = 0;
    const arbeitsgang = 0;

    const zeit_ameldung = `${shift_info.total_hours}`;

    const SchichtModelleID = `${shift_info.shift_code}`;
    const SchichtModelleBez = `${shift_info.shift_name}`;

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
    const person_type = '';

    //insert into t_zeiten_bde_test only q_mac row
    const query_ins = `INSERT INTO t_zeiten_bde_test(MaschineNr,MaschineBez,TeileNr,TeileBez,Baugruppe,UnterbrechungsgrundeNr,UnterbrechungsgrundeBez,NakaBez,SchichtModelleID,SchichtModelleBez,DateKey,BeginnDateKey,EndDateKey,Auftrag_Nr,TimeKommt,TimeGeht,MengeAuss,MengeRueck,FullDate,MonthName,CalendarYear,HalleBez,MonthOfYear,Te,WerkzeugID,KundenNr,AuftragsArt,WeekOfYear,OEE_JN,OEE_MA,OEE_zeit,ZeitAnmeldung,Bediener,Arbeitsgang,Jahr_KW,Jahr_Monat,MaschinenGruppe,type_of_data, PersonTyp, status) VALUES('${bde_nr}','${machineBez}','${teileNr}','${teileBez}','${baugruppe}','-5','prod_capa','','${SchichtModelleID}','${SchichtModelleBez}','${date_key}','${begin_date}','${end_key}','${auftrag_no}','${start_time}','${end_time}','${bad_shot_per_hour}','${good_shot_per_hour}','${full_date}','${month_name}','${calendar_year}','${halleBez}','${month_of_year}','${te}','${werkzeugID}','${kundenNr}','${auftragArt}','${week_of_year}','${OEE_JN}','${OEE_MA}','0','${zeit_ameldung}','${bediener}','${arbeitsgang}','${year_week}','${year_month}','${maschinenGruppe}','capa_mac', '${person_type}','')`;

    connection_v2.query(query_ins, (error, results, fields) => {
        if (error) throw error
        console.log("Successfully inserted!", results);
    })

}