// Dependencies
const { connection, connection_v2 } = require('./connection/conn');
const get_shift_data_halle = require('./helper/shift-data');
const prepare_and_ins = require('./helper/data-insert/prepare_and_ins');
const only_cycle_timeloss = require('./helper/data-insert/cycle_timeloss');

/* Comment out dynamic OR manual file while inserting data, based on requirements */
// const { today_date, last_one_hour, current_hour, start_time, end_time } = require('./helper/dynamic-date');
const { today_date, last_one_hour, current_hour, start_time, end_time } = require('./helper/manual-date');

connection.on('error', () => {
    connection.end();
});

connection_v2.on('error',  () => {
    connection_v2.end();
});

// Set the halle
const halleBez = "Bendenweg";

// const query_location = `SELECT bde_nr, id_machine FROM t_location WHERE id_machine =225`;

const query_location = `SELECT bde_nr, id_machine FROM t_location WHERE test_machine=0 and app_type = 'DAQ'  ORDER BY id_machine ASC`;
connection.query(query_location, (error, results, fields) => {
    if (error) throw error

    for (let index = 0; index < results.length; index++) {

        const bde_nr = results[index].bde_nr;
        const id_machine = results[index].id_machine;
        let shift_info = get_shift_data_halle(bde_nr, last_one_hour, current_hour, halleBez);

        const count_auftrags_hourly = `SELECT t_giessparameter_${id_machine}.error_type, t_giessparameter_${id_machine}.schuss_nr, t_giessparameter_${id_machine}.zeit AS entry_time, t_giessparameter_${id_machine}.recipe_nr AS active_recipe, t_location.bde_nr, t_location.id_machine AS maschineID, t_giessparameter_${id_machine}.auftrags_list AS auftrag_nr FROM t_giessparameter_${id_machine}, t_location WHERE t_location.id_machine=${id_machine} AND t_giessparameter_${id_machine}.masch_status = 0 AND DATE_FORMAT(t_giessparameter_${id_machine}.zeit,'%Y-%m-%d %H:00:00') BETWEEN '${last_one_hour}' AND  '${current_hour}' GROUP BY t_giessparameter_${id_machine}.auftrags_list`;

        connection.query(count_auftrags_hourly, (error, results, fields) => {
            if (error) {
                throw error;
            } else {

                if (results.length > 0) {
                    for (let index = 0; index < results.length; index++) {

                        const auftrag_nr = results[index].auftrag_nr;
                        const good_records = `SELECT count(schuss_nr) AS total_shot FROM t_giessparameter_${id_machine} WHERE zeit BETWEEN '${last_one_hour}' AND  '${current_hour}' AND FIND_IN_SET(${auftrag_nr}, auftrags_list)  AND masch_status = 0`;

                        connection.query(good_records, (error, results, fields) => {
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
                            if (error) throw error;

                            for (let index = 0; index < results.length; index++) {
                                const auftrag_nr = results[index].Auftrag_Nr;
                                const masch = results[index].masch;

                                if (masch > 0) {
                                    const good_records = `SELECT count(schuss_nr) as total_shot FROM t_giessparameter_${id_machine} WHERE error_type='N' and zeit BETWEEN '${last_one_hour}' AND '${current_hour}' AND auftrags_list = '${auftrag_nr}'  AND masch_status = 0`;

                                    connection.query(good_records, (error, results, fields) => {
                                        if (error) throw error;

                                        for (let index = 0; index < results.length; index++) {
                                            const good_shot_per_hour = results[index].total_shot;
                                            const bad_shot_per_hour = 0;

                                            only_cycle_timeloss(bde_nr, id_machine, auftrag_nr, last_one_hour, current_hour, start_time, end_time, good_shot_per_hour, bad_shot_per_hour, shift_info);
                                        }
                                    });
                                } else {
                                    console.log("Nothing to insert!");
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});


