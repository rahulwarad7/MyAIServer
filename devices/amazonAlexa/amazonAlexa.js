var AlexaSkillUtil = require('./alexaSkillUtil.js');
var TidePooler = require('./../../apps/tide-pooler/tide-pooler.js');
var Response = require('./../../shared/data-models/response.js');
var Speech = require('./../../shared/data-models/speech.js');

var Allstate = function () { };

var debugMode = false;

Allstate.prototype.setDebugMode = function (debugModeValue) {
    Allstate.prototype.debugMode = debugModeValue;
};

//public function start
Allstate.prototype.execute = function (body) {
    var responseInfo = new Response();
    try {
        checkAppId(body.session.application.applicationId);
        if (!body.session.attributes) {
            body.session.attributes = {};
        }
        if (body.session.new) {
            onSessionStarted(body);
        }
        responseInfo.data = HandleRequest(body);

    } catch (error) {
        logging("Unexpected exception " + error);
        responseInfo.status = 1;
    }
    return responseInfo;
};

//public function end

//private function start
function HandleRequest(body) {
    var handleRequestRespInfo;
    switch (body.request.type) {
        case 'LaunchRequest':
            handleRequestRespInfo = HandleLaunchRequest(body);
            break;
        case 'SessionEndedRequest':
            handleRequestRespInfo = HandleSessionEndedRequest(body);
            break;
        case 'IntentRequest':
        default:
            logging('dispatch intent: ' + body.request.intent.name);
            handleRequestRespInfo = HanldeIntentRequest(body);
            break;
    }
    return handleRequestRespInfo;
}

function HandleLaunchRequest(body) {
    logging("onLaunch requestId: " + body.request.requestId + ", sessionId: " + body.session.sessionId);
    return handleWelcomeRequest();
}
function handleWelcomeRequest(body) {
    var speechOutput = new Speech();
    speechOutput.text = "Welcome to Allstate. How can I help?";

    var repromptOutput = new Speech();
    repromptOutput.text = "Hello! Welcome to Allstate. How can I help?" +
        "I can provide information about your Allstate Account or " +
        " provide insurance. " +
        "I can even help you with Road Side Assistance.";
    var welcomeResponseInfo = AlexaSkillUtil.ask(speechOutput, repromptOutput, body.session);
    return welcomeResponseInfo;
}

function HandleSessionEndedRequest(body) {
    logging("onSessionEnded requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
    // any cleanup logic goes here
}

function HanldeIntentRequest(body) {
    var intentResponseInfo;
    var intentName = body.request.intent.name;
    switch (intentName) {
        case "GetWeatherForecast":
            var speechOutput = new Speech();
            speechOutput.text = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            intentResponseInfo = AlexaSkillUtil.tell(speechOutput, body.session);
            break;
        case "TDSupportedCities":
            intentResponseInfo = supportedCitiesIntent(body);
            break;
        case "TDDialogTideIntent":
            intentResponseInfo = dialogTideIntent(body);
            break;
        default:
            logging('no supporting intent implemented. IntentName: ' + intentName);
            throw 'Unsupported intent: ' + intentName;
            break;
    }
    return intentResponseInfo;
}

function onSessionStarted(body) {
    logging("onSessionStarted requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
}

function logging(data) {
    if (this._debugMode) {
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

function dialogTideIntent(body) {
    var dialogTideSpeechResponse;
    var intent = body.request.intent;
    var citySlot = intent.slots.City;
    var dateSlot = intent.slots.Date;
    if (citySlot && citySlot.value) {
        var poolerCitySpeechResponse = TidePooler.handleCityDialogRequest(body);
        if (poolerCitySpeechResponse.repromptOutput) {
            //tell the final tide status
            dialogTideSpeechResponse = AlexaSkillUtil.tellWithCard(
                poolerCitySpeechResponse.speechOutput,
                body.session,
                { "title": "TidePooler", "content": poolerCitySpeechResponse.speechOutput }
            );
        } else {
            //ask for date 
            dialogTideSpeechResponse = AlexaSkillUtil.ask(
                poolerCitySpeechResponse.speechOutput,
                poolerCitySpeechResponse.repromptOutput,
                { "attributes": poolerCitySpeechResponse.sessionAttributes });
        }
    } else if (dateSlot && dateSlot.value) {
        var poolerDateSpeechResponse = TidePooler.handleDateDialogRequest(body);
        if (poolerDateSpeechResponse.repromptOutput) {
            //tell the final tide status
            dialogTideSpeechResponse = AlexaSkillUtil.tellWithCard(
                poolerDateSpeechResponse.speechOutput,
                body.session,
                { "title": "TidePooler", "content": poolerDateSpeechResponse.speechOutput }
            );
        } else {
            //ask for city 
            dialogTideSpeechResponse = AlexaSkillUtil.ask(
                poolerDateSpeechResponse.speechOutput,
                poolerDateSpeechResponse.repromptOutput,
                { "attributes": poolerDateSpeechResponse.sessionAttributes });
        }
    } else {
        dialogTideSpeechResponse = TidePooler.handleNoSlotDialogRequest(body);
    }
    return dialogTideSpeechResponse;
}
// private intents functions end

//private function end

module.exports = Allstate;


