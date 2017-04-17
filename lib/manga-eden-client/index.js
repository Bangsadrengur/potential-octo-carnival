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
};

const gcs = serie => getMangaId(getMangaList, seriesMap[serie] || serie)
    .then(R.concat(url + chapters))
    .then(rp)
    .then(R.pipe(JSON.parse, R.prop('chapters')))
    .then(R.map(([number, timestamp, name, path]) => ({ number, timestamp, name, path})));

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
};
