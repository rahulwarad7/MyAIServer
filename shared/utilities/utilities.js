
var SendGridHelper = require('sendgrid').mail;
var q = require('q');


var Utilities = function () {

};
Utilities.prototype.GetRandomValue = function (inputArray) {
    var rand = inputArray[Math.floor(Math.random() * inputArray.length)];
    return rand;
};

Utilities.prototype.sendEmail = function (to, subject, body, type) {
    var deferred = q.defer();
    var data = {
        "from": "npavangouda@gmail.com",
        "to": to,
        "subject": subject,
        "text": body
    };

    var from_email = new SendGridHelper.Email(data.from);
    var to_email = new SendGridHelper.Email(data.to);
    var subject = data.subject;
    var content = new SendGridHelper.Content("text/plain", data.text);
    var mail = new SendGridHelper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    sg.API(request, function (error, response) {
        deferred.resolve(error ? false : true);
    });

    return deferred.promise;
}




module.exports = new Utilities();