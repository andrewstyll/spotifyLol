schedUtils = {};

schedUtils.makeMatchHistoryOptions = function(season, queue, beginTime) {
    options = {};
    options.season = season;
    options.beginTime = beginTime;
    options.queue = queue; // array of queues

    return options;
}

module.exports = schedUtils;
