const test = require('ava');
const Domain = require('../backend/domain');

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
      t: 'One Piece',
    }],
    page: 1,
    start: 1,
    total: 1,
  };


  const chapters = {
    chapters: [[1, 1275542373, 'Chapter one', 'path/to/chapter']],
  };

  const pages = { images: [[0, 'image.extension', 123, 456]] };


  const getEncoded = async (url) => {
    if (url === 'http://www.mangaeden.com/api/list/0/') { return JSON.stringify(serie); }
    if (url === 'http://www.mangaeden.com/api/manga/id') { return JSON.stringify(chapters); }
    if (url === 'http://www.mangaeden.com/api/chapter/path/to/chapter') {
      return JSON.stringify(pages);
    }
    return {};
  };

  const getUnencoded = async () => Buffer.from([0x00, 0x01]);

  return {
    getEncoded,
    getUnencoded,
  };
}

const framework = {
  HTTPRequest,
};

test('fetching chapters of One Piece', (t) => {
  const domain = Domain(framework);

  const serie = 'one-piece';
  return domain.getChapters(serie)
    .then((chapters) => {
      t.deepEqual(chapters, [{
        date: '3/5/2010',
        name: 'Chapter one',
        number: 1,
        path: 'path/to/chapter',
      }]);
    });
});

test('fetching a page of One Piece', (t) => {
  const domain = Domain(framework);

  const serie = 'one-piece';
  const chapter = 1;
  const page = 1;
  return domain.getPage(serie, chapter, page)
    .then((image) => {
      t.deepEqual(image, Buffer.from([0x00, 0x01]));
    });
});

test.todo('failing to fetch a page of One Piece');
