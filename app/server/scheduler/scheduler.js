const riotAPI = require('../riotAPIWrapper/riotAPI');
const PriorityQueue = require('../../../utils/priorityQueue');

scheduler = {};

let reqQueue;

scheduler.start = function() {

    reqQueue = new PriorityQueue();

    riotAPI.initAPIWrapper();
    scheduler.startCrawl();
}

// database needs to be pre seeded with some number of players from different ranks to get an even distribution
scheduler.startCrawl = function() {
    // 1. look up x number of people from db
    // 2. for each player, look up their match history and store the match ID's so I know what has and hasn't been looked
    //      up already
    // 3. queue up a lookup of the match data, assuming it doesn't exist in the db
    // 4. from one of the matches for each player, store a valid player to be updated. For a player to be updated, they
    //      can either not have been looked up before (in which case they will not exist in the db and will provide us 
    //      with new match history data), or they have to have last played somewhere between an hour ago and a week ago. 
    //      To do this check, look up the player in the db. If they exist, look them up with the API and check the last
    //      updated field.
    // 5. repeat this over and over again.
    //
    // NOTE: implement with a priority queue, with all lookups being given the second highest priority. Retransmitted
    //          requests and searches/updates requested from the front end are to be assigned the highest priority
}

module.exports = scheduler;
