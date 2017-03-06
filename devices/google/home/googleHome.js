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
        case "TDDIALOGTIDEINTENT":
            responseBody = dialogTideIntent(body);
            break;
        case "TDDIALOG-CITY":
            responseBody = handleTDCityIntent(body);
            break;
        case "TDDIALOG-DATE":
            responseBody = handleTDDateIntent(body);
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

function handleTDCityIntent(body) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);
    
    if (sessionAttrs.city) {
        var poolerCitySpeechResponse = TidePooler.handleCityDialogRequest(sessionAttrs.city, sessionAttrs);
        dialogTideSpeechResponse.speech = poolerCitySpeechResponse.speechOutput.text;
        dialogTideSpeechResponse.displayText = poolerCitySpeechResponse.speechOutput.text;
    }
    
    return dialogTideSpeechResponse;
}

function handleTDDateIntent(body) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);
    
    if (sessionAttrs.date) {
        var poolerCitySpeechResponse = TidePooler.handleDateDialogRequest(sessionAttrs.date, sessionAttrs);
        dialogTideSpeechResponse.speech = poolerCitySpeechResponse.speechOutput.text;
        dialogTideSpeechResponse.displayText = poolerCitySpeechResponse.speechOutput.text;
    }


    return dialogTideSpeechResponse;
}

function getTDSessionAttributes(contextInfo) {
    var sessionAttrs = { "city": undefined, "date": undefined };
    
    if (contextInfo) {
        var cityOrg = contextInfo.parameters['geo-city.original'];
        var dateOrg = contextInfo.parameters['date.original'];
        if (cityOrg && cityOrg.length > 0) {
            sessionAttrs.city = contextInfo.parameters['geo-city'];
        }
        if (dateOrg && dateOrg.length > 0) {
            sessionAttrs.date = contextInfo.parameters.date;
        }
    }

    return sessionAttrs;
}


function dialogTideIntent(body) {
    var dialogTideSpeechResponse;
    var result = body.result;
    var city = result.parameters['geo-city'];
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

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var responseInfo;


    return responseInfo;
}



module.exports = new GoogleHome();


