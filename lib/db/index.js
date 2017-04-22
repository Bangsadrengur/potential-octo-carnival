const cache = require('memory-cache');

module.exports = (source) => ({
  getSeries: () => new Promise((resolve, reject) => {
    const cValue = cache.get('series');
    if (cValue) { resolve(cValue); return; }
    source.getSeries().then(sValue => {
      cache.put('series', sValue);
      resolve(sValue);
    });
  }),
  getChapters: (serieId) => new Promise((resolve, reject) => {
    const cValue = cache.get(`${serieId}`);
    if (cValue) { resolve(cValue); return; }
    source.getChapters(serieId).then(sValue => {
      cache.put(`${serieId}`, sValue);
      resolve(sValue);
    });
  }),
  getPages: (serieId, chapterId) => source.getPages(serieId, chapterId),
  getPage: (serieId, chapterId, pageId) => source.getPage(serieId, chapterId, pageId),
});
