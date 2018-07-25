const { values, pluck } = require('ramda');
const Source = require('./source');
const Server = require('./server');
const DB = require('./db');

const FAVORITES = {
  'one-piece': { lookup: 'One Piece', source: 'manga-eden' },
  // 'onepunch-man': { lookup: 'Onepunch-Man', source: 'mangafreak' },
};

function Con(system, favorites = FAVORITES) {
  const source = Source(system, favorites);
  const db = DB(system, source);
  const server = Server(
    system,
    db,
    values(pluck('lookup', favorites)));
  return server;
}

module.exports = Con;
