var googleHome = require('./../home/googleHome.js');
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
    switch (source.toUpperCase()) {
        case 'GOOGLE':
            googleHome.processResponse(body)
                .then(function (respData) {
                    responseBody.data = respData;
                    deferred.resolve(responseBody);
                }).catch(function(error){
                    responseBody.status = 1;
                    deferred.reject(responseBody);
                });
            break;
        case 'FACEBOOK':
            //processFacebookResponse();
            break;
        default:
            googleHome.processResponse(body)
                .then(function (respData) {
                    responseBody.data = respData;
                    deferred.resolve(responseBody);
                }).catch(function(error){
                    responseBody.status = 1;
                    deferred.reject(responseBody);
                });
            break;
    }
    return deferred.promise;
};



module.exports = new Allstate();