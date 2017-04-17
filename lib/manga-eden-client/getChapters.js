const R = require('ramda');

module.exports = (id) =>
  R.pipe(
    R.filter(chapter => chapter.number === id),
    R.head,
    R.last
  );
