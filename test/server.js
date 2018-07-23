const test = require('ava');
const Server = require('../js');

function WebApplicationFramework() {
  return {
    get: () => ([{
      date: '20/6/2018',
      name: 'Chapter one',
      number: 1,
      path: 'path/to/chapter',
    }]),
  };
}
function HTTPRequest() {
  return {
    get: () => 'http response',
  };
}

const cache = {
  get: () => {},
};

const system = {
  WebApplicationFramework,
  HTTPRequest,
  cache,
};

test('fetching latest chapters for available series', async (t) => {
  const server = Server(system);

  const output = server.get('/api/series/one-piece/chapters/limit/5');
  t.deepEqual(output, [
    {
      number: 1,
      name: 'Chapter one',
      path: 'path/to/chapter',
      date: '20/6/2018',
    },
  ]);
});

test.todo('fetching a page of a chapter');

test.todo('failing to fetch some of the latest chapters for available series');
test.todo('failing to fetch all of the latest chapters of the available series');

test.todo('failing to fetch a page of a chapter');
test.todo('fetching a non existant page of a chapter');
