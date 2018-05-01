/* eslint-disable no-console */
const express = require('express');
const R = require('ramda');
const ms = require('ms');
const cors = require('cors');

const viewsPath = 'dist';

module.exports = ({ getChapters, getPages, getPage }, favorites) => {
  /*
   * Out: [{
   *        serie :: String,
   *        lastFive :: [{ number :: Number, name :: String }]
   *        }]
   */
  const kebabCase = string => string.replace(/\s+/g, '-').toLowerCase();
  const getFavoritesWithLatestChapters = () =>
    Promise.all(
      favorites
      .map(kebabCase)
      .map(getChapters),
    )
    .then(R.map(R.take(5)))
    .then(
      R.map(
        R.map(
          R.compose(
            R.omit('path'),
            R.assoc('pageCount', -1),
            R.evolve({ number: R.toString }),
          ),
        ),
      ),
    )
    .then(R.zipWith(
      (name, chapters) => ({ name, urlName: kebabCase(name), chapters }),
      favorites,
    ));

  const app = express();
  app.set('views', 'viewsPath');
  app.set('view engine', 'pug');
  /* development */
  app.use(cors());
  /* development */

  app.get('/', (req, res) => {
    console.log('/');
    res.sendFile('index.html', { root: viewsPath });
  });

  app.get('/browse/series/:serieId/chapters/:chapterId/pages', (req, res) => {
    const serie = req.params.serieId;
    const chapter = req.params.chapterId;
    console.log(`/browse/series/${serie}/chapters/${chapter}/pages`);
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
    console.log(`/browse/series/${serie}/chapters/${chapter}/pages/${page}`);
    res.sendFile('page.html', { root: viewsPath, maxAge: ms('1d') });
  });

  app.get('/api/series', (req, res) => {
    console.log('/api/series');
    getFavoritesWithLatestChapters()
      .then((series) => {
        res.json(series);
      })
      .catch((error) => {
        console.log('/api/series failed with error: ', error);
        res.status(500).send();
      });
  });

  app.get('/api/series/favorites/recent', (req, res) => {
    console.log('/api/series/favorites/recent');
    getFavoritesWithLatestChapters()
      .then((series) => { res.json(series); })
      .catch((error) => { console.log('ERROR', error); });
  });

  app.get('/api/series/:serieId/chapters', (req, res) => {
    console.log(`/api/series/${req.params.serieId}`);
    getChapters(req.params.serieId)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/limit/:limit', (req, res) => {
    const serieId = req.params.serieId;
    const limit = req.params.limit;
    console.log(`/api/series/${serieId}/chapters/limit${limit}`);
    getChapters(serieId)
      .then(R.take(5))
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages', (req, res) => {
    console.log(req.params);
    getPages(req.params.serieId, req.params.chapterId)
      .then(pages => pages.length)
      .then((count) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.json({ count });
      })
      .catch((error) => { console.log(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    console.log(req.params);
    getPage(req.params.serieId, req.params.chapterId, req.params.pageId)
      .then((image) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.end(image);
      })
      .catch((error) => { console.log(error); });
  });

  return app;
};
