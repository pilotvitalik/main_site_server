const mysql = require('mysql2');
const calcTime = require('./calcTime');
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
      calcTime.calc(data.time, res)
    }
  );
}