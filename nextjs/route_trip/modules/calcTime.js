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

const globalObj = {
    minInHour: 60,
    mlsecInSec: 1000,
    isStartRoute: false,
};

exports.calc = function(time, res){
    globalObj.start = time;
    defineStartId();
    setTimeout(() => {
        receiveFirstStartPeriod(globalObj.startId);
    }, 50)
    setTimeout(() => {
        editAnotherPointTime(res);
    }, 100)
}

function defineStartId(){
    let startId = 'SELECT MIN(id) FROM route NATURAL JOIN cross_point WHERE isChecked=false';
    let countRows = 'SELECT COUNT(*) FROM route';
    connection.query(`${startId}; ${countRows}`, function (error, results, fields) {
        if (error) throw error;
        globalObj.startId = results[0][0]['MIN(id)'];
        globalObj.countRows = results[1][0]['COUNT(*)'];
    });
}

function receiveFirstStartPeriod(id){
    if (id === 1){
        globalObj.isStartRoute = true;
    } else {
        globalObj.isStartRoute = false;
    }
    let startPeriod = `SELECT duration FROM route WHERE id=${id}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
            calcTime(id, rows[0]['duration'], globalObj.start);
        })
    .catch(console.log)
}

function editAnotherPointTime(res){
    let timerId = setTimeout(function request() {

      if (globalObj.startId === globalObj.countRows) {
        clearTimeout(timerId);
        mysqlGet.get(res);
        return false;
      }

      globalObj.startId = globalObj.startId + 1;
      receiveOtherPeriod(globalObj.startId);

      timerId = setTimeout(request, 50);
    }, 50);
}

function receiveOtherPeriod(id){
    let startPeriod = `SELECT duration FROM route WHERE id=${id}`;
    let prevPointTime = `SELECT time FROM point_time WHERE point_id=${+id - 1}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
                connection.promise().query(prevPointTime)
                    .then (([rows1, fields1]) => {
                            calcTime(id, rows[0]['duration'], Date.parse(rows1[0]['time']));
                    })
        })
        .catch(console.log())
}

function calcTime(id, period, startTime){
    period = +period * globalObj.mlsecInSec * globalObj.minInHour;
    let stopDateMil = +startTime + period;
    let stopDate = new Date((id === 1) ? startTime : stopDateMil);

    let insert = `UPDATE point_time SET time='${stopDate}' WHERE point_id=${id}`;
    connection.promise().query(insert)
        .then (([rows, fields]) => {
            formatTime(id);
        })
        .catch(console.log)
        .then(() => {if (globalObj.isStartRoute) copyInitTime(id, stopDate)})
}

function formatTime(id){
    let receiveDate = `SELECT time FROM point_time WHERE point_id=${id}`;
    let date;
    let hour;
    let minutes;
    let dateMonth;
    let numberMonth;
    let year;
    let finalString;
    connection.promise().query(receiveDate)
        .then (([rows, fields]) => {
            date = new Date(rows[0]['time']);
            hour = (String(date.getHours()).length === 1) ? `0${date.getHours()}` : date.getHours();
            minutes = (String(date.getMinutes()).length === 1) ? `0${date.getMinutes()}` : date.getMinutes();
            dateMonth = (String(date.getDate()).length === 1) ? `0${date.getDate()}` : date.getDate();
            numberMonth = (String(date.getMonth()).length === 1) ? `0${date.getMonth()}` : date.getMonth();
            year = String(date.getFullYear()).slice(2);
            finalString =`${hour}:${minutes} ${dateMonth}.${numberMonth}.${year}`;
            insertUpdTime(id, finalString);
        })
        .catch(console.log)
}

function insertUpdTime(id, string){
    let editRow = `UPDATE format_time SET time='${string}' WHERE time_id=${id}`;
    connection.promise().query(editRow)
        .then (([rows, fields]) => {})
        .catch(console.log)
}

async function copyInitTime(id, initDate){
    let insertInitTime = `UPDATE point_time SET init_time='${initDate}' WHERE point_id=${id}`;
    connection.promise().query(insertInitTime)
        .then (([rows, fields]) => {
            zeroingDiff(id);
        })
        .catch(console.log)
}

async function zeroingDiff(id){
    let zero = `UPDATE format_time SET diff='', isDelay='' WHERE time_id=${id}`;
    connection.promise().query(zero)
        .then (([rows, fields]) => {
        })
        .catch(console.log)
}