const matchHistoryModel = require('../../models/matchHistory');
const mongoose = require('mongoose');
const MatchHistory = mongoose.model('MatchHistory'); 

matchHistoryUtils = {}

/* returns a matchHistory object
 * @params {Object} matchHistoryData: JSON object containing matchHistory data to be stored
 * @returns {Object}: returns a matchHistory model object
 */
matchHistoryUtils.createMatchHistory = function(matchHistoryData) {
    let matchHistory = new MatchHistory({
        gameId: matchHistoryData.gameId,
        queue: matchHistoryData.queue,
        season: matchHistoryData.season,
        timeStamp: matchHistoryData.timestamp
    });

    return matchHistory;
}

/* checks to see if a matchHistory object already exists in the database
 * @params {Object} matchHistory: matchHistory to check in DB for
 * @params {Function} callBack: callback to be executed on completion of find operation. If non-error field.length == true, 
 * then the matchHistory doesn't exist.
 */
matchHistoryUtils.checkMatchHistoryExists = function(matchHistory, callBack) {
    MatchHistory.find({'gameId': matchHistory.gameId}, callBack);
}

/* saves a matchHistory model to the database
 *  38  * @params {Object} matchHistory: matchHistory model object to be saved
 *   39  * @params {Function} callBack: callback to be executed on completion of save operation function(err, product, numAffected)
 */
matchHistoryUtils.saveMatchHistory = function(matchHistory, callBack) {
    matchHistory.save(callBack);
}

module.exports = matchHistoryUtils;
