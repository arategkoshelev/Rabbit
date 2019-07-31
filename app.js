const http = require('http');
const url = require('url')
const debug = require('debug')('server:request')
const log = require('./app/utils/winstonlog')(module)
const fs = require('fs');

const server = new http.Server(function(req, res){

  log.info('not important')

  const urlParse = url.parse(req.url, true);

  debug(urlParse);

  // setTimeout(function(){ //неизвестно когда сработает
  //   req.on('readable', function(){

  //   })
  // },0)



  const part = {count: 0, notFinished: true}
  setImmediate(function run(){  //работает асинхронно но первым попадает в очередь после обработки текущих событий, вычисления разбиваются на части как только вызывается
    const heavyCalc = (el) =>{
      el > 100 && (part.notFinished = false)
      // console.log(el)
    }
    heavyCalc(part.count++);
    if (part.notFinished) setImmediate(run)
  },0)

  process.nextTick(function(){  //сработает точно до наступления любых событий, в том числе ввода и вывода
    // console.log('tick')
    req.on('readable', function(){

    })
  },0)

  fs.stat(__filename, (err, stats)=>{
    console.log(stats.isFile());
    console.log(stats)
  })

  // fs.writeFile('file.tmp', 'myString', function(err){
  //   if (err) throw err;
  //   fs.rename('file.tmp', 'new.tmp', function(err){
  //     if (err) throw err;
  //     fs.unlink('new.tmp', function(err){
  //       if (err) throw err;
  //     })
  //   })
  // })


  fs.readFile(__filename, {encoding: 'utf-8'}, function(err, data){
    if (err){
      console.log(err);
      if (err.code == 'ENOENT'){
        console.error(err.message)
      }
    } else {
      //  console.log(data)
    }
  })

  if (urlParse.pathname == '/tut' && urlParse.query.name)
  {
    res.setHeader('Cache-control', 'no-cache')
    res.statusCode=200;
    res.end(urlParse.query.name);
  }else if(urlParse.pathname == '/'){
    // const info = fs.readFileSync('./index.html')
    // res.end(info)
    fs.readFile('./public/index.html', (err,info)=>{
      console.log(info)
      if (err) {
        console.log(err)
        res.statusCode = 500;
        res.end('ServereeeError');
        return
      }

      res.end(info)
    })

  }else{
    log.error('unknown url')
    res.statusCode=404;
    res.end("Page not fod")
  }
})

server.listen(1337, '127.0.0.1')
