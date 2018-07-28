const MangaEden = require('./manga-eden');

const Sources = (system) => {
  const mangaEden = MangaEden(system);

  const getPage = (serie, chapter, page) =>
    mangaEden.getPage(serie, chapter, page);

  const getChapters = serie =>
    mangaEden.getChapters(serie);

  return {
    getPage,
    getChapters,
  };
};

module.exports = Sources;
