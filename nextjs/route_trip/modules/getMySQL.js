const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
});

exports.get = function(res) {
  res.setHeader('Content-Type', 'text/plain');
  connection.query(
    'SELECT * FROM `route`',
    function(err, results, fields) {
      res.end(JSON.stringify(results));
    }
  );
};