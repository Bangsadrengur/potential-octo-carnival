const source = require('./manga-eden-client');
const db = {
  getSeries: () => {},
  getChapters: (serieId) => source.getChapters(serieId),
  getPages: (serieId, chapterId) => source.getPages(serieId, chapterId),
  getPage: (serieId, chapterId, pageId) => source.getPage(serieId, chapterId, pageId),
}
const express = require('express');
const app = express();

const getChapters = db.getChapters;
const getChapter = db.getPages;
const getPage = db.getPage;

app.get('/api/serie/:serieId', (req, res) => {
  console.log(req.params);
  getChapters(req.params.serieId)
    .then((chapters) => { res.json(chapters);
    })
    .catch((error) => { console.log(error); });
});

app.get('/api/serie/:serieId/chapter/:chapterId', (req, res) => {
  console.log(req.params);
  getChapter(req.params.serieId, req.params.chapterId)
    .then((pages) => { res.json(pages); })
    .catch((error) => { console.log(error); });
});

app.get('/api/serie/:serieId/chapter/:chapterId/page/:pageId', (req, res) => {
  console.log(req.params);
  getPage(req.params.serieId, req.params.chapterId, req.params.pageId)
    .then((image) => { res.end(image); })
    .catch((error) => { console.log(error); });
});

app.use(express.static('lib/UA'));

app.listen(3000, () => {});
