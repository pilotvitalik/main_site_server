const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
require('dotenv').config()

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (req.url === process.env.UPLOAD_DIR && req.method === 'POST'){
		const form = formidable({ multiples: true, uploadDir: __dirname + process.env.UPLOAD_DIR, multiples: true});
		form.on('file', (filename, file) => {
		  form.emit('data', { name: 'file', key: filename, value: file });
		});
		form.on('data', ({ name, key, value }) => {
			fs.rename(value.path, __dirname + process.env.UPLOAD_DIR + '/' + key, (err) => {
				if (err) console.log(err);
			});
		})
		form.parse(req, (err, fields, files) => {
		    res.writeHead(200, { 'content-type': 'application/json' });
		    res.end(JSON.stringify({ fields, files }, null, 2));
		});
	}
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})