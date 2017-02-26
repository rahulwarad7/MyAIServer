
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
            speech: "Today in Boston: Fair, the temperature is 37 degree fahrenheit.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },
    "TDSupportedCitiesIntent": function (intent, session, response) {
        supportedCitiesIntent(intent, session, response);
    },
    "TDDialogTideIntent": function (intent, session, response) {
        // Determine if this turn is for city, for date, or an error.
        // We could be passed slots with values, no slots, slots with no value.
        var citySlot = intent.slots.City;
        var dateSlot = intent.slots.Date;
        if (citySlot && citySlot.value) {
            handleCityDialogRequest(intent, session, response);
        } else if (dateSlot && dateSlot.value) {
            handleDateDialogRequest(intent, session, response);
        } else {
            handleNoSlotDialogRequest(intent, session, response);
        }
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function supportedCitiesIntent(intent, session, response) {
    var suppCitesSpeechResponse = TidePooler.getSupportedCitiesResponse();
    response.ask(suppCitesSpeechResponse.speech, suppCitesSpeechResponse.repromptSpeech);
}

function handleCityDialogRequest(intent, session, response) {

    var cityStation = TidePooler.getCityStationFromIntent(intent, false),
        repromptText,
        speechOutput;
    if (cityStation.error) {
        repromptText = "Currently, I know tide information for these coastal cities: " + getAllStationsText()
            + "Which city would you like tide information for?";
        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot
        speechOutput = cityStation.city ? "I'm sorry, I don't have any data for " + cityStation.city + ". " + repromptText : repromptText;
    } else {
        // if we don't have a date yet, go to date. If we have a date, we perform the final request
        if (session.attributes.date) {
            getFinalTideResponse(cityStation, session.attributes.date, response);
        } else {
            // set city in session and prompt for date
            session.attributes.city = cityStation;
            speechOutput = "For which date?";
            repromptText = "For which date would you like tide information for " + cityStation.city + "?";
        }
    }

    response.ask(speechOutput, repromptText);
}
module.exports = new Allstate();