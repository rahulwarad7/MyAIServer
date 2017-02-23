
var express = require('express');
var bodyParser = require('body-parser');
var allstateAlexa = require('./devices/amazonAlexa/amazonAlexa.js');
var allstateApiAi = require('./devices/google/api-ai/api-ai.js');



var port = process.env.PORT || 3000;
var app = express();
var appRouter = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/pavanserver/api', appRouter);
app.listen(port, function () {
    console.log('Pavan Server listening on port: ' + port);
});

appRouter.route('/ai/voice/api-ai')
    .post(function (req, res) {
        console.log(JSON.stringify(req.headers));
        console.log(JSON.stringify(req.body));
        var body = req.body;

        var responseBody = allstateApiAi.execute(body);
        /*var sessionId = body.sessionId;
        var message = "Today in Boston: Fair, the temperature is 37 F";

        if (body.originalRequest && body.originalRequest.source) {
            console.log('--' + body.originalRequest.source + '---');
        }


        var responseBody = {
            "speech": message,
            "displayText": message,
            "data": {},
            "context-out": []
        };
        */
        res.setHeader("Content-Type", "application/json");
        res.send(responseBody);
    });


appRouter.route('/ai/voice/amzn-alexa')
    .post(function (req, res) {
        var body = req.body;
        var context = {};
        var responseBody = allstateAlexa.execute(body, context);

        res.setHeader("Content-Type", "application/json");
        res.send(responseBody);
    });
