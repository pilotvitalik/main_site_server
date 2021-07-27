const mysql = require('mysql2');
const calcTime = require('./calcTime');
const defineDiff = require('./diff');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
});

exports.check = function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  })
  req.on('end', () => {
    body = JSON.parse(body);
    checkPoint(body, res)
  })
};

function checkPoint(data, res){
  connection.query(
    `UPDATE cross_point SET isChecked=${data.val} WHERE id=${data.id}`,
    function(err, results, fields) {
      if (err) {
        console.log(err);
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      defineDiff.diff(data);
      setActTime(data);
      calcTime.calc(data.time, res);
    }
  );
}

function setActTime(data){
  let date = new Date(data.time);
  let hour = (String(date.getHours()).length === 1) ? `0${date.getHours()}` : date.getHours();
  let minutes = (String(date.getMinutes()).length === 1) ? `0${date.getMinutes()}` : date.getMinutes();
  let dateMonth = (String(date.getDate()).length === 1) ? `0${date.getDate()}` : date.getDate();
  let numberMonth = (String(date.getMonth()).length === 1) ? `0${date.getMonth()}` : date.getMonth();
  let year = String(date.getFullYear()).slice(2);
  let finalString =`${hour}:${minutes} ${dateMonth}.${numberMonth}.${year}`;
  insertUpdTime(data.id, finalString);
}
function insertUpdTime(id, string){
    let editRow = `UPDATE format_time SET time='${string}' WHERE time_id=${id}`;
    connection.promise().query(editRow)
        .then (([rows, fields]) => {})
        .catch(console.log)
}