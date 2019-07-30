const http = require('http');
const url = require('url');
const checkAccess = require('./utils/checkAccess');
const sendFileSafe = require('./utils/sendFileSafe');
const streamFile = require('./utils/streamFile');

const ROOT = __dirname + '/public';

streamFile(ROOT + '/index.html');

http.createServer((req, res)=>{

  if (!checkAccess(req, 'o_O')){
    res.statusCode = 403;
    res.end('Tell me the stcret to access!');
    return
  }

  sendFileSafe(url.parse(req.url).pathname, res, ROOT)

}).listen(3000)


