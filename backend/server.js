const R = require('ramda');
const ms = require('ms');

const viewsPath = 'dist';

function Server(
  { getChapters: getChaptersFromSource, getPage: getPageFromSource },
) {
  const browseRoot = () =>
    (res) => {
      console.log("SENDING FILE");
      res.sendFile('index.html', { root: viewsPath });
    };

  const browsePage = () =>
    (res) => {
      res.sendFile('page.html', { root: viewsPath, maxAge: ms('1d') });
    };

  const getChapters = serie =>
    (res, next) => {
      getChaptersFromSource(serie)
        .then((chapters) => { res.json(chapters); })
        .catch((error) => { next(error); });
    };

  const getChaptersLimitedTo = (serie, limit) =>
    (res, next) => {
      getChaptersFromSource(serie)
        .then(R.take(limit))
        .then((chapters) => { res.json(chapters); })
        .catch((error) => { next(error); });
    };

  const getPage = (serie, chapter, page) =>
    (res, next) => {
      getPageFromSource(serie, chapter, page)
        .then((image) => {
          res.setHeader('Cache-Control', 'max-age=86400');
          res.end(image);
        })
        .catch((error) => { next(error); });
    };

  return {
    browseRoot,
    browsePage,
    getChapters,
    getChaptersLimitedTo,
    getPage,
  };
}

module.exports = Server;
