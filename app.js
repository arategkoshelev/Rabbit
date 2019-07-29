const http = require('http');
const url = require('url')

const server = new http.Server(function(req, res){
  console.log(req.method, req.url);
  console.log("headers", req.headers)
  const urlParse = url.parse(req.url, true);
  console.log(urlParse);
  if (urlParse.pathname == '/tut' && urlParse.query.name)
  {
    res.setHeader('Cache-control', 'no-cache')
    res.statusCode=200;
    res.end(urlParse.query.name);
  }else{
    res.statusCode=404;
    res.end("Page not found")
  }
})

server.listen(1337, '127.0.0.1')
