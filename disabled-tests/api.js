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

const system = {
  WebApplicationFramework,
  cache,
};

test('fetching latest chapters for available series', (t) => {
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
  Backend(system, Sources);

  return webApplicationFramework.trigger('/api/series/:serieId/chapters/:chapterId/pages/:pageId')
    .then((output) => {
      t.deepEqual(output, Buffer.from([0x00, 0x01]));
    });
});
