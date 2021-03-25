// Dependencies
const { connection, connection_v2 } = require('./connection/conn');
const get_shift_data_halle = require('./helper/shift-data');
const prepareCapaData = require('./helper/data-insert/prepareCapaData');
const only_cycle_timeloss = require('./helper/data-insert/cycle_timeloss');

/* Comment out dynamic OR manual file while inserting data, based on requirements */
// const { today_date, last_one_hour, current_hour, start_time, end_time } = require('./helper/dynamic-date');
const { today_date, last_one_hour, current_hour, start_time, end_time } = require('./helper/manual-date');

// connection.on('error', () => {
//     connection.end();
// });

// connection_v2.on('error', () => {
//     connection_v2.end();
// });

// Set the halle
const halleBez = "Bendenweg";

const query_location = `SELECT bde_nr, id_machine FROM t_location WHERE test_machine=0 and app_type = 'DAQ' ORDER BY id_machine ASC`;

connection.query(query_location, (error, results, fields) => {
    if (error) throw error;

    for (let index = 0; index < results.length; index++) {
        const bde_nr = results[index].bde_nr;
        const id_machine = results[index].id_machine;
        let shift_info = get_shift_data_halle(bde_nr, last_one_hour, current_hour, halleBez);

        const shift_start_time = `${shift_info.actual_date} ${shift_info.starttime}:00`;
        const shift_end_time = `${today_date} ${shift_info.endtime}:00`;

        if (shift_info.endtime === end_time) {
			prepareCapaData(bde_nr, shift_info, shift_start_time, shift_end_time);
		}

    }
    process.exit();

});
