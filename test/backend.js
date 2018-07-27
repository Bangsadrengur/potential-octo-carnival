const test = require('ava');
const Backend = require('../backend');

const routes = {};

const favorites = {
  serie: { lookup: 'Manga serie', source: 'manga-eden' },
};

const cache = {
  get: () => {},
  put: () => {},
};

test('fetching latest chapters for available series', (t) => {
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

  const system = {
    WebApplicationFramework,
    HTTPRequest,
    cache,
  };

  Backend(system, favorites);

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
  function HTTPRequest() {
    const serie = {
      end: 1,
      manga: [{
        a: 'a',
        c: ['c'],
        h: 0,
        i: 'serie-id',
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
      chapters: [[1, 1275542373, 'Chapter one', 'chapter-id']],
    };

    const pages = {
      images: [
        [
          0,
          'two/part-path.jpg',
          570,
          570,
        ],
      ],
    };

    const get = async (url) => {
      if (url === 'http://www.mangaeden.com/api/list/0/') { return JSON.stringify(serie); }
      if (url === 'http://www.mangaeden.com/api/manga/serie-id') {
        return JSON.stringify(chapters);
      }
      if (url === 'http://www.mangaeden.com/api/chapter/chapter-id') {
        return JSON.stringify(pages);
      }
      if (url === 'http://cdn.mangaeden.com/mangasimg/two/part-path.jpg') {
        return Buffer.from([0x00, 0x01]);
      }
      return {};
    };

    return {
      get,
    };
  }

  const getReq = (req) => {
    switch (req) {
      case '/api/series/:serieId/chapters/:chapterId/pages/:pageId':
        return { params: { serieId: 'serie', chapterId: '1', pageId: '1' } };
      default:
        return {};
    }
  };

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
    HTTPRequest,
    cache,
  };

  Backend(system, favorites);

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
