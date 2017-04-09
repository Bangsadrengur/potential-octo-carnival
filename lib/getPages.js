const R = require('ramda');

module.exports = get => chapterId => get(chapterId)
  .then(JSON.parse)
  .then(result => result.images)
  .then(R.map(([number, path, height, width]) => ({ number, path, height, width })));
