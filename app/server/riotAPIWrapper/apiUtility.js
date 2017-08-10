const request = require('request');
const CONST = require('./constants/requestConstants');
const OPTIONS = require('./constants/requestOptions');
const ERROR_CODES = require('./constants/errorCodes');
const RateLimiter = require('./rateLimiter');

const HTTPS = CONST.HTTPS_HEAD;
const HOST = CONST.HOST; //string
const KEY = CONST.API_POSTFIX; //string containing API key

apiUtils = {};

// rate limit variables that will be initialised by apiUtils.initRateLimiters()
let rateLimiterSlow;
let rateLimiterFast;

/* makes a http request at given URL
 * @param {Integer} priority: priority rating for the request
 * @param {string} url: url of request
 * @param {function} callBack: function to be executed on return of data
 * @return {Object}: returns object containing either an error status code OR the requested info
 */
apiUtils.makeRequest = function(priority, url, callBack){
    
    apiUtils.schedule(priority, function() {
        request(url, function(error, response, body) {
            //console.log('error:', error); // Print the error if one occurred 
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
           
            let statusCode = response.statusCode;

            if(statusCode != 200) {
                if(ERROR_CODES.hasOwnProperty(statusCode)) {
                    callBack({errorResponse: statusCode, message: ERROR_CODES[statusCode]}, null);
                } else {
                    callBack({errorResponse: statusCode, message: 'ERROR'}, null);
                }
            } else {
                callBack(null, JSON.parse(body));
            }
        });
    });
}

/* makes a URL based on given parameters, returns url as string
 * @param {string} region: region where data will come from
 * @param {string} apiRequest: api request, contains optiions
 * @param {Object} options: contains a list of all options to be included in the API request
 * @return {string}: returns string containing URL
 */
apiUtils.makeURL = function(region, apiRequest, optionsObj) {
    
    let options = '?';

    if(optionsObj != null) {
        for(var key in optionsObj) {
            
            let value = optionsObj[key];
            if(optionsObj.hasOwnProperty(key) && OPTIONS.hasOwnProperty(key) && OPTIONS[key].hasOwnProperty(value)) {    
                options += key.toString() + '=' + OPTIONS[key][value] + '&';
            }
        }
    }

    let url = HTTPS + region + HOST + apiRequest + options + KEY;

    return url;
}

/* schedules the reqWrapper to be called as tokens become available to the rateLimiters
 * @param {Integer} priority: priority rating for the requestWrapper
 * @param {function} reqWrapper: function wrapping the request function. Will be executed by the rateLimiters
 */
apiUtils.schedule = function(priority, reqWrapper) {
    // TODO:: need to create feedback for my API scraping scheduler so it knows when to slow down requests, right now it
    // could make requests forever, filling up the rateLimiter queues to infinity
    rateLimiterFast.scheduleRequest(priority, function () {
        rateLimiterSlow.scheduleRequest(priority, reqWrapper);
    });
}

/* initialises rate limiter objects with limits pulled from environment variables. Will have to look into allocating
 * portions of the rate limitations to account for client invoked api calls.
 */
apiUtils.initRateLimiters = function() {
    // grab environment variables, intervals are in seconds so convert to milliseconds

    // TODO:: when initialising rate limiter, make a test call to determine actual limit from response header.
    // Initialising and reinitialising tests with same keyu resets internal rate limit but not actual key limit
    let ratePerIntervalSlow = process.env.PROD_SLOW_REQ || process.env.DEV_SLOW_REQ;
    let intervalSlow = (process.env.PROD_SLOW_INTERVAL || process.env.DEV_SLOW_INTERVAL)*1000;
   
    let ratePerIntervalFast = process.env.PROD_FAST_REQ || process.env.DEV_FAST_REQ;
    let intervalFast = (process.env.PROD_FAST_INTERVAL || process.env.DEV_FAST_INTERVAL)*1000;
    
    rateLimiterSlow = new RateLimiter(ratePerIntervalSlow, intervalSlow);
    rateLimiterFast = new RateLimiter(ratePerIntervalFast, intervalFast);
}

module.exports = apiUtils;
