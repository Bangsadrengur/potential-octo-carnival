const R = require('ramda');
const ms = require('ms');

const viewsPath = 'dist';

function Router(
  { get },
  { getChapters, getPage },
) {
  get('/', (req, res) => {
    res.sendFile('index.html', { root: viewsPath });
  });

  get('/browse/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    res.sendFile('page.html', { root: viewsPath, maxAge: ms('1d') });
  });

  get('/api/series/:serieId/chapters', (req, res, next) => {
    const serie = req.params.serieId;
    getChapters(serie)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  get('/api/series/:serieId/chapters/limit/:limit', (req, res, next) => {
    const { serieId, limit } = req.params;
    getChapters(serieId)
      .then(R.take(limit))
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res, next) => {
    const { serieId, chapterId, pageId } = req.params;
    getPage(serieId, chapterId, pageId)
      .then((image) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.end(image);
      })
      .catch((error) => { next(error); });
  });
}

module.exports = Router;
