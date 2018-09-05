const express = require('express');

const app = express();

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    console.log('Server On ', __dirname);
});

app.get('/', (req, res) => {

    console.log('GET /');
    res.status(200).send("Server On");

});