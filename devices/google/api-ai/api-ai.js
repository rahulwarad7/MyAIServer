var googleHome = require('./../home/googleHome.js');


var Response = function () {
    this.speech;
    this.displayText;
    this.data = {};
    this.contextOut = [];
}



var Allstate = function () { };

Allstate.prototype.execute = function (body) {
    var source = '';
    var responseBody = new Response();
    if (body.originalRequest && body.originalRequest.source) {
        source = body.originalRequest.source;
    }
    switch (source.toUpperCase()) {
        case 'GOOGLE':
            googleHome.processResponse(body, responseBody)
            break;
        case 'FACEBOOK':
            //processFacebookResponse();
            break;
        default:
            processResponse(body, responseBody)
            break;
    }
    responseBody['context-out'] = responseBody.contextOut;
    return responseBody;
};

function processResponse(body, responseBody) {
    googleHome.processResponse(body, responseBody)
}

module.exports = new Allstate();