const http = require('http');
const mysqlGet = require('./modules/getMySQL');
const mysqlAdd = require('./modules/addMySQL');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	switch (req.url) {
		case '/next/route_trip':
			mysqlGet.get(res);
			break;
		default:
			mysqlAdd.add(req, res);
			break
	}
})

server.listen(port, hostname, () => {
	console.log('Server was started');
})

