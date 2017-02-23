

var GoogleHome = function () { };

GoogleHome.prototype.processResponse = function (body, responseBody) {
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        intentHandlers(body, responseBody);
    }
}

function intentHandlers(body, responseBody) {
    var intentName = body.result.metadata.intentName;
    switch (intentName.toUpperCase()) {
        case "WEATHERFORECAST":
            var message = "Today in Boston: Fair, the temperature is 37 F";
            responseBody.speech = message;
            responseBody.displayText = message;
            break;
        case "HELPINTENT":
        default:
            var message = "You can say hello to me!";
            responseBody.speech = message;
            responseBody.displayText = message;
            break;
    }
};


module.exports = new GoogleHome();


