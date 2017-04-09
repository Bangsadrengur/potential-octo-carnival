const test = require('ava');
const getMangaId = require('../lib/getMangaId');

test('.getMangaId gets a manga id by name', (t) => {
  const get = () => Promise.resolve(
    '{ "manga": [{ "t": "name", "i": 1 }]}'
  );
  const name = 'name';

  return getMangaId(get, name)
    .then((result) => {
      t.deepEqual(result, 1);
    });
});
