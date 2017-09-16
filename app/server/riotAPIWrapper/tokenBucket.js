/* constructor for the token bucket object
 * @param {Integer} ratePerInterval: number of calls to be made across each interval
 * @param {Integer} interval: length of interval that rate applies to in milliseconds
 */
const TokenBucket = function (ratePerInterval, interval) {
    // ratePerInterval = req/interval, interval = milliseconds
    
    this.bucketSize = ratePerInterval; // the maximum number of tokens I want to allow in my bucket at once
    this.rateLimit = ratePerInterval/interval; 
    this.interval = interval; // will be 1 second and 2 minutes for the devKey rates
    this.dropCount = 0;//startingDrops; // number of tokens (or drops) currently in the bucket

    // This is in milliseconds
    this.lastDrip = new Date().getTime();

    this.drip(); 
}

/* called every 1/ratelimit to allow a steady stream of drops into the tokenBucket. Tokens are added according to the
 * rates defined in the constructor
 */
TokenBucket.prototype.drip = function () {
    
    let that = this;

    //check how much time has passed since the last drip in milliseconds
    let currentTime = new Date().getTime();
    let deltaTime = currentTime-this.lastDrip;//, 1/this.rateLimit;
    
    // how many tokens should I add based on how much time has passed (remember, this can't be called exactly at perfect
    // intervals, so I'll need to account for this being called late)
    let tokensToAdd = Math.floor(deltaTime * this.rateLimit);
    if(tokensToAdd > 0) {
        this.lastDrip = currentTime;
        this.dropCount = Math.min(tokensToAdd + this.dropCount, this.bucketSize);
    }
     
    setTimeout(function() {
        that.drip();   
    }, 1/this.rateLimit);
}

/* called to remove a drop from the token bucket.
 * @return {Boolean}: if can remove drop return true, else return false
 */
TokenBucket.prototype.removeDrop = function() {

    // if we have drops to give in the bucket
    if(this.dropCount > 0) {
        this.dropCount--;
        return true;
    } else {
        return false;
    }
}

/* checks the number of drops in the tokenBucket
 * @return {Integer}: returns the dropCount of the tokenBucket
 */
TokenBucket.prototype.getDropCount = function() {
    return this.dropCount;
}

/* performs exponential backoff algorithm, halving drip rate every time it is called
 */
TokenBucket.prototype.dripRateBackoff = function() {
    this.rateLimit = this.rateLimit/2;   
}

module.exports = TokenBucket;
