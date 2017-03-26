const request = require('request');
const get = require('./get');

const url = 'http://www.mangaeden.com';
const listPath = '/api/list/0/';

const getMangaList = () => get(request, url + listPath);

getMangaList().then(console.log).catch(console.log.bind(null, 'error'));
