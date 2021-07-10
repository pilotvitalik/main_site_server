const http = require('http');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/plain');
	res.setStatus = 200;
	res.end('[{"name": "Vitaliy"}]');
	console.log(req.url)
})

server.listen(port, hostname, () => {
	console.log('Server was started');
})

