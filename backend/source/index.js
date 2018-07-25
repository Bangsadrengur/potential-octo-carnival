const MangaEden = require('./manga-eden');
const Mangafreak = require('./mangafreak');
const R = require('ramda');

const source = (system, favorites) => {
  const sources = {
    'manga-eden': MangaEden(system, R.pluck('lookup', favorites)),
    mangafreak: Mangafreak(R.pluck('lookup', favorites)),
  };

  const getPage = (serie, chapter, page) =>
    sources[favorites[serie].source].getPage(serie, chapter, page);

  const getPages = (serie, chapter) =>
    sources[favorites[serie].source].getPages(serie, chapter);

  const getChapters = serie =>
    sources[favorites[serie].source].getChapters(serie);

  return {
    getPage,
    getPages,
    getChapters,
  };
};

module.exports = source;
