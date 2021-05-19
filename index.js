const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.url === process.env.UPLOAD_DIR && req.method === 'POST'){
		const dirname = path.join(__dirname, process.env.UPLOAD_DIR, '/');
		const form = formidable({ multiples: true, uploadDir: dirname, hash: false });

		form.on('file', (filename, file) => {
		  form.emit('data', { name: 'file', key: filename, value: file });
		});

		form.on('data', ({name, key, value}) => {
			fs.rename(value.path, dirname + key, (err) => {
				if (err) throw err;
			})
		});

		form.parse(req, (err, fields, files) => {
		    res.writeHead(200, { 'content-type': 'application/json' });
		    res.end(JSON.stringify({ fields, files }, null, 2));
		});
		 
		return;
	}
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})