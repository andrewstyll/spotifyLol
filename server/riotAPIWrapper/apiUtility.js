const request = require('request');
const CONST = require('./constants/requestConstants');
const ERROR_CODES = require('./constants/errorCodes');

const HTTPS = CONST.HTTPS_HEAD;
const HOST = CONST.HOST; //string
const KEY = CONST.API_POSTFIX; //string containing API key

utils = {};

/* makes a http request at given URL
 * @param {string} url: url of request
 * @return {Object}: returns object containing either an error status code OR the requested info
 */
utils.makeRequest = function(url, callBack){
    
    console.log(url);
    request(url, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred 
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
       
        let statusCode = response.statusCode;

        if(statusCode != 200) {
            console.log('HI');
            if(ERROR_CODES.hasOwnProperty(statusCode)) {
                callBack({errorResponse: statusCode, message: ERROR_CODES[statusCode]}, null);
            } else {
                console.log('UNKNOWN ERROR');
                callBack({errorResponse: statusCode, message: 'ERROR'}, null);
            }
        } else { 
            console.log('WORKING');
            callBack(null, JSON.parse(body));
        }
    });
}

/* makes a URL based on given parameters, returns url as string
 * @param {string} region: region where data will come from
 * @param {string} apiRequest: api request, contains optiions
 * @return {string}: returns string containing URL
 */
utils.makeURL = function(region, apiRequest) {
     
    let url = HTTPS + region + HOST + apiRequest + KEY;

    return url;
}



module.exports = utils;
