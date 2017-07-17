const TokenBucket = require('./tokenBucket');

/* Constructor for RateLimiter object
 * @param {Integer} ratePerInterval: number of calls to be made across each interval
 * @param {Integer} interval: length of interval that rate applies to in milliseconds
 */
const RateLimiter = function(ratePerInterval, interval) {
    // init bucket and bucket queue
    this.bucket = new TokenBucket(ratePerInterval, interval);
    this.reqQueue = [];
}

/* request scheduler for the rate limiter. Will check tokenBucket to see if request can be executed. If not, will
 * setTimeout and will be invoked later
 * @param {CallBack} req: request that will be invoked of there are enough drops in the bucket
 */
RateLimiter.prototype.scheduleRequest = function(req) {
    
    let that = this;
    
    // if there's a request, I want to push it onto the queue. This way I'm only going to deal with the queue below.
    if(req) {
        this.reqQueue.push(req);
    }

    if(this.bucket.getDropCount() > 0) { // if I have drops to make requests with
        if(this.reqQueue.length !== 0) { // if a request exists for me to execute
            if(this.bucket.removeDrop()) { // remove a drop from the bucket
                
                let fn = this.reqQueue.shift();
                fn();
            }              
        }
    } else {
        setTimeout(function() {
            that.scheduleRequest(null)   
        }, 1/this.bucket.rateLimit);
    }
}

module.exports = RateLimiter;
