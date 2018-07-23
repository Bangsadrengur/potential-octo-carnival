const Server = require('../js/index');
const system = require('../js/system');

const server = Server(system);
const port = 3000;

server.start(port);
