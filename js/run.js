const { values, pluck } = require('ramda');
const Source = require('./source');
const Server = require('./server');

const favorites = {
  'one-piece': { lookup: 'One Piece', source: 'manga-eden' },
  // 'onepunch-man': { lookup: 'Onepunch-Man', source: 'mangafreak' },
};

function run() {
  const source = Source(favorites);
  const server = Server(source, values(pluck('lookup', favorites)));
  server.listen(3000, () => {});
}

module.exports = run;