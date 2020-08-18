const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('./config/winston');
const apiV1 = require('./routes/index');
const helmet = require('helmet')

const app = express();

require('dotenv').config({path: path.join(process.cwd(), 'variables.env')})

app.use(morgan('combined', {stream: winston.stream}));
app.use(helmet())

app.get('/', function(req, res) {
  return res.send(404);
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1', apiV1);

module.exports = app;
