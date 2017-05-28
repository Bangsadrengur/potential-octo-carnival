const R = require('ramda');
const rp = require('request-promise-native');
const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  selectChapter,
  chapterToChapterPath,
  pagesToPagePath,
} = require('./parsers');

const url = 'http://www.mangaeden.com';
const cdnUrl = 'http://cdn.mangaeden.com/mangasimg/'
const listPath = '/api/list/0/';
const chapters = '/api/manga/';
const pages = '/api/chapter/';

const getMangaList = () => rp({ uri: url + listPath, encoding: null });
const getChapterList = serieId => rp({ uri: url + chapters + serieId, encoding: null });
const getPageList = chapterId => rp({ uri: url + pages + chapterId, encoding: null });
const getImage = path => rp({ uri: R.concat(cdnUrl, path), encoding: null });

const createSource = seriesMap => {
  const getSeries = () =>
    getMangaList()
      .then(parseSeries);

  const getChapters = serie =>
    getSeries()
      .then(parseChaptersUrl(seriesMap[serie]))
      .then(R.concat(url + chapters))
      .then(rp)
      .then(parseChapters)

  const getPages = (serie, chapter) =>
    getChapters(serie)
      .then(selectChapter(chapter))
      .then(chapterToChapterPath)
      .then(getPageList)
      .then(JSON.parse)
      .then(R.prop('images'))
      .then(R.map(([number, path, height, width]) => ({ number, path, height, width })));

  const getPage = (serie, chapter, page) =>
    getPages(serie,chapter)
      .then(pagesToPagePath(Number(page)))
      .then(getImage);

  return {
    getPage,
    getPages,
    getChapters,
  };
}

module.exports = createSource;
