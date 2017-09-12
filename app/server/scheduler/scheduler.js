const riotAPI = require('../riotAPIWrapper/riotAPI');
const CONST = require('../riotAPIWrapper/constants/requestConstants');

const schedUtils = require('./schedulerUtility');
const summUtils = require('./summonerUtility');
const matchHistoryUtils = require('./matchHistoryUtility');
const matchDataUtils = require('./matchDataUtility');

const REQ_PRIORITY = CONST.REQ_PRIORITY;

scheduler = {};

const defaults = {
    season: 'SEASON2017',
    queue: ['RANKED_FLEX_SR', 'TEAM_BUILDER_RANKED_SOLO']
};

// store the summoner info
function handleSummonerInfo(error, response, summoner) {
    
    if(error) {
        console.log('error in handleSummonerInfo: ' + error.errorResponse + ' ' + error.message );
    } else {
        let tomorrow = new Date();
        // set the date to be equal to tomorrow
        tomorrow.setDate(tomorrow+1);
        let newSummoner = summUtils.createSummoner(summoner, summonerUtils.getNewDate(tomorrow))     
        // store the new summmoner
        summUtils.saveSummoner(newSummoner,function(error) {
            if(error) {
                console.log('Error adding new summoner: ' + error);
            }        
        });
    }
}

function handleMatchData(error, response, matchData) {
    if(error) {
        console.log('error in handleMatchData: ' + error.errorResponse + ' ' + error.message);
    } else {
        matchData.participantIdentities.forEach(function(participant) {
            summUtils.checkSummonerExists(participant.player, function(error, summoner) {
                if(error) {
                    console.log('error checking if summoner exists');
                } else if(summoner.length) {
                    console.log('summoner already exists');                   
                } else {
                    // get summoner by ID
                    riotAPI.getSummonerInfo(participant.player.accountId, handleSummonerInfo);
                }
            });
        });
        
        /*matchDataUtils.saveMatchData(matchData, function(error, matchData, numAffected) {
            if(error) {
                console.log('error saving match data: ' + error);
            }
        });*/
    }
}

/* callback called when returning from a call to lookup match history data
 * @param {Error} error: error that willbe thrown if async call is unsuccessful
 * @param {Object} matchHistoryData: object containing match history data returned from api call
 * on success, callBack will check to see if each match returned has been looked up already to avoid repeat searches
 */
function handleMatchHistory(error, response, matchHistoryData) {
    if(error) {
        console.log('error in handleMatchHistory: ' + error.errorResponse + ' ' + error.message);
        // potential retransmit here
    } else {
        // do something with the returning match history data 
        matchHistoryData.matches.forEach(function(matchHistory) {
            
            let newMatchHistory = matchHistoryUtils.createMatchHistory(matchHistory);               
            matchHistoryUtils.checkMatchHistoryExists(newMatchHistory, function (error, foundMatchHistory) {
                if(error) {
                    console.log('error in storeMatchHistory');
                } else if(foundMatchHistory.length) {
                    console.log('match has already been stored!: ' + foundMatchHistory);          
                } else {
                    matchHistoryUtils.saveMatchHistory(newMatchHistory, function(error, matchHistory, numAffected) {
                        if(error) {
                            console.log('error saving match History data: ' + error);
                        }
                    }); 
                    let priority = REQ_PRIORITY.BCKGRND;
                    riotAPI.getMatchData(newMatchHistory.gameId, handleMatchData, priority);
                }
            });
        });
        
        //let newTime = schedUtils.setNextUpdateTime(); // figure out when to next update the summoner based on time last checked and size of match history
        //summonerUtils.updateSummoner(); // update the update timing of the summoner to determine when to next look them up
    }
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
            let accountId = summoner.accountId;
            let recent = false; // I only included this just in case... I'm certain i'll never need the recent option
            let options = schedUtils.makeMatchHistoryOptions(defaults.season, defaults.queue, summoner.revisionDate);
            
            let priority = REQ_PRIORITY.BCKGRND;
            
            riotAPI.getMatchHistory(accountId, recent, options, handleMatchHistory, priority); 
        }); 
    }
}

/* this is my ghetto ass method of stuffing the DB. I may or may not tuck this away somewhere else, it's very intrusive
 * in this file.
 */
function seedDB() {

    riotAPI.getSummonerInfo(process.env.SEED_NAME, function(error, response, summoner) {
        if(error) {
            console.log("Error looking up seed user: " + error.errorResponse + ' ' + error.message);
        } else {
            let date = new Date();
            let newSummoner = summUtils.createSummoner(summoner, summUtils.getNewDate(date));
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

/* the initialisation function of my scheduler. Initialises the riotAPI and starts the scheduler crawl as well
 */
scheduler.start = function() {

    riotAPI.initAPIWrapper(process.env.SEED_NAME, function() {
        
        if(process.env.NODE_ENV === 'dev') {
            seedDB();
        } else {
            scheduler.startCrawl();
        }
    });

}

/* my scheduler init function. starts the process by getting the the list of all summoners that are to have their data
 * updated today.
 * TODO:: automate this to be performed once every day
 */
scheduler.startCrawl = function() {
    
    summUtils.getTodaysSummoners(iterateOverSummoners);
}

module.exports = scheduler;
