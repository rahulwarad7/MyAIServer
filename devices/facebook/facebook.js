
var q = require('q');

var FacebookMsg = function () { };

FacebookMsg.prototype.processResponse = function (body) {
    var deferred = q.defer();
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        /*intentHandlers(body)
                    .then(function (responseInfo) {
                        deferred.resolve(responseInfo);
                    });*/
    }
    return deferred.promise;
}



module.exports = new FacebookMsg();