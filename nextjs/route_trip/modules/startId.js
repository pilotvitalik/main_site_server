const mysql = require('mysql2');
//const mysql = require('mysql2/promise');
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
    prevPointTime: '',
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
        defineStartId(res)
        //defineStartId1(res)
    })
};

function defineStartId(res){
    let startId = 'SELECT MIN(id) FROM route NATURAL JOIN cross_point WHERE isChecked=false';
    let countRows = 'SELECT COUNT(*) FROM route';
    connection.query(`${startId}; ${countRows}`, function (error, results, fields) {
        if (error) throw error;
        // `results` is an array with one element for every statement in the query:
        globalObj.startId = results[0][0]['MIN(id)'];
        globalObj.countRows = results[1][0]['COUNT(*)'];
        for (let i = globalObj.startId; i < globalObj.countRows + 1; i++){
            if (globalObj.startId === i){
                receiveStartPeriod(i);
            } else {
                //console.log(i);
                receiveAnotherStartPeriod(i);
            }
        }
        res.end('ок');
    });
}

function receiveStartPeriod(id){
    let startPeriod = `SELECT time FROM route WHERE id=${id}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
            globalObj.startPeriod = rows[0]['time'];
            calcTime(id);
        })
	.catch(console.log('error'))
        //.then( () => connection.end());
}

function receiveAnotherStartPeriod(id){
    let startPeriod = `SELECT time FROM route WHERE id=${id}`;
    connection.promise().query(startPeriod)
        .then (([rows, fields]) => {
            console.log(72);
            globalObj.startPeriod = rows[0]['time'];
            receiveAnotherStartPeriod2(id);
            //calcTime(id);
        })
	.then(() => {
		console.log(777)
	})
        .catch(console.log())
        //.then(() => {calcTime(id)});
}

function receiveAnotherStartPeriod2(id){
    console.log('receiveAnotherStartPeriod2')
    let prevPointTime = `SELECT time FROM point_time WHERE point_id=${+id - 1}`;
    connection.promise().query(prevPointTime)
        .then (([rows, fields]) => {
            globalObj.start = Date.parse(rows[0]['time']);
            //calcTime(id);
        })
        .catch(console.log)
        .then(() => {calcTime(id)});
}

function calcTime(id){
    console.log('calcTime')
    console.log('calcTime = ', globalObj.startPeriod)
    let period = globalObj.startPeriod * globalObj.mlsecInSec * globalObj.minInHour;
    let stopDateMil = globalObj.start + period;
    let stopDate = new Date(stopDateMil);
    console.log(new Date(globalObj.start), period, id, stopDate);
    let insert = `UPDATE point_time SET time='${stopDate}' WHERE point_id=${id}`;
    connection.promise().query(insert)
        .then (([rows, fields]) => {
            //console.log('Ура')
        })
        .catch(console.log)
        //.then( () => connection.end());
}
