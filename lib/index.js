const source = require('./source');
const createServer = require('./server');
const createDB = require('./db');

const db = createDB(source);
const server = createServer(db);
server.listen(3000, () => {});
