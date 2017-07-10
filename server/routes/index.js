const routes = require('express').Router();

const summonerSearch = require('./summonerSearch');
const summoner = require('./summoner');
const moodAI = require('./moodAI');

routes.get('/summonerSearch', summonerSearch);
routes.get('/summonerSearch/:summonerName', summoner);
routes.get('/moodAI', moodAI);

const riotAPI = require('./../riotAPIWrapper/riotAPI');

testCallback = function(error, data) {
    if(error) {
        console.log(error.errorResponse + ' ' + error.message);
    } else {
        if('accountId' in data) {
            let accountID = data.accountId;
            riotAPI.getMatchHistory(accountID, true, testCallback);
            riotAPI.getMatchHistory(accountID, false, testCallback);
        } else if ('totalGames' in data) {
            console.log(data.totalGames);   
        }
    }
}

routes.get('/', function(req, res) {
    
    // for testing :D
    riotAPI.getSummonerInfoByName('alzadar', testCallback);

    res.send({message: 'Connected'});
});

module.exports = routes;
