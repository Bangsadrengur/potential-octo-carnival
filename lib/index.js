const R = require('ramda');
const createSource = require('./source');
const createServer = require('./server');
const createDB = require('./db');

const favorites = {
  'one-piece': { lookup: 'One Piece', source: 'manga-eden' },
  'onepunch-man': { lookup: 'Onepunch-Man', source: 'mangafreak' },
  'fairy-tail': { lookup: 'Fairy Tail', source: 'manga-eden' },
};

const source = createSource(favorites);
const db = createDB(source);
const server = createServer(db, R.values(R.pluck('lookup', favorites)));
server.listen(3000, () => {});
