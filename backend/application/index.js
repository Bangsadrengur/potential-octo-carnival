const Domain = require('../domain');
const ms = require('ms');
const { take } = require('ramda');

function Application({
  WebApplicationFramework,
  HTTPRequest,
}) {
  const { getChapters, getPages, getPage } = Domain({ HTTPRequest });
  const app = WebApplicationFramework();

  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
  });

  app.get('/browse/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    res.sendFile('page.html', { root: 'dist', maxAge: ms('1d') });
  });

  app.get('/api/series/:serieId/chapters', (req, res, next) => {
    const { serieId } = req.params;
    getChapters(serieId)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  app.get('/api/series/:serieId/chapters/limit/:limit', (req, res, next) => {
    const { serieId, limit } = req.params;
    getChapters(serieId)
      .then(take(limit))
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages', (req, res, next) => {
    const { serieId, chapterId } = req.params;
    getPages(serieId, chapterId)
      .then(pages => pages.length)
      .then((count) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.json({ count });
      })
      .catch((error) => { next(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res, next) => {
    const { serieId, chapterId, pageId } = req.params;
    getPage(serieId, chapterId, pageId)
      .then((image) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.end(image);
      })
      .catch((error) => { next(error); });
  });


  return {
    start: port => app.listen(port),
  };
}

module.exports = Application;
