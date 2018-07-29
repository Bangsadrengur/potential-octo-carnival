const R = require('ramda');
const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  selectChapter,
  chapterToChapterPath,
  pagesToPagePath,
} = require('./parsers');

const url = 'http://www.mangaeden.com';
const cdnUrl = 'http://cdn.mangaeden.com/mangasimg/';
const listPath = '/api/list/0/';
const chapters = '/api/manga/';
const pages = '/api/chapter/';


const Source = ({ HTTPRequest }) => {
  const { get } = HTTPRequest();

  const getMangaList = () => get(url + listPath);
  const getPageList = chapterId => get(url + pages + chapterId);
  const getImage = path => get(R.concat(cdnUrl, path));

  const getSeries = () =>
    getMangaList()
      .then(parseSeries);

  const getChapters = serie =>
    getSeries()
      .then(parseChaptersUrl(serie))
      .then(R.concat(url + chapters))
      .then(get)
      .then(parseChapters);

  const getPages = (serie, chapter) =>
    getChapters(serie)
      .then(selectChapter(chapter))
      .then(chapterToChapterPath)
      .then(getPageList)
      .then(JSON.parse)
      .then(R.prop('images'))
      .then(R.map(([number, path, height, width]) => ({
        number, path, height, width,
      })));

  const getPage = (serie, chapter, page) =>
    getPages(serie, chapter)
      .then(R.compose(pagesToPagePath, R.dec, Number)(page))
      .then(getImage);

  return {
    getPage,
    getPages,
    getChapters,
  };
};

module.exports = Source;
