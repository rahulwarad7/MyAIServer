
//var q = require('q');

var FacebookMsg = function () { };

//#region public methods
FacebookMsg.prototype.processResponse = function (body, respData) {
    //var deferred = q.defer();
    var facebookInfo = { "facebook": undefined }
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        var intentName = body.result.metadata.intentName;
        switch (intentName.toUpperCase()) {
            case "WELCOME":
                facebookInfo.facebook = GetWelcomeTemplateInfo(respData);
                break;
            default:
                break;
        }

    }
    return facebookInfo;
    //return deferred.promise;
}
//#endregion

//#region private methods

function GetWelcomeTemplateInfo(respData) {
    var attachment = {
        type: "template",
        payload: {
            template_type: "generic",
            elements: [{
                title: "Allstate",
                subtitle: respData.displayText,
                item_url: "https://www.allstate.com/",
                image_url: "https://www.allstate.com/resources/Allstate/images/global/logo-allstate.png",
                buttons: [{
                    type: "web_url",
                    url: "https://www.allstate.com/",
                    title: "Open Web URL"
                }],
            }]
        }
    };

    return { "attachment": attachment };
}

//#endregion

module.exports = new FacebookMsg();