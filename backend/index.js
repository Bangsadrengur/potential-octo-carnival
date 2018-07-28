const configurePathRoutes = require('./router');
const DB = require('./db');
const SOURCES = require('../sources');

function Con(system, Sources = SOURCES) {
  const { WebApplicationFramework } = system;
  const web = WebApplicationFramework();
  const source = Sources(system);
  const db = DB(system, source);
  configurePathRoutes(
    web,
    db,
  );
  return web;
}

module.exports = Con;
