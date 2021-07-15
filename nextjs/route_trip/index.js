const http = require('http');
const mysqlGet = require('./modules/getMySQL');
const mysqlAdd = require('./modules/addMySQL');
const mysqlEdit = require('./modules/editMySQL');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	switch (req.url) {
		case process.env.LIST_ROUTE_POINTS:
			mysqlGet.get(res);
			break;
		case process.env.ADD_POINT:
			mysqlAdd.add(req, res);
			break;
		default:
			mysqlEdit.edit(req, res);
			break;
	}
})

server.listen(port, hostname, () => {
	console.log('Server was started');
})

