const matchHistoryModel = require('../../models/matchHistory');
const mongoose = require('mongoose');
const MatchHistory = mongoose.model('MatchHistory'); 

matchHistoryUtils = {}

// our match history will be a record of every match participated in by some players. Each match contains a match ID and
// that we will look for to check if it exists to avoid repeat storages.

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
 * @params {Function} callBack: callback to be executed on completion of find operation. If non-error field != null, the
 * matchHistoryData already exists
 */
matchHistoryUtils.checkMatchHistoryExists = function(matchHistory, callBack) {
    MatchHistory.find({'gameId': matchHistory.gameId}, callBack);
}

module.exports = matchHistoryUtils;
