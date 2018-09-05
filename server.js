const express = require('express');

function server (SERVER_PORT) {
    const app = express()

    const server = app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    console.log('Server On', __dirname)
    });

    app.get('/', (req, res) => {

        console.log('GET /');
        res.status(200).send("Server On");
    });

    app.post('/dialogFlow', (req, res) => {

        console.log('post /dialogFlow');
        // res.status(200).send("Server On");

        res.json({
            fulfillmentText: "This is a text response"
          })
    });
}

module.exports = {
    server
}