const source = require('./manga-eden-client');
const db = {
  getSeries: () => {},
  getChapters: () => {},
  getPages: (serieId, chapterId) => source.getPages(serieId, chapterId),
  getPage: (serieId, chapterId, pageId) => source.getPage(serieId, chapterId, pageId),
}
const express = require('express');
const app = express();

const getChapter = (serieId, chapterId) => db.getPages(serieId, chapterId);
const getPage = (serieId, chapterId, pageId) => db.getPage(serieId, chapterId, pageId);

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
