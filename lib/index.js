const R = require('ramda');
const request = require('request');

const get = require('./get');
const getMangaId = require('./getMangaId');
const getChapterId = require('./getChapters');
const getPages = require('./getPages');

const url = 'http://www.mangaeden.com';
const cdnUrl = 'http://cdn.mangaeden.com/mangasimg/'
const listPath = '/api/list/0/';
const chapters = '/api/manga/';
const pages = '/api/chapter/';

const getMangaList = () => get(request, url + listPath);
const getChapterList = serieId => get(request, url + chapters + serieId);
const getPageList = chapterId => get(request, url + pages + chapterId);
const getImage = path => get(request, cdnUrl + path);

const getAnImage = get => pages => number => {
  const ps = R.filter(page => page.number === number)(pages)
  console.log("PS", ps);
  const p = R.head(ps);
  const path = p.path;
  return get(path);
}
  //R.compose(
  //  get,
  //  page => page.path,
  //  R.head,
  //  R.filter(page => page.number === number)
  //);

getMangaId(getMangaList, "One Piece")
  .then(getChapterId(getChapterList)(1))
  .then(getPages(getPageList))
  .then(getAnImage(getImage))
  .then(fn => fn(1))
  .catch(console.log.bind(null, 'error'));
