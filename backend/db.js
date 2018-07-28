const R = require('ramda');

const timeout = 1800000; // 30 minutes

function DB({ cache }, source) {
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

  const getChapters = serie => getCached(source.getChapters)(Array(serie));
  const getPage = (serie, chapter, page) =>
    getCached(source.getPage)([serie, chapter, page]);

  return {
    getChapters,
    getPage,
  };
}

module.exports = DB;
