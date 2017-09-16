//this is where my wrapper functions will reside for the riot games API

const CONST = require('./constants/requestConstants');
const utils = require('./apiUtility');

const API = CONST.API_CALL; //API_CALL object
const REQ_PRIORITY = CONST.REQ_PRIORITY;

let riotAPI = {};

/* initiates the riot games API wrapper
 * @param {String}: takes in a summoner name to send a seed request to determine the current API rate limit from the
 * header
 * @param {Function}: callback to be executed upong successful instantiation of the API wrapper
 * @callback {Object}: will initiate either a test sequence or a data crawler
 */
riotAPI.initAPIWrapper = function(summonerName, callBack) {
    if(summonerName) {
        riotAPI.getSummonerInfo(summonerName, function(error, response, body) {
            if(error) {
                console.log('Error initializing API: ' + error.errorResponse + ' ' + error.message);
            } else {
                utils.initRateLimiters();
                callBack();
            }
        }, REQ_PRIORITY.CONFIG_REQ);
    } else {
        utils.initRateLimiters();
    }
}

/* callback invoked after api call for summoner info, call made by summoner name
 * @param {String/Integer} summName: string contaning summoner name OR Integer containing accountId
 * @param {Function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match summoner data, response data or error data params
 */
riotAPI.getSummonerInfo = function(summoner, callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
   
    let apiRequest;

    if(typeof summoner === 'string') {
        apiRequest = API.SUMMONER_BY_NAME + summoner;
    } else {
        apiRequest = API.SUMMONER_BY_ACCOUNT + summoner;        
    }

    let url = utils.makeURL(region, apiRequest, null);
    
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

/* callback invoked after api call for match history, call made by summoner accountID
 * @param {long} accountID: long int contaning summoner account ID 
 * @param {bool} recent: boolean determining if we want just last 20 games or not
 * @param {Object} options: contains a list of all options to be included in the API request
 * @param {function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match history data, response data or error data params
 */
riotAPI.getMatchHistory = function(accountID, recent, options, callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
    
    let matchHistoryTag;
    if(recent) {
        matchHistoryTag = '/recent' 
        options = null;
    } else {
        matchHistoryTag = '';
    }
    let apiRequest = API.MATCH_BY_ACC_ID + accountID + matchHistoryTag;

    let url = utils.makeURL(region, apiRequest, options);
    
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

/* callback invoked after api call for match data, call made by matchID
 * @param {long} matchID: long int contaning match ID 
 * @param {function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match data, response data or error data params
 */
riotAPI.getMatchData = function(matchID, callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
    
    let apiRequest = API.MATCH_BY_MATCH_ID + matchID;

    let url = utils.makeURL(region, apiRequest, null);
    
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

/* callback invoked after api call for curent game  info, call made by summonerID
 * @param {long} summonerID: long int contaning summonerID 
 * @param {function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match summoner data, response info or error data params
 */
riotAPI.getCurrentGameBySummID = function(summonerID, callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
    
    let apiRequest = API.SUMMONER_BY_NAME + summonerID;
    
    let url = utils.makeURL(region, apiRequest, null);
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

/* callback invoked after api call for profile icon files. STATIC DATA
 * @param {function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match profile icon data, response info,  or error data
 */
riotAPI.getProfileIcons = function(callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
    
    let apiRequest = API.PROFILE_ICONS;

    let url = utils.makeURL(region, apiRequest, null);
    
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

/* callback invoked after api call for champion info. STATIC DATA
 * @param {function} callBack: function to be executed on return of data
 * @param {Integer} priority: priority rating for the request
 * @callback {Object}: takes match champion info, response info, or error data
 */
riotAPI.getChampionInfo = function(callBack, priority = REQ_PRIORITY.BCKGRND, region = CONST.REGION.NA) {
    let apiRequest = API.CHAMP_LIST;

    let url = utils.makeURL(region, apiRequest, null);
    
    // now make a request
    utils.makeRequest(priority, url, callBack);
}

module.exports = riotAPI;
