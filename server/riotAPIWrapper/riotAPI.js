//this is where my wrapper functions will reside for the riot games API

const CONST = require('./constants/requestConstants');
const utils = require('./apiUtility');

const API = CONST.API_CALL; //API_CALL object

let riotAPI = {};

/* returns return of api call for summoner info, call made by summoner name
 * @param {string} summName: string contaning summoner name 
 * @return {Object}: returns an object containing summoner data
 */
riotAPI.getSummonerInfoByName = function(summName, callBack, region = CONST.REGION.NA) {
    
    let apiRequest = API.SUMMONER_BY_NAME + summName;
    
    let url = utils.makeURL(region, apiRequest);
    // now make a request
    utils.makeRequest(url, callBack);
}

/* returns return of api call for match history, call made by summoner accountID
 * @param {string} accountID: string contaning summoner account ID 
 * @param {bool} recent: boolean determining if we want just last 20 games or not
 * @param {function} callBack: function to be executed on return of data
 * @return {Object}: returns an object containing matchHistory data
 */
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

module.exports = riotAPI;
