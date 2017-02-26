var Response = require('./../../shared/data-models/response.js');

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

function getAllStationsText() {
    var stationList = '';
    for (var station in STATIONS) {
        stationList += station + ", ";
    }

    return stationList;
};

TidePooler.prototype.getSupportedCitiesResponse = function () {
    var welcomeSpeechResp = new Response();
    var whichCityPrompt = "Which city would you like tide information for?";
    var speechOutput = "Currently, I know tide information for these coastal cities: " + getAllStationsText()
        + whichCityPrompt;
    welcomeSpeechResp.speech.text = speechOutput;
    welcomeSpeechResp.speech.type = 'PlainText';
    
    welcomeSpeechResp.repromptSpeech.text = whichCityPrompt;
    welcomeSpeechResp.repromptSpeech.type = 'PlainText';

    return welcomeSpeechResp;
};


module.exports = new TidePooler();