var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');

var STATIONS = {
    'seattle': 9447130,
    'san francisco': 9414290,
    'monterey': 9413450,
    'los angeles': 9410660,
    'san diego': 9410170,
    'boston': 8443970,
    'new york': 8518750,
    'virginia beach': 8638863,
    'wilmington': 8658163,
    'charleston': 8665530,
    'beaufort': 8656483,
    'myrtle beach': 8661070,
    'miami': 8723214,
    'tampa': 8726667,
    'new orleans': 8761927,
    'galveston': 8771341
};

var TidePooler = function () { };


TidePooler.prototype.getSupportedCitiesResponse = function () {
    var suppCitiesSpeechResp = new SpeechResponse();
    var whichCityPrompt = "Which city would you like tide information for?";

    var speechOutput = new Speech();
    speechOutput.text = "Currently, I know tide information for these coastal cities: " + getAllStationsText()
                        + whichCityPrompt

    var repromptOutput = new Speech();
    repromptOutput.text = whichCityPrompt;
    
    suppCitiesSpeechResp.speechOutput = speechOutput;
    suppCitiesSpeechResp.repromptOutput = repromptOutput;

    return suppCitiesSpeechResp;
};

//private function start

function getAllStationsText() {
    var stationList = '';
    for (var station in STATIONS) {
        stationList += station + ", ";
    }

    return stationList;
};

function getCityStationFromIntent(intent, assignDefault) {

    var citySlot = intent.slots.City;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!citySlot || !citySlot.value) {
        if (!assignDefault) {
            return {
                error: true
            }
        } else {
            // For sample skill, default to Seattle.
            return {
                city: 'seattle',
                station: STATIONS.seattle
            }
        }
    } else {
        // lookup the city. Sample skill uses well known mapping of a few known cities to station id.
        var cityName = citySlot.value;
        if (STATIONS[cityName.toLowerCase()]) {
            return {
                city: cityName,
                station: STATIONS[cityName.toLowerCase()]
            }
        } else {
            return {
                error: true,
                city: cityName
            }
        }
    }
}

function getCityDialogResponse(intent, session, response) {
    var cityDialogSpeechResp = new Response();
    var cityStation = TidePooler.getCityStationFromIntent(intent, false),
        repromptText,
        speechOutput;
    if (cityStation.error) {
        repromptText = "Currently, I know tide information for these coastal cities: " + getAllStationsText()
            + "Which city would you like tide information for?";
        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot
        cityDialogSpeechResp.speech.text = cityStation.city ?
            "I'm sorry, I don't have any data for " + cityStation.city + ". " + repromptText :
            repromptText;
        cityDialogSpeechResp.speech.type = 'PlainText';

    } else {
        // if we don't have a date yet, go to date. If we have a date, we perform the final request
        if (session.attributes.date) {
            getFinalTideResponse(cityStation, session.attributes.date, response);
        } else {
            // set city in session and prompt for date
            cityDialogSpeechResp.sessionAttributes.city = cityStation;
            cityDialogSpeechResp.speech.text = "For which date?";
            cityDialogSpeechResp.speech.type = 'PlainText';
            cityDialogSpeechResp.repromptSpeech.text = "For which date would you like tide information for " + cityStation.city + "?";
            cityDialogSpeechResp.repromptSpeech.type = 'PlainText';
        }
    }
    return cityDialogSpeechResp;
}

function getFinalTideResponse(cityStation, date, response) {

}
//private function end

module.exports = new TidePooler();