const express = require('express');
const app = express();
const routes = require('./server/routes');
const scheduler = require('./server/scheduler/scheduler');

require('dotenv').config();

app.use('/', routes);

scheduler.start();

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
});
