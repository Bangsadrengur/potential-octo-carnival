const plugins = require('./plugins');

const Sources = ({ MangaEden, Mangafreak } = plugins, system) => {
  const mangaEden = MangaEden(system);
  const mangafreak = Mangafreak(system);
  const sources = {
    'one-piece': mangaEden,
    'one-punch-man': mangafreak,
  };

  const getPage = (serie, chapter, page) =>
    sources[serie].getPage(serie, chapter, page);

  const getChapters = serie =>
    sources[serie].getChapters(serie);

  return {
    getPage,
    getChapters,
  };
};

module.exports = Sources;
