module.exports = (fs, request, url) => filename => path => {
  const uri = url + path;

  new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      if (err) reject(err);

      request(uri)
        .pipe(require('fs').createWriteStream(filename))
        .on('close', resolve);
    });
  })
}

