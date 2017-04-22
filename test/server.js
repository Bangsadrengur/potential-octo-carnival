const test = require('ava');
const infuseServer = require('../lib/server/server');

const app = { get() {}, use: () =>  {} }
const express = () => app;
express.static = () => {};
const createServer = infuseServer(express);

test('createServer returns a new server', t => {
  t.is(createServer(express), app);
});
