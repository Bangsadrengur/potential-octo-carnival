const R = require('ramda');
const ms = require('ms');

const viewsPath = 'dist';

function Server(
  { getChapters: getChaptersFromSource, getPage: getPageFromSource },
) {
  const browseRoot = () =>
    (req, res) => {
      res.sendFile('index.html', { root: viewsPath });
    };

  const browsePage = () =>
    (req, res) => {
      res.sendFile('page.html', { root: viewsPath, maxAge: ms('1d') });
    };

  const getChapters = serie =>
    (req, res, next) => {
      getChaptersFromSource(serie)
        .then((chapters) => { res.json(chapters); })
        .catch((error) => { next(error); });
    };

  const getChaptersLimitedTo = (serie, limit) =>
    (req, res, next) => {
      getChaptersFromSource(serie)
        .then(R.take(limit))
        .then((chapters) => { res.json(chapters); })
        .catch((error) => { next(error); });
    };

  const getPage = ({ serie, chapter, page }) =>
    (req, res, next) => {
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
