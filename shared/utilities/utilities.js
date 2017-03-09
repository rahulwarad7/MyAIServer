
var Utilities = function () {

};
Utilities.prototype.GetRandomValue = function (inputArray) {
    var rand = inputArray[Math.floor(Math.random() * inputArray.length)];
    return rand;
};





module.exports = new Utilities();