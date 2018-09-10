const http = require('http')
const https = require('https')
const fs = require('fs')
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000
const securePort = process.argv[3] || 8443
const env = process.env.NODE_ENV || 'development'

let options = {
  ca: '',
  key: '',
  cert: ''
}

if (env === 'production') {
  try {
    options = {
      ca: fs.readFileSync('/root/certs/kibopush.ca-bundle'),
      key: fs.readFileSync('/root/certs/kibopush.key'),
      cert: fs.readFileSync('/root/certs/kibopush.crt')
    }
  } catch (e) {
    console.log('Error in loading certs')
    console.log(e)
  }
}

http.createServer(require('./logic').logic).listen(parseInt(port))
https.createServer(options, require('./logic').logic).listen(parseInt(securePort))

console.log(`Server listening on ports ${port} and ${securePort}`)
