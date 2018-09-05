const server = require('./server').server;
let SERVER_PORT = require('./config.js').SERVER_PORT;

server(process.env.PORT || SERVER_PORT);

