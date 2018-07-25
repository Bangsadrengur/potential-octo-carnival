const test = require('ava');
const Backend = require('../js');

const routes = {};

const favorites = {
  serie: { lookup: 'Manga serie', source: 'manga-eden' },
};

const webApplicationFramework = {
  trigger: uri => new Promise((resolve, reject) => {
    routes[uri](
      { params: { serieId: 'serie', limit: 1 } },
      { json: (...args) => { resolve(...args); } },
      (...args) => { reject(...args); },
    );
  }),
  get: (uri, callback) => {
    routes[uri] = callback;
  },
};

function WebApplicationFramework() {
  return webApplicationFramework;
}

function HTTPRequest() {
  const serie = {
    end: 1,
    manga: [{
      a: 'a',
      c: ['c'],
      h: 0,
      i: 'id',
      im: 'im',
      ld: 0,
      s: 0,
      t: 'Manga serie',
    }],
    page: 1,
    start: 1,
    total: 1,
  };

  const chapters = {
    chapters: [[1, 1275542373, 'Chapter one', 'path/to/chapter']],
  };

  const get = async (url) => {
    if (url === 'http://www.mangaeden.com/api/list/0/') { return JSON.stringify(serie); }
    if (url === 'http://www.mangaeden.com/api/manga/id') { return JSON.stringify(chapters); }
    return {};
  };

  return {
    get,
  };
}

const cache = {
  get: () => {},
  put: () => {},
};

const system = {
  WebApplicationFramework,
  HTTPRequest,
  cache,
};

test('fetching latest chapters for available series', (t) => {
  Backend(system, favorites);

  return webApplicationFramework.trigger(
    '/api/series/:serieId/chapters/limit/:limit')
    .then((output) => {
      t.deepEqual(output, [{
        number: 1,
        name: 'Chapter one',
        path: 'path/to/chapter',
        date: '3/5/2010',
      }]);
    });
});

test.todo('fetching a page of a chapter');
test.todo('minimizing calls to external sources when querying for data');

test.todo('failing to fetch some of the latest chapters for available series');
test.todo('failing to fetch all of the latest chapters of the available series');

test.todo('failing to fetch a page of a chapter');
test.todo('fetching a non existant page of a chapter');
