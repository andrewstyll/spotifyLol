const chai = require('chai');
const expect = chai.expect;

const riotAPI = require('./../server/riotAPIWrapper/riotAPI');
const apiUtils = require('./../server/riotAPIWrapper/apiUtility');
const OPTIONS = require('./../server/riotAPIWrapper/constants/requestOptions');

describe('riotAPI wrapper tests', function() {

    describe('summonerName call', function() {
        it('returned data object has correct keys, throws no error', function() {
            
            let keys = ['profileIconId', 'name', 'summonerLevel', 'revisionDate', 'id', 'accountId'];
            let summoner = 'rastamonke';
            riotAPI.getSummonerInfoByName(summoner, function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(keys);
                expect(data.name).to.equal(summoner);
            });
        });   
    });   

    describe('getMatchHistory call', function() {
        it('accepts only valid request options into URL builder', function() {
            
            let region = 'testRegion';
            let apiRequest = '/testRequest';
            let validValue = OPTIONS.queue.RANKED_FLEX_SR;
            let invalidValue = OPTIONS.queue.TEAM_BUILDER_RANKED_SOLO;
            
            let options = {banana: 123, season: 'alphabet', queue: 'RANKED_FLEX_SR', grape: 'TEAM_BUILDER_RANKED_SOLO'}
            let url = apiUtils.makeURL(region, apiRequest, options);
            
            expect(url).to.not.have.string('banana');
            expect(url).to.not.have.string('season');
            expect(url).to.have.string('queue');
            expect(url).to.have.string(validValue);
            expect(url).to.not.have.string(invalidValue);
        });
        
        it('returned data object has correct keys, throws no error', function() {
           
            let playerID = 38639641;
            let mainKeys = ['matches', 'totalGames', 'startIndex', 'endIndex'];
            let matchRefKeys = ['lane', 'gameId', 'champion', 'platformId', 'season', 'queue', 'role', 'timestamp'];
            let options = {queue: 420};
            let maxNumRecent = 20;

            riotAPI.getMatchHistory(playerID, false, options, function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(mainKeys);
                expect(data.matches).to.have.all.keys(matchRefKeys);
            });
            
            riotAPI.getMatchHistory(playerID, true, options, function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(mainKeys);
                expect(data.matches).to.have.all.keys(matchRefKeys);
                expect(data).to.have.property(mainKeys[1], 20);
                expect(data).to.have.all.keys(mainKeys[3], 20);
            });
        });   
    });
    
    describe('getMatchData call', function() {
        it('returned data object has correct keys, throws no error', function() {
           
            let matchID = 2538566376;
            let mainKeys = ['seasonId', 'queueId', 'gameId', 'participantIdentities', 'gameVersion', 'platformId', 
                            'gameMode', 'mapId', 'gameType', 'teams', 'participants', 'gameDuration', 'gameCreation'];
            let participantIdentitiesKeys = ['player', 'participantId'];
            let playerKeys = ['currentPlatformId', 'summonerName', 'matchHistoryUri', 'platformId', 
                                'currentAccountId', 'profileIcon', 'summonerId', 'accountId'];

            riotAPI.getMatchData(matchID, function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(mainKeys);
                expect(data.participantIdentities).to.have.all.keys(participantIdentitiesKeys);
                expect(data.participantIdentities.player).to.have.all.keys(playerKeys);
            });
        });   
    });
    
    describe('getProfileIcons', function() {
        it('returned data object has correct keys, throws no error', function() {
           
            let mainKeys = ['data', 'version', 'type'];

            riotAPI.getProfileIcons(function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(mainKeys);
            });
        });   
    });

    describe('getChampionInfo', function() {
        it('returned data object has correct keys, throws no error', function() {
           
            let mainKeys = ['keys', 'data', 'version', 'type', 'format'];

            riotAPI.getChampionInfo(function(error, data) {
                expect(error).to.be.null;
                expect(data).to.have.all.keys(mainKeys);
            });
        });   
    });
});
