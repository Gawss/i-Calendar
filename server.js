const express = require('express');
const spreadSheet = require('./GoogleSheets.js').SpreadSheet;
const bodyParser = require('body-parser');

function server (SERVER_PORT) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const server = app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    console.log('Server On', __dirname)
    });

    app.get('/', (req, res) => {

        console.log('GET /');
        res.status(200).send("Server On");
    });

    app.get('/spreadSheet', (req, res) => {

        console.log('GET /');
        spreadSheet();
        res.status(200).send("Server On");
    });

    app.post('/dialogFlow', (req, res) => {

        console.log('post /dialogFlow');
        // res.status(200).send("Server On");
        console.log(req.body);
        console.log(req.body.queryResult.action);
        console.log(req.body.queryResult.parameters.date);
        res.json({
            fulfillmentText: "This is a text response"
          })
    });
}

module.exports = {
    server
}