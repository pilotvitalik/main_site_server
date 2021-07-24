const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB,
    multipleStatements: true
});

exports.add = function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  })
  req.on('end', () => {
    body = JSON.parse(body);
    calcRowsTable(body, res)
  })
};

function calcRowsTable(data, res){
  let count;
  res.setHeader('Content-Type', 'text/plain');
  connection.query(
      `SELECT COUNT(*) FROM route`,
    function(err, results, fields) {
      if (err) {
        console.log(err);
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      count = results[0]['COUNT(*)'];
      console.log(count);
      insert(data, count + 1, res);
    }
  );
}

function insert(data, count, res){
  const queryString = `'${data.title}', '${data.distance}', '${data.duration}', '${data.speed}'`;
  const date = new Date();
  const actDate = new Date(date);
  const hour = (String(actDate.getHours()).length === 1) ? `0${actDate.getHours()}` : actDate.getHours();
  const minutes = (String(actDate.getMinutes()).length === 1) ? `0${actDate.getMinutes()}` : actDate.getMinutes();
  const dateMonth = (String(actDate.getDate()).length === 1) ? `0${actDate.getDate()}` : actDate.getDate();
  const numberMonth = (String(actDate.getMonth()).length === 1) ? `0${actDate.getMonth()}` : actDate.getMonth();
  const year = String(actDate.getFullYear()).slice(2);
  const finalString =`${hour}:${minutes} ${dateMonth}.${numberMonth}.${year}`;

  const insertPoint = `INSERT INTO route(point, distance, duration, speed) VALUES (${queryString})`;
  const insertStatus = `INSERT INTO cross_point(id, isChecked) VALUES (${count}, false)`;
  const insertTime = `INSERT INTO point_time(time) VALUES ('${date}')`;
  const insertFormatTime = `INSERT INTO format_time(time) VALUES ('${finalString}')`;
  connection.query(
    `${insertPoint}; ${insertStatus}; ${insertTime}; ${insertFormatTime}`,
    function(err, results, fields) {
      if (err) {
        console.log(err);
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      res.end('Данные сохранены');
    }
  );
}