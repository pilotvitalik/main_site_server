const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  database: process.env.DB,
  password: process.env.PASSWD_DB
});

exports.edit = function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  })
  req.on('end', () => {
    body = JSON.parse(body);
    changeRowTable(body, res)
  })
};

function changeRowTable(data, res){
	let string = '';
	for (let key in data){
		if (key !== 'id'){
			string += `${key}='${data[key]}', `;
		}
	}
	connection.query(
	  `UPDATE route SET ${string.slice(0, -2)} WHERE id=${data.id}`,
	  function(err, results, fields) {
	    if (err) {
	      console.log(err);
	      res.end('Возникла внутренняя ошибка сервера');
	      return false;
	    }
	    res.end('Данные обновлены');
	  }
	);
}