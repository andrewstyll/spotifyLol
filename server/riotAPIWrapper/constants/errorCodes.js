ERROR_CODES = {
    200: 'Success :D',
    400: 'Bad Request => Syntax error in request',
    401: 'Unauthorized',
    403: 'Forbidden => There is likely and issue with the API key',
    404: 'Data Not Found => The requested data does not exist',
    405: 'Method Not Allowed',
    415: 'Unsupported Media Type => The request body is in an unspported format',
    429: 'Rate limit exceeded => The rate limit of the API key in use has been exceeded. WARNING: this may cause the API key to be blacklisted',
    500: 'Internal Server Error => There is an error with the host server',
    502: 'Bad gateway',
    503: 'Service unavailable => The server is currently unavailable to handle requests, please attempt your request again',
    504: 'Gateway timeout'
}

module.exports = ERROR_CODES;
