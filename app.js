const express = require('express');
const app = express();
const routes = require('./server/routes');

const riotAPI = require('./server/riotAPIWrapper/riotAPI');

require('dotenv').config();

riotAPI.initAPIWrapper();

app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
});
