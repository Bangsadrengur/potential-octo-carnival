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
  const {
    getEncoded,
    getUnencoded,
  } = HTTPRequest();

  const serieMap = { 'one-piece': 'One Piece' };

  const getMangaList = () => getEncoded(url + listPath);
  const getChapterList = chaptersUrl => getEncoded(`${url}${chapters}${chaptersUrl}`);
  const getPageList = chapterId => getEncoded(url + pages + chapterId);
  const getImage = path => getUnencoded(R.concat(cdnUrl, path));

  const getSeries = () =>
    getMangaList()
      .then(parseSeries);

  const getChapters = serie =>
    getSeries()
      .then(parseChaptersUrl(serieMap[serie]))
      .then(getChapterList)
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
