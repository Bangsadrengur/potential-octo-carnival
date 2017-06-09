const R = require('ramda');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const rp = require('request-promise-native');
const pify = require('pify');
const get = pify(cloudscraper.get);

const createSource = seriesMap => {
  const getChapters = serie => new Promise((resolve, reject) => {
    cloudscraper.get('http://www3.mangafreak.net/Read1_Onepunch_Man_1', (error, response, body) => {
      if (error) { reject(error); return; }

      const $ = cheerio.load(body);
      const value = $('.chapter_list > select:nth-child(2) > option:last-child').attr().value;
      const value2 = R.reverse(R.range(1, R.inc(Number(R.last(R.split('_', value))))));
      const value3 = R.map(number => ({ number }), value2);
      resolve(value3);
    });
  });

  const getPages = (serie, chapter) => new Promise((resolve, reject) => {
    cloudscraper.get('http://www3.mangafreak.net/Read1_Onepunch_Man_' + chapter, (error, response, body) => {
      if (error) { reject(error); return; }

      const $ = cheerio.load(body);
      const value = $('.read_selector > select:nth-child(1) > option:last-child').attr().value;
      const value2 = R.reverse(R.range(1, R.inc(Number(R.last(R.split('_', value))))));
      const value3 = R.map(number => ({
        number,
        path: 'http://www3.mangafreak.net/Read1_Onepunch_Man_' + chapter + '_' + number,
      }), value2);
      resolve(value3);
    });
  });

  const cdnUrl = 'http://images.mangafreak.net/mangas';

  const getPage = (serie, chapter, page) => new Promise((resolve, reject) => {
    cloudscraper.request(
      {
        method: 'GET',
        url: cdnUrl + '/onepunch_man/onepunch_man_' + chapter + '/onepunch_man_' + chapter + '_' + page + '.jpg?v5',
        encoding: null,
      },
      (error, response, body) => {
        if (error) { reject(error); return; }

        resolve(body);
      }
    );
  })

  return {
    getPage,
    getPages,
    getChapters,
  };
}

module.exports = createSource;