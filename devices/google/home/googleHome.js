var TidePooler = require('./../../../apps/tide-pooler/tide-pooler.js');

var GoogleHome = function () { };

GoogleHome.prototype.processResponse = function (body) {
    var responseInfo;
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        responseInfo = intentHandlers(body);
    }
    return responseInfo;
}

function intentHandlers(body) {
    var intentName = body.result.metadata.intentName;
    var responseBody = {};
    switch (intentName.toUpperCase()) {
        case "WEATHERFORECAST":
            var message = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            responseBody.speech = message;
            responseBody.displayText = message;
            break;
        case "TDSUPPORTEDCITIES":
            var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
            responseBody.speech = poolerSpeechResponse.speechOutput.text;
            responseBody.displayText = poolerSpeechResponse.speechOutput.text;
            break;
        case "HELPINTENT":
        default:
            var message = "You can say hello to me!";
            responseBody.speech = message;
            responseBody.displayText = message;
            break;
    }
    return responseBody;    
};


module.exports = new GoogleHome();


