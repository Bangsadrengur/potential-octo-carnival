/* eslint-disable no-console */
const express = require('express');
const R = require('ramda');
const ms = require('ms');
// const cors = require('cors');
const morgan = require('morgan');

const viewsPath = 'dist';

module.exports = ({ getChapters, getPages, getPage }, favorites) => {
  const app = express();
  app.set('views', 'viewsPath');
  app.set('view engine', 'pug');
  /* development */
  // app.use(cors());
  /* development */

  app.use(morgan('tiny'));

  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: viewsPath });
  });

  app.get('/browse/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    const serie = req.params.serieId;
    const chapter = req.params.chapterId;
    const page = req.params.pageId;
    res.sendFile('page.html', { root: viewsPath, maxAge: ms('1d') });
  });

  app.get('/api/series/:serieId/chapters', (req, res) => {
    getChapters(req.params.serieId)
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  app.get('/api/series/:serieId/chapters/limit/:limit', (req, res) => {
    const serieId = req.params.serieId;
    const limit = req.params.limit;
    getChapters(serieId)
      .then(R.take(5))
      .then((chapters) => { res.json(chapters); })
      .catch((error) => { next(error); });
  });

  app.get('/api/series/:serieId/chapters/:chapterId/pages/:pageId', (req, res) => {
    getPage(req.params.serieId, req.params.chapterId, req.params.pageId)
      .then((image) => {
        res.setHeader('Cache-Control', 'max-age=86400');
        res.end(image);
      })
      .catch((error) => { next(error) });
  });

  return app;
};
