const express = require('express');

const routes = require('./routes');
const scheduler = require('./app/server/scheduler/scheduler');

const app = express();

require('dotenv').config();

const db = require('./db/db');

app.use('/', routes);

scheduler.start();

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
});
