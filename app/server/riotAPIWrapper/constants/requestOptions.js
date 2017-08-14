// This will contain a list of all of the queues that return match data containing summoner info with the purpose of
// assigning a winning percentage on a champion to the summoner
const queue = {
    RANKED_FLEX_SR: 440, // current season ranked team builder
    TEAM_BUILDER_RANKED_SOLO: 420, // current season ranked solo
    RANKED_TEAM_5x5: 42, 
    RANKED_SOLO_5x5: 4,
    RANKED_FLEX_TT: 9
};

// I can only see me wanting info from the past 2 seasons at most
const season = {
    PRESEASON2016: 6,
    SEASON2016: 7,
    PRESEASON2017: 8,
    SEASON2017: 9
}

module.exports = {
    season,
    queue
};
