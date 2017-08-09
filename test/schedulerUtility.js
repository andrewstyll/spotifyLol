const db = require('../db/db');
const schedulerUtils = require('../app/server/scheduler/schedulerUtility');

const expect = require('chai').expect;

describe('schedulerUtility tests', function() {
    describe('getTodaysDate call', function() {
        it('should produce the correctly formatted date of today (dd/mm/yyy)', function() {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth()+1;
            let year = date.getFullYear();
            
            let todaysDate = schedulerUtils.getTodaysDate(); 
            
            expect(todaysDate).to.equal(day + '/' + month + '/' + year);
        }); 
    });

    let date = schedulerUtils.getTodaysDate();

    let newSummoner = {
        "profileIconId": 1265,
        "name": "Alzadar",
        "summonerLevel": 30,
        "accountId": 38639641,
        "id": 24332057,
        "revisionDate": 1502076168000
    };
    
    let anothaNewSummoner = {
        "profileIconId": 516,
        "name": "ThoseCrazyGuys",
        "summonerLevel": 30,
        "accountId": 35454047,
        "id": 21888077,
        "revisionDate": 1501969357000
    };

    let baitSummoner = {
        "profileIconId": 1101,
        "name": "rastamonke",
        "summonerLevel": 30,
        "accountId": 35488264,
        "id": 21913759,
        "revisionDate": 1495784037000
    };

    // will probably need to create test cases for partial database entries or something like that...
    describe('createSummoner call', function() {
        
        it('should produce a summoner object based on the summoner schema', function() {
        
            let createdSummoner = schedulerUtils.createSummoner(newSummoner, date);
            
            expect(createdSummoner.profileIconId).to.equal(newSummoner.profileIconId);
            expect(createdSummoner.name).to.equal(newSummoner.name);
            expect(createdSummoner.accountId).to.equal(newSummoner.accountId);
            expect(createdSummoner.id).to.equal(newSummoner.id);
            expect(createdSummoner.revisionDate).to.equal(newSummoner.revisionDate);
            expect(createdSummoner.updateScheduled).to.equal(date);
        }); 
    });

    describe('summoner DB operations call', function() {
        it('callBack should return true for calls to store summoner value in DB', function (done) {
            let createdSummoner = schedulerUtils.createSummoner(newSummoner, date);
            schedulerUtils.saveSummoner(createdSummoner, function(error) {
                
                expect(error).to.be.null;
                done();
            });

        }); 
        
        it('getTodaysSummoners should return an array of summoner objects that have revisionDate field set to today', function(done) {
            let newDate = new Date();
            let day = newDate.getDate();
            let month = newDate.getMonth()+2;
            let year = newDate.getFullYear();
            
            let createdSummoner = schedulerUtils.createSummoner(baitSummoner, day + '/' + month + '/' + year);
            let anothaSummoner = schedulerUtils.createSummoner(baitSummoner, date);
        
            schedulerUtils.saveSummoner(createdSummoner, function(error) {
                expect(error).to.be.null;
                
                schedulerUtils.saveSummoner(anothaSummoner, function(error) { 
                    schedulerUtils.getTodaysSummoners(function(error, summoners) {
                        
                        expect(error).to.be.null;
                        expect(summoners).to.have.lengthOf(2);
                        expect(summoners[0]).to.have.property('accountId', 38639641);
                        expect(summoners[1]).to.have.property('accountId', 35488264);
                        done();
                    });
                });
            });
            
        });

        it('remove summoners should remove summoners with given conditions', function(done) {
            schedulerUtils.removeSummoner({updateScheduled: date}, function(error) {
               expect(error).to.be.null;
               done();
            });
        });
        
        it('remove summoners should remove all summoners due to empty conditions', function(done) {
            schedulerUtils.removeSummoner({}, function(error) {
               expect(error).to.be.null;
               done();
            });
        });
    });
});
