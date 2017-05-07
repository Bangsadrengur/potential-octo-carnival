const R = require('ramda');
const request = require('request');
const rp = require('request-promise-native');

const get = require('./get');
const getMangaId = require('./getMangaId');
const getChapterId = require('./getChapters');
const getAnImage = require('./getAnImage');

const url = 'http://www.mangaeden.com';
const cdnUrl = 'http://cdn.mangaeden.com/mangasimg/'
const listPath = '/api/list/0/';
const chapters = '/api/manga/';
const pages = '/api/chapter/';

const getMangaList = () => get(request, url + listPath);
const getChapterList = serieId => get(request, url + chapters + serieId);
const getPageList = chapterId => get(request, url + pages + chapterId);
const getImage = path => rp({
  uri: R.concat(cdnUrl, path),
  encoding: null,
});

const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  selectChapter,
  chapterToChapterPath,
} = require('./parsers');

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
      .then(getAnImage(getImage, Number(page)))

  return {
    getPage,
    getPages,
    getChapters,
    getSeries,
  };
}

module.exports = createSource;
