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
// i don't want these to be touchable by anything else
let rateLimiterSlow;
let rateLimiterFast;

let backoffInterval = 5000;
let lastBackoff = new Date();

let apiDown = false;
let apiDownInterval = 600000;
let lastApiDown = new Date();

/* exponentially reduces the request and bucket drip rate of the rate limiters. Only occurs at most once every 5 seconds 
 * @return {String}: returns a string describing the outcome of the function call
 */
apiUtils.initiateBackoff = function() {
 
    let currentDate = new Date();
    if(currentDate - lastBackoff > backoffInterval) {
        rateLimiterFast.rateBackoff();
        rateLimiterSlow.rateBackoff();
        lastBackoff = currentDate;
        return 'ratelimiting backoff completed';
    } else {
        return 'not long enough interval since last backoff';
    }
}

/* attempts to set the "server is down flag, should only occur when a 500 or greater error message is returned"
 * @return {String}: returns a string describing the outcome of the function call
 */
apiUtils.setApiDownFlag = function() {
    let currentDate = new Date();
    // if api is not down OR it has been a long time since the API flag was set (used to extend a long period of
    // API down time)
    if(!apiDown || currentDate - lastApiDown > apiDownInterval) {
        apiDown = true;
        lastApiDown = currentDate;
        
        // turn this off after the interval so we can check again
        setTimeout(function() {
            apiDown = false; 
        }, apiDownInterval);
        
        return 'API Is Down';
    } else {
        return 'not long enough interval since API went down';
    }
}

/* updates the request priority of an older request call based on the type of request
 * @params {Integer} priority: the priority of the previous request
 * @return {Integer}: the priority of the new request
 */
apiUtils.updatePriority = function(priority) {
    if(priority === CONST.REQ_PRIORITY.USER_REQ) {
        return CONST.REQ_PRIORITY.USER_REQ_RETRANS;
    } else if (priority === CONST.REQ_PRIORITY.BCKGRND) {
        return CONST.REQ_PRIORITY.BCKGRND_RETRANS;
    } else {
        return priority;
    }
}

/* makes a request after a delay, for use when API is too busy/is down
 * @params {Integer} priority: priority of the request to be made
 * @params {String} url: url of the request to be made
 * @params {Function} callBack: callback function to be invoked upon completion of the request
 * @params {Integer} delay: delay to wait until making the request again
 */
apiUtils.makeDelayedRequest = function(priority, url, callBack, delay) {
    setTimeout(function() {
        apiUtils.makeRequest(priority, url, callBack);               
    }, delay);
}


/* takes action based on the return codes recieved from the API
 * @param {Error} error: error that will be thrown if async call is unsuccessful
 * @param {Response} response: HTTP response header object
 * @param {Object} body: object containing http message body
 * @param {Integer} priority: priority rating for the request
 * @param {String} url: url of request
 * @param {Function} callBack: function to be executed on return of data
 */
apiUtils.handleResponse = function(error, response, body, priority, url, callBack) {
    
    let statusCode = response.statusCode;
    // if bad response
    if(statusCode != 200) {
        if(ERROR_CODES.hasOwnProperty(statusCode)) {
            newpriority = updatePriority(priority);
            let errorMsgExtension = '';
            if(statusCode === 429) { // retransmit and slow down the rate
                errorMsgExtension = apiUtils.initiateBackoff();
                apiUtils.makeDelayedRequest(newPriority, url, callBack, CONST.REQ_RETRANS[429]);
            } else if(statusCode >= 500) {
                errorMsgExtension = apiUtils.setApiDownFlag();
                apiUtils.makeDelayedRequest(newPriority, url, callBack, CONST.REQ_RETRANS[500]);
            }
            callBack({errorResponse: statusCode, message: ERROR_CODES[statusCode] + ' Request: ' + url + ' ' + errorMsgExtension}, response, null);
        } else {
            callBack({errorResponse: statusCode, message: 'ERROR Request: ' + url}, response, null);
        }
    } else {
        // if i get a 200, the API must not be down. This is based on the assumption that I have sent some request after
        // determining that the API is down and is here to catch cases where the API recovers earlier than expected
        apiDown = false;       
        callBack(null, response, JSON.parse(body));
    }
}

/* wraps a request in a function for quick execution while maintaining scope
 * @param {Integer} priority: priority rating for the request
 * @param {String} url: url of request
 * @param {Function} callBack: function to be executed on return of data
 * @return {Function}: returns a function wrapping a request
 */
apiUtils.wrapRequest = function(priority, url, callBack) {
    return function() {  
        request(url, function(error, response, body) {
             
            //console.log(response.headers['x-app-rate-limit-count']);
            apiUtils.handleResponse(error, response, body, priority, url, callBack);
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

    if(priority === CONST.REQ_PRIORITY.CONFIG_REQ) { 
        requestWrap();
    } else {
        apiUtils.schedule(priority, requestWrap);
    }
}

/* this checks if the key and value are valid. If they are, they will be appended to the array
 * @params {String} key: key we will be checking from the obj object
 * @params {String/Integer} value we will be checking from the obj object against predetermined constants
 * @param {Object} options: contains a list of all options to be included in the API request
 * @return {String}: returns a string that will be appended to the URL string
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
    rateLimiterFast.scheduleRequest(priority, function () {
        rateLimiterSlow.scheduleRequest(priority, reqWrapper);
    });
}

/* initialises rate limiter objects with limits pulled from environment variables. Will have to look into allocating
 * portions of the rate limitations to account for client invoked api calls.
 */
apiUtils.initRateLimiters = function() {
    // grab environment variables, intervals are in seconds so convert to milliseconds
    
    let slowRatePercentage = process.env.DEV_SLOW_PERC/100;
    let fastRatePercentage = process.env.DEV_FAST_PERC/100;

    let ratePerIntervalSlow = (process.env.PROD_SLOW_REQ || process.env.DEV_SLOW_REQ)*slowRatePercentage;
    let intervalSlow = (process.env.PROD_SLOW_INTERVAL || process.env.DEV_SLOW_INTERVAL)*1000;

    let ratePerIntervalFast = (process.env.PROD_FAST_REQ || process.env.DEV_FAST_REQ)*fastRatePercentage;
    let intervalFast = (process.env.PROD_FAST_INTERVAL || process.env.DEV_FAST_INTERVAL)*1000;

    rateLimiterSlow = new RateLimiter(ratePerIntervalSlow, intervalSlow);
    rateLimiterFast = new RateLimiter(ratePerIntervalFast, intervalFast);
}

module.exports = apiUtils;
