const url = require('url')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable');

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
    if (fs.statSync(pathname).isDirectory()) {
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
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
        if (req.url === '/public/bundle.js') {
          res.setHeader('Cache-Control', 'public, max-age=432000, no-cache, must-revalidate')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000')
        }
        res.end(data)
      }
    })
  })
}
