const mysql = require('mysql2');
const mysqlGet = require('./getMySQL');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    database: process.env.DB,
    password: process.env.PASSWD_DB,
    multipleStatements: true
});

exports.diff = (data) => {
    let initTime = `SELECT init_time FROM point_time WHERE point_id=${data.id}`;
    connection.promise().query(initTime)
        .then(([rows, fields]) =>{
            defineDiff(data, Date.parse(rows[0]['init_time']))
        })
        .catch(console.log())
}

function defineDiff(data, initTime){
    const minutes = Math.round((data.time - initTime) / 60000);
    const hours = (minutes / 60).toFixed(0);
    let updMin = formatMin(minutes);
    let updHour = formatHour(hours);
    let isDelay = (minutes > 0) ? true : false;
    const diff = `${updHour}:${updMin}`;
    let insertDiff = `UPDATE format_time SET diff='${diff}', isDelay=${isDelay} WHERE time_id=${data.id}`;
    connection.promise().query(insertDiff)
        .then(([rows, fields]) => {

        })
        .catch(console.log())
}

function formatMin(min){
    let positiveMin = (min < 0) ? String(min).slice(1) : min;
    let rightMin = (Number(positiveMin) > 59)
        ? Number(positiveMin) - 60
        : positiveMin;
    let result = (String(rightMin).length === 1) ? `0${rightMin}` : rightMin
    return result;
}

function formatHour(hour){
    let isNegative = (String(hour).match(/\-/)) ? true : false;
    let isZero = (String(hour).replace(/\-/g, '').length === 1) ? `0${String(hour).replace(/\-/g, '')}` : hour;
    let result = isNegative ? `-${String(isZero)}` : isZero;
    return result;
}