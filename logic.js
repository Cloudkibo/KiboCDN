const url = require('url')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable');
const etag = require('etag')

// maps file extention to MIME types
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
}

exports.logic = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // parse URL
  const parsedUrl = url.parse(req.url)

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  /* eslint-disable */
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '')
  /* eslint-enable */
  let pathname = path.join(__dirname, sanitizePath)

  // Upload bundle.js logic
  if (req.url === '/fileupload' && req.method.toLowerCase() === 'post') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.bundle.path;
      var newpath = __dirname + '/public/' + files.bundle.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
    return ;
  }

  fs.access(pathname, fs.constants.F_OK, (err) => {
    if (err) {
      // if the file is not found, return 404
      res.statusCode = 404
      res.end(`File ${req.url} not found!`)
      return
    }
    // if is a directory, then look for index.html
    let stats = fs.statSync(pathname)
    if (stats.isDirectory()) {
      // pathname += '/index.html'
      res.statusCode = 404
      res.end(`Please provide file name as well.`)
      return
    }
    // read file from file system
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext
        // if the file is found, set Content-type and prepare to send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
        res.setHeader('ETag', etag(data))

        if (req.headers.hasOwnProperty('if-none-match')) {
          // if required file is not changed, ask browser to use cache
          if (req.headers['if-none-match'] === etag(data)) {
            res.statusCode = 304;
            res.end();
            return ;
          }
        }

        // setting up the cache policy and sending the actual file
        if (req.url === '/public/bundle.js' || req.url === '/public/bundle_staging.js') {
          // set cache duration for 1 minute, and revalidate from server about expiry
          res.setHeader('Cache-Control', 'max-age=60, must-revalidate')
        } else {
          // set cache duration for 1 hour, and revalidate from server about expiry
          res.setHeader('Cache-Control', 'max-age=3600, must-revalidate')
        }
        res.setHeader('Content-Length', stats.size)
        res.write(data)
        res.end()
      }
    })
  })
}
