const R = require('ramda');
const request = require('request');
const fs = require('fs');

const get = require('./get');
const getMangaId = require('./getMangaId');
const getChapterId = require('./getChapters');
const getPages = require('./getPages');
const getAndWriteToFile = require('./getAndWriteToFile');
const getAnImage = require('./getAnImage');

const url = 'http://www.mangaeden.com';
const cdnUrl = 'http://cdn.mangaeden.com/mangasimg/'
const listPath = '/api/list/0/';
const chapters = '/api/manga/';
const pages = '/api/chapter/';

const getMangaList = () => get(request, url + listPath);
const getChapterList = serieId => get(request, url + chapters + serieId);
const getPageList = chapterId => get(request, url + pages + chapterId);
const getImage = getAndWriteToFile(fs, request, cdnUrl); 


getMangaId(getMangaList, "One Piece")
  .then(getChapterId(getChapterList)(1))
  .then(getPages(getPageList))
  .then(getAnImage(getImage('test.jpg'), 1))
  .catch(console.log.bind(null, 'error'));
