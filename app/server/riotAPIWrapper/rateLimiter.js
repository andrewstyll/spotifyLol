const TokenBucket = require('./tokenBucket');
const PriorityQueue = require('../../../utils/priorityQueue');

/* Constructor for RateLimiter object
 * @param {Integer} ratePerInterval: number of calls to be made across each interval
 * @param {Integer} interval: length of interval that rate applies to in milliseconds
 */
const RateLimiter = function(ratePerInterval, interval) {
    // init bucket and bucket queue
    this.bucket = new TokenBucket(ratePerInterval, interval);
    this.reqQueue = new PriorityQueue();
    this.requestLimit = this.bucket.rateLimit
}

/* request scheduler for the rate limiter. Will check tokenBucket to see if request can be executed. If not, will
 * setTimeout and will be invoked later
 * @param {Integer} priority: priority rating for the request
 * @param {CallBack} req: request that will be invoked of there are enough drops in the bucket
 */
RateLimiter.prototype.scheduleRequest = function(priority, req) {
    
    let that = this;

    // if there's a request, I want to push it onto the queue. This way I'm only going to deal with the queue below.
    if(req) {
        this.reqQueue.enqueue(priority, req);
    } else {
        if(this.reqQueue.getSize() !== 0) { // if a request exists for me to execute
            if(this.bucket.getDropCount() > 0) { // if I have drops to make requests with
                if(this.bucket.removeDrop()) { // remove a drop from the bucket
                     
                    let fn = this.reqQueue.dequeue();
                    fn();
                }              
            }
        }
    }

    if(this.reqQueue.getSize() !== 0) {
        setTimeout(function() {
            that.scheduleRequest(null, null); 
        }, 1/this.requestLimit);
    }
}

/* performs exponential backoff algorithm, halving request rate every time it is called
 */
RateLimiter.prototype.rateBackoff = function() {
    this.bucket.dripRateBackoff(); 
    this.requestLimit = this.bucket.rateLimit;
}

module.exports = RateLimiter;
