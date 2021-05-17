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
				let arr;
				let stringArr;
				let count = 1;
				let globalCount = 1;
				//temp var
				let tmp = [];
				let tmpName;
				req.on('data', (chunk) => {
				    arr = chunk.toJSON().data; 
				    stringArr = arr.join(',');
				    //tmp = tmp.concat(chunk.toJSON().data);

				    if (stringArr.includes('45,45,45')){
				    	if (globalCount === 1){
				    		tmpName = arr;
				    		name = createFile(file, arr, startFile, stopFile)
				    		count = 1;
				    	} else if (globalCount < 3){
				    		content = stringArr.slice(0, stringArr.indexOf(stopFile));
				    		newContent = stringArr.slice(stringArr.indexOf(stopFile) + 6);
				    		arr = content.split(',');
				    		console.log(arr);
				    		buffer = Buffer.from(arr);
				    		fs.appendFile(file + name, buffer, (err) => {
				    			if (err )console.log(err);
				    		});
				    		console.log(newContent);
				    		arr = newContent.split(',');
				    		arr.forEach(item => {
				    			tmp.push(Number(item));
				    		});
				    		name = createFile(file, tmp, startFile, stopFile);
				    		count = 1;
				    	} else if (globalCount === 3) {
				    		content = stringArr.slice(0, stringArr.indexOf(stopFile));
				    		arr = content.split(',');
				    		console.log(arr);
				    		buffer = Buffer.from(arr);
				    		fs.appendFile(file + name, buffer, (err) => {
				    			if (err )console.log(err);
				    		});
				    	}
				    	globalCount = globalCount + 1;
				    } else {
				    	appendFile(file, count, name, arr, startFile, stopFile);
				    }
				    console.log(count);
				    count = count + 1;				    
				})

				req.on('end', function() {

					res.writeHead(200, { 'content-type': 'application/json' });
					//res.end(`файл ${name} успешно загружен`);
					res.end(JSON.stringify(Buffer.from(tmpName).toJSON().data.toString()));
				});
	}
})

function createFile(file, arr, startFile, stopFile){
	console.log('createFile');
	console.log(arr)
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
	console.log(name)

	return name;
}

function appendFile(file, count, name, arr, startFile, stopFile){
	let buffer = Buffer.from(arr);
	//let stringArr = arr.join(',');
	//let content;
	//let newContent;
	// if (stringArr.includes('45,45,45')){
	// 	//count = 1;
	// 	//content = stringArr.slice(0, stringArr.indexOf(stopFile));
	// 	// newContent = stringArr.slice(stringArr.indexOf(stopFile));
	// 	//arr = content.split(',');
		
	// 	console.log('добавляется старый файл')
	// 	// fs.appendFile(file + name, buffer, (err) => {
	// 	// 	if (err )console.log(err);
	// 	// })
	// 	// arr = newContent.split(',');
	// 	createFile(file, arr, startFile, stopFile)
	// } else {
	// 	count = count;
	// 	fs.appendFile(file + name, buffer, (err) => {
	// 		if (err )console.log(err);
	// 	})
	// }
	console.log(name)
	fs.appendFile(file + name, buffer, (err) => {
			if (err )console.log(err);
		})
	//return count;
}

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})