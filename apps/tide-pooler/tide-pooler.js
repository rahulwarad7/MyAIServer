var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var dateUtil = require('./../../shared/utilities/dateUtil.js');
var q = require('q');
var request = require('request');

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
    var deferred = q.defer();
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
        cityDialogSpeechResponse.speechOutput = speechOutput;
        cityDialogSpeechResponse.repromptOutput = repromptOutput;
        deferred.resolve(cityDialogSpeechResponse);
    } else {
        if (sessionAttrs.date) {
            getFinalTideResponse(cityStation.city, sessionAttrs.date)
                .then(function (tideSpeechOutput) {
                    cityDialogSpeechResponse.speechOutput = tideSpeechOutput;
                    cityDialogSpeechResponse.repromptOutput = null;
                    deferred.resolve(cityDialogSpeechResponse);
                });
            //speechOutput = getFinalTideResponse(cityStation.city, sessionAttrs.date);
            //repromptOutput = null;
        } else {
            cityDialogSpeechResponse.sessionAttributes = { "city": cityStation };
            speechOutput.text = "For which date?";
            repromptOutput.text = "For which date would you like tide information for " + cityStation.city + "?";
            cityDialogSpeechResponse.speechOutput = speechOutput;
            cityDialogSpeechResponse.repromptOutput = repromptOutput;
            deferred.resolve(cityDialogSpeechResponse);
        }
    }


    return deferred.promise;
};

TidePooler.prototype.handleDateDialogRequest = function (dateValue, sessionAttrs) {
    var dateDialogSpeechResponse = new SpeechResponse();
    var deferred = q.defer();
    //var intent = body.request.intent;
    //var session = body.session;
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    var date = getDateFromIntent(dateValue);

    if (!date) {
        repromptOutput.text = "Please try again saying a day of the week, for example, Saturday. "
            + "For which date would you like tide information?";
        speechOutput.text = "I'm sorry, I didn't understand that date. " + repromptText;
        dateDialogSpeechResponse.speechOutput = speechOutput;
        dateDialogSpeechResponse.repromptOutput = repromptOutput;
        deferred.resolve(dateDialogSpeechResponse);
    } else {
        if (sessionAttrs.city) {
            getFinalTideResponse(sessionAttrs.city, date)
                .then(function (tideSpeechOutput) {
                    dateDialogSpeechResponse.speechOutput = tideSpeechOutput;
                    dateDialogSpeechResponse.repromptOutput = null;
                    deferred.resolve(dateDialogSpeechResponse);
                });
            //speechOutput = getFinalTideResponse(sessionAttrs.city, date);
            //repromptOutput = null;
        } else {
            dateDialogSpeechResponse.sessionAttributes = { "date": date };
            speechOutput.text = "For which city would you like tide information for " + date.displayDate + "?";
            repromptOutput.text = "For which city?";
            dateDialogSpeechResponse.speechOutput = speechOutput;
            dateDialogSpeechResponse.repromptOutput = repromptOutput;
            deferred.resolve(dateDialogSpeechResponse);
        }
    }
    return deferred.promise;
};

TidePooler.prototype.handleNoSlotDialogRequest = function (sessionAttrs) {
    var dateDialogSpeechResponse = new SpeechResponse();
    var deferred = q.defer();
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
    deferred.resolve(dateDialogSpeechResponse);

    return deferred.promise;
};

//private function start

function getFinalTideResponse(city, date) {
    var deferred = q.defer();
    //do the api call to external service i.e. National Oceanic tide service
    var noaaURL = getNOAAUrl(city, date);
    request({ "method": "GET", "url": noaaURL },
        function (error, response, body) {
            var finalSpeechOutput = new Speech();
            if (error || response.statusCode !== 200) {
                console.log("Error from server");
                errormsg = "Error from server session";
                speechTxt = getHighTideSpeechText(errormsg, highTide, date, city);
            } else {
                var noaaResponseObject = JSON.parse(body);
                var speechTxt;
                if (noaaResponseObject.error) {
                    console.log("NOAA error: " + noaaResponseObj.error.message);
                    speechTxt = getHighTideSpeechText(noaaResponseObj.error, highTide, date, city);
                } else {
                    var highTide = findHighTide(noaaResponseObject);
                    speechTxt = getHighTideSpeechText(null, highTide, date, city);
                }
                finalSpeechOutput.text = speechTxt;
            }
            deferred.resolve(finalSpeechOutput);
        })

    return deferred.promise;
}

function getHighTideSpeechText(error, highTideResponse, date, city) {
    var speechOutput;

    if (error) {
        speechOutput = "Sorry, the National Oceanic tide service is experiencing a problem. Please try again later";
    } else {
        speechOutput = date.displayDate + " in " + city + ", the first high tide will be around "
            + highTideResponse.firstHighTideTime + ", and will peak at about " + highTideResponse.firstHighTideHeight
            + ", followed by a low tide at around " + highTideResponse.lowTideTime
            + " that will be about " + highTideResponse.lowTideHeight
            + ". The second high tide will be around " + highTideResponse.secondHighTideTime
            + ", and will peak at about " + highTideResponse.secondHighTideHeight + ".";
    }
    return speechOutput;
}


function getNOAAUrl(city, date) {
    var stationInfo = getCityStationFromIntent(city, false);
    var datum = "MLLW";
    var endpoint = 'http://tidesandcurrents.noaa.gov/api/datagetter';
    var queryString = '?' + date.requestDateParam;
    queryString += '&station=' + stationInfo.station;
    queryString += '&product=predictions&datum=' + datum + '&units=english&time_zone=lst_ldt&format=json';
    return (endpoint + queryString);
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
            displayDate: dateUtil.getFormattedDate(date),
            requestDateParam: requestDay
        }
    }
}

/**
 * Algorithm to find the 2 high tides for the day, the first of which is smaller and occurs
 * mid-day, the second of which is larger and typically in the evening
 */
function findHighTide(noaaResponseObj) {
    var predictions = noaaResponseObj.predictions;
    var lastPrediction;
    var firstHighTide, secondHighTide, lowTide;
    var firstTideDone = false;

    for (var i = 0; i < predictions.length; i++) {
        var prediction = predictions[i];

        if (!lastPrediction) {
            lastPrediction = prediction;
            continue;
        }

        if (isTideIncreasing(lastPrediction, prediction)) {
            if (!firstTideDone) {
                firstHighTide = prediction;
            } else {
                secondHighTide = prediction;
            }

        } else { // we're decreasing

            if (!firstTideDone && firstHighTide) {
                firstTideDone = true;
            } else if (secondHighTide) {
                break; // we're decreasing after have found 2nd tide. We're done.
            }

            if (firstTideDone) {
                lowTide = prediction;
            }
        }

        lastPrediction = prediction;
    }

    return {
        firstHighTideTime: dateUtil.getFormattedTime(new Date(firstHighTide.t)),
        firstHighTideHeight: getFormattedHeight(firstHighTide.v),
        lowTideTime: dateUtil.getFormattedTime(new Date(lowTide.t)),
        lowTideHeight: getFormattedHeight(lowTide.v),
        secondHighTideTime: dateUtil.getFormattedTime(new Date(secondHighTide.t)),
        secondHighTideHeight: getFormattedHeight(secondHighTide.v)
    }
}


function isTideIncreasing(lastPrediction, currentPrediction) {
    return parseFloat(lastPrediction.v) < parseFloat(currentPrediction.v);
}

/**
 * Formats the height, rounding to the nearest 1/2 foot. e.g.
 * 4.354 -> "four and a half feet".
 */
function getFormattedHeight(height) {
    var isNegative = false;
    if (height < 0) {
        height = Math.abs(height);
        isNegative = true;
    }

    var remainder = height % 1;
    var feet, remainderText;

    if (remainder < 0.25) {
        remainderText = '';
        feet = Math.floor(height);
    } else if (remainder < 0.75) {
        remainderText = " and a half";
        feet = Math.floor(height);
    } else {
        remainderText = '';
        feet = Math.ceil(height);
    }

    if (isNegative) {
        feet *= -1;
    }

    var formattedHeight = feet + remainderText + " feet";
    return formattedHeight;
}
//private function end

module.exports = new TidePooler();