const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB,
    multipleStatements: true
});

exports.delete = function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  })
  req.on('end', () => {
    body = JSON.parse(body);
    deleteRowTable(body, res)
  })
};

function deleteRowTable(data, res){
  let count = 0;
  console.log(data.id);
  connection.query(
    `DELETE FROM route WHERE id=${data.id}`,
    function(err, results, fields) {
      if (err) {
          console.log(err)
        res.end('Возникла внутренняя ошибка сервера: удаление');
        return false;
      }
      count = calcRows(res);
    }
  );
}

function calcRows(res){
  connection.query(
      `SELECT COUNT(*) FROM route`,
      function(err, results, fields) {
        if (err) {
          res.end('Возникла внутренняя ошибка сервера: подсчет');
          return false;
        }
        count = results[0]['COUNT(*)'];
        zeroingAutoIncrement(count + 1, res);
      }
  );
}

function zeroingAutoIncrement(count, res){
  let zeroingRoute = `ALTER TABLE route AUTO_INCREMENT = ${count}`;
  let zeroingStatus = `ALTER TABLE cross_point AUTO_INCREMENT = ${count}`;
  let zeroingTime = `ALTER TABLE point_time AUTO_INCREMENT = ${count}`;
  let zeroingFormatTime = `ALTER TABLE format_time AUTO_INCREMENT = ${count}`;
  connection.query(
    `${zeroingRoute}; ${zeroingStatus}; ${zeroingTime}; ${zeroingFormatTime}`,
      function(err, result, fields){
          if (err) {
              res.end('Возникла внутренняя ошибка сервера: обнуление');
              return false;
          }
          res.end('Данные обновлены');
      }
  );
}