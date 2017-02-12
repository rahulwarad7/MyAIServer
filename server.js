var express = require('express');
var bodyParser = require('body-parser');


app.set('port', (process.env.PORT || 3000));


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function (req, res) {

    var body = req.body;
    var sessionId = body.sessionId;

    res.send('OK');
});


app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
