const riotAPI = require('../riotAPIWrapper/riotAPI');
const CONST = require('../riotAPIWrapper/constants/requestConstants');
const summUtils = require('./summonerUtility');
const schedUtils = require('./schedulerUtility');
const matchHistoryUtils = require('./matchHistoryUtility');

const REQ_PRIORITY = CONST.REQ_PRIORITY;

scheduler = {};

const defaults = {
    season: 'SEASON2017',
    queue: ['RANKED_FLEX_SR', 'TEAM_BUILDER_RANKED_SOLO']
};

/* callback called when returning from a call to lookup match history data
 * @param {Error} error: error that willbe thrown if async call is unsuccessful
 * @param {Object} matchHistoryData: object containing match history data returned from api call
 * on success, callBack will check to see if each match returned has been looked up already to avoid repeat searches
 */
function handleMatchHistory(error, matchHistoryData) {
    if(error) {
        console.log('error in handleMatchHistory');
    } else {
        // do something with the returning match history data 
        matchHistoryData.matches.forEach(function(matchHistory) {
            
            let newMatchHistory = matchHistoryUtils.createMatchHistory(matchHistory);               
            matchHistoryUtils.checkMatchHistoryExists(newMatchHistory, );
        });
    }
}

/* complies the options that will be used to stuff the URL called when getting match history
 * @param {Object} summoner: partial summoner object, will be used to look up the match history based on its accountId
 * property
 * @callBack: invokes callback on return.
 */
function getMatchHistoryToDate(summoner) {
    let accountId = summoner.accountId;
    let recent = false; // I only included this just in case... I'm certain i'll never need the recent option
    let options = schedUtils.makeMatchHistoryOptions(defaults.season, defaults.queue, summoner.revisionDate);
    
    let priority = REQ_PRIORITY.BCKGRND;
    
    riotAPI.getMatchHistory(accountId, recent, options, handleMatchHistory, priority); 
}

/* callBack that iterates over an array of summoners, and attempts to get the match history belonging to each one
 * @param {Error} error: error that willbe thrown if async call is unsuccessful
 * @param {Array} summoners: array containing summoner  data pulled from the DB
 */
function iterateOverSummoners(error, summoners) {
    if(error) {
        console.log('error in iterateOverSummoners');
    } else {
        summoners.forEach(function(summoner) {
            getMatchHistoryToDate(summoner);   
            // why would I ever need to check if the summoner exists, i'm looking them up right now, of course they
            // exist....
        }); 
    }
}

/* this is my ghetto ass method of stuffing the DB. I may or may not tuck this away somewhere else, it's very intrusive
 * in this file.
 */
function seedDB() {

    riotAPI.getSummonerInfoByName('rastamonke', function(error, summoner) {
        if(error) {
            console.log("Error looking up seed user: " + error);
        } else {
            let newSummoner = summUtils.createSummoner(summoner, summUtils.getTodaysDate());
            summUtils.removeSummoner({}, function(error) {
                if(error) {
                    console.log("Error clearing localDB of entries");
                } else {
                    summUtils.saveSummoner(newSummoner,function(error) {
                        if(error) {
                            console.log("Error seeding DB: " + error);
                        } else {
                            scheduler.startCrawl();
                        }
                    });
                }
            });
        }
    });      
}

/* the initialisation function of my scheduler. Initialises the riotAPI and starts the scheduler crawl as well
 */
scheduler.start = function() {

    riotAPI.initAPIWrapper();

    if(process.env.NODE_ENV === 'dev') {
        seedDB();
    } else {
        scheduler.startCrawl();
    }
}


/* my scheduler init function. starts the process by getting the the list of all summoners that are to have their data
 * updated today.
 * TODO:: automate this to be performed once every day
 */
scheduler.startCrawl = function() {
    
    summUtils.getTodaysSummoners(iterateOverSummoners);
}

module.exports = scheduler;
