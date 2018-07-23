const R = require('ramda');
const ms = require('ms');

const viewsPath = 'dist';

module.exports = (
  { WebApplicationFramework },
  { getChapters, getPage },
) => {
  const webApplicationFramework = WebApplicationFramework();
  const { get } = webApplicationFramework;

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
    const serieId = req.params.serieId;
    const limit = req.params.limit;
    getChapters(serieId)
      .then(R.take(limit))
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res, next) => {
    getPage(req.params.serieId, req.params.chapterId, req.params.pageId)
      .then((image) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.end(image);
      })
      .catch((error) => { next(error); });
  });

  return webApplicationFramework;
};
