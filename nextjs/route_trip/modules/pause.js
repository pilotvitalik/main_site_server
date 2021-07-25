const mysql = require('mysql2');
const mysqlGet = require('./getMySQL');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
});

const globalObj = {};

exports.pause = function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  })
  req.on('end', () => {
    body = JSON.parse(body);
    globalObj.status = body.status;
    globalObj.time = body.actTime;
    defineMinId(res);
  })
};

function defineMinId(res){
  let startId = 'SELECT MIN(id) FROM route NATURAL JOIN cross_point WHERE isChecked=false';
  connection.promise().query(startId)
    .then (([rows, fields]) => {
      globalObj.minId = rows[0]['MIN(id)'];
      if (globalObj.status){
        setPause(res); 
        return false;
      }
      defineForecastTime(res);
    })
    .catch(console.log())
}

function setPause(res){
  res.setHeader('Content-Type', 'text/plain');
  connection.promise().query(`UPDATE route SET pause=${globalObj.status} WHERE id=${globalObj.minId}`)
    .then (([rows, fields]) => {
      res.end(JSON.stringify({status: 'Маршрут на паузе'}));
    })
  .catch(console.log())
}

function defineForecastTime(res){
  let getForecastTime = `SELECT time FROM point_time WHERE point_id=${globalObj.minId}`;
  connection.promise().query(getForecastTime)
    .then (([rows, fields]) => {
      globalObj.forecast = Date.parse(rows[0]['time']);
      removePause(res);
    })
  .catch(console.log())
}

function removePause(res){
  const diff = globalObj.forecast - globalObj.time;
  const updTime = new Date(globalObj.forecast + diff);
  const updForecast = `UPDATE point_time SET time='${updTime}' WHERE point_id=${globalObj.minId}`;
  formatTime(updTime, res);
}

function formatTime(updTime, res){
    let hour = (String(updTime.getHours()).length === 1) ? `0${updTime.getHours()}` : updTime.getHours();
    let minutes = (String(updTime.getMinutes()).length === 1) ? `0${updTime.getMinutes()}` : updTime.getMinutes();
    let dateMonth = (String(updTime.getDate()).length === 1) ? `0${updTime.getDate()}` : updTime.getDate();
    let numberMonth = (String(updTime.getMonth()).length === 1) ? `0${updTime.getMonth()}` : updTime.getMonth();
    let year = String(updTime.getFullYear()).slice(2);
    let finalString =`${hour}:${minutes} ${dateMonth}.${numberMonth}.${year}`;
    let editRow = `UPDATE format_time SET time='${finalString}' WHERE time_id=${globalObj.minId}`;
    connection.promise().query(editRow)
        .then (([rows, fields]) => {
          mysqlGet.get(res);
        })
        .catch(console.log)
}