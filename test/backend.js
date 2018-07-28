const test = require('ava');
const Backend = require('../backend');

const cache = {
  get: () => {},
  put: () => {},
};

function Sources() {
  return {
    getPage: async (/* serie, chapter, page */) => Buffer.from([0x00, 0x01]),
    getChapters: async (/* serie */) => ([{
      date: '3/5/2010',
      name: 'Chapter one',
      number: 1,
      path: 'path/to/chapter',
    }]),
  };
}

const getReq = (req) => {
  switch (req) {
    case '/api/series/:serieId/chapters/:chapterId/pages/:pageId':
      return { params: { serieId: 'serie', chapterId: '1', pageId: '1' } };
    case '/api/series/:serieId/chapters/limit/:limit':
      return { params: { serieId: 'serie', limit: 1 } };
    default:
      return {};
  }
};

const routes = {};

const webApplicationFramework = {
  trigger: uri => new Promise((resolve, reject) => {
    const req = getReq(uri);
    routes[uri](
      req,
      {
        json: (...args) => { resolve(...args); },
        setHeader: () => {},
        end: (...args) => { resolve(...args); },
      },
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


test('fetching latest chapters for available series', (t) => {
  const system = {
    WebApplicationFramework,
    cache,
  };

  Backend(system, Sources);

  return webApplicationFramework.trigger('/api/series/:serieId/chapters/limit/:limit')
    .then((output) => {
      t.deepEqual(output, [{
        number: 1,
        name: 'Chapter one',
        path: 'path/to/chapter',
        date: '3/5/2010',
      }]);
    });
});

test('fetching a page of a chapter', (t) => {
  const system = {
    WebApplicationFramework,
    cache,
  };

  Backend(system, Sources);

  return webApplicationFramework.trigger('/api/series/:serieId/chapters/:chapterId/pages/:pageId')
    .then((output) => {
      t.deepEqual(output, Buffer.from([0x00, 0x01]));
    });
});

test.todo('minimizing calls to external sources when querying for data');
test.todo('integrating with multiple sources of manga');

test.todo('failing to fetch some of the latest chapters for available series');
test.todo('failing to fetch all of the latest chapters of the available series');

test.todo('failing to fetch a page of a chapter');
test.todo('fetching a non existant page of a chapter');
