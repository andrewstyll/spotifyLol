const express = require('express');
const app = express();
const routes = require('./server/routes');

const tests = require('./server/test/test');

app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
    
    tests.summonerByName('alzadar', 38639641);
    tests.matchHistory(38639641, 8);
    tests.matchData(2538566376, 38639641);
});
