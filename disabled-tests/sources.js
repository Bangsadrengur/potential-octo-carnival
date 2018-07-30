const test = require('ava');
const { fake } = require('sinon');
const Sources = require('../backend/sources');

/*
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
*/

test.todo('offering One Piece', async (t) => {
  function External() {
    getPage
  }
  const HTTPRequest = () => ({
    get: fake(),
  });
  const system = {
    HTTPRequest,
  };
  const sources = Sources(External, system);

  await sources.getChapters('One Piece');

  t.equals(HTTPRequest.get.callCount, 1);
});
test.todo('offering One-punch Man');
test.todo('minimizing calls to external sources when getting chapters for One Piece');

test.todo('failing to fetch some of the latest chapters for One Piece');
test.todo('failing to fetch some of the latest chapters for One-punch Man');
test.todo('failing to fetch all of the latest chapters for One Piece');
test.todo('failing to fetch all of the latest chapters for One-punch Man');

test.todo('failing to fetch a page of a chapter of One Piece');
test.todo('failing to fetch a page of a chapter of One-punch Man');
test.todo('fetching a non existant page of a chapter of One Piece');
test.todo('fetching a non existant page of a chapter of One-punch Man');
