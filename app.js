const express = require('express');

require('dotenv').config();

process.env.NODE_ENV = 'dev';

const db = require('./db/db');
const routes = require('./routes');
const scheduler = require('./app/server/scheduler/scheduler');

const app = express();

app.use('/', routes);

scheduler.start();

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
});
