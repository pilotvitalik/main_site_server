const calcTime = require('./calcTime');
require('dotenv').config();

exports.startRoute = function(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', () => {
        body = JSON.parse(body);
        if (body.password !== process.env.ROOT_PASSWD){
          res.end('Неправильный пароль')
          return false;
        }
        calcTime.calc(body.time, res);
    })
};