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
        case "TDDialogTideIntent":
            intentResponseInfo = dialogTideIntent(body);
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



function dialogTideIntent(body) {
    var dialogTideSpeechResponse;
    var result = body.result;
    var city = result.parameters.geo-city;
    var date = result.parameters.date;
    if (city) {
        var poolerCitySpeechResponse = TidePooler.handleCityDialogRequest(city, {});
        dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
    } else if (date) {
        var poolerDateSpeechResponse = TidePooler.handleDateDialogRequest(date, {});
        dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);

    } else {
        dialogTideSpeechResponse = TidePooler.handleNoSlotDialogRequest(body);
    }
    return dialogTideSpeechResponse;
}


module.exports = new GoogleHome();


