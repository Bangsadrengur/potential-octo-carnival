const R = require('ramda');

module.exports = (get, number) =>
  R.compose(
    get,
    R.prop('path'),
    R.head,
    R.filter(R.where({ number: R.equals(number) }))
  );
