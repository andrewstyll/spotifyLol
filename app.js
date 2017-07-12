const express = require('express');
const app = express();
const routes = require('./server/routes');

app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
    console.log("Hello friends");   
});
