const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const stream = require('stream');
// const express = require('express');
require('dotenv').config();
// var multer  = require('multer')
// var upload = multer({ dest: 'node/uploadFile' })

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

// app.post(process.env.UPLOAD_DIR, upload.single('upload_file'), function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.json(req.body);
// })

// app.listen(port, hostname, () => {
//   console.log(`Express listening at http://localhost:${port}`)
// })

var fileName = '';
var globalBuffer = [];

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.url === process.env.UPLOAD_DIR && req.method === 'POST'){
		const file = path.join(__dirname, process.env.UPLOAD_DIR, '/');
				const startFile = '255,216,255';
				const stopFile = '13,10,45,45,45,45,45,45';
				let buffer;
				let str;
				let name;
				let startName;
				let content;
				let arr = [];
				let stringArr;
				let count = 1;

				req.on('data', (chunk) => {
				    arr = chunk.toJSON().data; 
				    console.log(count);
				    if (count === 1){
				    	name = createFile(file, arr, startFile, stopFile);
				    } else {
				    	appendFile(file, name, arr);
				    }
				    count = count + 1;
				})

				req.on('end', function() {
					// buffer = Buffer.from(arr);
					// str = buffer.toString();
					// startName = str.indexOf('name=\"') + 6;
					// name = str.slice(startName, str.indexOf('\"', startName));
					// stringArr = arr.join(',');
					// content = stringArr.slice(stringArr.indexOf(startFile), stringArr.indexOf(stopFile));
					// arr = content.split(',');
					// buffer = Buffer.from(arr);

					// fs.writeFile(file + name, buffer, (err) => {
					// 	if (err )console.log(err);
					// })

					res.writeHead(200, { 'content-type': 'application/json' });
					res.end(`файл ${name} успешно загружен`);
				});
	}
})

function createFile(file, arr, startFile, stopFile){
	console.log('createFile');
	let buffer = Buffer.from(arr);
	let str = buffer.toString();
	let startName = str.indexOf('name=\"') + 6;
	let name = str.slice(startName, str.indexOf('\"', startName));
	let stringArr = arr.join(',');
	let content = stringArr.slice(stringArr.indexOf(startFile), stringArr.indexOf(stopFile));
	arr = content.split(',');
	buffer = Buffer.from(arr);

	fs.appendFile(file + name, buffer, (err) => {
		if (err )console.log(err);
	})

	return name;
}

function appendFile(file, name, arr){
	let buffer = Buffer.from(arr);
	
	fs.appendFile(file + name, buffer, (err) => {
		if (err )console.log(err);
	})
}

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})