
var express = require('express');
var bodyParser = require('body-parser');



var port = process.env.PORT || 3000;
var app = express();
var appRouter = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/pavanserver/api', appRouter);
app.listen(port, function () {
    console.log('Pavan Server listening on port: ' + port);
});

appRouter.route('/ai/voice')
    .post(function (req, res) {
        console.log(JSON.stringify(req.headers));
        var body = req.body;
        var sessionId = body.sessionId;
        var fullfilment = {
            "speech": "Today in Boston: Fair, the temperature is 37 F",
            "source": "apiai-weather-webhook-sample",
            "displayText": "Today in Boston: Fair, the temperature is 37 F"
        };
        body.result.fulfillment = fullfilment;
        res.send(body);
    });

