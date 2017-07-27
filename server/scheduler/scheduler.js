// This is where my code for the scheduler will reside
const riotAPI = require('../riotAPIWrapper/riotAPI');

scheduler = {};

scheduler.start = function() {
    riotAPI.initAPIWrapper();
    scheduler.startCrawl();
}

scheduler.startCrawl = function() {
    // I have no idea how to schedule the data lookup.... I need to factor in how frequently a player plays to go along
    // with a basic searching pattern
}

module.exports = scheduler;
