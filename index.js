const express = require('express');
const app = express();
require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

app.get('/next', function (req, res) {
  res.send('hello world from express')
})

app.listen(port)