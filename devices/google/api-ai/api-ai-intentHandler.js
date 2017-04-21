

var aos = require('./../../../apps/aos/aos.js');
var q = require('q');

var ApiAiIntentHandler = function () { };

ApiAiIntentHandler.prototype.processResponse = function (body) {
    var deferred = q.defer();
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        intentHandlers(body)
            .then(function (responseInfo) {
                deferred.resolve(responseInfo);
            });
    }
    return deferred.promise;
}

function intentHandlers(body) {
    var deferred = q.defer();
    var intentName = body.result.metadata.intentName;
    var responseBody = {};
    switch (intentName.toUpperCase()) {
        case "WELCOME":
            handleWelcomeIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "HELP":
            handleHelpIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "MENU":
            handleMenuIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-QUOTESTART":
            handleAosRentersQuoteStart(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-QUOTESTART-NO":
            handleAosRentersQuoteStartNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-INSURANCE":
            handlerAOSRentersInsuranceStart(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-NAME":
        case "AOS-RENTERS-LASTNAME":
            handlerAOSRentersInsuranceName(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-DOB":
            handlerAOSRentersInsuranceDOB(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURADDR":
            handlerAOSRentersInsuranceAddr(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURADDR-LOC":
            handlerAOSRentersInsuranceAddrCurLoc(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURCITY-ZIP":
            handlerAOSRentersInsuranceCityZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "AOS-RENTERS-PHONENUMBER":
            handlerAOSRentersPhoneNumber(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-PHONENUMBER-AUTHORIZE-NO":
        case "AOS-RENTERS-PHONENUMBER-AUTHORIZE-YES":
            handlerAOSRentersPhoneNumberAuthorize(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-EMAILADDRESS":
            handlerAOSRentersEmailAddress(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-INSADDRSAME-YES":
            handlerAOSRentersInsuranceInsuredAddrSame(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "AOS-RENTERS-INSADDRSAME-NO":
            handlerAOSRentersInsuranceInsuredAddrDiff(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ADDRSTOINSURE":
            handlerAOSRentersNewCityZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-DIFFADDRS":
            handlerAOSRentersDiffAddress(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CREDITHISTORY-AUTHORIZE-YES":
            handlerAOSRentersCrediHistoryAuthorize(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CREDITHISTORY-AUTHORIZE-NO":
            handlerAOSRentersCrediHistoryAuthorize(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-EMPSTATUS":
            handlerAOSRentersEmpStatus(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-GENDER":
            handlerAOSRentersGender(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-MARITALSTATUS":
            handlerAOSRentersMaritalStatus(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-LIVEDMORETHANTWOYRS-YES":
            handlerAOSRentersLivedMoreThanTwoYrsYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-RESIDENCEPROCEED":
            handlerAOSRentersResidence(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-LIVEDMORETHANTWOYRS-NO":
            handlerAOSRentersLivedMoreThanTwoYrsNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-PREVZIPANDCITY":
            handlerAOSRentersPrevCityZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-PREVSTREETADDRESS":
            handlerAOSRentersPrevStreetAddrs(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "AOS-RENTERS-ISPRIMARYRESIDENCE-YES":
            handlerAOSRentersIsPrimaryResYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISPRIMARYRESIDENCE-NO":
            handlerAOSRentersIsPrimaryResNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-RESIDENCELOCATION-YES":
            handlerAOSRentersResidenceLocYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-RESIDENCELOCATION-NO":
            handlerAOSRentersResidenceLocNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISBUSINESSOPERATED-YES":
            handlerAOSRentersIsBusinessOperatedYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISBUSINESSOPERATED-NO":
            handlerAOSRentersIsBusinessOperatedNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-RESIDENCETYPE":
            handlerAOSRentersResidenceType(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-RESIDENCEHOMETYPE":
            handlerAOSRentersResidenceHomeType(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISFIVEORMOREUNITS-YES":
            handlerAOSRentersIsFiveOrMoreUnitsYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISFIVEORMOREUNITS-NO":
            handlerAOSRentersIsFiveOrMoreUnitsNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONONE":
            handlerAOSRentersStSpecQuestionOne(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONTWO":
            handlerAOSRentersStSpecQuestionTwo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONTHREE":
            handlerAOSRentersStSpecQuestionThree(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONFOUR":
            handlerAOSRentersStSpecQuestionFour(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONFIVE":
            handlerAOSRentersStSpecQuestionFive(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONSIX":
            handlerAOSRentersStSpecQuestionSix(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONSEVEN":
            handlerAOSRentersStSpecQuestionSeven(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-STSPECQUESTIONEIGHT":
            handlerAOSRentersStSpecQuestionEight(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-PERSONALITEMSVALUE":
            handlerAOSRentersPersonalItemsValue(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-VALIDATERENTERCUSTOMER":
            handlerAOSRenterValidCustomer(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-SAVEQUOTE-YES":
            handlerAOSRenterSaveQuoteYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-SAVEQUOTE-NO":
            handlerAOSRenterSaveQuoteNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-GENERATEQUOTEURL":
            handlerAOSRenterGenerateURL(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-ISSPOUSEADDED-YES":
            handlerAOSRentersIsSpouseYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "AOS-RENTERS-ISSPOUSEADDED-NO":
            handlerAOSRentersIsSpouseNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });

            break;

        case "AOS-RENTERS-SPOUSE-NAME":
        case "AOS-RENTERS-SPOUSE-LASTNAME":
            handlerAOSRentersSpouseInsuranceName(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-SPOUSE-DOB":
            handlerAOSRentersSpouseInsuranceDOB(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "AOS-RENTERS-SPOUSE-EMPSTATUS":
            handlerAOSRentersSpouseEmpStatus(body, deferred)
                .then(function (responseInfo) {
                    //employed, self employed, student, retired, unemployed, homemaker,military
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-SPOUSE-GENDER":
            handlerAOSRentersSpouseGender(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "GET-LOCATION-PERMISSION":
            var permissionGranted = isPermissionGranted(body);
            handleGetLocationPermission(body, deferred, permissionGranted)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;


        case "HELPINTENT":
        default:
            var message = "Type help to get help and menu for options!";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
    }
    return deferred.promise;
};

//#region permission
function isPermissionGranted(body) {
    var permissionStatus = body.originalRequest.data.inputs[0].arguments[0].text_value;
    if (permissionStatus === "true") {
        return true;
    } else {
        return false;
    }


}
function handleGetLocationPermission(body, deferred, pemissionGranted) {
    var agentFindSpeechResp = {};
    if (pemissionGranted) {
        var permissionSeekingIntent = getPermissionSeekingIntent(body);
        if (permissionSeekingIntent) {
            var intentName = permissionSeekingIntent.parameters.IntentName;
            var deviceZipCode = getDeviceZipcode(body);
            processPermissionSeekingIntent(body, deferred, deviceZipCode, intentName)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
        }
    } else {
        agentFindSpeechResp.speech = "Request aborted , still you can find agent in manual way";
        agentFindSpeechResp.displayText = "Request aborted , still you can find agent in manual way";
        deferred.resolve(agentFindSpeechResp);
    }
    return deferred.promise;
}

function processPermissionSeekingIntent(body, deferred, deviceZipCode, intentName) {
    switch (intentName.toUpperCase()) {
        case "AGENT-FIND-BYCURRENTLOC":
            processAgentFindByCurrentLoc(body, deferred, deviceZipCode)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        default:
            break;


    }
    return deferred.promise;
}

function getPermissionSeekingIntent(body) {
    var incomingContexts = body.result.contexts;
    var permissionSeekingIntent = incomingContexts.find(function (contextObj) {
        if (contextObj.name === "PermissionSeekingIntent") {
            return contextObj;
        }
    });
    return permissionSeekingIntent;
}

function getDeviceZipcode(body) {
    if (body.originalRequest.data.device) {
        return body.originalRequest.data.device.location.zip_code;
    }
}
//#endregion

//#region Renters insurance
function handlerAOSRentersInsuranceStart(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceStart(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceName(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceName(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceDOB(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceDOB(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceAddr(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceAddr(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceCityZip(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceCityZip(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceInsuredAddrSame(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceInsuredAddrSame(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersPhoneNumber(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersPhoneNumber(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}
function handlerAOSRentersPhoneNumberAuthorize(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersPhoneNumberAuthorize(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersEmailAddress(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersEmailAddress(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceInsuredAddrDiff(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersInsuranceInsuredAddrDiff(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersNewCityZip(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersNewCityZip(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersDiffAddress(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersDiffAddress(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersCrediHistoryAuthorize(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerCreditHistoryAuthorize(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersEmpStatus(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersEmpStatus(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersGender(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersGender(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersMaritalStatus(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersMeritalStatus(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersLivedMoreThanTwoYrsYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersLivedMoreThanTwoYrsYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersResidence(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersResidence(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersLivedMoreThanTwoYrsNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersLivedMoreThanTwoYrsNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersPrevCityZip(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersPrevCityZip(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersPrevStreetAddrs(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersPrevStreetAddrs(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsPrimaryResYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersIsPrimaryResYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsPrimaryResNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersIsPrimaryResNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersResidenceLocYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersResidenceLocYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersResidenceLocNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersResidenceLocNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsBusinessOperatedYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersIsBusinessOperatedYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsBusinessOperatedNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersIsBusinessOperatedNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersResidenceType(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersResidenceType(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersResidenceHomeType(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersResidenceHomeType(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsFiveOrMoreUnitsYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersIsFiveOrMoreUnitsYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsFiveOrMoreUnitsNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersIsFiveOrMoreUnitsNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionOne(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionOne(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionTwo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionTwo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionThree(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionThree(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionFour(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionFour(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionFive(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionFive(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionSix(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionSix(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}
function handlerAOSRentersStSpecQuestionSeven(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionSeven(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersStSpecQuestionEight(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersStSpecQuestionEight(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersPersonalItemsValue(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRentersPersonalItemsValue(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRenterValidCustomer(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRenterValidCustomer(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;            
            rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRenterSaveQuoteYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRenterSaveQuoteYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRenterGenerateURL(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRenterGenerateURL(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;            
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRenterSaveQuoteNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerRenterSaveQuoteNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceAddrCurLoc(body, deferred) {
    var rentersSpeechResp = {};
    rentersSpeechResp.speech = "To get your current location";
    rentersSpeechResp.displayText = "To get your current location";
    if (!rentersSpeechResp.contextOut) {
        rentersSpeechResp.contextOut = [];
    }
    rentersSpeechResp.contextOut.push({ "name": "PermissionSeekingIntent", "parameters": { "IntentName": "AOS-RENTERS-CURADDR-LOC" } });
    deferred.resolve(rentersSpeechResp);
    return deferred.promise;
}

function handlerAOSRentersIsSpouseYes(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerAOSRentersIsSpouseYes(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersSpouseInsuranceName(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersSpouseInsuranceName(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersSpouseInsuranceDOB(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersSpouseInsuranceDOB(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersSpouseEmpStatus(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersSpouseEmpStatus(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersSpouseGender(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);
    aos.handlerRentersSpouseGender(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersIsSpouseNo(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handlerAOSRentersIsSpouseNo(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            //rentersWelcomeSpeechResp.contextOut = [{ "name": "renters", "parameters": sessionAttrs }];
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function getAOSRentersSessionAttributes(contextInfo) {
    var sessionAttrs = {
        "firstName": undefined,
        "lastName": undefined,
        "middleName": undefined,
        "dob": undefined,
        "addrLine1": undefined,
        "city": undefined,
        "zip": undefined,
        "state": undefined,
        "IsInsuredAddrSame": undefined,
        "phoneNumber": undefined,
        "isAuthorize": undefined,
        "emailAddress": undefined,
        "businessoutofresidence": undefined,
        "employmentStatus": undefined,
        "unitsInBuilding": undefined,
        "locatedInDormOrMilitaryBarracks": undefined,
        "residenceBuildingType": undefined,
        "residenceBuildingHomeType" : undefined,
        "primaryResidence": undefined,
        "isCurrentAddressSameAsInsuredAddress": undefined,
        "gender": undefined,
        "maritalstatus": undefined,
        "livedmorethantwo": undefined,
        "transactionToken": {},
        "agentDetails": {},
        "isSpouseAdded": undefined,
        "spousefirstName": undefined,
        "spouselastName": undefined,
        "spousemiddleName": undefined,
        "spouseDob": undefined,
        "spouseEmpStatus": undefined,
        "spouseGender": undefined,
        "newcity": undefined,
        "newzip": undefined,
        "newaddrLine1": undefined,
        "prevzipcode": undefined,
        "prevstate": undefined,
        "prevcity": undefined,
        "prevaddrLine1": undefined,
        "isCreditAuthorized": undefined,
        "isgenerateurl": undefined,
        "stateSpecQOneAns": undefined,
        "stateSpecQTwoAns": undefined,
        "stateSpecQThreeAns": undefined,
        "stateSpecQFourAns": undefined,
        "stateSpecQFiveAns": undefined,
        "stateSpecQSixAns": undefined,
        "stateSpecQSevenAns": undefined,
        "stateSpecQEightAns": undefined,
        "isResidence2600ftFromCoastVisible": undefined,
        "propertyInsuranceClaims": undefined,
        "isDogAdded": undefined,
        "isError" :undefined,
        "claimLostDate": undefined,
        "claimLostType": undefined,
        "claimLostDescription": undefined,
        "unOccupiedResidence": undefined,
        "losstype": undefined,
        "lossdate": undefined,
        "LostLocationDisplay": undefined,
        "dogbreeds": undefined,
        "isResidenceWithinThousandFtFromCoast": undefined,
        "claimLostLocationDisplay": undefined,
        "claimLostLocation": undefined,
        "withInCityLimit": undefined,
        "constructionType" : undefined,
        "additionalResidents" : undefined
    };

    if (contextInfo) {

        var givenname = contextInfo.parameters["given-name.original"];
        if (givenname && givenname.length > 0) {
            givenname = contextInfo.parameters["given-name"];
            var arr = givenname.split(" ");
            if (arr.length <= 2) {
                sessionAttrs.firstName = arr[0];
                sessionAttrs.lastName = arr[1];
            }
            else {
                sessionAttrs.firstName = arr[0];
                sessionAttrs.middleName = arr[1];
                sessionAttrs.lastName = arr[2];
            }
        }
        var lastName = contextInfo.parameters["last-name.original"];
        if (lastName && lastName.trim().length > 0) {
            sessionAttrs.lastName = contextInfo.parameters["last-name"];
        }
        var dob = contextInfo.parameters["dob.original"];
        if (dob && dob.trim().length > 0) {
            sessionAttrs.dob = contextInfo.parameters["dob"];
        }
        var addrLine1 = contextInfo.parameters["address.original"];
        if (addrLine1 && addrLine1.trim().length > 0) {
            sessionAttrs.addrLine1 = contextInfo.parameters["address"];
        }
        var city = contextInfo.parameters["geo-city.original"];
        if (city && city.trim().length > 0) {
            sessionAttrs.city = contextInfo.parameters["geo-city"];
        }
        var zip = contextInfo.parameters["zip.original"];
        if (zip && zip.trim().length > 0) {
            sessionAttrs.zip = contextInfo.parameters["zip"];
            if (sessionAttrs.zip.length === 4) {
                sessionAttrs.zip = "0" + sessionAttrs.zip;
            }
        }
        if (newaddrLine1 && newaddrLine1.trim().length > 0) {
            sessionAttrs.newaddrLine1 = contextInfo.parameters["newaddress"];
        }
        var newaddrLine1 = contextInfo.parameters["newaddress.original"];
        if (newaddrLine1 && newaddrLine1.trim().length > 0) {
            sessionAttrs.newaddrLine1 = contextInfo.parameters["newaddress"];
        }
        var newcity = contextInfo.parameters["newgeo-city.original"];
        if (newcity && newcity.trim().length > 0) {
            sessionAttrs.newcity = contextInfo.parameters["newgeo-city"];
        }
        var newzip = contextInfo.parameters["newzip.original"];
        if (newzip && newzip.trim().length > 0) {
            sessionAttrs.newzip = contextInfo.parameters["newzip"];
            if (sessionAttrs.newzip.length === 4) {
                sessionAttrs.newzip = "0" + sessionAttrs.newzip;
            }
        }
        var phoneNumber = contextInfo.parameters["phone-number.original"];
        if (phoneNumber && phoneNumber.trim().length > 0) {
            sessionAttrs.phoneNumber = contextInfo.parameters["phone-number"];
        }
        var isAuthorize = contextInfo.parameters["isAuthorize.original"];
        if (isAuthorize && isAuthorize.trim().length > 0) {
            sessionAttrs.isAuthorize = contextInfo.parameters["isAuthorize"];
        }
        var emailAddress = contextInfo.parameters["email.original"];
        if (emailAddress && emailAddress.trim().length > 0) {
            sessionAttrs.emailAddress = contextInfo.parameters["email"];
        }
        var businessoutofresidence = contextInfo.parameters["isBusinessOperated.original"];
        if (businessoutofresidence && businessoutofresidence.trim().length > 0) {
            sessionAttrs.businessoutofresidence = contextInfo.parameters["isBusinessOperated"];
        }
        var employmentStatus = contextInfo.parameters["aos-renters-employmentType.original"];
        if (employmentStatus && employmentStatus.trim().length > 0) {
            sessionAttrs.employmentStatus = contextInfo.parameters["aos-renters-employmentType"];
        }
        var unitsInBuilding = contextInfo.parameters["isfiveormoreunits.original"];
        if (unitsInBuilding && unitsInBuilding.trim().length > 0) {
            sessionAttrs.unitsInBuilding = contextInfo.parameters["isfiveormoreunits"];
        }
        var locatedInDormOrMilitaryBarracks = contextInfo.parameters["residenceLocation.original"];
        if (locatedInDormOrMilitaryBarracks && locatedInDormOrMilitaryBarracks.trim().length > 0) {
            sessionAttrs.locatedInDormOrMilitaryBarracks = contextInfo.parameters["residenceLocation"];
        }
        var personalItemsValue = contextInfo.parameters["valueofPersonalItems.original"];
        if (personalItemsValue && personalItemsValue.trim().length > 0) {
            sessionAttrs.personalItemsValue = contextInfo.parameters["valueofPersonalItems"];
        }
        var residenceBuildingType = contextInfo.parameters["aos-renters-typeOfBuilding.original"];
        if (residenceBuildingType && residenceBuildingType.trim().length > 0) {
            sessionAttrs.residenceBuildingType = contextInfo.parameters["aos-renters-typeOfBuilding"];
        }
        var residenceBuildingHomeType = contextInfo.parameters["aos-renters-buildingNoUnits.original"];
        if (residenceBuildingHomeType && residenceBuildingHomeType.trim().length > 0) {
            sessionAttrs.residenceBuildingHomeType = contextInfo.parameters["aos-renters-buildingNoUnits"];
        }
        var primaryResidence = contextInfo.parameters["isprimaryresidence.original"];
        if (primaryResidence && primaryResidence.trim().length > 0) {
            sessionAttrs.primaryResidence = contextInfo.parameters["isprimaryresidence"];
        }
        var isCurrentAddressSameAsInsuredAddress = contextInfo.parameters["IsInsuredAddrSame.original"];
        if (isCurrentAddressSameAsInsuredAddress && isCurrentAddressSameAsInsuredAddress.trim().length > 0) {
            sessionAttrs.isCurrentAddressSameAsInsuredAddress = contextInfo.parameters["IsInsuredAddrSame"];
        }
        var gender = contextInfo.parameters["aos-gender.original"];
        if (gender && gender.trim().length > 0) {
            sessionAttrs.gender = contextInfo.parameters["aos-gender"];
        }
        var maritalstatus = contextInfo.parameters["maritalstatus.original"];
        if (maritalstatus && maritalstatus.trim().length > 0) {
            sessionAttrs.maritalstatus = contextInfo.parameters["maritalstatus"];
        }
        var livedmorethantwo = contextInfo.parameters["livedmorethantwo.original"];
        if (livedmorethantwo && livedmorethantwo.trim().length > 0) {
            sessionAttrs.livedmorethantwo = contextInfo.parameters["livedmorethantwo"];
        }
        if (contextInfo.parameters.transactionToken) {
            sessionAttrs.transactionToken = contextInfo.parameters.transactionToken;
            sessionAttrs.state = contextInfo.parameters.transactionToken.state;
        }
        if (contextInfo.parameters.agentDetails) {
            sessionAttrs.agentDetails = contextInfo.parameters.agentDetails;
        }
        if (contextInfo.parameters.isDogAdded) {
            sessionAttrs.isDogAdded = contextInfo.parameters.isDogAdded;
        }
        if (contextInfo.parameters.isError) {
            sessionAttrs.isError = contextInfo.parameters.isError;
        }        
        if (contextInfo.parameters.isResidenceWithinThousandFtFromCoast) {
            sessionAttrs.isResidenceWithinThousandFtFromCoast = contextInfo.parameters.isResidenceWithinThousandFtFromCoast;
        }
        if (contextInfo.parameters.claimLostDate) {
            sessionAttrs.claimLostDate = contextInfo.parameters.claimLostDate;
        }
        if (contextInfo.parameters.claimLostType) {
            sessionAttrs.claimLostType = contextInfo.parameters.claimLostType;
        }
        if (contextInfo.parameters.claimLostDescription) {
            sessionAttrs.claimLostDescription = contextInfo.parameters.claimLostDescription;
        }
        if (contextInfo.parameters.claimLostLocationDisplay) {
            sessionAttrs.claimLostLocationDisplay = contextInfo.parameters.claimLostLocationDisplay;
        }
        if (contextInfo.parameters.claimLostLocation) {
            sessionAttrs.claimLostLocation = contextInfo.parameters.claimLostLocation;
        }
        if (contextInfo.parameters.constructionType) {
            sessionAttrs.constructionType = contextInfo.parameters.constructionType;
        }
        var lossDescription = contextInfo.parameters["losstype.original"];
        if (lossDescription) {
            sessionAttrs.lossDescription = lossDescription;
            sessionAttrs.losstype = contextInfo.parameters["losstype"];
        }
        var lossdate = contextInfo.parameters["lossdate.original"];
        if (lossdate) {
            sessionAttrs.lossdate = contextInfo.parameters["lossdate"];
        }
        var dogbreeds = contextInfo.parameters["dogbreeds.original"];
        if (dogbreeds && dogbreeds.trim().length > 0) {
            sessionAttrs.dogbreeds = contextInfo.parameters["dogbreeds"];
        }
        if (contextInfo.parameters.withInCityLimit != null) {
            sessionAttrs.withInCityLimit = contextInfo.parameters.withInCityLimit;
        }
        if (contextInfo.parameters.creditHit != null) {
            sessionAttrs.creditHit = contextInfo.parameters.creditHit;
        }
        if (contextInfo.parameters.isRenterReOrderData != null) {
            sessionAttrs.isRenterReOrderData = contextInfo.parameters.isRenterReOrderData;
        }
        if (contextInfo.parameters.isValidRenterCustomer != null) {
            sessionAttrs.isValidRenterCustomer = contextInfo.parameters.isValidRenterCustomer;
        }
        var isSpouseAdded = contextInfo.parameters["isSpouseAdded.original"];
        if (isSpouseAdded && isSpouseAdded.trim().length > 0) {
            sessionAttrs.isSpouseAdded = contextInfo.parameters["isSpouseAdded"];
        }

        var spouseName = contextInfo.parameters["spouse-name.original"];
        if (spouseName && spouseName.length > 0) {
            spouseName = contextInfo.parameters["spouse-name"];
            var arr = spouseName.split(" ");
            if (arr.length <= 2) {
                sessionAttrs.spousefirstName = arr[0];
                sessionAttrs.spouselastName = arr[1];
            }
            else {
                sessionAttrs.spousefirstName = arr[0];
                sessionAttrs.spouselastName = arr[2];
                sessionAttrs.spousemiddleName = arr[1];
            }
        }

        var spouselastName = contextInfo.parameters["spouselastName.original"];
        if (spouselastName && spouselastName.trim().length > 0) {
            sessionAttrs.spouselastName = contextInfo.parameters["spouselastName"];
        }
        var spouseDob = contextInfo.parameters["spouseDob.original"];
        if (spouseDob && spouseDob.trim().length > 0) {
            sessionAttrs.spouseDob = contextInfo.parameters["spouseDob"];
        }
        var spouseEmpStatus = contextInfo.parameters["spouseEmpStatus.original"];
        if (spouseEmpStatus && spouseEmpStatus.trim().length > 0) {
            sessionAttrs.spouseEmpStatus = contextInfo.parameters["spouseEmpStatus"];
        }
        var spouseGender = contextInfo.parameters["spouseGender.original"];
        if (spouseGender && spouseGender.trim().length > 0) {
            sessionAttrs.spouseGender = contextInfo.parameters["spouseGender"];
        }
        var prevaddrLine1 = contextInfo.parameters["prevaddress.original"];
        if (prevaddrLine1 && prevaddrLine1.trim().length > 0) {
            sessionAttrs.prevaddrLine1 = contextInfo.parameters["prevaddress"];
        }
        var isCreditAuthorized = contextInfo.parameters["isCreditAuthorized.original"];
        if (isCreditAuthorized && isCreditAuthorized.trim().length > 0) {
            sessionAttrs.isCreditAuthorized = contextInfo.parameters["isCreditAuthorized"];
        }
        var isgenerateurl = contextInfo.parameters["isgenerateurl.original"];
        if (isgenerateurl && isgenerateurl.trim().length > 0) {
            sessionAttrs.isgenerateurl = contextInfo.parameters["isgenerateurl"];
        }
        var prevcity = contextInfo.parameters["prevcity.original"];
        if (prevcity && prevcity.trim().length > 0) {
            sessionAttrs.prevcity = contextInfo.parameters["prevcity"];
        }
        var prevzipcode = contextInfo.parameters["prevzipcode.original"];
        if (prevzipcode && prevzipcode.trim().length > 0) {
            sessionAttrs.prevzip = contextInfo.parameters["prevzipcode"];
            if (sessionAttrs.prevzip.length === 4) {
                sessionAttrs.prevzip = "0" + sessionAttrs.prevzip;
            }
        }
        if (contextInfo.parameters.prevstate != null) {
            sessionAttrs.prevstate = contextInfo.parameters.prevstate;
        }
        var stateSpecQOneAns = contextInfo.parameters["stateSpecQOneAns.original"];
        if (stateSpecQOneAns && stateSpecQOneAns.trim().length > 0) {
            sessionAttrs.stateSpecQOneAns = contextInfo.parameters["stateSpecQOneAns"];
        }
        var stateSpecQTwoAns = contextInfo.parameters["stateSpecQTwoAns.original"];
        if (stateSpecQTwoAns && stateSpecQTwoAns.trim().length > 0) {
            sessionAttrs.stateSpecQTwoAns = contextInfo.parameters["stateSpecQTwoAns"];
        }
        var stateSpecQThreeAns = contextInfo.parameters["stateSpecQThreeAns.original"];
        if (stateSpecQThreeAns && stateSpecQThreeAns.trim().length > 0) {
            sessionAttrs.stateSpecQThreeAns = contextInfo.parameters["stateSpecQThreeAns"];
        }
        var stateSpecQFourAns = contextInfo.parameters["stateSpecQFourAns.original"];
        if (stateSpecQFourAns && stateSpecQFourAns.trim().length > 0) {
            sessionAttrs.stateSpecQFourAns = contextInfo.parameters["stateSpecQFourAns"];
        }
        var stateSpecQFiveAns = contextInfo.parameters["stateSpecQFiveAns.original"];
        if (stateSpecQFiveAns && stateSpecQFiveAns.trim().length > 0) {
            sessionAttrs.stateSpecQFiveAns = contextInfo.parameters["stateSpecQFiveAns"];
        }
        var stateSpecQSixAns = contextInfo.parameters["stateSpecQSixAns.original"];
        if (stateSpecQSixAns && stateSpecQSixAns.trim().length > 0) {
            sessionAttrs.stateSpecQSixAns = contextInfo.parameters["stateSpecQSixAns"];
        }
        var stateSpecQSevenAns = contextInfo.parameters["stateSpecQSevenAns.original"];
        if (stateSpecQSevenAns && stateSpecQSevenAns.trim().length > 0) {
            sessionAttrs.stateSpecQSevenAns = contextInfo.parameters["stateSpecQSevenAns"];
        }
        var stateSpecQEightAns = contextInfo.parameters["stateSpecQEightAns.original"];
        if (stateSpecQEightAns && stateSpecQEightAns.trim().length > 0) {
            sessionAttrs.stateSpecQEightAns = contextInfo.parameters["stateSpecQEightAns"];
        }
        if (contextInfo.parameters.isResidence2600ftFromCoastVisible) {
            sessionAttrs.isResidence2600ftFromCoastVisible = contextInfo.parameters.isResidence2600ftFromCoastVisible;
        }
        if (contextInfo.parameters.unOccupiedResidence) {
            sessionAttrs.unOccupiedResidence = contextInfo.parameters.unOccupiedResidence;
        }
        if (contextInfo.parameters.propertyInsuranceClaims) {
            sessionAttrs.propertyInsuranceClaims = contextInfo.parameters.propertyInsuranceClaims;
        }
        if (contextInfo.parameters.additionalResidents) {
            sessionAttrs.additionalResidents = contextInfo.parameters.additionalResidents;
        }
        if (contextInfo.parameters["IsInsuredAddrSame"] === false || contextInfo.parameters["IsInsuredAddrSame"] === "false") {
            sessionAttrs.IsInsuredAddrSame = false;
        }
        else {
            sessionAttrs.IsInsuredAddrSame = true;
        }
        if (contextInfo.parameters["isSpouseAdded"] === true || contextInfo.parameters["isSpouseAdded"] === "true") {
            sessionAttrs.spouseAdded = true;
        }
        else if (spouseName && spouseName.length > 0) {
            sessionAttrs.spouseAdded = true;
        }
        else {
            sessionAttrs.spouseAdded = false;
        }
        if (contextInfo.parameters["livedmorethantwo"] === false || contextInfo.parameters["livedmorethantwo"] === "false") {
            sessionAttrs.livedmorethantwo = false;
        }
        else {
            sessionAttrs.livedmorethantwo = true;
        }


    }

    return sessionAttrs;
}

//#endregion


//#region General Intents

function handleWelcomeIntent(body, deferred) {
    var welcomeSpeechResp = {};
    welcomeSpeechResp.speech = "Welcome to the Allstatebot. I can help you with your insurance-related questions.  ";

    welcomeSpeechResp.speech = welcomeSpeechResp.speech + "    You can choose from options: Get Renters Quote, Help.";
    welcomeSpeechResp.displayText = welcomeSpeechResp.speech;
    deferred.resolve(welcomeSpeechResp);
    return deferred.promise;
}

function handleHelpIntent(body, deferred) {
    var helpSpeechResp = {};
    helpSpeechResp.speech = "I can help! Simply select one of the menu options below or type a question or phrase.   ";

    helpSpeechResp.speech = helpSpeechResp.speech + "    I can also connect you with a community manager. Just type Get Live Help";
    helpSpeechResp.displayText = helpSpeechResp.speech;
    deferred.resolve(helpSpeechResp);
    return deferred.promise;
}

function handleMenuIntent(body, deferred) {
    var helpSpeechResp = {};
    helpSpeechResp.speech = "Okay! Simply select one of the menu options like get me renters quote or type a question or phrase. If you need any assistance at any time, just type help.   ";
    helpSpeechResp.displayText = helpSpeechResp.speech;
    deferred.resolve(helpSpeechResp);
    return deferred.promise;
}

function handleAosRentersQuoteStart(body, deferred) {
    var helpSpeechResp = {};
    helpSpeechResp.speech = "At this time, I can only provide a quote for renters insurance. Would you like to get a renters quote?   ";
    helpSpeechResp.displayText = helpSpeechResp.speech;
    deferred.resolve(helpSpeechResp);
    return deferred.promise;
}

function handleAosRentersQuoteStartNo(body, deferred) {
    var helpSpeechResp = {};
    helpSpeechResp.speech = "Type help to get a help   ";
    helpSpeechResp.displayText = helpSpeechResp.speech;
    deferred.resolve(helpSpeechResp);
    return deferred.promise;
}

module.exports = new ApiAiIntentHandler();


