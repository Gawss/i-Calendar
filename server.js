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

        let date_ = new Date(req.body.queryResult.parameters.date).toISOString();
        let date_Array = date_.split("-");
        console.log('DATE: ' + date_);
        console.log('DATE: ' + date_Array);
        let year = parseInt(date_Array[0]);
        let month = parseInt(date_Array[1]);
        let day = parseInt(date_Array[2].split("T")[0]);

        let dayName = getDayOfWeek(year + "-" + month + "/" + day);

        if(req.body.queryResult.action === 'askDay'){

            spreadSheet(year, month, day, dayName, res);

        }else{
            res.json({
                fulfillmentText: "No entiendo la intención de tu pregunta... :("
              })
        }
    });
}

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();    
    // return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    return isNaN(dayOfWeek) ? null : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek];
}

module.exports = {
    server
}