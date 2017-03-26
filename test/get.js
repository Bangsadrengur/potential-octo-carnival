const test = require('ava');
const get = require('../lib/get');


test('.get gets path', (t) => {
  const request = (path, callback) => {
    callback(null, { statusCode: 200 }, 'JSON');
  };

  return get(request, 'path').then((result) => {
    t.is(result, 'JSON');
  });
});
