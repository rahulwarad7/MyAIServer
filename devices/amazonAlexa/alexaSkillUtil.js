

var AlexaSkillUtil = function () { };

//public function start

AlexaSkillUtil.prototype.tell = function (speechOutput, sessionInfo) {
    var speechLetInput = {
        session: sessionInfo,
        output: speechOutput,
        shouldEndSession: true
    };
    var alexaResponseInfo = buildSpeechletResponse(speechLetInput);
    return alexaResponseInfo;
};

AlexaSkillUtil.prototype.tellWithCard = function (speechOutput, sessionInfo, cardInfo) {
    var speechLetInput = {
        session: sessionInfo,
        output: speechOutput,
        cardTitle: cardInfo.title,
        cardContent: cardInfo.content,
        shouldEndSession: true
    };
    var alexaResponseInfo = buildSpeechletResponse(speechLetInput);
    return alexaResponseInfo;
};

AlexaSkillUtil.prototype.ask = function (speechOutput, repromptSpeech, sessionInfo) {
    var speechLetInput = {
        session: sessionInfo,
        output: speechOutput,
        reprompt: repromptSpeech,
        shouldEndSession: false
    };
    var alexaResponseInfo = buildSpeechletResponse(speechLetInput);
    return alexaResponseInfo;
};

AlexaSkillUtil.prototype.askWithCard = function (speechOutput, repromptSpeech, sessionInfo, cardInfo) {
    var speechLetInput = {
        session: sessionInfo,
        output: speechOutput,
        reprompt: repromptSpeech,
        cardTitle: cardInfo.title,
        cardContent: cardInfo.content,
        shouldEndSession: false
    };
    var alexaResponseInfo = buildSpeechletResponse(speechLetInput);
    return alexaResponseInfo;
};


//public function end


//private function start
function createSpeechObject(speechInfo) {
    if (speechInfo && speechInfo.type === 'SSML') {
        return {
            type: speechInfo.type,
            ssml: speechInfo.text
        };
    } else {
        return {
            type: speechInfo.type || 'PlainText',
            text: speechInfo.text
        }
    }
}

function buildSpeechletResponse(options) {
    var alexaResponse = {
        outputSpeech: createSpeechObject(options.output),
        shouldEndSession: options.shouldEndSession
    };
    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }
    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: "Simple",
            title: options.cardTitle,
            content: options.cardContent
        };
    }
    var returnResult = {
        version: '1.0',
        response: alexaResponse
    };
    if (options.session && options.session.attributes) {
        returnResult.sessionAttributes = options.session.attributes;
    }
    return returnResult;
};

//private function end

module.exports = new AlexaSkillUtil();
