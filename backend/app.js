const Backend = require('./backend');

function App(system) {
  const web = system.WebApplicationFramework();
  const { get } = web;
  const {
    browseRoot,
    browsePage,
    getChapters,
    getChaptersLimitedTo,
    getPage,
  } = Backend(system);

  get('/', (req, res) => {
    browseRoot()(res);
  });

  get('/browse/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    browsePage()(res);
  });

  get('/api/series/:serieId/chapters', (req, res, next) => {
    const serie = req.params.serieId;
    getChapters(serie)(res, next);
  });

  get('/api/series/:serieId/chapters/limit/:limit', (req, res, next) => {
    const { serieId, limit } = req.params;
    getChaptersLimitedTo(serieId, limit)(res, next);
  });

  get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res, next) => {
    const { serieId, chapterId, pageId } = req.params;
    getPage(serieId, chapterId, pageId)(res, next);
  });

  return web;
}

module.exports = App;
