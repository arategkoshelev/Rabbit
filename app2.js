const http = require('http');
const url = require('url')
const fs = require('fs');

const server = new http.Server(function(req, res){

  const urlParse = url.parse(req.url, true);

  if (urlParse.pathname == '/tut' && urlParse.query.name)
  {
    res.setHeader('Cache-control', 'no-cache')
    res.statusCode=200;
    res.end(urlParse.query.name);
  }else if(urlParse.pathname == '/'){
    const students 
    res.end(info)
  }else{
    log.error('unknown url')
    res.statusCode=404;
    res.end("Page not fod")
  }
})

server.listen(1337, '127.0.0.1')
