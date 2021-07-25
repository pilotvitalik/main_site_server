const calcTime = require('./calcTime');
require('dotenv').config();

exports.id = function(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', () => {
        body = JSON.parse(body);
        calcTime.calc(body.time, res);
    })
};