schedUtils = {};

schedUtils.makeMatchHistoryOptions = function(season, queue, beginTime) {
    options = {};
    options.season = season;
    options.beginTime = beginTime;
    options.queue = queue; // array of queues

    return options;
}

/* This function should (given the date last updated, and the number of matches returned) estimate when next to look up
 * the summoner based on when they will next have 15 completed games.
 * 
 */
schedUtils.setNextUpdateTime = function() {
     
}

module.exports = schedUtils;
