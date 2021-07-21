const http = require('http');
const mysqlGet = require('./modules/getMySQL');
const mysqlAdd = require('./modules/addMySQL');
const mysqlEdit = require('./modules/editMySQL');
const mysqlDelete = require('./modules/deleteMySQL');
const checkPoit = require('./modules/checkPoint');
const defineStartId = require('./modules/startId');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	console.log(req.url)
	switch (req.url) {
		case process.env.ADD_POINT:
			mysqlAdd.add(req, res);
			break;
		case process.env.EDIT_POINT:
			mysqlEdit.edit(req, res);
			break;
		case process.env.DELETE_POINT:
			mysqlDelete.delete(req, res);
			break;
		case process.env.CHECK_POINT:
			checkPoit.check(req, res);
			break;
		case process.env.START_ID:
			defineStartId.id(res);
			break;
		default:
			mysqlGet.get(res);
			break;
	}
})

server.listen(port, hostname, () => {
	console.log('Server was started');
})