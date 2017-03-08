var AlexaSkillUtil = require('./alexaSkillUtil.js');
var TidePooler = require('./../../apps/tide-pooler/tide-pooler.js');
var Response = require('./../../shared/data-models/response.js');
var Speech = require('./../../shared/data-models/speech.js');
var q = require('q');

var Allstate = function () { };


//public function start
Allstate.prototype.execute = function (body) {
    var responseInfo = new Response();
    var deferred = q.defer();
    try {
        checkAppId(body.session.application.applicationId);
        if (!body.session.attributes) {
            body.session.attributes = {};
        }
        if (body.session.new) {
            onSessionStarted(body);
        }

        HandleRequest(body, deferred)
            .then(function (respData) {
                responseInfo.data = respData;
                deferred.resolve(responseInfo);
            })
            .catch(function () {
                logging("Unexpected exception " + error);
                responseInfo.status = 1;
                deferred.reject(responseInfo);
            });

    } catch (error) {
        logging("Unexpected exception " + error);
        responseInfo.status = 1;
        deferred.reject(responseInfo);
    }
    return deferred.promise;
};

//public function end

//private function start
function HandleRequest(body, deferred) {
    var handleRequestRespInfo;
    switch (body.request.type) {
        case 'LaunchRequest':
            HandleLaunchRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
        case 'SessionEndedRequest':
            HandleSessionEndedRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
        case 'IntentRequest':
        default:
            logging('dispatch intent: ' + body.request.intent.name);
            HanldeIntentRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
    }
    return deferred.promise;
}

function HandleLaunchRequest(body, deferred) {
    logging("onLaunch requestId: " + body.request.requestId + ", sessionId: " + body.session.sessionId);
    return handleWelcomeRequest(body, deferred);
}

function handleWelcomeRequest(body, deferred) {
    var speechOutput = new Speech();
    speechOutput.text = "Welcome to Allstate. How can I help?";

    var repromptOutput = new Speech();
    repromptOutput.text = "Hello! Welcome to Allstate. How can I help?" +
        "I can provide information about your Allstate Account or " +
        " provide insurance. " +
        "I can even help you with Road Side Assistance.";
    var welcomeResponseInfo = AlexaSkillUtil.ask(speechOutput, repromptOutput, body.session);
    deferred.resolve(welcomeResponseInfo);
    return deferred.promise;
}

function HandleSessionEndedRequest(body, deferred) {
    logging("onSessionEnded requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
    // any cleanup logic goes here
    deferred.resolve();
    return deferred.promise;
}

function HanldeIntentRequest(body, deferred) {
    var intentResponseInfo;
    var intentName = body.request.intent.name;
    logging("intent start: " + intentName);
    switch (intentName) {
        case "GetWeatherForecast":
            var speechOutput = new Speech();
            speechOutput.text = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            intentResponseInfo = AlexaSkillUtil.tell(speechOutput, body.session);
            deferred.resolve(intentResponseInfo);
            break;
        case "TDSupportedCities":
            intentResponseInfo = supportedCitiesIntent(body);
            deferred.resolve(intentResponseInfo);
            break;
        case "TDDialogTideIntent":
            dialogTideIntent(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                });
            break;
        default:
            logging('no supporting intent implemented. IntentName: ' + intentName);
            throw 'Unsupported intent: ' + intentName;
            break;
    }
    logging("intent start: " + intentName);
    return deferred.promise;
}

function onSessionStarted(body) {
    logging("onSessionStarted requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
}

function logging(data) {
    if (false) {
        console.log(data);
    }
}

function checkAppId(currentReqAppId) {
    var appId = "amzn1.ask.skill.1cf6d2e2-8f52-4e41-b540-d6328404d0a4";
    if (this._appId && currentReqAppId !== appId) {
        logging("The applicationIds don't match : " + currentReqAppId + " and " + appId);
        throw "Invalid applicationId";
    }
}

// private intents functions start

function supportedCitiesIntent(body) {
    var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
    var supCitiesResponseInfo = AlexaSkillUtil.ask(
        poolerSpeechResponse.speechOutput,
        poolerSpeechResponse.repromptOutput,
        body.session
    );
    return supCitiesResponseInfo;
}

function dialogTideIntent(body, deferred) {
    var dialogTideSpeechResponse;
    var intent = body.request.intent;
    var citySlotValue = intent.slots.td_city ? intent.slots.td_city.value : null;
    var dateSlotValue = intent.slots.Date ? intent.slots.Date.value : null;
    var sessionAttrs = {};
    if (citySlotValue) {
        sessionAttrs.date = body.session.attributes.date;
        TidePooler.handleCityDialogRequest(citySlotValue, sessionAttrs)
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else if (dateSlotValue) {
        sessionAttrs.city = body.session.attributes.city.city;
        TidePooler.handleDateDialogRequest(dateSlotValue, sessionAttrs)
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else {
        TidePooler.handleNoSlotDialogRequest(body.session.attributes)
            .then(function (poolerNoSlotSpeechResponse) {
                dialogTideSpeechResponse = poolerNoSlotSpeechResponse;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }
    return deferred.promise;
}

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var processedResponse;
    var combinedAttributes = Object.assign(
        poolerDateSpeechResponse.sessionAttributes ? poolerDateSpeechResponse.sessionAttributes : {},
        body.session.attributes ? body.session.attributes : {}
    );
    if (poolerDateSpeechResponse.repromptOutput) {
        //ask for city or date
        processedResponse = AlexaSkillUtil.ask(
            poolerDateSpeechResponse.speechOutput,
            poolerDateSpeechResponse.repromptOutput,
            { "attributes": combinedAttributes });
    } else {
        //tell the final tide status
        processedResponse = AlexaSkillUtil.tellWithCard(
            poolerDateSpeechResponse.speechOutput,
            { "attributes": combinedAttributes },
            { "title": "TidePooler", "content": poolerDateSpeechResponse.speechOutput.text }
        );
    }
    return processedResponse;
}
// private intents functions end

//private function end

module.exports = Allstate;


