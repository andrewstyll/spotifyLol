const routes = require('express').Router();

const summonerSearch = require('./summonerSearch');
const summoner = require('./summoner');
const moodAI = require('./moodAI');

routes.get('/summonerSearch', summonerSearch);
routes.get('/summonerSearch/:summonerName', summoner);
routes.get('/moodAI', moodAI);

routes.get('/', function(req, res) {
    res.send({message: 'Connected'});
});

module.exports = routes;
