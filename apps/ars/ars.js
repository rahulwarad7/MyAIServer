var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var Utilities = require('./../../shared/utilities/utilities.js');
var Session = require('./../../shared/data-models/session.js');

var q = require('q');
var request = require('request');

var ARS = function () { };

var URL_BASE = "https://m.goodhandsrescue.com/ghrm/api/";//"https://qa.m.goodhandsrescue.com/ghrm/api/";
var URL_GET_SERVICE_COSTS = URL_BASE + "servicecosts";


ARS.prototype.handleRoadServiceHandler = function (sessionAttrs) {
    var deferred = q.defer();
    var roadServiceSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();


    handleARSServiceType(sessionAttrs, roadServiceSpeechResp)
        .then(function (respData) {
            deferred.resolve(respData);
        });



    return deferred.promise;
};

ARS.prototype.handleRoadServiceYMMHandler = function (sessionAttrs) {
    var deferred = q.defer();
    var roadServiceSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();


    handleARSServiceType(sessionAttrs, roadServiceSpeechResp)
        .then(function (respData) {
            deferred.resolve(respData);
        });



    return deferred.promise;
};

ARS.prototype.handleRoadServiceAgreementHandler = function (sessionAttrs) {
    var deferred = q.defer();
    var roadServiceSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Thank you, for choosing Allstate. We have dispatched 'help' to you.";
    repromptOutput.text = speechOutput.text;
    roadServiceSpeechResp.speechOutput = speechOutput;
    //roadServiceSpeechResp.repromptOutput = repromptOutput;

    deferred.resolve(roadServiceSpeechResp);


    return deferred.promise;
}


ARS.prototype.handleRoadServiceErrorHandler = function (sessionAttrs) {
    var deferred = q.defer();
    var roadServiceSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Thank you, for choosing Allstate. please try again!";
    repromptOutput.text = speechOutput.text;
    roadServiceSpeechResp.speechOutput = speechOutput;
   // roadServiceSpeechResp.repromptOutput = repromptOutput;

    deferred.resolve(roadServiceSpeechResp);


    return deferred.promise;
}

function handleARSServiceType(sessionAttrs, roadServiceSpeechResp) {
    var deferred = q.defer();
    if (sessionAttrs.serviceType) {
        switch (sessionAttrs.serviceType.toUpperCase()) {
            case "LOCKOUT":
                hanldeLockoutService(sessionAttrs, roadServiceSpeechResp)
                    .then(function (respData) {
                        deferred.resolve(respData);
                    });
                break;
            case "GAS":
                if (sessionAttrs.vehicleLocation) {

                } else {
                    //ask current Location.
                }
                break;
            case "TIRE CHANGE":
                if (sessionAttrs.vehicleLocation) {

                } else {
                    //ask current Location.
                }
                break;
            case "BATTERY":
                if (sessionAttrs.vehicleLocation) {

                } else {
                    //ask current Location.
                }
                break;
            case "TOW":
                if (sessionAttrs.vehicleLocation) {

                } else {
                    //ask current Location.
                }
                break;
        }
    } else {

    }

    //deferred.resolve(roadServiceSpeechResp);



    return deferred.promise;
}

function hanldeLockoutService(sessionAttrs, roadServiceSpeechResp) {
    var deferred = q.defer();

    if (!sessionAttrs.vehicleYear && !sessionAttrs.vehicleMake && !sessionAttrs.vehicleModel) {
        if (sessionAttrs.keyLocation) {
            if (sessionAttrs.vehicleLocation) {
                roadServiceSpeechResp = askVehicleYMM(sessionAttrs);
            } else {
                roadServiceSpeechResp = askLocation(sessionAttrs);
            }
        } else {
            //ask current Location.
            roadServiceSpeechResp = askKeyLocation(sessionAttrs);
        }
        deferred.resolve(roadServiceSpeechResp);
    } else {
        if (!sessionAttrs.vehicleYear) {
            roadServiceSpeechResp = askVehicleYear(sessionAttrs);
            deferred.resolve(roadServiceSpeechResp);
        } else if (!sessionAttrs.vehicleModel) {
            roadServiceSpeechResp = askVehicleModel(sessionAttrs);
            deferred.resolve(roadServiceSpeechResp);
        } else if (!sessionAttrs.vehicleMake) {
            roadServiceSpeechResp = askVehicleMake(sessionAttrs);
            deferred.resolve(roadServiceSpeechResp);
        } else {
            getServiceCosts()
                .then(function (costsResp) {
                    //provide esitmated cost and get agreement.
                    var costsRespJSON = JSON.parse(costsResp);
                    var serviceCostInfo = getServiceTypeCostInfo(costsRespJSON, "LOCKOUT");
                    roadServiceSpeechResp = askForCostAgreement(serviceCostInfo, sessionAttrs);
                    deferred.resolve(roadServiceSpeechResp);
                });
        }
    }
    /*
    if (sessionAttrs.vehicleYear) {
        if (sessionAttrs.vehicleMake) {
            if (sessionAttrs.vehicleModel) {
                getServiceCosts()
                    .then(function (costsResp) {
                        //provide esitmated cost and get agreement.
                        var costsRespJSON = JSON.parse(costsResp);
                        var serviceCostInfo = getServiceTypeCostInfo(costsRespJSON, "LOCKOUT");
                        roadServiceSpeechResp = askForCostAgreement(serviceCostInfo);
                        deferred.resolve(roadServiceSpeechResp);
                    });
            } else {
                roadServiceSpeechResp = askVehicleModel();
                deferred.resolve(roadServiceSpeechResp);
            }
        } else {
            roadServiceSpeechResp = askVehicleMake();
            deferred.resolve(roadServiceSpeechResp);
        }
    } else {
        if (sessionAttrs.keyLocation) {
            if (sessionAttrs.vehicleLocation) {
                roadServiceSpeechResp = askVehicleYear();
            } else {
                roadServiceSpeechResp = askLocation();
            }
        } else {
            //ask current Location.
            roadServiceSpeechResp = askKeyLocation();
        }
        deferred.resolve(roadServiceSpeechResp);
    }*/
    return deferred.promise;
}

function getServiceTypeCostInfo(costResp, serviceTypeName) {
    var srvTypeInfo;
    srvTypeInfo = costResp.response.result.value.servicecost.find(
        function (serv) { return serv.servicetype.toUpperCase() === serviceTypeName }
    );

    return srvTypeInfo;
}

function askForCostAgreement(serviceCostInfo, sessionAttrs) {
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "The approximate cost for Lockout service will be $" + serviceCostInfo.cost + ".Do you agree?";
    repromptOutput.text = speechOutput.text;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askVehicleYear(sessionAttrs) {
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "Please provide your vehicle's year";
    repromptOutput.text = speechOutput.text;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askVehicleYMM(sessionAttrs) {
    //var ARSSpeechResp = new SpeechResponse();
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "Please provide your vehicle's year, make and model";
    repromptOutput.text = speechOutput.text;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askVehicleMake(sessionAttrs) {
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "What's the make?";
    repromptOutput.text = "What's the make?";;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askVehicleModel(sessionAttrs) {
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "vehicle's Model please";
    repromptOutput.text = "vehicle's model please";;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askLocation(sessionAttrs) {
    //var ARSSpeechResp = new SpeechResponse();
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "Please provide your vehicle's location, or you can say 'current location'";
    repromptOutput.text = "Please provide your vehicle's location, or you can say 'current location'";;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;
}

function askKeyLocation(sessionAttrs) {
    var locationServSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    speechOutput.text = "Where are your keys? In your car? or Lost? or Borken?";
    repromptOutput.text = speechOutput.text;
    locationServSpeechResp.speechOutput = speechOutput;
    locationServSpeechResp.repromptOutput = repromptOutput;
    locationServSpeechResp.sessionAttrs = sessionAttrs;
    return locationServSpeechResp;

}

function getServiceCosts() {
    var deferred = q.defer();
    request({ method: 'GET', uri: URL_GET_SERVICE_COSTS }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            errormsg = "Error from server session";
            deferred.reject(errormsg);
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
}



module.exports = new ARS();
