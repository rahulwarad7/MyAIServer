
var AlexaSkill = require('./alexaSkill.js');
var TidePooler = require('./../../apps/tide-pooler/tide-pooler.js');

//app id should be allstate app id in amazon alexa
var APP_ID = "amzn1.ask.skill.1cf6d2e2-8f52-4e41-b540-d6328404d0a4";


var Allstate = function () {
    AlexaSkill.call(this, APP_ID);
};


// Extend AlexaSkill
Allstate.prototype = Object.create(AlexaSkill.prototype);
Allstate.prototype.constructor = Allstate;


Allstate.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Allstate onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Allstate.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Allstate onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

Allstate.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Allstate onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};


Allstate.prototype.intentHandlers = {
    // register custom intent handlers
    "GetWeatherForecast": function (intent, session, response) {
        var speechOutput = {
                speech: "Today in Boston: Fair, the temperature is 37 F",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
        response.tell(speechOutput);
    },
    "TDSupportedCitiesIntent":function(intent, session, response){
        supportedCitiesIntent(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function supportedCitiesIntent(intent, session, response){
    var suppCitesSpeechResponse = TidePooler.getSupportedCitiesResponse();
    response.ask(suppCitesSpeechResponse.speech, suppCitesSpeechResponse.repromptSpeech);
}

module.exports = new Allstate();