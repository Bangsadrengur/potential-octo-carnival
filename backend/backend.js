const Server = require('./server');
const DB = require('./db');
const Sources = require('./sources');

function Con(system) {
  const source = Sources(system);
  const db = DB(system, source);
  const server = Server(db);
  return server;
}

module.exports = Con;
