var Mailgun = require('mailgun').Mailgun;
var q = require('q');


var Utilities = function () {

};
Utilities.prototype.GetRandomValue = function (inputArray) {
    var rand = inputArray[Math.floor(Math.random() * inputArray.length)];
    return rand;
};

Utilities.prototype.sendEmail = function (to, subject, body) {
    var deferred = q.defer();
    var mgApiInstance = new Mailgun('key-eceeb1d9fe3c2821e4668ae4b9fbf475');
    var data = {
        "from": "npavangouda@gmail.com",
        "to": [to],
        "subject": subject,
        "text": body
    };

    mgApiInstance.sendText(data.from, data.to, data.subject, data.text, function (err) {
        var success = true;
        if(err){
            success = false;
        }
        deferred.resolve(success);
    })

    return deferred.promise;
}




module.exports = new Utilities();