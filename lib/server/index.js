const express = require('express');
const R = require('ramda');

module.exports = ({ getSeries, getChapters, getPages, getPage }, favorites) => {
  const app = express();
  app.set('views', './lib/UA');
  app.set('view engine', 'pug');

  app.get('/', (req, res) => {
    console.log('/');
    res.render('index', { series: favorites });
  });

  app.get('/browse/series', (req, res) => {
    console.log('/browse/series');
    res.render('index', { series: favorites });
  });

  app.get('/browse/series/:serieId/chapters', (req, res) => {
    const serieId = req.params.serieId;
    console.log('/browse/series/' + serieId + '/chapters');
    getChapters(serieId)
      .then((chapters) => { res.render('chapters', { serie: serieId, chapters }); })
      .catch((error) => { console.log(error); });
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
        console.log(hasNext);
        res.render('page', { serie, chapter, page, hasNext });
      })
  });

  app.get('/api/series', (req, res) => {
    console.log('/api/series');
    Promise.resolve(favorites)
      .then((series) => { res.json(series); })
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
