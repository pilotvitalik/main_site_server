const mysql = require('mysql2');
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
    console.log(body);
    checkPoint(body, res)
  })
};

function checkPoint(data, res){
  res.setHeader('Content-Type', 'text/plain');
  connection.query(
    `UPDATE cross_point SET isChecked=${data.val} WHERE id=${data.id}`,
    function(err, results, fields) {
      if (err) {
        console.log(err);
        res.end('Возникла внутренняя ошибка сервера');
        return false;
      }
      res.end(JSON.stringify({status: data.val}));
    }
  );
}