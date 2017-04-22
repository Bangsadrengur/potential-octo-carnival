const R = require('ramda');
const request = require('request');
const rp = require('request-promise-native');

const get = require('./get');
const getMangaId = require('./getMangaId');
const getChapterId = require('./getChapters');
const getPages = require('./getPages');
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

const seriesMap = {
  'one-piece': 'One Piece',
  'onepunch-man': 'Onepunch-Man',
  'flower-dream': 'Flower Dream',
};

const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
} = require('./parsers');

const gss = () =>
  getMangaList()
    .then(parseSeries);

const gcs = serie =>
  gss()
    .then(parseChaptersUrl(seriesMap[serie]))
    .then(R.concat(url + chapters))
    .then(rp)
    .then(parseChapters)

const gps = (serie, chapter) =>
  gcs(serie)
    .then(R.filter(chap => chap.number === Number(chapter)))
    .then(R.head)
    .then(R.prop('path'))
    .then(getPages(getPageList))

const gp = (serie, chapter, page) =>
  gps(serie,chapter)
    .then(getAnImage(getImage, Number(page)))

module.exports = {
  getPage: gp,
  getPages: gps,
  getChapters: gcs,
  getSeries: gss,
};
