var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var alexaDateUtil = require('./../../shared/utilities/dateUtil.js');

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

TidePooler.prototype.handleCityDialogRequest = function (cityValue, sessionAttrs) {
    var cityDialogSpeechResponse = new SpeechResponse();
    //var intent = body.request.intent;
    //var cityValue = intent.slots.td_city ? intent.slots.td_city.value : null;
    //var session = body.session;
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    var cityStation = getCityStationFromIntent(cityValue, false);
    if (cityStation.error) {
        var repromptText = "Currently, I know tide information for these coastal cities: " + getAllStationsText()
            + "Which city would you like tide information for?";
        repromptOutput.text = repromptText;
        speechOutput.text = cityStation.city ? "I'm sorry, I don't have any data for " + cityStation.city + ". " + repromptText : repromptText;
    } else {
        if (sessionAttrs.date) {
            speechOutput = getFinalTideResponse(cityStation.city, sessionAttrs.date);
            repromptOutput = null;
        } else {
            cityDialogSpeechResponse.sessionAttributes = { "city": cityStation };
            speechOutput.text = "For which date?";
            repromptOutput.text = "For which date would you like tide information for " + cityStation.city + "?";
        }
    }

    cityDialogSpeechResponse.speechOutput = speechOutput;
    cityDialogSpeechResponse.repromptOutput = repromptOutput;

    return cityDialogSpeechResponse;
};

TidePooler.prototype.handleDateDialogRequest = function (dateValue, sessionAttrs) {
    var dateDialogSpeechResponse = new SpeechResponse();
    //var intent = body.request.intent;
    //var session = body.session;
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    var date = getDateFromIntent(dateValue);

    if (!date) {
        repromptOutput.text = "Please try again saying a day of the week, for example, Saturday. "
            + "For which date would you like tide information?";
        speechOutput.text = "I'm sorry, I didn't understand that date. " + repromptText;
    } else {
        if (sessionAttrs.city) {
            speechOutput = getFinalTideResponse(sessionAttrs.city, date);
            repromptOutput = null;
        } else {
            cityDialogSpeechResponse.sessionAttributes = { "date": date };
            speechOutput.text = "For which city would you like tide information for " + date.displayDate + "?";
            repromptOutput.text = "For which city?";
        }
    }


    dateDialogSpeechResponse.speechOutput = speechOutput;
    dateDialogSpeechResponse.repromptOutput = repromptOutput;
    return dateDialogSpeechResponse;
};

TidePooler.prototype.handleNoSlotDialogRequest = function (sessionAttrs) {
    var dateDialogSpeechResponse = new SpeechResponse();
    //var intent = body.request.intent;
    //var session = body.session;
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.city) {
        speechOutput.text = "Please try again saying a day of the week, for example, Saturday. ";
        repromptOutput.text = speechOutput.text;
        dateDialogSpeechResponse.speechOutput = speechOutput;
        dateDialogSpeechResponse.repromptOutput = repromptOutput;
    } else {
        dateDialogSpeechResponse = getSupportedCitiesResponse();
    }

    return dateDialogSpeechResponse;
};

//private function start

function getFinalTideResponse(city, date) {
    //do the api call to external service i.e. National Oceanic tide service
    var finalSpeechOutput = new Speech();
    finalSpeechOutput.text = date.displayDate + " in " + city.city + ", the first high tide will be around "

    return finalSpeechOutput;
}

function getAllStationsText() {
    var stationList = '';
    for (var station in STATIONS) {
        stationList += station + ", ";
    }

    return stationList;
};

function getCityStationFromIntent(cityValue, assignDefault) {

    //var citySlot = intent.slots.td_city;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!cityValue) {
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
        var cityName = cityValue;
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

function getDateFromIntent(dateSlotValue) {

    //var dateSlot = intent.slots.Date;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!dateSlotValue) {
        // default to today
        return {
            displayDate: "Today",
            requestDateParam: "date=today"
        }
    } else {

        var date = new Date(dateSlotValue);

        // format the request date like YYYYMMDD
        var month = (date.getMonth() + 1);
        month = month < 10 ? '0' + month : month;
        var dayOfMonth = date.getDate();
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
        var requestDay = "begin_date=" + date.getFullYear() + month + dayOfMonth
            + "&range=24";

        return {
            displayDate: alexaDateUtil.getFormattedDate(date),
            requestDateParam: requestDay
        }
    }
}
//private function end

module.exports = new TidePooler();