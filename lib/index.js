const R = require('ramda');
const createSource = require('./source');
const createServer = require('./server');
const createDB = require('./db');

const favorites = {
  'one-piece': 'One Piece',
  'onepunch-man': 'Onepunch-Man',
  'fairy-tail': 'Fairy Tail',
};

const source = createSource(favorites);
const db = createDB(source);
const server = createServer(db, R.values(favorites));
server.listen(3000, () => {});
