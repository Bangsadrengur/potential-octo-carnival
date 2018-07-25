const express = require('express');
const morgan = require('morgan');
const rp = require('request-promise-native');
const cache = require('memory-cache');

function WebApplicationFramework() {
  const app = express();

  app.use(morgan('tiny'));
  app.set('view engine', 'pug');


  return {
    get: (...args) => app.get(...args),
    start: port => app.listen(port),
  };
}

function HTTPRequest() {
  return {
    get: uri => rp({ uri, encoding: null }),
  };
}

const System = {
  WebApplicationFramework,
  HTTPRequest,
  cache,
};

module.exports = System;
