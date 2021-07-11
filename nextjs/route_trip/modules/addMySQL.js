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
    insert(body, res)
  })
};

function insert(data, res){
  res.setHeader('Content-Type', 'text/plain');
  connection.query(
    `INSERT INTO route(point, distance, time, speed, pointid) VALUES ('${data.title}', ${data.distance}, ${data.time}, ${data.speed}, '${data.pointId}')`,
    function(err, results, fields) {
      if (err) {
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      res.end('Данные сохранены');
    }
  );
}