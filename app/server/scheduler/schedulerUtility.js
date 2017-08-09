const summonerModel = require('../../models/summoner');
const mongoose = require('mongoose');
const Summoner = mongoose.model('Summoner'); 

schedulerUtils = {}

/* returns todays date in dd/mm/yyyy format
 * @return {String}: returns todays date in dd/mm/yyy format
 */
schedulerUtils.getTodaysDate = function() {
    let date = new Date();
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
schedulerUtils.createSummoner = function(summonerData, date) {
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
schedulerUtils.saveSummoner = function(summoner, callBack) {

    summoner.save(callBack);
}

/* removes all summoner models in the database matching a certain set of conditions. Required for DB maintenance
 * @params {Object} conditions: conditions object to match with all entried to be deleted
 * @params {Function} callBack: callback to be executed on completion of remove operation
 */
schedulerUtils.removeSummoner = function(conditions, callBack) {
    // conditions object example: {updateScheduled: '25/01/1999'} <- remove all summoners with this matching date string
    Summoner.remove(conditions, callBack);
}

/* get a list of all summoners to be updated today
 * @params {Function} callBack: callback to be executed on completion of find operation
 * @return {Array}: returns an array of objects containing summonerID's and timestamps of when the entries were last
 * updated
 */
schedulerUtils.getTodaysSummoners = function(callBack) {
    // get all summoners that have their updateScheduled field matching todays date.
    let today = schedulerUtils.getTodaysDate();
    
    Summoner.find({'updateScheduled': today}, 'accountId', callBack);
}

module.exports = schedulerUtils;
