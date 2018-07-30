const express = require('express');
const morgan = require('morgan');
const rp = require('request-promise-native');
const cache = require('memory-cache');
const debug = require('debug');

const Application = require('../application');


function HTTPRequest() {
  const debugHTTPRequest = debug('HTTPRequest');
  const timeout = 1800000; // 30 minutes

  const get = async (requestParameters) => {
    const { uri } = requestParameters;
    const cachedResponse = cache.get(uri);
    if (cachedResponse) {
      return cachedResponse;
    }

    return rp(requestParameters)
      .then((value) => {
        cache.put(uri, value, timeout);
        return value;
      });
  };

  const getEncoded = async (uri) => {
    debugHTTPRequest('getEncoded', uri);
    return get({ uri });
  };

  const getUnencoded = async (uri) => {
    debugHTTPRequest('getUnencoded', uri);
    return get({ uri, encoding: null });
  };

  return {
    getEncoded,
    getUnencoded,
  };
}

function WebApplicationFramework() {
  const app = express();
  app.use(morgan('tiny'));

  return app;
}

const framework = {
  WebApplicationFramework,
  HTTPRequest,
};

function Framework() {
  return Application(framework);
}

module.exports = Framework;
