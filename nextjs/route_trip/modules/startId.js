const mysql = require('mysql2');
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
};

exports.id = function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', () => {
        body = JSON.parse(body);
        globalObj.start = body.time;
        defineStartId();
        setTimeout(() => {
            receiveFirstStartPeriod(globalObj.startId);
        }, 50)
        setTimeout(() => {
            editAnotherPointTime(res);
        }, 100)
    })
};

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
    let startPeriod = `SELECT time FROM route WHERE id=${id}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
            calcTime(id, rows[0]['time'], globalObj.start);
        })
	.catch(console.log)
}

function editAnotherPointTime(res){
    let timerId = setTimeout(function request() {

      if (globalObj.startId === globalObj.countRows) {
        clearTimeout(timerId);
        res.end('ок');
        return false;
      }

      globalObj.startId = globalObj.startId + 1;
      receiveOtherPeriod(globalObj.startId);

      timerId = setTimeout(request, 50);
    }, 50);
}

function receiveOtherPeriod(id){
    let startPeriod = `SELECT time FROM route WHERE id=${id}`;
    let prevPointTime = `SELECT time FROM point_time WHERE point_id=${+id - 1}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
                connection.promise().query(prevPointTime)
                    .then (([rows1, fields1]) => {
                            calcTime(id, rows[0]['time'], Date.parse(rows1[0]['time']));
                    })
        })
        .catch(console.log())
}

function calcTime(id, period, startTime){
    period = +period * globalObj.mlsecInSec * globalObj.minInHour;
    let stopDateMil = +startTime + period;

    let stopDate = new Date(stopDateMil);

    let insert = `UPDATE point_time SET time='${stopDate}' WHERE point_id=${id}`;
    connection.promise().query(insert)
        .then (([rows, fields]) => {
        })
        .catch(console.log)
        .then(() => {if (id === globalObj.countRows) connection.end()});
}