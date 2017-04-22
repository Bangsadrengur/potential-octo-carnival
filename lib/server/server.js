const R = require('ramda');
const favorites =  ['one-piece'];
module.exports = express => ({ getSeries, getChapters, getPages, getPage }) => {
  const app = express();

  app.get('/api/series/favorites', (req, res) => {
    console.log('/api/series/favorites');
    getSeries()
      // .then(data => { console.log("DATA", data); return data; })
      .then(R.pluck('title'))
      .then(R.filter(R.equals('One Piece')))
      .then((series) => { res.json(series); })
      .catch((error) => { console.log("ERROR", error); });
  });

  app.get('/api/series/:serieId', (req, res) => {
    console.log(`/api/series/${req.params.serieId}`);
    getChapters(req.params.serieId)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId', (req, res) => {
    console.log(req.params);
    getPages(req.params.serieId, req.params.chapterId)
      .then((pages) => { res.json(pages); })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    console.log(req.params);
    getPage(req.params.serieId, req.params.chapterId, req.params.pageId)
      .then((image) => { res.end(image); })
      .catch((error) => { console.log(error); });
  });

  app.use(express.static('lib/UA'));

  return app;
}
