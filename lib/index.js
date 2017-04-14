const client = require('./manga-eden-client');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  client()
    .then((image) => image.pipe(res));
});

app.listen(3000, () => {});
