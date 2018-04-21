const cache = require('memory-cache');
const R = require('ramda');

const timeout = 1800000; // 30 minutes

const getCached = get => ids => new Promise((resolve, reject) => {
  const cValue = cache.get(R.join('-', ids));
  if (cValue) { resolve(cValue); return; }
  get(...ids)
    .then((sValue) => {
      cache.put(R.join('-', ids), sValue, timeout);
      resolve(sValue);
    })
    .catch((error) => { reject(error); });
});

module.exports = source => ({
  getChapters: serie => getCached(source.getChapters)(Array(serie)),
  getPages: (serie, chapter) => getCached(source.getPages)([serie, chapter]),
  getPage: (serie, chapter, page) => getCached(source.getPage)([serie, chapter, page]),
});