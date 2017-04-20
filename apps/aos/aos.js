var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var Utilities = require('./../../shared/utilities/utilities.js');
var DateUtil = require('./../../shared/utilities/dateUtil.js');
var agents = require('./../../shared/data-models/agent.js');
var Session = require('./../../shared/data-models/session.js');
var Agent = require('./../../shared/data-models/agent.js');
var Address = require('./../../shared/data-models/address.js');
var Resident = require('./../../shared/data-models/resident.js');
var ContactInfo = require('./../../shared/data-models/contactInfo.js');

var q = require('q');
var request = require('request');

var AOS = function () { };

var AOSTranData = [];

//#region CONSTANTS
var URL_COMMON = "https://purchase-itest2.allstate.com/onlinesalesapp-common/";
var URL_RENTERS_SESSIONID = URL_COMMON + "api/transaction/RENTERS/sessionid";
var URL_GETAGENTS = URL_COMMON + "api/common/agents";
var URL_AUTO_SESSIONID = URL_COMMON + "api/transaction/AUTO/sessionid";
var URL_GETSTATE = URL_COMMON + "api/location/{0}/state";
var URL_RENTERS_BASE = "https://purchase-itest2.allstate.com/onlinesalesapp-renters/api";
var URL_RENTERS_SAVECUSTOMER = URL_RENTERS_BASE + "/renters/customer";
var URL_RENTERS_RENTERSINFO = URL_RENTERS_BASE + "/renters/renter-information";
var URL_RENTERS_CONFIRMPROFILE = URL_RENTERS_BASE + "/renters/renter-information/confirm-profile";
var URL_RENTERS_SAVEANDEXIT = URL_RENTERS_BASE + "/renters/save-and-exit";
var URL_RENTERS_QUOTEREPOSITORY = URL_COMMON + "api/quote-repository";
var URL_RENTERS_SAVEEXPLICIT = URL_RENTERS_BASE + "/renters/save-explicit";
var URL_RENTERS_RESIDENCEINFO = URL_RENTERS_BASE + "/renters/residence-information";
var URL_RENTERS_ORDERQUOTE = URL_RENTERS_BASE + "/renters/quote";

var FROM_EMAIL_ID = "pgoud@gmail.com";
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

//#region PUBLIC METHODS

AOS.prototype.handleRentersInsuranceStart = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Sure thing! I'll just need some basic contact info first. Please enter your full name.";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
}

AOS.prototype.handleRentersInsuranceName = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.lastName) {
        speechOutput.text = "Now your birthday.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else {
        speechOutput.text = sessionAttrs.firstName + ", please provide last name.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);



    return deferred.promise;
}
//Now what's your street address?, or say current location to take current address
AOS.prototype.handleRentersInsuranceDOB = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = " And 10-digit phone number";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersEmailAddress = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    rentersFindSpeechResp.contextOut = [];
    speechOutput.text = "Okay, great! Now I need some info on where you live. What's the CITY and ZIP code of your current address?";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceCityZip = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.zip && sessionAttrs.city) {
        speechOutput.text = " Now what's your current street address?";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else if (sessionAttrs.zip && !sessionAttrs.city) {
        speechOutput.text = sessionAttrs.firstName + ", please provide city.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else if (!sessionAttrs.zip && sessionAttrs.city) {
        speechOutput.text = sessionAttrs.firstName + ", please provide zip.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);
    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceInsuredAddrSame = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.IsInsuredAddrSame) {
        getRentersSaveCustomerResponse(sessionAttrs)
            .then(function (saveCustSpeechOutput) {
                rentersFindSpeechResp.speechOutput = saveCustSpeechOutput;
                rentersFindSpeechResp.repromptOutput = speechOutput;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);

            });
    } else {
        speechOutput.text = "Is this the address you'd like to insure?";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
        rentersFindSpeechResp.sessionAttrs = sessionAttrs;
        deferred.resolve(rentersFindSpeechResp);
    }

    return deferred.promise;
};

AOS.prototype.handlerRentersPhoneNumber = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.phoneNumber.length == 10) {
        speechOutput.text = "I agree that Allstate can call me at the provided phone number regarding my insurance quote request." +
            "I understand the call may be automatically dialed, that my consent is not a condition of any purchase, and that I can revoke my " +
            "consent at any time. say OK to authorize";
    }
    else {
        speechOutput.text = "Please provide the valid phone number";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersPhoneNumberAuthorize = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.isAuthorize === "true") {
        speechOutput.text = "Finally, email address.";
    }
    else {
        speechOutput.text = "you need to authorize to move further so say \"authorize\"";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);
    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceAddr = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Is this the address you'd like to insure? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersInsuranceInsuredAddrDiff = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    rentersFindSpeechResp.contextOut = [];
    speechOutput.text = "Okay, ! Now I need know What is the CITY and ZIP code you want to insure for?";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersNewCityZip = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Now what is the street address to insure? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersDiffAddress = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.IsInsuredAddrSame == false) {
        getRentersSaveCustomerResponse(sessionAttrs)
            .then(function (saveCustSpeechOutput) {
                rentersFindSpeechResp.speechOutput = saveCustSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    }
    else if (sessionAttrs.IsInsuredAddrSame == false) {
        getRentersSaveCustomerResponse(sessionAttrs)
            .then(function (saveCustSpeechOutput) {
                rentersFindSpeechResp.speechOutput = saveCustSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    } else {
        speechOutput.text = "Is this the address you'd like to insure?";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerCreditHistoryAuthorize = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.state != "KS") {
        speechOutput.text = "Great! Next I'll need to know a little about your employment status. Are you employed, self employed, unemployed, student, retired, home maker or military";
    }
    else {
        speechOutput.text = "Thanks. Would you like to add a spouse to your quote?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);
    return deferred.promise;
};

AOS.prototype.handlerRentersEmpStatus = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var sessionInfo = new Session();

    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        sessionInfo.sessionId = sessionAttrs.transactionToken.sessionID;
        sessionInfo.state = sessionAttrs.transactionToken.state;
        sessionInfo.zip = sessionAttrs.transactionToken.zipCode;
        getAgents(sessionInfo)
            .then(function (agentDetails) {
                if (agentDetails && agentDetails.length > 0) {
                    sessionAttrs.agentDetails = agentDetails[0];
                }
                if (sessionAttrs.state != "FL") {
                    speechOutput.text = "Now please mention your gender ";
                }
                else {
                    speechOutput.text = "Thanks! Have you lived in your residence for more than two years?";
                }
                rentersFindSpeechResp.speechOutput = speechOutput;
                rentersFindSpeechResp.repromptOutput = speechOutput;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    }
    return deferred.promise;
};

AOS.prototype.handlerRentersGender = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state != "CA" && sessionAttrs.state != "CT" && sessionAttrs.state != "MD" && sessionAttrs.state != "OR" && sessionAttrs.state != "PA" && sessionAttrs.state != "NY") {
        speechOutput.text = "Thanks. Would you like to add a spouse to your quote? ";
    }
    else {
        speechOutput.text = "Thanks. Now Tell me about your marital status like single, married and lived with spouse, divorced, legally married but separated, widowed, domestic partnership";
    }


    // speechOutput.text = "Thanks. Would you like to add a spouse to your quote? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersMeritalStatus = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.maritalstatus == "02" || sessionAttrs.maritalstatus == "08") {
        speechOutput.text = "Thanks. Please give your spouse name ";
    }
    else {
        speechOutput.text = "Thanks! Have you lived in your residence for more than two years? ";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    rentersFindSpeechResp.sessionAttrs = sessionAttrs;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};
AOS.prototype.handlerRentersLivedMoreThanTwoYrsYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        getRentersInfoResponse(sessionAttrs)
            .then(function (rentersInfoSpeechOutput) {
                rentersFindSpeechResp.speechOutput = rentersInfoSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRentersResidence = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        confirmProfileResponse(sessionAttrs)
            .then(function (confProfileSpeechOutput) {
                rentersFindSpeechResp.speechOutput = confProfileSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRentersLivedMoreThanTwoYrsNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Okay, What's the CITY and ZIP code of your previous address?";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersPrevCityZip = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.prevzip && sessionAttrs.transactionToken) {
        getStateFromZip(sessionAttrs.transactionToken.sessionID, sessionAttrs.prevzip)
            .then(function (state) {
                sessionAttrs.prevstate = state;
                speechOutput.text = "Now what's previous street address? ";
                rentersFindSpeechResp.speechOutput = speechOutput;
                rentersFindSpeechResp.repromptOutput = speechOutput;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    }
    else {
        speechOutput.text = "prevous address is not proper. Please provide valid city and zipcode";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
        deferred.resolve(rentersFindSpeechResp);
    }
    return deferred.promise;
};

AOS.prototype.handlerRentersPrevStreetAddrs = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        getRentersInfoResponse(sessionAttrs)
            .then(function (rentersInfoSpeechOutput) {
                rentersFindSpeechResp.speechOutput = rentersInfoSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerAOSRentersIsSpouseYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "Sure thing! I'll just need some basic info first. Please give your spouse's full name.";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);
    return deferred.promise;
};

AOS.prototype.handleRentersSpouseInsuranceName = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.lastName) {
        speechOutput.text = "Please, Provide your spouse's date of birth";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else {
        speechOutput.text = sessionAttrs.firstName + ", please provide your spouse's last name.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }
    deferred.resolve(rentersFindSpeechResp);



    return deferred.promise;
};

AOS.prototype.handleRentersSpouseInsuranceDOB = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Great! I would need to know a little about your spouse's employment status. Like employed, self employed, unemployed, student, retired, home maker or military";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersSpouseEmpStatus = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Now please mention your spouse's gender ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersSpouseGender = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Thanks! Have you lived in your residence for more than two years? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerAOSRentersIsSpouseNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "OK! Have you lived in your residence for more than two years? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersIsPrimaryResYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Sounds good! I'll just need a few more details. Are you located in a dorm, military barracks, farm or assisted living facility? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersIsPrimaryResNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs && sessionAttrs.agentDetails) {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. Here is agent close to you: " + sessionAttrs.agentDetails.name + " , you can call at, " + sessionAttrs.agentDetails.phoneNumber + " , or email at, " + sessionAttrs.agentDetails.emailAddress;
    }
    else {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. ";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersResidenceLocYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs && sessionAttrs.agentDetails) {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. Here is agent close to you: " + sessionAttrs.agentDetails.name + " , you can call at, " + sessionAttrs.agentDetails.phoneNumber + " , or email at, " + sessionAttrs.agentDetails.emailAddress;
    }
    else {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. ";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersResidenceLocNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Alright. Do you operate a business out of your residence? ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersIsBusinessOperatedYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs && sessionAttrs.agentDetails) {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. Here is agent close to you: " + sessionAttrs.agentDetails.name + " , you can call at, " + sessionAttrs.agentDetails.phoneNumber + " , or email at, " + sessionAttrs.agentDetails.emailAddress;
    }
    else {
        speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. ";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersIsBusinessOperatedNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Great. Now, what type of residence are we talking about? You can choose from Apartment, Townhouse, Condo, House, Manufactured/Mobile Home ";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersResidenceType = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.residenceBuildingType == "APT" || sessionAttrs.residenceBuildingType == "TH1" || sessionAttrs.residenceBuildingType == "CO") {
        speechOutput.text = "Are there more than 4 units in the building? ";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
        deferred.resolve(rentersFindSpeechResp);
    }
    else {
        speechOutput = stateSPecificQuestionOne(sessionAttrs, speechOutput);
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
        deferred.resolve(rentersFindSpeechResp);
    }

    return deferred.promise;
};

AOS.prototype.handlerRentersIsFiveOrMoreUnitsYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput = stateSPecificQuestionOne(sessionAttrs, speechOutput);
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersIsFiveOrMoreUnitsNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput = stateSPecificQuestionOne(sessionAttrs, speechOutput);
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionOne = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA") {
        speechOutput.text = "Ok. Is your residence regularly unoccupied for 24 hours or more? ";
    }
    else if (sessionAttrs.state === "CT") {
        if (sessionAttrs && sessionAttrs.agentDetails && sessionAttrs.stateSpecQOneAns === "true") {
            speechOutput.text = "Okay! Sounds like this may be a job for one of our agents. Here is agent close to you: " + sessionAttrs.agentDetails.name + " , you can call at, " + sessionAttrs.agentDetails.phoneNumber + " , or email at, " + sessionAttrs.agentDetails.emailAddress;
        }
        else {
            speechOutput.text = "Alright do you have any dogs? ";
        }
    }
    else if (sessionAttrs.state === "AL" || sessionAttrs.state === "LA" || sessionAttrs.state === "SC") {
        sessionAttrs.withInCityLimit = sessionAttrs.stateSpecQOneAns;
        speechOutput.text = "Does your property have any of the protective devices like Smoke Detectors, Fire Extinguishers, Deadbolt Locks, Central Fire Alarm, Fire Sprinklers, 24-Hour Manned Security, Central Burglar Alarm that reports to a monitoring center, Burglar Alarm that sounds in the home";
    }
    else if (sessionAttrs.state === "CO" || sessionAttrs.state === "GA" || sessionAttrs.state === "ID" || sessionAttrs.state === "ME" || sessionAttrs.state === "MD" ||
        sessionAttrs.state === "NV" || sessionAttrs.state === "NH" || sessionAttrs.state === "WI") {
        speechOutput.text = "Have you had property insurance for at least 1 year?";
    }
    else if (sessionAttrs.state === "AR" || sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "MI" || sessionAttrs.state == "NE" ||
        sessionAttrs.state === "RI" || sessionAttrs.state === "UT" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" || sessionAttrs.state === "MS" || sessionAttrs.state === "DE" ||
        sessionAttrs.state == "VT" || sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "NC" || sessionAttrs.state === "TN" || sessionAttrs.state === "OK") {
        speechOutput.text = "Got it, have you filed any claims in the last 3 years?";
    }
    else if (sessionAttrs.state == "MA" || sessionAttrs.state == "AK" || sessionAttrs.state == "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
        sessionAttrs.propertyInsuranceClaims = sessionAttrs.stateSpecQOneAns.toUpperCase();
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "Okay. I need to know date and type of the claim. Claim can be Fire, Theft, Liability, Vandalism, Water or other. "
        }
        else if (sessionAttrs.state == "MA" || sessionAttrs.state == "AK" || sessionAttrs.state == "DC" || sessionAttrs.state == "ND" ||
            sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
            speechOutput.text = "Alright! Do you have any dogs? "
        }
    }
    else if (sessionAttrs.state == "WY" || sessionAttrs.state === "DE") {
        sessionAttrs.isResidenceWithinThousandFtFromCoast = sessionAttrs.stateSpecQOneAns;
        if (sessionAttrs.isResidenceWithinThousandFtFromCoast === "false" && sessionAttrs.state === "DE") {
            speechOutput.text = "Alright, Do you have any dogs?";
        }
        else {
            speechOutput.text = "Alright, Do you have any dogs?";
        }
    }
    else if (sessionAttrs.state == "NJ" || sessionAttrs.state == "TX") {
        sessionAttrs.constructionType = sessionAttrs.constructionType;
        if (sessionAttrs.state == "NJ") {
            speechOutput.text = "Alright, Do you have any dogs?";
        }
    }
    else if (sessionAttrs.state == "PA") {
        sessionAttrs.isDogAdded = sessionAttrs.stateSpecQOneAns;
        if (sessionAttrs.isDogAdded === "true") {
            speechOutput.text = "Please list the dominant breed of your dog or dogs.";
        }
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionTwo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.state === "CA") {
        sessionAttrs.unOccupiedResidence = sessionAttrs.stateSpecQTwoAns;
        speechOutput.text = "Does your property have any of the following protective devices?Smoke Detectors, Fire Extinguishers, Deadbolt Locks, Central Fire Alarm, Fire Sprinklers, 24-Hour Manned Security, Central Burglar Alarm that reports to a monitoring center, Burglar Alarm that sounds in the home";
    }
    else if (sessionAttrs.state === "CT") {
        sessionAttrs.isResidence2600ftFromCoastVisible = sessionAttrs.stateSpecQOneAns;
        if (sessionAttrs && sessionAttrs.isResidence2600ftFromCoastVisible === "false") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQTwoAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs";
            }
        }
    }
    else if (sessionAttrs.state === "AL" || sessionAttrs.state === "CO" || sessionAttrs.state === "GA" || sessionAttrs.state === "ID" ||
        sessionAttrs.state === "LA" || sessionAttrs.state === "ME" || sessionAttrs.state === "MD" ||
        sessionAttrs.state === "NV" || sessionAttrs.state === "NH" || sessionAttrs.state === "SC" || sessionAttrs.state === "WI") {
        speechOutput.text = "Have you filed any claims in the last 3 years?";
    }
    else if (sessionAttrs.state === "AR" || sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "MI" || sessionAttrs.state == "NE" ||
        sessionAttrs.state === "RI" || sessionAttrs.state === "UT" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" || sessionAttrs.state === "MS" ||
        sessionAttrs.state == "VT" || sessionAttrs.state === "DE" ||
        sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "NC" || sessionAttrs.state === "TN" || sessionAttrs.state === "OK") {
        if (sessionAttrs.stateSpecQTwoAns) {
            sessionAttrs.propertyInsuranceClaims = sessionAttrs.stateSpecQTwoAns.toUpperCase();
        }
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "Okay. I need to know date and type of the claim. Claim can be Fire, Theft, Liability, Vandalism, Water or other. "
        }
        else {
            if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
                sessionAttrs.state === "TN" || sessionAttrs.state == "NE" || sessionAttrs.state == "VT" || sessionAttrs.state === "DE") {
                speechOutput.text = "Alright, Do you have any dogs?";
            }
            else if (sessionAttrs.state === "NY") {
                speechOutput.text = "Are there any additional residents?";
            }
        }
    }
    else if (sessionAttrs.state === "MA" || sessionAttrs.state === "NJ") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "And lost location is same as current insured address? ";
        }
        else if (sessionAttrs.state === "MA" || sessionAttrs.state === "NJ") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQTwoAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    else if (sessionAttrs.state == "AK" || sessionAttrs.state == "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "Alright, Do you have any dogs? ";
        }
        else {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQTwoAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    else if (sessionAttrs.state === "DE" || sessionAttrs.state === "NE" || sessionAttrs.state === "WY" || sessionAttrs.state == "VT") {
        sessionAttrs.isDogAdded = sessionAttrs.stateSpecQTwoAns;
        if (sessionAttrs.isDogAdded === "true") {
            speechOutput.text = "Please list the dominant breed of your dog or dogs.";
        }
    }
    if (sessionAttrs.state === "MA" || sessionAttrs.state === "AK" || sessionAttrs.state === "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.claimLostDate = sessionAttrs.lossdate;
            sessionAttrs.claimLostType = sessionAttrs.losstype;
            sessionAttrs.claimLostDescription = sessionAttrs.lossDescription;
        }
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionThree = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA") {
        speechOutput.text = "Have you filed any claims in the last 3 years";
    }
    else if (sessionAttrs.state === "AL" || sessionAttrs.state === "CO" || sessionAttrs.state === "GA" || sessionAttrs.state === "ID" || sessionAttrs.state === "LA" ||
        sessionAttrs.state === "ME" || sessionAttrs.state === "MD" || sessionAttrs.state === "NV" || sessionAttrs.state === "NH" || sessionAttrs.state === "SC" ||
        sessionAttrs.state === "WI") {
        sessionAttrs.propertyInsuranceClaims = sessionAttrs.stateSpecQThreeAns.toUpperCase();
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "Okay. I need to know date and type of the claim. Claim can be Fire, Theft, Liability, Vandalism, Water or other. ";
        }
        else {
            if (sessionAttrs.state === "CO" || sessionAttrs.state === "ID" || sessionAttrs.state === "ME" || sessionAttrs.state === "NH") {
                speechOutput.text = "Alright, Do you have any dogs?";
            }
            if (sessionAttrs.state === "MD") {
                speechOutput.text = "Are there any additional residents?";
            }
        }
    }
    else if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "MA" ||
        sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
        sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "TN" || sessionAttrs.state === "NE" || sessionAttrs.state === "VT") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
                sessionAttrs.state === "TN" || sessionAttrs.state === "MA" || sessionAttrs.state == "NE" || sessionAttrs.state == "VT" || sessionAttrs.state === "DE") {
                speechOutput.text = "Alright, Do you have any dogs?";
            }
            else if (sessionAttrs.state === "NY") {
                speechOutput.text = "Are there any additional residents?";
            }
            if (sessionAttrs.state === "MA") {
                var isInsuredAddress = sessionAttrs.stateSpecQThreeAns;
                if (isInsuredAddress === "true") {
                    sessionAttrs.claimLostLocationDisplay = sessionAttrs.addrLine1 + ", " + sessionAttrs.city + ", " + sessionAttrs.state + " " + sessionAttrs.zip;
                    sessionAttrs.claimLostLocation = "AI";
                }
                else {
                    sessionAttrs.claimLostLocationDisplay = "Other";
                    sessionAttrs.claimLostLocation = "OT";
                }
            }
        }
        else {
            if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
                sessionAttrs.state === "TN" || sessionAttrs.state == "NE" || sessionAttrs.state == "VT" || sessionAttrs.state === "DE") {
                sessionAttrs.isDogAdded = sessionAttrs.stateSpecQThreeAns;
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
            else if (sessionAttrs.state === "NY") {
                sessionAttrs.additionalResidents = sessionAttrs.stateSpecQThreeAns;
                if (sessionAttrs.additionalResidents === "true") {
                    speechOutput.text = "Got it! Please provide their name, relationship, age, employment and marital status.";
                }
                else {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
            }
        }
    }
    else if (sessionAttrs.state == "AK" || sessionAttrs.state == "DC" || sessionAttrs.state === "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQThreeAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    if (sessionAttrs.state === "AR" || sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "MA" || sessionAttrs.state === "MI" ||
        sessionAttrs.state === "OK" || sessionAttrs.state === "RI" || sessionAttrs.state === "UT" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
        sessionAttrs.state === "MS" || sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "NC" || sessionAttrs.state == "NE" ||
        sessionAttrs.state === "TN" || sessionAttrs.state === "AK" || sessionAttrs.state === "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT" || sessionAttrs.state == "VT") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE" && sessionAttrs.lossDescription) {
            sessionAttrs.claimLostDate = sessionAttrs.lossdate;
            sessionAttrs.claimLostType = sessionAttrs.losstype;
            sessionAttrs.claimLostDescription = sessionAttrs.lossDescription;

        }
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionFour = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA") {
        sessionAttrs.propertyInsuranceClaims = sessionAttrs.stateSpecQFourAns.toUpperCase();
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            speechOutput.text = "Okay. I'll need to know the date and type of claim like fire, theft, liability, vandalism water or other type of claim.";
        }
        else {
            speechOutput.text = "Alright, Do you have any dogs?";
        }
    }
    else if (sessionAttrs.state === "CO" || sessionAttrs.state === "ID" ||
        sessionAttrs.state === "ME" || sessionAttrs.state === "MD" || sessionAttrs.state === "NH") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            if (sessionAttrs.state === "MD") {
                speechOutput.text = "Are there any additional residents?";
            }
            else {
                speechOutput.text = "Alright, Do you have any dogs? ";
            }
        }
        else {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.additionalResidents) {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
            }
            if (sessionAttrs.state === "CO" || sessionAttrs.state === "ID" || sessionAttrs.state === "ME" || sessionAttrs.state === "NH") {
                sessionAttrs.isDogAdded = sessionAttrs.stateSpecQFourAns;
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
        }
    }
    else if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "MA" || sessionAttrs.state == "VT" ||
        sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" || sessionAttrs.state == "NE" ||
        sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "TN") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQFourAns;
            if (sessionAttrs.state === "MA" || sessionAttrs.state === "MA") {
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
            else if (sessionAttrs.state === "IN" || sessionAttrs.state === "IA" || sessionAttrs.state === "RI" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
                sessionAttrs.state === "TN" || sessionAttrs.state == "NE" || sessionAttrs.state == "VT" || sessionAttrs.state === "DE") {
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
            else if (sessionAttrs.state === "NY") {
                if (!sessionAttrs.additionalResidents) {
                    sessionAttrs.additionalResidents = sessionAttrs.stateSpecQFourAns;
                }
                if (sessionAttrs.additionalResidents === "true") {
                    speechOutput.text = "Got it! Please provide their name, relationship, age, employment and marital status. ";
                }
                else {
                    speechOutput.text = "Alright, Do you have any dogs? ";
                }
            }
        }
        else {
            if (sessionAttrs.state === "NY") {
                if (sessionAttrs.additionalResidents === "true") {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
                else {
                    if (sessionAttrs.isDogAdded === "true") {
                        speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                    }
                }
            }
        }
    }
    if (sessionAttrs.state === "AL" || sessionAttrs.state === "CO" || sessionAttrs.state === "GA" || sessionAttrs.state === "ID" || sessionAttrs.state === "LA" ||
        sessionAttrs.state === "ME" || sessionAttrs.state === "MD" || sessionAttrs.state === "NV" || sessionAttrs.state === "NH" || sessionAttrs.state === "SC" ||
        sessionAttrs.state === "WI") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.claimLostDate = sessionAttrs.lossdate;
            sessionAttrs.claimLostType = sessionAttrs.losstype;
            sessionAttrs.claimLostDescription = sessionAttrs.lossDescription;
        }
    }

    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionFive = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.claimLostDate = sessionAttrs.lossdate;
            sessionAttrs.claimLostType = sessionAttrs.losstype;
            sessionAttrs.claimLostDescription = sessionAttrs.lossDescription;
            speechOutput.text = "Alright, Do you have any dogs?";
        }
        else {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQFiveAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    else if (sessionAttrs.state === "CO" || sessionAttrs.state === "ID" ||
        sessionAttrs.state === "ME" || sessionAttrs.state === "MD" || sessionAttrs.state === "NH" || sessionAttrs.state === "NY") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQFiveAns;
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.additionalResidents === "true") {
                    speechOutput.text = "Got it! Please provide their name, relationship, age, employment and marital status.";
                }
            }
            else if (sessionAttrs.state === "NY") {
                if (sessionAttrs.additionalResidents === "true") {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
            }
            else {
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
        }
        else {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.additionalResidents === "true")  {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
            }
            else if (sessionAttrs.state === "NY") {
                if (sessionAttrs.additionalResidents === "true") {
                    if (sessionAttrs.isDogAdded === "true") {
                        speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                    }
                }
            }
        }
    }
    else if (sessionAttrs.state === "NY") {
        if (sessionAttrs.additionalResidents === "true") {
            speechOutput.text = "Alright, Do you have any dogs? ";
        }
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionSix = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            sessionAttrs.isDogAdded = sessionAttrs.stateSpecQSixAns;
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    else if (sessionAttrs.state === "MD") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.additionalResidents) {
                    speechOutput.text = "Alright, Do you have any dogs?";
                }
            }
        }
        else {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.additionalResidents) {
                    if (sessionAttrs.isDogAdded === "true") {
                        speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                    }
                }
            }
        }
    }
    else if (sessionAttrs.state === "NY") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE" && sessionAttrs.additionalResidents === "true") {
            if (sessionAttrs.isDogAdded === "true") {
                speechOutput.text = "Please list the dominant breed of your dog or dogs.";
            }
        }
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionSeven = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "CA" || sessionAttrs.state === "MD" || sessionAttrs.state === "NY") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Please list the dominant breed of your dog or dogs.";
                }
            }
            else {
                speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
                rentersFindSpeechResp.speechOutput = speechOutput;
                rentersFindSpeechResp.repromptOutput = speechOutput;
            }
        }
    }
    else {
        if (sessionAttrs.transactionToken) {
            getRentersQuoteResponse(sessionAttrs)
                .then(function (quoteDetailsSpeechOutput) {
                    rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                    rentersQuoteSpeechResp.repromptOutput = null;
                    rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                    deferred.resolve(rentersQuoteSpeechResp);
                });
        } else {
            speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        }
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersStSpecQuestionEight = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.state === "MD") {
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            if (sessionAttrs.state === "MD") {
                if (sessionAttrs.isDogAdded === "true") {
                    speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
                    rentersFindSpeechResp.speechOutput = speechOutput;
                    rentersFindSpeechResp.repromptOutput = speechOutput;
                }
            }
        }

    }
    else {
        if (sessionAttrs.transactionToken) {
            getRentersQuoteResponse(sessionAttrs)
                .then(function (quoteDetailsSpeechOutput) {
                    rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                    rentersQuoteSpeechResp.repromptOutput = null;
                    rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                    deferred.resolve(rentersQuoteSpeechResp);
                });
        } else {
            speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";

        }
    }
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handlerRentersPersonalItemsValue = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        getRentersQuoteResponse(sessionAttrs)
            .then(function (quoteDetailsSpeechOutput) {
                rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                rentersQuoteSpeechResp.repromptOutput = null;
                rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersQuoteSpeechResp);
            });
    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersQuoteSpeechResp.speechOutput = speechOutput;
        rentersQuoteSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRenterValidCustomer = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        if (sessionAttrs.isValidRenterCustomer) {
            quoteResponse(sessionAttrs)
                .then(function (quoteDetailsSpeechOutput) {
                    rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                    rentersQuoteSpeechResp.repromptOutput = null;
                    rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                    deferred.resolve(rentersQuoteSpeechResp);
                });
        }
        else {
            speechOutput.text = "Thank you for the inputs, Near by agent will contact you for further information";
            rentersQuoteSpeechResp.speechOutput = speechOutput;
            rentersQuoteSpeechResp.repromptOutput = speechOutput;
        }

    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersQuoteSpeechResp.speechOutput = speechOutput;
        rentersQuoteSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRenterSaveQuoteYes = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        if (sessionAttrs.isValidRenterCustomer) {
            saveAndExitResponse(sessionAttrs)
                .then(function (quoteDetailsSpeechOutput) {
                    rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                    rentersQuoteSpeechResp.repromptOutput = null;
                    rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                    deferred.resolve(rentersQuoteSpeechResp);
                });
        }
        else {
            speechOutput.text = "There are issues for saving the quote. Please contact near by agent.";
            rentersQuoteSpeechResp.speechOutput = speechOutput;
            rentersQuoteSpeechResp.repromptOutput = speechOutput;
        }

    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersQuoteSpeechResp.speechOutput = speechOutput;
        rentersQuoteSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRenterGenerateURL = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        if (sessionAttrs.isValidRenterCustomer) {
            quoteLandingURLResponse(sessionAttrs)
                .then(function (quoteDetailsSpeechOutput) {
                    rentersQuoteSpeechResp.speechOutput = quoteDetailsSpeechOutput;
                    rentersQuoteSpeechResp.repromptOutput = null;
                    rentersQuoteSpeechResp.sessionAttrs = sessionAttrs;
                    deferred.resolve(rentersQuoteSpeechResp);
                });
        }
        else {
            speechOutput.text = "There are issues for generating URL. Please contact near by agent.";
            rentersQuoteSpeechResp.speechOutput = speechOutput;
            rentersQuoteSpeechResp.repromptOutput = speechOutput;
        }

    } else {
        speechOutput.text = "Please login to retrieve quote to see your saved quote. Login details are sent to your registered email id.";
        rentersQuoteSpeechResp.speechOutput = speechOutput;
        rentersQuoteSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};

AOS.prototype.handlerRenterSaveQuoteNo = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs && sessionAttrs.agentDetails) {
        speechOutput.text = "Got it. Here is the agent you can contact for more information.  " + sessionAttrs.agentDetails.name + ", Contact Information:" + sessionAttrs.agentDetails.phoneNumber + " , Email at : " + sessionAttrs.agentDetails.emailAddress;
    }
    else {
        speechOutput.text = "Please type help for assistance or type menu for menu options";
    }

    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};
//#endregion


//#region PRIVATE RENTERS
function stateSPecificQuestionOne(sessionAttrs, speechOutput) {
    if (sessionAttrs.state === "CT") {
        speechOutput.text = "Got it. Is your residence located within 2,600 feet of the coast? ";
    }
    else if (sessionAttrs.state === "CA") {
        speechOutput.text = "Got it. Are you insured by Cal-Vet? ";
    }
    else if (sessionAttrs.state === "DE") {
        speechOutput.text = "Got it. Is the property located within 1,000 feet of the ocean or bay? ";
    }
    else if (sessionAttrs.state === "NJ" || sessionAttrs.state === "TX") {
        speechOutput.text = "Got it. Now I'll need to know what material your residence is made out of. ";
    }
    else if (sessionAttrs.state === "AL" || sessionAttrs.state == "LA" || sessionAttrs.state === "SC") {
        speechOutput.text = "Got it. Is the property within city limits? ";
    }
    else if (sessionAttrs.state === "AR" || sessionAttrs.state === "CO" || sessionAttrs.state === "GA" || sessionAttrs.state === "ID" || sessionAttrs.state === "IN" ||
        sessionAttrs.state === "IA" || sessionAttrs.state === "ME" || sessionAttrs.state === "MD" || sessionAttrs.state === "MI" || sessionAttrs.state === "NV" ||
        sessionAttrs.state === "NH" || sessionAttrs.state === "RI" || sessionAttrs.state === "UT" || sessionAttrs.state === "VA" || sessionAttrs.state === "WV" ||
        sessionAttrs.state === "WI" || sessionAttrs.state === "NM" || sessionAttrs.state === "NY" || sessionAttrs.state === "NC" || sessionAttrs.state === "OK" || sessionAttrs.state === "MS") {
        speechOutput.text = "Does your property have any of the protective devices like Smoke Detectors, Fire Extinguishers, Deadbolt Locks, Central Fire Alarm, Fire Sprinklers, 24-Hour Manned Security, Central Burglar Alarm that reports to a monitoring center, Burglar Alarm that sounds in the home";
    }
    else if (sessionAttrs.state == "NE" || sessionAttrs.state == "VT" || sessionAttrs.state == "WY" || sessionAttrs.state == "TN") {
        speechOutput.text = "Got it, Have you had property insurance for at least 1 year?";
    }
    else if (sessionAttrs.state == "MA" || sessionAttrs.state == "AK" || sessionAttrs.state == "DC" || sessionAttrs.state == "ND" ||
        sessionAttrs.state == "SD" || sessionAttrs.state == "HI" || sessionAttrs.state == "MT") {
        speechOutput.text = "Got it, Have you filed any claims in the last 3 years?";
    }
    else if (sessionAttrs.state == "PA") {
        speechOutput.text = "Alright! Do you have any dogs?";
    }
    if (!speechOutput.text) {
        speechOutput.text = "Got it. Just one more question. What is the estimated value of all personal items in your residence?";
    }
    return speechOutput;
}

function getRentersSaveCustomerResponse(sessionAttrs) {
    var deferred = q.defer();
    var saveCustSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zip = sessionAttrs.zip;
    sessionInfo.newzip = sessionAttrs.newzip;
    startAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return getStateFromZip(sessionInfo.sessionId, sessionInfo.zip);
        }).then(function (state) {
            sessionAttrs.state = state;
            if (sessionAttrs.newzip) {
                return getStateFromZip(sessionInfo.sessionId, sessionInfo.newzip);
            }
        }).then(function (newstate) {
            sessionAttrs.newstate = newstate;
            var customerSaveInfo = getCustomerSaveInfo(sessionAttrs, sessionInfo);
            return rentersSaveCustomer(customerSaveInfo, sessionInfo.sessionId);
        }).then(function (saveResp) {
            if (saveResp && saveResp.transactionToken) {
                sessionAttrs.transactionToken = saveResp.transactionToken;
                saveCustSpeechOutput.sessionAttrs = sessionAttrs;
                saveCustSpeechOutput.text = "Information from outside sources regarding credit history is used to provide you with a renters quote. A third party may be used to calculate your insurance score. This information, along with subsequently collected information, will be shared with outside parties that perform services on Allstate's behalf. ";
                saveCustSpeechOutput.text = saveCustSpeechOutput.text + "   Privacy Policy:http://www.allstate.com/about/privacy-statement-aic.aspx ";
                saveCustSpeechOutput.text = saveCustSpeechOutput.text + "   Type OK to authorize.";
            }
            deferred.resolve(saveCustSpeechOutput);
        }).catch(function (error) {
            saveCustSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
            deferred.resolve(saveCustSpeechOutput);
        });

    return deferred.promise;
}

function getRentersInfoResponse(sessionAttrs) {
    var deferred = q.defer();
    var rentersInfoSpeechOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        var rentersInfo = mapRentersInfo(sessionAttrs);
        saveRentersInfo(rentersInfo, sessionAttrs.transactionToken)
            .then(function (result) {
                sessionAttrs.creditHit = result.creditHit;
                sessionAttrs.isRenterReOrderData = result.isRenterReOrderData;
                rentersInfoSpeechOutput.text = "Thank you for the basic renters information. Would you like to proceed."
                deferred.resolve(rentersInfoSpeechOutput);
            }).catch(function (error) {
                rentersInfoSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
                deferred.resolve(rentersInfoSpeechOutput);
            });
    }
    return deferred.promise;
}

function confirmProfileResponse(sessionAttrs) {
    var deferred = q.defer();
    var rentersInfoSpeechOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        var confirmProfileInfo = mapRentersConfirmProfile(sessionAttrs);
        if (sessionAttrs && !sessionAttrs.creditHit && !sessionAttrs.isRenterReOrderData) {
            postConfirmProfile(confirmProfileInfo, sessionAttrs.transactionToken)
                .then(function (result) {
                    rentersInfoSpeechOutput.text = "Great! Now is the residence you are wanting to insure your primary residence? ";
                    deferred.resolve(rentersInfoSpeechOutput);
                }).catch(function (error) {
                    rentersInfoSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
                    deferred.resolve(rentersInfoSpeechOutput);
                });
        }
        else {
            rentersInfoSpeechOutput.text = "Now is the residence you are wanting to insure your primary residence? ";
            deferred.resolve(rentersInfoSpeechOutput);
        }
    }
    return deferred.promise;
}

function getRentersQuoteResponse(sessionAttrs) {
    var deferred = q.defer();
    var quoteSpeechOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        getResidenceInfo(sessionAttrs.transactionToken)
            .then(function (response) {
                var residenceInfoObject = response;
                residenceInfoObject = mapResidenceInfo(sessionAttrs, JSON.parse(residenceInfoObject));
                return postResidenceInfo(residenceInfoObject, sessionAttrs.transactionToken);
            }).then(function (response) {
                if (response) {
                    sessionAttrs.isValidRenterCustomer = response.isValidRenterCustomer;
                    quoteSpeechOutput.text = "Thank you for the inputs, Your details has been validated. would you like to get quote details? ";
                }
                deferred.resolve(quoteSpeechOutput);
            }).catch(function (error) {
                quoteSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
                deferred.resolve(quoteSpeechOutput);
            });
    }
    return deferred.promise;
}

function saveAndExitResponse(sessionAttrs) {
    var deferred = q.defer();
    var quoteSpeechOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        saveAndExplicit(sessionAttrs.emailAddress, sessionAttrs.transactionToken)
            .then(function (response) {
                return saveAndExit(sessionAttrs.emailAddress, sessionAttrs.transactionToken);
            }).then(function (response) {
                if (!response) {
                    quoteSpeechOutput.text = "Thank you for the inputs, Your details has been saved. would you like to complete the transaction ? ";
                }
                deferred.resolve(quoteSpeechOutput);
            }).catch(function (error) {
                quoteSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
                deferred.resolve(quoteSpeechOutput);
            });
    }
    return deferred.promise;
}

function quoteLandingURLResponse(sessionAttrs) {
    var deferred = q.defer();
    var quoteURLSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zip = sessionAttrs.zip;
    sessionInfo.newzip = sessionAttrs.newzip;
    startAutoAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return quoteRepository(sessionAttrs, sessionInfo.sessionId);
        }).then(function (response) {
            if (response && response.quoteList) {
                sessionAttrs.retrieveURL = response.quoteList[0].retrieveUrl;
                quoteURLSpeechOutput.sessionAttrs = sessionAttrs;
                quoteURLSpeechOutput.text = "Perfect. Here is the URL to connect to live quote page: ";
                quoteURLSpeechOutput.text = quoteURLSpeechOutput.text + sessionAttrs.retrieveURL;
                quoteURLSpeechOutput.text = quoteURLSpeechOutput.text + "&sessionID=" + sessionAttrs.transactionToken.sessionID + "&product=RENTERS&isAI=TRUE";
            }
            else {
                quoteURLSpeechOutput.text = "Could not save your quote. Please contact near by agent for more details";
            }
            deferred.resolve(quoteURLSpeechOutput);
        }).catch(function (error) {
            quoteURLSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
            deferred.resolve(quoteURLSpeechOutput);
        });

    return deferred.promise;
}

function quoteResponse(sessionAttrs) {
    var deferred = q.defer();
    var quoteSpeechOutput = new Speech();
    if (sessionAttrs.transactionToken) {
        orderQuote(sessionAttrs.transactionToken)
            .then(function (quoteResp) {
                if (quoteResp && quoteResp.quoteList) {
                    quoteSpeechOutput.text = "Okay, thanks for all the info! Here's your renters quote.  ";
                    quoteSpeechOutput.text = quoteSpeechOutput.text + "Total payable amount $" + quoteResp.quoteList[0].paymentInfo.paymentAmount;
                    quoteSpeechOutput.text = quoteSpeechOutput.text + ".Per month would cost $" + quoteResp.quoteList[0].paymentInfo.monthlyPaymentAmount;
                    quoteSpeechOutput.text = quoteSpeechOutput.text + " .Your down payment would be $" + quoteResp.quoteList[0].paymentInfo.inDownPaymentAmount;
                    quoteSpeechOutput.text = quoteSpeechOutput.text + " .Someone will be in touch with you shortly, but in the meantime would you like to continue from quote?";
                }
                if (quoteResp && quoteResp.stopPageType === "DangerousDogSelected") {
                    quoteSpeechOutput.text = "Okay, You have selected a dangerous dog.  ";
                }
                if (quoteResp && quoteResp.stopPageType === "RejectedUser") {
                    quoteSpeechOutput.text = "Okay, With these inputs provided, We can't proceed further. Please contact Allstate Agent. ";
                }
                deferred.resolve(quoteSpeechOutput);
            }).catch(function (error) {
                quoteSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
                deferred.resolve(quoteSpeechOutput);
            });
    }
    return deferred.promise;
}

function getCustomerSaveInfo(sessionAttrs, sessionInfo) {
    var customerData = {};
    customerData.firstName = sessionAttrs.firstName;
    customerData.lastName = sessionAttrs.lastName;
    customerData.suffix = '';
    customerData.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.dob, "MMDDYYYY");
    customerData.mailingAddress = sessionAttrs.addrLine1;
    customerData.city = sessionAttrs.city;
    customerData.state = sessionAttrs.state;
    customerData.zipCode = sessionAttrs.zip;
    customerData.aWSFlag = "N";
    customerData.affinity = {};
    customerData.insuredAddress = {};
    customerData.insuredAddress.addressLine1 = '';
    customerData.insuredAddress.city = '';
    customerData.insuredAddress.state = '';
    customerData.insuredAddress.zipCode = '';
    if (!sessionAttrs.IsInsuredAddrSame) {
        if (customerData.insuredAddress) {
            customerData.insuredAddress.addressLine1 = sessionAttrs.newaddrLine1;
            customerData.insuredAddress.aptOrUnit = '';
            customerData.insuredAddress.city = sessionAttrs.newcity;
            customerData.insuredAddress.state = sessionAttrs.newstate;
            customerData.insuredAddress.zipCode = sessionAttrs.newzip;
        }
    }
    customerData.isInsuredAddressSameAsCurrent = sessionAttrs.IsInsuredAddrSame;
    return customerData;
}

function mapRentersInfo(sessionAttrs) {
    var rentersInfoData = null;
    rentersInfoData = initializeRentersInfoRequest();
    if (rentersInfoData) {
        rentersInfoData = mapResident(rentersInfoData, sessionAttrs);
        rentersInfoData.insuredAddress = mapAddress(rentersInfoData.insuredAddress, sessionAttrs);
        rentersInfoData.currentAddress = mapAddress(rentersInfoData.currentAddress, sessionAttrs);
        if (!sessionAttrs.livedmorethantwo) {
            rentersInfoData.previousAddress = mapAddress(rentersInfoData.previousAddress, sessionAttrs);
        }
        rentersInfoData = mapContactInfo(rentersInfoData, sessionAttrs);
        rentersInfoData.businessOutOfResidence = null;
        if (sessionAttrs.transactionToken.state === "KS") {
            rentersInfoData.liveAtCurAddressMoreThanTwoYears = null;
        }
        else {
            rentersInfoData.liveAtCurAddressMoreThanTwoYears = sessionAttrs.livedmorethantwo;
        }

        rentersInfoData.isSpouseAdded = false;
        rentersInfoData.isAgreeForTelemarketingCalls = true; //add question to user

    }
    return rentersInfoData;
}

function mapRentersConfirmProfile(sessionAttrs) {
    var confProfileData = {};
    confProfileData.profiles = getProfiles(sessionAttrs);
    confProfileData.addresses = getAddresses(sessionAttrs);
    return confProfileData;
}

function getProfiles(sessionAttrs) {
    var profiles = [];
    var profile = {};
    profile.driverGUID = null;
    profile.driverNumber = null;
    profile.relationshipToPrimaryDriver = "SA";
    profile.firstName = sessionAttrs.firstName;
    profile.middleName = null;
    profile.lastName = sessionAttrs.lastName;
    profile.suffix = null;
    profile.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.dob, "MMDDYYYY");;
    profile.id = "dvEditPrimary";
    profiles.push(profile);
    if (sessionAttrs.spouseAdded) {
        profile.driverGUID = null;
        profile.driverNumber = null;
        profile.relationshipToPrimaryDriver = null;
        profile.firstName = sessionAttrs.spousefirstName;
        profile.middleName = null;
        profile.lastName = sessionAttrs.spouselastName;
        profile.suffix = null;
        profile.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.spouseDob, "MMDDYYYY");;
        profile.id = "dvEditSpouse";
        profiles.push(profile);
    }
    return profiles;
}

function getAddresses(sessionAttrs) {
    var addresses = [];
    var addrs = {};
    addrs.address = {};
    addrs.address.addressLine1 = sessionAttrs.addrLine1;
    addrs.address.aptOrUnit = null;
    addrs.address.city = sessionAttrs.city;
    addrs.address.state = sessionAttrs.transactionToken.state;
    addrs.address.zipCode = sessionAttrs.zip;
    addrs.address.stateReadOnly = true;
    addrs.address.zipCodeReadOnly = true;
    addrs.invalidZipCode = false;
    addrs.isPreviousAddress = false;
    addrs.headerText = "Current Address";
    addrs.id = "dvEditAddress";
    addrs.editHeader = "Edit Primary Address";
    addresses.push(addrs);
    return addresses;
}

function mapResident(rentersInfoData, sessionAttrs) {
    if (rentersInfoData.primaryRenter) {
        rentersInfoData.primaryRenter.firstName = sessionAttrs.firstName;
        rentersInfoData.primaryRenter.lastName = sessionAttrs.lastName;
        rentersInfoData.primaryRenter.gender = sessionAttrs.gender;
        rentersInfoData.primaryRenter.employmentStatus = sessionAttrs.employmentStatus;
        if (sessionAttrs.state === "CA" || sessionAttrs.state === "CT" || sessionAttrs.state === "MD" || sessionAttrs.state === "OR" || sessionAttrs.state === "PA" || sessionAttrs.state === "NY") {
            rentersInfoData.primaryRenter.maritalStatus = sessionAttrs.maritalstatus;
        }

        rentersInfoData.primaryRenter.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.dob, "MMDDYYYY");
        if (sessionAttrs.dob) {
            var birthdate = new Date(sessionAttrs.dob);
            var cur = new Date();
            var diff = cur - birthdate;
            var age = Math.floor(diff / 31557600000);
            rentersInfoData.primaryRenter.age = age;
        }

    }
    if (sessionAttrs.spouseAdded) {
        rentersInfoData.spouse.firstName = sessionAttrs.spousefirstName;
        rentersInfoData.spouse.lastName = sessionAttrs.spouselastName;
        rentersInfoData.spouse.gender = sessionAttrs.spouseGender;
        rentersInfoData.spouse.employmentStatus = sessionAttrs.spouseEmpStatus;
        rentersInfoData.spouse.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.spouseDob, "MMDDYYYY");
        if (sessionAttrs.spouseDob) {
            var birthdate = new Date(sessionAttrs.spouseDob);
            var cur = new Date();
            var diff = cur - birthdate;
            var age = Math.floor(diff / 31557600000);
            rentersInfoData.spouse.age = age;
        }

    }
    return rentersInfoData;
}

function mapAddress(address, sessionAttrs) {
    if (address.addressType === "Previous") {
        address.addressLine1 = sessionAttrs.prevaddrLine1;
        address.city = sessionAttrs.prevcity;
        address.state = sessionAttrs.prevstate;
        address.zipCode = sessionAttrs.prevzipcode;
    }
    else {
        address.addressLine1 = sessionAttrs.addrLine1;
        address.city = sessionAttrs.city;
        address.state = sessionAttrs.transactionToken.state;
        address.zipCode = sessionAttrs.zip;
    }
    return address;
}

function mapContactInfo(rentersInfoData, sessionAttrs) {
    if (rentersInfoData.contactInformation) {
        rentersInfoData.contactInformation.phoneNumber = sessionAttrs.phoneNumber;
        rentersInfoData.contactInformation.emailAddress = sessionAttrs.emailAddress;
    }
    return rentersInfoData;
}

function mapResidenceInfo(sessionAttrs, residenceInfo) {
    var residenceInfoData = null;
    if (residenceInfo && residenceInfo.residenceDetails) {
        residenceInfo.residenceDetails.primaryResidence = sessionAttrs.primaryResidence;
        residenceInfo.residenceDetails.locatedInDormOrMilitaryBarracks = sessionAttrs.locatedInDormOrMilitaryBarracks;
        residenceInfo.residenceDetails.residenceBuildingType = sessionAttrs.residenceBuildingType;
        residenceInfo.residenceDetails.unitsInBuilding = sessionAttrs.unitsInBuilding
        residenceInfo.residenceDetails.businessoutofresidence = sessionAttrs.businessoutofresidence
        if (sessionAttrs.personalItemsValue == "15000" || sessionAttrs.personalItemsValue == "25000" || sessionAttrs.personalItemsValue == "35000" || sessionAttrs.personalItemsValue == "45000") {
            residenceInfo.residenceDetails.personalItems = sessionAttrs.personalItemsValue;
            residenceInfo.residenceDetails.personalItemsValue = '';
        }
        else {
            residenceInfo.residenceDetails.personalItems = "Other";
            residenceInfo.residenceDetails.personalItemsValue = sessionAttrs.personalItemsValue;
        }
        if (sessionAttrs.transactionToken.state === "CA") {
            residenceInfo.residenceDetails.unOccupiedResidence = sessionAttrs.unOccupiedResidence;
        }
        if (sessionAttrs.transactionToken.state === "CA") {
            residenceInfo.residenceDetails.propertyInsuranceClaims = sessionAttrs.propertyInsuranceClaims;
        }
        if (sessionAttrs.transactionToken.state === "DE") {
            residenceInfo.residenceDetails.isResidenceWithinThousandFtFromCoast = sessionAttrs.isResidenceWithinThousandFtFromCoast;
        }
        if (sessionAttrs.transactionToken.state === "NJ" || sessionAttrs.transactionToken.state === "TX") {
            residenceInfo.residenceDetails.constructionType = sessionAttrs.constructionType;
        }
        if (sessionAttrs.propertyInsuranceClaims === "TRUE") {
            var lostdate = DateUtil.getFormattedDate(sessionAttrs.claimLostDate, "MM-DD-YYYY");
            var splitDate = "01-01-0001";
            if (lostdate) {
                var splitDate = lostdate.toString().split("-");
            }
            residenceInfo.residenceDetails.claims = [];
            residenceInfo.residenceDetails.claims[0] = {};
            residenceInfo.residenceDetails.claims[0].id = "1";
            residenceInfo.residenceDetails.claims[0].lossdate = {};
            residenceInfo.residenceDetails.claims[0].lossdate.day = splitDate[2];
            residenceInfo.residenceDetails.claims[0].lossdate.month = splitDate[1];
            residenceInfo.residenceDetails.claims[0].lossdate.year = splitDate[0];
            residenceInfo.residenceDetails.claims[0].lossType = sessionAttrs.claimLostType;
            residenceInfo.residenceDetails.claims[0].lossTypeDescription = sessionAttrs.claimLostDescription;
            if (sessionAttrs.claimLostLocationDisplay) {
                residenceInfo.residenceDetails.claims[0].lossLocation = sessionAttrs.claimLostLocation;
                residenceInfo.residenceDetails.claims[0].lossLocationDisplay = sessionAttrs.claimLostLocationDisplay;
            }
        }
        if (sessionAttrs.isDogAdded === "true") {
            residenceInfo.residenceDetails.dogList = [];
            residenceInfo.residenceDetails.dogList[0] = {};
            residenceInfo.residenceDetails.dogList[0].dogId = "1"
            residenceInfo.residenceDetails.dogList[0].dogBreed = sessionAttrs.dogbreeds;
            residenceInfo.residenceDetails.dogList[0].dogCountLable = "Dog #1";
            residenceInfo.residenceDetails.noOfDogs = "1";
        }

    }
    return residenceInfo;
}

function initializeRentersInfoRequest() {
    var rentersInfo = {};
    rentersInfo.primaryRenter = new Resident();
    rentersInfo.spouse = new Resident();
    rentersInfo.insuredAddress = new Address();
    rentersInfo.insuredAddress.addressType = "Current";
    rentersInfo.currentAddress = new Address();
    rentersInfo.currentAddress.addressType = "Current";
    rentersInfo.previousAddress = new Address();
    rentersInfo.previousAddress.addressType = "Previous";
    rentersInfo.contactInformation = new ContactInfo();
    rentersInfo.businessOutOfResidence = null;
    rentersInfo.liveAtCurAddressMoreThanTwoYears = "true";
    rentersInfo.isSpouseAdded = false;
    rentersInfo.isAgreeForTelemarketingCalls = true;
    rentersInfo.isCurrentAddressSameAsInsuredAddress = true;
    rentersInfo.isRenterOrderData = false;
    rentersInfo.isAddressStandardized = false;
    rentersInfo.isdpAgeCheck = false;
    rentersInfo.messageType = null;
    rentersInfo.errors = null;
    rentersInfo.stopPageType = "None";
    rentersInfo.isSuccess = true;
    return rentersInfo;
}
//#endregion


//#region AOS API CALLS
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

function startAutoAOSSession(zip) {
    var deferred = q.defer();
    request({ method: 'GET', uri: URL_AUTO_SESSIONID }, function (error, response, body) {
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

function rentersSaveCustomer(customerSaveInfo, sessionId) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_SAVECUSTOMER,
            json: customerSaveInfo,
            headers: { "X-TID": sessionId, "x-pd": "RENTERS" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function saveRentersInfo(rentersInfo, transactionToken) {
    console.log(rentersInfo);
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_RENTERSINFO,
            "content-type": "application/json",
            json: rentersInfo,
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/occupants/primary/" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function postConfirmProfile(confirmInfo, transactionToken) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_CONFIRMPROFILE,
            "content-type": "application/json",
            json: confirmInfo,
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/confirm-profile" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function getResidenceInfo(transactionToken) {
    var deferred = q.defer();
    request(
        {
            method: "GET",
            uri: URL_RENTERS_RESIDENCEINFO,
            "content-type": "application/json",
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/residence-info/" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function postResidenceInfo(residenceInfoObject, transactionToken) {
    var deferred = q.defer();
    console.log(residenceInfoObject);
    request(
        {
            method: "POST",
            uri: URL_RENTERS_RESIDENCEINFO,
            "content-type": "application/json",
            json: residenceInfoObject,
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/residence-info/" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                console.log(responseJson);
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function orderQuote(transactionToken) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_ORDERQUOTE,
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/residence-info/" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = JSON.parse(response.body);
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function getSavedQuote(sessionInfo) {
    var deferred = q.defer();
    if (sessionInfo.dob) {
        var dob = DateUtil.getFormattedDate(sessionInfo.dob, "MMDDYYYY");
        sessionInfo.dob = dob;
    }
    request(
        {
            method: 'POST',
            uri: URL_RETRIEVEQUOTE,
            "content-type": "application/json",
            headers: { "X-pd": "AUTO", "X-TID": sessionInfo.sessionId },
            json: true,
            body: { "lastName": sessionInfo.lastname, "dateOfBirth": sessionInfo.dob, "emailID": sessionInfo.email, "zipCode": sessionInfo.zipcode }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var quotes = ProcessQuoteResponse(response.body);
                deferred.resolve(quotes);
            }
        });

    return deferred.promise;
}

function saveAndExplicit(emailid, transactionToken) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_SAVEEXPLICIT,
            "content-type": "application/json",
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/save-quote" },
            json: true,
            body: { "email": emailid, "moduleName": "RentersQuote", "quoteType": "RENTER_SINGLE" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function saveAndExit(emailid, transactionToken) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_SAVEANDEXIT,
            "content-type": "application/json",
            headers: { "X-TID": transactionToken.sessionID, "X-PD": "RENTERS", "X-ZP": transactionToken.zipCode, "X-CN": transactionToken.controlNumber, "X-ST": transactionToken.state, "X-VID": "/save-quote" },
            json: true,
            body: { "email": emailid, "moduleName": "RentersQuote", "quoteType": "RENTER_SINGLE" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function quoteRepository(sessionAttrs, sessionID) {
    var deferred = q.defer();
    var dob;
    if (sessionAttrs && sessionAttrs.dob) {
        dob = DateUtil.getFormattedDate(sessionAttrs.dob, "MMDDYYYY");
    }
    request(
        {
            method: "POST",
            uri: URL_RENTERS_QUOTEREPOSITORY,
            "content-type": "application/json",
            headers: { "X-TID": sessionID, "X-PD": "AUTO", "X-VID": "/" },
            json: true,
            body: { "dateOfBirth": dob, "emailID": sessionAttrs.emailAddress, "lastName": sessionAttrs.lastName, "zipCode": sessionAttrs.zip }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

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
//#endregion

//#region RESPONSE MAPPERS
function ProcessQuoteResponse(retrieveQuoteServResp) {
    var quotes = [];
    if (retrieveQuoteServResp && retrieveQuoteServResp.quoteList && retrieveQuoteServResp.quoteList.length > 0) {
        for (var index = 0; index < retrieveQuoteServResp.quoteList.length; index++) {
            var currSavedQuote = retrieveQuoteServResp.quoteList[index];
            var savedQuote = new RetrieveQuote();
            if (currSavedQuote.policyNumber) {
                savedQuote.policyNumber = currSavedQuote.policyNumber;
                savedQuote.controlNumber = currSavedQuote.controlNumber;
                savedQuote.product = currSavedQuote.product;
                savedQuote.startDate = currSavedQuote.startDate;
                if (currSavedQuote && currSavedQuote.agentBusinessCard) {
                    savedQuote.agentName = currSavedQuote.agentBusinessCard.name;
                    savedQuote.agentPhoneNumber = currSavedQuote.agentBusinessCard.phoneNumber;
                    savedQuote.agentEmailAddress = currSavedQuote.agentBusinessCard.emailAddress;
                }
            }

            quotes.push(savedQuote);
        }
    }

    return quotes;
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
//#endregion


module.exports = new AOS();
