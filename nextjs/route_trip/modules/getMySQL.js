const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
});

// exports.get = function(res) {
//   res.setHeader('Content-Type', 'text/plain');
//   connection.query(
//     'SELECT * FROM `route` NATURAL JOIN `cross_point`',
//     function(err, results, fields) {
//       res.end(JSON.stringify(results));
//     }
//   );
// };

exports.get = function(res) {
  res.setHeader('Content-Type', 'text/plain');
  let mainTable = 'SELECT * FROM route';
  let joinTime = 'JOIN format_time ON route.id=format_time.time_id';
  let joinCrossPoint = 'JOIN cross_point ON route.id=cross_point.id';
  connection.query(
    `${mainTable} ${joinTime} ${joinCrossPoint}`,
    function(err, results, fields) {
      res.end(JSON.stringify(results));
    }
  );
};