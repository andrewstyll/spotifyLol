require('dotenv').config();

const TokenBucket = require('./../server/riotAPIWrapper/tokenBucket');
const RateLimiter = require('./../server/riotAPIWrapper/rateLimiter');

const expect = require('chai').expect;

describe('RateLimiter and TokenBucket Test', function() {
    describe('RateLimiter Tests', function() {
        describe('scheduleRequest Test', function() {
        
            it('rate limiter prevents too many requests', function() {
                limTest = new RateLimiter(1, 10*1000); // one request every 10 seconds   
                let count = 0;
                for(let i = 0; i < 3; i++) {
                    limTest.scheduleRequest(function() {
                        count++;    
                    });
                }
                expect(count).to.equal(1);
                expect(limTest.reqQueue.length).to.equal(2);
            });
            
            it('rate limiter executes requests after each interval', function(done) {
                limTest = new RateLimiter(1, 1*1000); // one request every 10 seconds   
                let count = 0;
                for(let i = 0; i < 2; i++) {
                    limTest.scheduleRequest(function() {
                        count++;    
                    });
                }
                expect(count).to.equal(1);
                expect(limTest.reqQueue.length).to.equal(1);

                setTimeout(function() {
                    try {
                        expect(count).to.equal(2);
                        expect(limTest.reqQueue.length).to.equal(0);
                        done(); 
                    } catch(e) {
                        done(e);
                    }
                }, 1.5*1000);
            });
        });
    });

    describe('TokenBucket Tests', function() {
        describe('Drip Test with helper functions', function() {
            
            it('tokenBucket drip adds new drops on every 1/rate', function(done) {
                bucketTest = new TokenBucket(5, 0.5*1000); // every half second add 5 requests
                expect(bucketTest.getDropCount()).to.equal(5);
                bucketTest.removeDrop();
                expect(bucketTest.getDropCount()).to.equal(4);

                setTimeout(function() {
                    try {
                        expect(bucketTest.getDropCount()).to.equal(5);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 0.6*1000);
            });
            
            it('tokenBucket drip doesn\'t add more tokens than it can hold', function(done) {
                bucketTest = new TokenBucket(5, 0.5*1000); // every half second add 5 requests
                expect(bucketTest.getDropCount()).to.equal(5);

                setTimeout(function() {
                    try {
                        expect(bucketTest.getDropCount()).to.equal(5);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 0.6*1000);
            });
        });
    });
});
