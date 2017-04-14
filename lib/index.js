const client = require('./manga-eden-client');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  client()
    .then((image) => image.pipe(res));
});

app.get('/series/:seriesId/chapter/:chapterId/page/:pageId', (req, res) => {
  console.log(req.params);
  client(req.params.seriesId, req.params.chapterId, req.params.pageId)
    .then((image) => { image.pipe(res) })
    .catch((error) => { console.log(error); });
});

app.listen(3000, () => {});
