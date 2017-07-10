const riotAPI = require('./../riotAPIWrapper/riotAPI');

tests = {};

// I'll do this with chai later.. or never XP
tests.summonerByName = function (input, expected) {
    riotAPI.getSummonerInfoByName(input, function(error, data) {
        if(error) {
            console.log('summonerByName: ' + error.errorResponse + ' ' + error.message);
        } else {
            if(data.accountId === expected) {
                console.log('TEST summonerByName PASS');
            } else {
                console.log('TEST summonerByName FAIL');
            }
        }
    });
}

tests.matchHistory = function (input, expected) {
    riotAPI.getMatchHistory(input, true, function(error, data) {
        if(error) {
            console.log('matchHistory: ' + error.errorResponse + ' ' + error.message);
        } else {
            if(data.matches[0].season === expected) {
                console.log('TEST matchHistory PASS');
            } else {
                console.log('TEST matchHistory FAIL');
            }
        }
    });
}

tests.matchData = function(input, expected) {
    riotAPI.getMatchData(input, function(error, data) {
        if(error) {
            console.log('matchData: ' + error.errorResponse + ' ' + error.message);
        } else {
            let participantID = null;
            data.participantIdentities.forEach(function(playerObj) {
                if(playerObj.player.accountId === expected) {
                    participantID = playerObj.participantId;   
                }
            });
            if(participantID) {
                console.log('TEST matchData PASS');
            } else {
                console.log('TEST matchData FAIL');
            }
        }
    });
}

module.exports = tests;
