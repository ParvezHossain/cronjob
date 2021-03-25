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

module.exports = {
    today_date,
    last_one_hour,
    current_hour,
    start_time,
    end_time
}