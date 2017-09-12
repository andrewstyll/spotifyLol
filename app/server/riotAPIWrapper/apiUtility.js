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

/* wraps a request in a function for quick execution while maintaining scope
 * @param {Integer} priority: priority rating for the request
 * @param {String} url: url of request
 * @param {Function} callBack: function to be executed on return of data
 * @return {Function}: returns a function wrapping a request
 */
apiUtils.wrapRequest = function(priority, url, callBack) {
    return function() {  
        request(url, function(error, response, body) {
            //console.log('error:', error); // Print the error if one occurred 
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
           
            let statusCode = response.statusCode;
            console.log(response.headers['x-app-rate-limit-count']);
            if(statusCode != 200) {
                if(ERROR_CODES.hasOwnProperty(statusCode)) {
                    callBack({errorResponse: statusCode, message: ERROR_CODES[statusCode]}, response, null);
                } else {
                    callBack({errorResponse: statusCode, message: 'ERROR'}, response, null);
                }
            } else {
                callBack(null, response, JSON.parse(body));
            }
        });
    }
}

/* makes or schedules a http request at given URL
 * @param {Integer} priority: priority rating for the request
 * @param {String} url: url of request
 * @param {Function} callBack: function to be executed on return of data
 * @return {Object}: returns object containing either an error status code OR the requested info
 */
apiUtils.makeRequest = function(priority, url, callBack){

    requestWrap = apiUtils.wrapRequest(priority, url, callBack);

    if(priority == CONST.REQ_PRIORITY.CONFIG_REQ) { 
        requestWrap();
    } else {
        apiUtils.schedule(priority, requestWrap);
    }
}

/* this checks if the key and value are valid. If they are, they will be appended to the array
 * @params {String} key: key we will be checking from the obj object
 * @params {String/Integer} value we will be checking from the obj object against predetermined constants
 * @param {Object} options: contains a list of all options to be included in the API request
 * @return {String}: returns a string that will be appeneded to the URL string
 */
apiUtils.checkOption = function(key, value, obj) {
    if(obj.hasOwnProperty(key) && OPTIONS.hasOwnProperty(key) && OPTIONS[key].hasOwnProperty(value)) {    
        return key.toString() + '=' + OPTIONS[key][value] + '&';
    } else {
        return "";
    }
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
            // if the value is an array, 
            if(Object.prototype.toString.call( value ) === '[object Array]') {
                for(let i = 0; i < value.length; i++) {
                    options += apiUtils.checkOption(key, value[i], optionsObj);
                }
            } else {
                options += apiUtils.checkOption(key, value, optionsObj);
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
    /*rateLimiterFast.scheduleRequest(priority, function () {
        rateLimiterSlow.scheduleRequest(priority, reqWrapper);
    });*/

    rateLimiterFast.scheduleRequest(priority, reqWrapper);
}

/* initialises rate limiter objects with limits pulled from environment variables. Will have to look into allocating
 * portions of the rate limitations to account for client invoked api calls.
 * @params {Integer} slowDropDeduction: the amount of drops to be removed from the slow interval as they have already
 * occurred
 * @params {Integer} fastDropDeduction: the amount of drops to be removed from the fast interval as they have already
 * occurred
 */
apiUtils.initRateLimiters = function(slowDropDeduction = 0, fastDropDeduction = 0) {
    // grab environment variables, intervals are in seconds so convert to milliseconds
    //
    // fast has size 20, interval 1000
    let ratePerIntervalSlow = process.env.PROD_SLOW_REQ || process.env.DEV_SLOW_REQ;
    let intervalSlow = (process.env.PROD_SLOW_INTERVAL || process.env.DEV_SLOW_INTERVAL)*1000;
    let slowDropStart = ratePerIntervalSlow - slowDropDeduction;

    let ratePerIntervalFast = process.env.PROD_FAST_REQ || process.env.DEV_FAST_REQ;
    let intervalFast = (process.env.PROD_FAST_INTERVAL || process.env.DEV_FAST_INTERVAL)*1000;
    let fastDropStart = ratePerIntervalFast - fastDropDeduction;

    rateLimiterSlow = new RateLimiter(slowDropStart, ratePerIntervalSlow, intervalSlow);
    rateLimiterFast = new RateLimiter(fastDropStart, ratePerIntervalFast, intervalFast);
}

module.exports = apiUtils;
