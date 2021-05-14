const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const stream = require('stream');
require('dotenv').config()

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.url === process.env.UPLOAD_DIR && req.method === 'POST'){
		const file = path.join(__dirname, process.env.UPLOAD_DIR, '/');
		let body = '';
		let buffer;
		let str;
		let name;
		let startName;
		let content;
		let arr;
		req.on('data', (chunk) => {
		    body += chunk.toString();
		})

		req.on('end', function() {
		  startName = body.indexOf('name=\"') + 6;
		  name = body.slice(startName, body.indexOf('\"', startName));
		  content = body.slice((body.indexOf('\r\n\r\n') + 4), body.indexOf('\r\n---'));
		  arr = content.split(',');
		  buffer = Buffer.from(arr);

		  fs.writeFile(file + name, buffer, (err) => {
		  	if (err )console.log(err);
		  })

		  res.writeHead(200, { 'content-type': 'application/json' });
		  res.end(`файл ${name} успешно загружен`);
		});
	}
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})