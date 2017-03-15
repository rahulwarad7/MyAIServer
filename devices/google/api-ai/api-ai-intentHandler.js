

var TidePooler = require('./../../../apps/tide-pooler/tide-pooler.js');
var aos = require('./../../../apps/aos/aos.js');
var ars = require('./../../../apps/ars/ars.js');
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
        case "AGENT-FIND":
            handleAgentFindIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYZIP":
            handleAgentFindByZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYCURRENTLOC":
            break;
        case "AGENT-FIND-EMAIL-YES":
            handleAgentFindEmailYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-EMAIL-NO":
            handleAgentFindEmailNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-EMAIL-SEND":
            handleAgentFindEmailSend(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "WEATHERFORECAST":
            var message = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
        case "TDSUPPORTEDCITIES":
            var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
            responseBody.speech = poolerSpeechResponse.speechOutput.text;
            responseBody.displayText = poolerSpeechResponse.speechOutput.text;
            deferred.resolve(responseBody);
            break;
        case "TDDIALOGTIDEINTENT":
            dialogTideIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-CITY":
            handleTDCityIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-DATE":
            handleTDDateIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-START":
        case "ARS-SERVICE-LOCATION":
            handleARSStartIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-VEHICLE-YEAR":
        case "ARS-SERVICE-VEHICLE-MAKE":
        case "ARS-SERVICE-VEHICLE-MODEL":
        case "ARS-SERVICE-VEHICLE-YMM":
            handleARSVehicleYMMIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-PRICE-AGREE":
            handleARSAgreementIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "HELPINTENT":
        default:
            var message = "You can say hello to me!";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
    }
    return deferred.promise;
};

//#region ARS

function handleARSAgreementIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceAgreementHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}

function handleARSStartIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}

function handleARSVehicleYMMIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceYMMHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}



function getARSSessionAttributes(contextInfo) {
    var sessionAttrs = {
        "serviceType": undefined, "cost": undefined,
        "keyLocation": undefined, "vehicle": {}, "vehicleLocation": undefined
    };

    if (contextInfo) {
        var serviceType = contextInfo.parameters["ars-service-type.original"];
        if (serviceType && serviceType.trim().length > 0) {
            sessionAttrs.serviceType = contextInfo.parameters["ars-service-type"];
        }
        var keyLocation = contextInfo.parameters["ars-key-loc.original"];
        if (keyLocation && keyLocation.trim().length > 0) {
            sessionAttrs.keyLocation = contextInfo.parameters["ars-key-loc"];
        }
        var vehicleLocation = contextInfo.parameters["location.original"];
        if (vehicleLocation && vehicleLocation.trim().length > 0) {
            sessionAttrs.vehicleLocation = contextInfo.parameters["location"];
            if (sessionAttrs.vehicleLocation.toUpperCase() === 'CURRENT') {
                sessionAttrs.vehicleLocation = "1500 Capitol Drive, Northbrook, IL 60060";
            }
        }
        var vehicleYear = contextInfo.parameters["vehicle-year.original"];
        if (vehicleYear && vehicleYear.trim().length > 0) {
            sessionAttrs.vehicleYear = contextInfo.parameters["vehicle-year"];
        }
        var vehicleMake = contextInfo.parameters["vehicle-make.original"];
        if (vehicleMake && vehicleMake.trim().length > 0) {
            sessionAttrs.vehicleMake = contextInfo.parameters["vehicle-make"];
        }
        var vehicleModel = contextInfo.parameters["vehicle-model.original"];
        if (vehicleModel && vehicleModel.trim().length > 0) {
            sessionAttrs.vehicleModel = contextInfo.parameters["vehicle-model"];
        }
    }

    return sessionAttrs;
}


//#endregion


//#region Agent

function handleWelcomeIntent(body, deferred) {
    var agentFindSpeechResp = {};
    agentFindSpeechResp.speech = "Welcome to Allstate. I can help find an agent, get you an insurance. I can even help you with Road Side Assistance.";
    agentFindSpeechResp.displayText = agentFindSpeechResp.speech;
    deferred.resolve(agentFindSpeechResp);
    return deferred.promise;
}

function handleAgentFindEmailYes(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);


    aos.handleAgentFindEmailYesIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function handleAgentFindEmailNo(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);


    aos.handleAgentFindEmailNoIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;

}

function handleAgentFindEmailSend(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    console.log("handleAgentFindEmailSend - start");

    aos.handleAgentFindEmailSendIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            console.log("handleAgentFindEmailSend - end");
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}


function handleAgentFindByZip(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    if (sessionAttrs.zip) {
        aos.handleAgentFindByZipIntent(sessionAttrs)
            .then(function (agentFindSpeechResponse) {
                agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
                agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
                agentFindSpeechResp.contextOut = [{ "name": "AgentFindByZip", "parameters": sessionAttrs }];
                deferred.resolve(agentFindSpeechResp);
            });
    }
    return deferred.promise;
}

function handleAgentFindIntent(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    aos.handleAgentFindRequest(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function getAgentSessionAttributes(contextInfo) {
    var sessionAttrs = { "zip": undefined, "email": undefined, "agent": {} };
    if (contextInfo) {
        var zip = contextInfo.parameters["zip.original"];
        if (zip && zip.trim().length > 0) {
            sessionAttrs.zip = contextInfo.parameters["zip"];
        }
        var email = contextInfo.parameters["email.original"];
        if (email && email.trim().length > 0) {
            sessionAttrs.email = email;
        }
        if (contextInfo.parameters.agent) {
            sessionAttrs.agent = contextInfo.parameters.agent;
        }
    }

    return sessionAttrs;
}

//#endregion


//#region Tidepooler
function handleTDCityIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.city) {
        TidePooler.handleCityDialogRequest(sessionAttrs.city, sessionAttrs)
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse.speech = poolerCitySpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerCitySpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }

    return deferred.promise;
}
function handleTDDateIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.date) {
        TidePooler.handleDateDialogRequest(sessionAttrs.date, sessionAttrs)
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse.speech = poolerDateSpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerDateSpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }


    return deferred.promise;
}

function getTDSessionAttributes(contextInfo) {
    var sessionAttrs = { "city": undefined, "date": undefined };

    if (contextInfo) {
        var cityOrg = contextInfo.parameters['geo-city.original'];
        var dateOrg = contextInfo.parameters['date.original'];
        if (cityOrg && cityOrg.length > 0) {
            sessionAttrs.city = contextInfo.parameters['geo-city'];
        }
        if (dateOrg && dateOrg.length > 0) {
            sessionAttrs.date = contextInfo.parameters.date;
        }
    }

    return sessionAttrs;
}


function dialogTideIntent(body, deferred) {
    var dialogTideSpeechResponse;
    var result = body.result;
    var city = result.parameters['geo-city'];
    var date = result.parameters.date;
    if (city) {
        TidePooler.handleCityDialogRequest(city, {})
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else if (date) {
        TidePooler.handleDateDialogRequest(date, {})
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });

    } else {
        TidePooler.handleNoSlotDialogRequest(body)
            .then(function (noSlotSpeechResponse) {
                deferred.resolve(noSlotSpeechResponse);
            });
    }
    return deferred.promise;
}

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var responseInfo;


    return responseInfo;
}
//#endregion




module.exports = new ApiAiIntentHandler();


