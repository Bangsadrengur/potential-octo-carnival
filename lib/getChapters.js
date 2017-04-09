const R = require('ramda');

module.exports = (get) => (id) => (serieId) => get(serieId)
  .then(JSON.parse)
  .then(manga => manga.chapters)
  .then(R.filter(chapter => chapter[0] === id))
  .then(R.head)
  .then(R.last);
