const https = require('https');
const fs = require('fs');
const mysqlGet = require('./modules/getMySQL');
const mysqlAdd = require('./modules/addMySQL');
const mysqlEdit = require('./modules/editMySQL');
const mysqlDelete = require('./modules/deleteMySQL');
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const options = {
  key: fs.readFileSync('./privatekey.pem'),
  cert: fs.readFileSync('./certificate.pem')
};

const server = https.createServer(options, (req, res) => {
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
		default:
			mysqlGet.get(res);
			break;
	}
})

server.listen(port, hostname, () => {
	console.log('Server https was started');
})
