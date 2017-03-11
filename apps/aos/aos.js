var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var Utilities = require('./../../shared/utilities/utilities.js');
var agents = require('./../../shared/data-models/agent.js');
var Session = require('./../../shared/data-models/session.js');
var Agent = require('./../../shared/data-models/agent.js');

var q = require('q');
var request = require('request');

var AOS = function () { };

var AOSTranData = [];

//#region CONSTANTS
var URL_COMMON = "https://purchase-stest.allstate.com/onlinesalesapp-common/";
var URL_RENTERS_SESSIONID = URL_COMMON + "api/transaction/RENTERS/sessionid";
var URL_GETAGENTS = URL_COMMON + "api/common/agents";
var URL_GETSTATE = URL_COMMON + "api/location/{0}/state";

var FROM_EMAIL_ID = "npavangouda@gmail.com";
var AGENTFINDRESP = [
    "Sure. what's your zip code?",
    "I can help you with that. What's your zip?",
    "Please provide the zip?",
];
var EMAILRESP = [
    "Sure. what's your email id?",
    "Please provide the email id",
    "Email id please",
    "What's the email id?",
    "please provide email id"
];
var EMAILSENTRESPAGENT = [
    "Email sent.",
    "We have sent an email to you.",
    "We have sent an email to you with agent details.",
    "Agent details has been sent to your mailbox.",
];
//#endregion

AOS.prototype.handleAgentFindRequest = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.zip) {
        getFinalAgentFindResponse(sessionAttrs)
            .then(function (agentSpeechOutput) {
                agentFindSpeechResp.speechOutput = agentSpeechOutput;
                agentFindSpeechResp.repromptOutput = null;
                agentFindSpeechResp.sessionAttrs = sessionAttrs;
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


    getFinalAgentFindResponse(sessionAttrs)
        .then(function (agentSpeechOutput) {
            agentFindSpeechResp.speechOutput = agentSpeechOutput;
            agentFindSpeechResp.repromptOutput = null;
            agentFindSpeechResp.sessionAttrs = sessionAttrs;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

AOS.prototype.handleAgentFindEmailYesIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.email) {
        getFinalAgentFindSendEmailResponse(sessionAttrs)
            .then(function (agentSpeechOutput) {
                agentFindSpeechResp.speechOutput = agentSpeechOutput;
                agentFindSpeechResp.repromptOutput = null;
                deferred.resolve(agentFindSpeechResp);
            });
    } else {
        speechOutput.text = Utilities.GetRandomValue(EMAILRESP);
        repromptOutput.text = Utilities.GetRandomValue(EMAILRESP);
        agentFindSpeechResp.speechOutput = speechOutput;
        agentFindSpeechResp.repromptOutput = repromptOutput;
        deferred.resolve(agentFindSpeechResp);
    }


    return deferred.promise;
};

AOS.prototype.handleAgentFindEmailNoIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();

    speechOutput.text = "Thank you for chosing Allstate. You are in Good Hands.";
    agentFindSpeechResp.speechOutput = speechOutput;
    agentFindSpeechResp.repromptOutput = null;
    deferred.resolve(agentFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleAgentFindEmailSendIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    getFinalAgentFindSendEmailResponse(sessionAttrs)
        .then(function (agentSpeechOutput) {
            agentFindSpeechResp.speechOutput = agentSpeechOutput;
            agentFindSpeechResp.repromptOutput = null;
            deferred.resolve(agentFindSpeechResp);
        });


    return deferred.promise;

};

function getFinalAgentFindSendEmailResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var to = sessionAttrs.email;
    var subject = "Allstate agent details: " + sessionAttrs.agent.name;
    var body = buildAgentEmailBody(sessionAttrs.agent, to);
    Utilities.sendEmail(to, subject, body)
        .then(function (emailStatus) {
            if (emailStatus) {
                finalSpeechOutput.text = Utilities.GetRandomValue(EMAILSENTRESPAGENT);
            } else {
                finalSpeechOutput.text = "Sorry! there was a problem while sending the email to you. Please try again later.";
            }
            deferred.resolve(finalSpeechOutput);
        })


    return deferred.promise;
}

function buildAgentEmailBody(agentInfo, to) {
    var emailBody = "";

    emailBody = emailBody + "\nThank you for your interest in Allstate agents.\n"
    emailBody = emailBody + "\nBelow are details you requested regarding our agent: " + agentInfo.name;
    emailBody = emailBody + "\n-------------------------------------------------------";
    emailBody = emailBody + "\nAdderess: " + getCombinedAddress(agentInfo);
    emailBody = emailBody + "\nPhone: " + agentInfo.phoneNumber;
    emailBody = emailBody + "\nEmail: " + agentInfo.emailAddress;

    return emailBody;
}

function getCombinedAddress(agentInfo) {
    var combinedAddr = "";
    if (agentInfo.addressLine1) {
        combinedAddr = combinedAddr + agentInfo.addressLine1 + ","
    }
    if (agentInfo.city) {
        combinedAddr = combinedAddr + agentInfo.city + ","
    }
    if (agentInfo.state) {
        combinedAddr = combinedAddr + agentInfo.state + " "
    }
    if (agentInfo.zipCode) {
        combinedAddr = combinedAddr + agentInfo.zipCode
    }

    return combinedAddr;
}

function getFinalAgentFindResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zip = sessionAttrs.zip;

    startAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return getStateFromZip(sessionInfo.sessionId, sessionInfo.zip);
        }).then(function (state) {
            sessionInfo.state = state;
            return getAgents(sessionInfo);
        }).then(function (agentsResp) {
            if (agentsResp && agentsResp.length > 0) {
                sessionAttrs.agent = agentsResp[0];
                var firstAgentName = agentsResp[0].name;
                finalSpeechOutput.text = "nearest Allstate agent to you is, " + firstAgentName +
                    ". You can call the agent at " + agentsResp[0].phoneNumber +
                    ". Or, would you like me to email you the agent details?";
            } else {
                finalSpeechOutput.text = "sorry! no agents are available at zip " + sessionInfo.zip;
            }
            deferred.resolve(finalSpeechOutput);
        }).catch(function (error) {
            finalSpeechOutput.text = "something went wrong with agent service. Please try again later.";
            deferred.resolve(finalSpeechOutput);
        })

    return deferred.promise;
};


function getAgents(sessionInfo) {
    var deferred = q.defer();
    request(
        {
            method: 'POST',
            url: URL_GETAGENTS,
            "content-type": "application/json",
            headers: {
                "X-TID": sessionInfo.sessionId,
                "X-ST": sessionInfo.state
            },
            json: true,
            body: { "zipCode": sessionInfo.zip }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var agents = ProcessAgentResponse(response.body);
                deferred.resolve(agents);
            }
        });

    return deferred.promise;
}

function ProcessAgentResponse(agentServResp) {
    var agents = [];
    if (agentServResp && agentServResp.agentAvailable && agentServResp.agents.length > 0) {
        for (var index = 0; index < agentServResp.agents.length; index++) {
            var currServAgent = agentServResp.agents[index];
            var agentInfo = new Agent();
            agentInfo.id = currServAgent.id;
            agentInfo.name = currServAgent.name;
            agentInfo.addressLine1 = currServAgent.addressLine1;
            agentInfo.city = currServAgent.city;
            agentInfo.state = currServAgent.state;
            agentInfo.zipCode = currServAgent.zipCode;
            agentInfo.phoneNumber = currServAgent.phoneNumber;
            agentInfo.imageUrl = currServAgent.imageURL;
            agentInfo.emailAddress = currServAgent.emailAddress;
            agents.push(agentInfo);
        }
    }

    return agents;
}

function startAOSSession(zip) {
    var deferred = q.defer();
    request({ method: 'GET', uri: URL_RENTERS_SESSIONID }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            errormsg = "Error from server session";
            deferred.reject(errormsg);
        } else {
            var sessionId = response.headers['x-tid'];
            deferred.resolve(sessionId);
        }
    });
    return deferred.promise;
}

function getStateFromZip(sessionId, zip) {
    var deferred = q.defer();
    var urlGetStateFromZip = URL_GETSTATE.replace("{0}", zip);
    request({ method: 'GET', uri: urlGetStateFromZip, headers: { "X-TID": sessionId } },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = JSON.parse(response.body);
                deferred.resolve(responseJson.stateCode);
            }
        });
    return deferred.promise;
}

module.exports = new AOS();