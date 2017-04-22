const R = require('ramda');

module.exports = (get, name) => get()
  .then(JSON.parse)
  .then(result => result.manga)
  .then(R.filter(serie => serie.t === name))
  .then(R.head)
  .then(result => result.i)
