var googleHome = require('./../home/googleHome.js');
var facebookMsg = require('./../../facebook/facebook.js');
var apiAiIntentHandler = require('./api-ai-intentHandler.js');
var q = require('q');


var Response = function () {
    this.speech;
    this.displayText;
    this.data = {};
    this.contextOut = [];
}



var Allstate = function () { };

Allstate.prototype.execute = function (body) {
    var deferred = q.defer();
    var source = '';
    var responseBody = new Response();
    if (body.originalRequest && body.originalRequest.source) {
        source = body.originalRequest.source;
    }
    //by default let api-ai generate the basic response.
    apiAiIntentHandler.processResponse(body)
        .then(function (respData) {
            //once the basic response is generated then, do device specific processing.
            switch (source.toUpperCase()) {
                case 'GOOGLE':
                    break;
                case 'FACEBOOK':
                    respData.data = facebookMsg.processResponse(body, respData);
                    break;
                default:
                    break;
            }
            responseBody.data = respData;
            deferred.resolve(responseBody);
        }).catch(function (error) {
            responseBody.status = 1;
            deferred.reject(responseBody);
        });
    return deferred.promise;
};



module.exports = new Allstate();