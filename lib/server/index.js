const express = require('express');
const R = require('ramda');

/* development */
const cors = require('cors');
/* development */

module.exports = ({ getChapters, getPages, getPage }, favorites) => {
  /*
   * Out: [{
   *        serie :: String,
   *        lastFive :: [{ number :: Number, name :: String }]
   *        }]
   */
  const kebabCase = string => string.replace(/\s+/g, '-').toLowerCase();
  const getFavoritesWithLatestChapters = () => 
    Promise.all(favorites.map(kebabCase).map(getChapters))
      .then(R.map(R.take(5)))
      .then(R.zipWith(
        (name ,chapters) => ({name, urlName: kebabCase(name) ,chapters}),
        favorites
      ))

  const app = express();
  app.set('views', './lib/UA');
  app.set('view engine', 'pug');
  /* development */
  app.use(cors());
  /* development */

  app.get('/', (req, res) => {
    console.log('/');
    res.sendFile('index.html', { root: 'lib/UA/' });
  });

  app.get('/browse/series/:serieId/chapters/:chapterId/pages', (req, res) => {
    const serie = req.params.serieId;
    const chapter = req.params.chapterId;
    console.log('/browse/series/' + serie + '/chapters/' + chapter + '/pages');
    getPages(serie, chapter)
      .then(R.pluck('number'))
      .then(R.reverse)
      .then(R.map(R.add(1)))
      .then((pages) => { res.render('pages', { pages, serie, chapter }); })
      .catch((error) => { console.log(error); });
  });

  app.get('/browse/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    const serie = req.params.serieId;
    const chapter = req.params.chapterId;
    const page = req.params.pageId;
    console.log('/browse/series/' + serie + '/chapters/' + chapter + '/pages/' + page);
    getPages(serie, chapter)
      .then(R.any(R.propEq('number', Number(page))))
      .then((hasNext) => {
        res.render('page', { serie, chapter, page, hasNext });
        if (hasNext) { getPage(serie, chapter, page); }
      })
  });

  app.get('/api/series', (req, res) => {
    console.log('/api/series');
    Promise.resolve(favorites)
    // .then((series) => { res.json(series); })
      .then((series) => { res.json([{
        name: "One Piece",
        urlName: "one-piece",
        chapters: [{
          name: "latest",
          number: "871",
          date: "date",
          pageCount: 1,
        }]
      }]); })
      .catch((error) => { console.log("ERROR", error); });
  });

  app.get('/api/series/favorites/recent', (req, res) => {
    console.log('/api/series/favorites/recent');
    getFavoritesWithLatestChapters()
      .then((series) =>  { res.json(series); })
      .catch((error) => { console.log("ERROR", error); });
  });

  app.get('/api/series/:serieId/chapters', (req, res) => {
    console.log(`/api/series/${req.params.serieId}`);
    getChapters(req.params.serieId)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages', (req, res) => {
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

  return app;
}
