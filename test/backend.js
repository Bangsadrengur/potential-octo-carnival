const test = require('ava');
const Backend = require('../backend/backend');

const cache = {
  get: () => {},
  put: () => {},
};

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
      t: 'one-piece',
    }],
    page: 1,
    start: 1,
    total: 1,
  };


  const chapters = {
    chapters: [[1, 1275542373, 'Chapter one', 'path/to/chapter']],
  };

  const pages = { images: [[0, 'image.extension', 123, 456]] };

  const image = Buffer.from([0x00, 0x01]);

  const get = async (url) => {
    if (url === 'http://www.mangaeden.com/api/list/0/') { return JSON.stringify(serie); }
    if (url === 'http://www.mangaeden.com/api/manga/id') { return JSON.stringify(chapters); }
    if (url === 'http://www.mangaeden.com/api/chapter/path/to/chapter') {
      return JSON.stringify(pages);
    }
    if (url === 'http://cdn.mangaeden.com/mangasimg/image.extension') {
      return image;
    }
    return {};
  };

  return {
    get,
  };
}

const system = {
  HTTPRequest,
  cache,
};

test.cb('fetching a page of One Piece', (t) => {
  t.plan(1);
  const backend = Backend(system);

  const serie = 'one-piece';
  const chapter = 1;
  const page = 1;
  const fn = backend.getPage(serie, chapter, page);

  fn(
    {
      end: (arg) => {
        t.deepEqual(arg, Buffer.from([0x00, 0x01]));
        t.end();
      },
      setHeader: () => {},
    },
    (error) => {
      t.end(error);
    },
  );
});

test.todo('failing to fetch a page of One Piece');
