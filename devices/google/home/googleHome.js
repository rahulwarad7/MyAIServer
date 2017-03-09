var TidePooler = require('./../../../apps/tide-pooler/tide-pooler.js');
var aos = require('./../../../apps/aos/aos.js');
var q = require('q');

var GoogleHome = function () { };

GoogleHome.prototype.processResponse = function (body) {
    var deferred = q.defer();
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        intentHandlers(body)
            .then(function (responseInfo) {
                deferred.resolve(responseInfo);
            });
    }
    return deferred.promise;
}

function intentHandlers(body) {
    var deferred = q.defer();
    var intentName = body.result.metadata.intentName;
    var responseBody = {};
    switch (intentName.toUpperCase()) {
        case "AGENT-FIND":
            handleAgentFindIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYZIP":
            handleAgentFindByZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYCURRENTLOC":
            break;
        case "WEATHERFORECAST":
            var message = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
        case "TDSUPPORTEDCITIES":
            var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
            responseBody.speech = poolerSpeechResponse.speechOutput.text;
            responseBody.displayText = poolerSpeechResponse.speechOutput.text;
            deferred.resolve(responseBody);
            break;
        case "TDDIALOGTIDEINTENT":
            dialogTideIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-CITY":
            handleTDCityIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-DATE":
            handleTDDateIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "HELPINTENT":
        default:
            var message = "You can say hello to me!";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
    }
    return deferred.promise;
};


//#region Agent

function handleAgentFindByZip(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    if (sessionAttrs.zip) {
        aos.handleAgentFindByZipIntent(sessionAttrs)
            .then(function (agentFindSpeechResponse) {
                agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
                agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
                deferred.resolve(agentFindSpeechResp);
            });
    }
    return deferred.promise;
}

function handleAgentFindIntent(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    aos.handleAgentFindRequest(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function getAgentSessionAttributes(contextInfo) {
    var sessionAttrs = { "zip": undefined, "agents": [] };
    if (contextInfo) {
        var zip = contextInfo.parameters["zip.original"];
        if (zip && zip.length > 0) {
            sessionAttrs.zip = contextInfo.parameters["zip"];
        }
    }

    return sessionAttrs;
}

//#endregion


//#region Tidepooler
function handleTDCityIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.city) {
        TidePooler.handleCityDialogRequest(sessionAttrs.city, sessionAttrs)
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse.speech = poolerCitySpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerCitySpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }

    return deferred.promise;
}
function handleTDDateIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.date) {
        TidePooler.handleDateDialogRequest(sessionAttrs.date, sessionAttrs)
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse.speech = poolerDateSpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerDateSpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }


    return deferred.promise;
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


function dialogTideIntent(body, deferred) {
    var dialogTideSpeechResponse;
    var result = body.result;
    var city = result.parameters['geo-city'];
    var date = result.parameters.date;
    if (city) {
        TidePooler.handleCityDialogRequest(city, {})
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else if (date) {
        TidePooler.handleDateDialogRequest(date, {})
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });

    } else {
        TidePooler.handleNoSlotDialogRequest(body)
            .then(function (noSlotSpeechResponse) {
                deferred.resolve(noSlotSpeechResponse);
            });
    }
    return deferred.promise;
}

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var responseInfo;


    return responseInfo;
}
//#endregion




module.exports = new GoogleHome();


