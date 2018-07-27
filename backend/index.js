const { values, pluck } = require('ramda');
const Source = require('./source');
const configurePathRoutes = require('./router');
const DB = require('./db');

const FAVORITES = {
  'one-piece': { lookup: 'One Piece', source: 'manga-eden' },
  // 'onepunch-man': { lookup: 'Onepunch-Man', source: 'mangafreak' },
};

function Con(system, favorites = FAVORITES) {
  const { WebApplicationFramework } = system;
  const web = WebApplicationFramework();
  const source = Source(system, favorites);
  const db = DB(system, source);
  configurePathRoutes(
    web,
    db,
    values(pluck('lookup', favorites)));
  return web;
}

module.exports = Con;
