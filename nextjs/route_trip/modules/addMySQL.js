const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
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
      insert(data, count + 1, res);
    }
  );
}

function insert(data, count, res){
  const queryString = `'${data.title}', '${data.distance}', '${data.time}', '${data.speed}', 'route_${count}'`;
  connection.query(
    `INSERT INTO route(point, distance, time, speed, pointid) VALUES (${queryString})`,
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