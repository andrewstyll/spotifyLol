const riotAPI = require('./../../app/server/riotAPIWrapper/riotAPI');
const apiUtils = require('./../../app/server/riotAPIWrapper/apiUtility');
const OPTIONS = require('./../../app/server/riotAPIWrapper/constants/requestOptions');

const expect = require('chai').expect;

riotAPI.initAPIWrapper();

describe('riotAPI wrapper tests', function() {
    describe('apiUtils tests', function() {
        describe('makeURL call', function() {
            it('accepts only valid request options into URL builder', function() {
                
                let region = 'testRegion';
                let apiRequest = '/testRequest';
                let validValues = [OPTIONS.queue.RANKED_FLEX_SR, OPTIONS.queue.RANKED_FLEX_TT];
                let invalidValue = OPTIONS.queue.TEAM_BUILDER_RANKED_SOLO;

                let options = {banana: 123, season: 'alphabet', queue: ['RANKED_FLEX_SR', 'RANKED_FLEX_TT'], grape: 'TEAM_BUILDER_RANKED_SOLO'}
                let url = apiUtils.makeURL(region, apiRequest, options);
                
                expect(url).to.not.have.string('banana');
                expect(url).to.not.have.string('season');
                expect(url).to.have.string('queue');
                expect(url).to.have.string(validValues[0]);
                expect(url).to.have.string(validValues[1]);
                expect(url).to.not.have.string(invalidValue);
            });
        });
    });

    describe('riotAPI tests', function() {
        
        function checkValidError(error) {
            if(error != null) {
                if(error.errorResponse >= 500 || error.errorResponse == 404) {
                    return true;
                }
            }
            console.log(error);
            return false;
        }

        describe('summonerName call', function() {
            it('returned data object has correct keys, or throws valid error', function(done) {
                
                let keys = ['profileIconId', 'name', 'summonerLevel', 'revisionDate', 'id', 'accountId'];
                let summoner = 'rastamonke';
                riotAPI.getSummonerInfoByName(summoner, function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true;
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(keys); 
                        expect(data.name).to.equal(summoner);
                    }
                    done();
                });
            });   
        });   

        describe('getMatchHistory call', function() {
            it('returned data object has correct keys, or throws valid error WITHOUT recent flag', function(done) {
               
                let playerID = 38639641;
                let mainKeys = ['matches', 'totalGames', 'startIndex', 'endIndex'];
                let matchRefKeys = ['lane', 'gameId', 'champion', 'platformId', 'season', 'queue', 'role', 'timestamp'];
                let options = {queue: 'TEAM_BUILDER_RANKED_SOLO'};
                let maxNumRecent = 20;

                riotAPI.getMatchHistory(playerID, false, options, function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true;
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                        expect(data.matches[0]).to.include.all.keys(matchRefKeys);
                    }
                    done();
                });
                
            });  

            it('returned data object has correct keys, or throws valid error WITH recent flag', function(done) {
               
                let playerID = 38639641;
                let mainKeys = ['matches', 'totalGames', 'startIndex', 'endIndex'];
                let matchRefKeys = ['lane', 'gameId', 'champion', 'platformId', 'season', 'queue', 'role', 'timestamp'];
                let options = {queue: 'TEAM_BUILDER_RANKED_SOLO'};
                let maxNumRecent = 20;
                
                riotAPI.getMatchHistory(playerID, true, options, function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true;
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                        expect(data.matches[0]).to.include.all.keys(matchRefKeys);
                        expect(data).to.have.property(mainKeys[1], 20);
                        expect(data).to.have.property(mainKeys[3], 20);
                    }
                    done();
                });
            });   
        });
        
        describe('getMatchData call', function() {
            it('returned data object has correct keys, or throws valid error', function(done) {
               
                let matchID = 2538566376;
                let mainKeys = ['seasonId', 'queueId', 'gameId', 'participantIdentities', 'gameVersion', 'platformId', 
                                'gameMode', 'mapId', 'gameType', 'teams', 'participants', 'gameDuration', 'gameCreation'];
                
                let participantIdentitiesKeys = ['player', 'participantId'];
                
                let playerKeys = ['currentPlatformId', 'summonerName', 'matchHistoryUri', 'platformId', 
                                    'currentAccountId', 'profileIcon', 'summonerId', 'accountId'];

                riotAPI.getMatchData(matchID, function(error, data) {
                    
                    if(error) {
                        expect(checkValidError(error)).to.be.true;
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                        expect(data.participantIdentities[0]).to.include.all.keys(participantIdentitiesKeys);
                        expect(data.participantIdentities[0].player).to.include.all.keys(playerKeys);
                    }
                    done();
                });
            });   
        });
        
        describe('currentGameInfo', function() {
            it('returned data object has correct keys, or throws valid error', function(done) {
                
                let summonerID = 19199530;
                let mainKeys = ['gameId', 'gameStartTime', 'platformId', 'gameMode', 'mapId', 
                                'gameType', 'gameQueueConfigId', 'observers', 'participants'];

                riotAPI.getCurrentGameBySummID(summonerID, function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                    }
                    done();
                });
            });   
        });
        
        describe('getProfileIcons', function() {
            it('returned data object has correct keys, or throws valid error', function(done) {
               
                let mainKeys = ['data', 'version', 'type'];

                riotAPI.getProfileIcons(function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                    }
                    done();
                });
            });   
        });

        describe('getChampionInfo', function() {
            it('returned data object has correct keys, or throws valid error', function(done) {
               
                let mainKeys = ['type', 'version', 'data'];

                riotAPI.getChampionInfo(function(error, data) {
                    if(error) {
                        expect(checkValidError(error)).to.be.true
                        expect(data).to.be.null;
                    } else {
                        expect(error).to.be.null;
                        expect(data).to.include.all.keys(mainKeys);
                    }
                    done();
                });
            });   
        });
    });
});
