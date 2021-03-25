const mysql = require("mysql");

// mySQL connection
var connection = mysql.createConnection({
    host: "localhost",
    user: "parvez",
    port: 3308,
    password: "",
    database: "diecast",
});

connection.connect();

var connection_v2 = mysql.createConnection({
    host: "localhost",
    user: "parvez",
    port: 3308,
    password: "",
    database: "bde_zeiten",
});

connection_v2.connect();

module.exports = { connection, connection_v2 }