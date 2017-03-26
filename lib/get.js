const get = (request, path) => new Promise((resolve, reject) => {
  request(path, (error, response, body) => {
    if (error) { reject(error); return; }
    if (!response || response.statusCode !== 200) {
      reject(`${path} ${response.statusCode}`);
      return;
    }

    resolve(body);
  });
});

module.exports = get;
