const MangaEden = require('./manga-eden');

const Sources = (system) => {
  const mangaEden = MangaEden(system);

  const getPage = (serie, chapter, page) =>
    mangaEden.getPage(serie, chapter, page);

  const getPages = (serie, chapter) =>
    mangaEden.getPages(serie, chapter);

  const getChapters = serie =>
    mangaEden.getChapters(serie);

  return {
    getPage,
    getPages,
    getChapters,
  };
};

module.exports = Sources;
