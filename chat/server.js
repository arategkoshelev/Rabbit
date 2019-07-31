const http = require('http');
const fs = require('fs');
const url = require('url')
const chat = require('./chat');
const sendFile = require('../utils/sendFile');
//const streamFile = require('../utils/streamFile');

const ROOT = __dirname + '/';

http.createServer((req,res)=>{
  const urlParsed = url.parse(req.url, true);

  switch(urlParsed.pathname){
    case '/':
      sendFile(ROOT+"/index.html", res);
      break;
    
    case '/main.js':
      sendFile(ROOT+"/main.js", res);
      break;

    case '/subscribe':
      chat.subscribe(req, res);
      break;
      
    case '/publish':
      console.log('+++++++++')
      let body = '';

      req
        .on('readable', function(){

          const reqread = req.read();
          if (reqread){
            body += reqread;
          }
           
          if (body.length > 1e4){
            res.statusCode = 413;
            res.end('Too big message')
          }

        })
        .on('end', function(){
          try{
              
            body = JSON.parse(body);

          }catch(e){
            console.log(e)
            res.statusCode = 400;
            res.end('Bad JSON');
            return
          }

          chat.publish(body.message);
          res.end('ok')
        })

      break;
      
    default:
      res.statusCode = 404;
      res.end('Not found');         
  }
}).listen(3001)

