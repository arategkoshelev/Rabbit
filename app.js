const http = require('http');
const url = require('url')
const debug = require('debug')('server:request')
const log = require('./utils/winstonlog')(module)

const server = new http.Server(function(req, res){

  log.info('not important')

  const urlParse = url.parse(req.url, true);
  debug(urlParse);
  if (urlParse.pathname == '/tut' && urlParse.query.name)
  {
    res.setHeader('Cache-control', 'no-cache')
    res.statusCode=200;
    res.end(urlParse.query.name);
  }else{
    log.error('unknown url')
    res.statusCode=404;
    res.end("Page not fod")
  }
})

server.listen(1337, '127.0.0.1')
