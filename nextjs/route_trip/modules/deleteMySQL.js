const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
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
  console.log(data)
  connection.query(
    `DELETE FROM route WHERE id=${data.id}`,
    function(err, results, fields) {
      console.log(results)
      if (err) {
        console.log(err);
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      res.end('Данные обновлены');
    }
  );
}