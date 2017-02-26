

var Speech = function () {
    this.text;
    this.type;
};

module.exports = function () {
    this.speech = new Speech;
    this.repromptSpeech = new Speech();
};

