var mysql = require('mysql');

var mysqlconnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "",
    database : "popularapp_new",
    multipleStatements: true
});

// var mysqlconnection = mysql.createConnection({
//     host : "103.224.247.222",
//     user : "populara_news",
//     password: "popularApp123",
//     database : "populara_news",
//     multipleStatements: true
// });

mysqlconnection.connect((err)=>{
    if(!err) {
        console.log("connected");
    }
    else {
        console.log("Not connected");
    }
});

module.exports = mysqlconnection;
