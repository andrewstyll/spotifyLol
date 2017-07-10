//this is where my wrapper functions will reside for the riot games API

const CONST = require('./constants/requestConstants');
const utils = require('./apiUtility');

const API = CONST.API_CALL; //API_CALL object

let riotAPI = {};

/* callback invoked after api call for summoner info, call made by summoner name
 * @param {string} summName: string contaning summoner name 
 * @param {function} callBack: function to be executed on return of data
 * @callback {Object}: passes an object containing summoner data or error data
 */
riotAPI.getSummonerInfoByName = function(summName, callBack, region = CONST.REGION.NA) {
    
    let apiRequest = API.SUMMONER_BY_NAME + summName;
    
    let url = utils.makeURL(region, apiRequest);
    // now make a request
    utils.makeRequest(url, callBack);
}

/* callback invoked after api call for match history, call made by summoner accountID
 * @param {long} accountID: long int contaning summoner account ID 
 * @param {bool} recent: boolean determining if we want just last 20 games or not
 * @param {function} callBack: function to be executed on return of data
 * @callback {Object}: passes an object containing match history data or error data
 */
//TODO::need to implement options for queries :D
riotAPI.getMatchHistory = function(accountID, recent, callBack, region = CONST.REGION.NA) {
    
    let matchHistoryTag;
    if(recent) {
        matchHistoryTag = '/recent' 
    } else {
        // can add in options based on what type of query I want
        matchHistoryTag = '';
    }
    let apiRequest = API.MATCH_BY_ACC_ID + accountID + matchHistoryTag;

    let url = utils.makeURL(region, apiRequest);
    
    // now make a request
    utils.makeRequest(url, callBack);
}

/* callback invoked after api call for match data, call made by matchID
 * @param {long} matchID: long int contaning match ID 
 * @param {function} callBack: function to be executed on return of data
 * @callback {Object}: passes an object containing match data or error data
 */
riotAPI.getMatchData = function(matchID, callBack, region = CONST.REGION.NA) {
    
    let apiRequest = API.MATCH_BY_MATCH_ID + matchID;

    let url = utils.makeURL(region, apiRequest);
    
    // now make a request
    utils.makeRequest(url, callBack);
}

//TODO::need to implement options for queries :D
riotAPI.getProfileIcons = function(callBack, region = CONST.REGION.NA) {
    let apiRequest = API.PROFILE_ICONS;
}

//TODO::need to implement options for queries :D
riotAPI.getChampionInfo = function(callBack, region = CONST.REGION.NA) {
    let apiRequest = API.CHAMP_LIST;
}

module.exports = riotAPI;
