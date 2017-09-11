const summonerModel = require('../../models/summoner');
const mongoose = require('mongoose');
const Summoner = mongoose.model('Summoner'); 

summonerUtils = {}

/* returns todays date in dd/mm/yyyy format
 * @params {Object} date: generic Date object
 * @return {String}: returns todays date in dd/mm/yyy format
 */
summonerUtils.getNewDate = function(date) {

    let day = date.getDate(); // returns day of the month (0-31)
    let month = date.getMonth()+1; // returns month (0-11)
    let year = date.getFullYear();

    let dateString = day + '/' + month + '/' + year;
    return dateString;
}

/* returns a summoner model object
 * @params {Object} summonerData: JSON object containing summoner data to be stored
 * @params {String} date: date in 'dd/mm/yyyy' format. Date of next summoner look up for this specific summoner
 * @returns {Object}: returns a summoner model object
 */
summonerUtils.createSummoner = function(summonerData, date) {
    let summoner = new Summoner({
        profileIconId: summonerData.profileIconId,
        name: summonerData.name,
        accountId: summonerData.accountId,
        id: summonerData.id,
        revisionDate: summonerData.revisionDate,
        updateScheduled: date
    });
    return summoner;
}

/* saves a summoner model to the database
 * @params {Object} summoner: summoner model object to be saved
 * @params {Function} callBack: callback to be executed on completion of save operation
 */
summonerUtils.saveSummoner = function(summoner, callBack) {

    summoner.save(callBack);
}

/* checks to see if a summoner object already exists in the database
 * @params {Object} summoner: summoner to check in DB for
 * @params {Function} callBack: callback to be executed on completion of find operation. If non-error field.length ==
 * true, then the summoner already exists
 */
summonerUtils.checkSummonerExists = function(summoner, callBack) {
    Summoner.find({'accountId': summoner.accountId}, callBack);   
}

/* removes all summoner models in the database matching a certain set of conditions. Required for DB maintenance
 * @params {Object} conditions: conditions object to match with all entried to be deleted
 * @params {Function} callBack: callback to be executed on completion of remove operation
 */
summonerUtils.removeSummoner = function(conditions, callBack) {
    // conditions object example: {updateScheduled: '25/01/1999'} <- remove all summoners with this matching date string
    Summoner.remove(conditions, callBack);
}

/* updates a summoner model in the database with the updated parameters
 * @params {Object} summoner: summoner object to be updated
 * @params {Object} params: paramaters to be updated in the db for the given summoner
 * @params {Function} callBack: callback to be executed on update completion. Takes (error, rawResponse)
 */
summonerUtils.updateSummoner = function(summoner, params, callBack) {
    Summoner.update(summoner, params, callBack);   
}

/* get a list of all accountId's belonging to summoners to be updated today
 * @params {Function} callBack: callback to be executed on completion of find operation
 * @return {Array}: returns an array of accountId objects containing summonerID's and timestamps of when the entries were last
 * updated
 */
summonerUtils.getTodaysSummoners = function(callBack) {
    // get all summoners that have their updateScheduled field matching todays date.
    let today = summonerUtils.getNewDate(new Date());
    
    Summoner.find({'updateScheduled': today}, 'accountId revisionDate', callBack);
}

module.exports = summonerUtils;
