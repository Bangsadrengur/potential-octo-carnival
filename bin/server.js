const Backend = require('../backend');
const system = require('../backend/system');

const backend = Backend(system);
const port = 3000;

backend.start(port);
