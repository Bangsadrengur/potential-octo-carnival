const Backend = require('../backend');

const backend = Backend();
console.log(backend);
const port = 3000;

backend.start(port);
