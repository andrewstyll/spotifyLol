const riotAPI = require('../riotAPIWrapper/riotAPI');
const PriorityQueue = require('../../../utils/priorityQueue');
const summUtils = require('./summonerUtility');

scheduler = {};

// get the match history since last updated 
function getMatchHistoryToDate(summoner) {
    riotAPI.getMatchHistory(); 
}

function iterateOverSummoners(error, summoners) {
    if(error) {
        console.log('error in iterateOverSummoners');
    } else {
        summoners.forEach(function(summoner) {
            getMatchHistoryToDate(summoner);   
        }); 
    }
}

scheduler.start = function() {

    riotAPI.initAPIWrapper();
    scheduler.startCrawl();
}

// database needs to be pre seeded with some number of players from different ranks to get an even distribution
scheduler.startCrawl = function() {
    
    // Do I do this with async.js or promises
    summUtils.getTodaysSummoners(iterateOverSummoners);
}

module.exports = scheduler;
