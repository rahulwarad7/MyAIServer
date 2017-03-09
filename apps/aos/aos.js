var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var Utilities = require('./../../shared/utilities/utilities.js');
var q = require('q');
var request = require('request');

var AOS = function () { };

var AGENTFINDRESP = [
    "Sure. what's your zip code?",
    "I can help you with that. What's your zip?",
    "Please provide the zip?",
];

AOS.prototype.handleAgentFindRequest = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.zip) {
        getFinalAgentFindResponse(sessionAttrs.zip)
            .then(function (agentSpeechOutput) {
                agentFindSpeechResp.speechOutput = agentSpeechOutput;
                agentFindSpeechResp.repromptOutput = null;
                deferred.resolve(agentFindSpeechResp);
            });
    } else {
        speechOutput.text = Utilities.GetRandomValue(AGENTFINDRESP);
        repromptOutput.text = Utilities.GetRandomValue(AGENTFINDRESP);
        agentFindSpeechResp.speechOutput = speechOutput;
        agentFindSpeechResp.repromptOutput = repromptOutput;
        deferred.resolve(agentFindSpeechResp);
    }

    return deferred.promise;
};

AOS.prototype.handleAgentFindByZipIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();


    getFinalAgentFindResponse(sessionAttrs.zip)
        .then(function (agentSpeechOutput) {
            agentFindSpeechResp.speechOutput = agentSpeechOutput;
            agentFindSpeechResp.repromptOutput = null;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function getFinalAgentFindResponse(zip) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    finalSpeechOutput.text = "your agents are 13413.";

    deferred.resolve(finalSpeechOutput);
    return deferred.promise;
};

module.exports = new AOS();