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
            responseBody = googleHome.processResponse(body)
            break;
        case 'FACEBOOK':
            //processFacebookResponse();
            break;
        default:
            responseBody = processResponse(body)
            break;
    }
    responseBody['context-out'] = responseBody.contextOut;
    return responseBody;
};

function processResponse(body) {
   return  googleHome.processResponse(body)
}

module.exports = new Allstate();