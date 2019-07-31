const fs = require('fs');
const path = require('path');

module.exports = sendFileSafe


function sendFileSafe(filePath, req, res, ROOT){


  try{
    filePath = decodeURIComponent(filePath);
  } catch(e){
    res.statusCode = 400;
    res.end('Bad Request');
    return
  }

  if (~filePath.indexOf('\0')){ //null bite
    res.statusCode = 400;
    res.end('Bad Request');
    return
  }

  filePath = path.normalize(path.join(ROOT, filePath));

  if (filePath.indexOf(ROOT) != 0){ 
    res.statusCode = 404;
    res.end('File not found');
    return
  }

  fs.stat(filePath, (err, stats)=>{
    if (err || !stats.isFile()){
      res.statusCode = 404;
      res.end('File not found');
      return
    }


    sendFile(filePath, req, res)

  }) 
}


// function sendFile(filePath, res){
//   fs.readFile(filePath, (err, content)=>{
//     if (err) {
//       res.statusCode = 500;
//       res.end('ServerError sendFileSafe');
//     }
//     const mime = require('mime').lookup(filePath);
//     res.setHeader('Content-Type', mime + "; charser=utf-8");
//     res.end(content)
//   })
// }

// function sendFile(filePath, req, res){
//   file.on('readable', write);

//   function write(){
//     const fileContent = file.read(); //считать
//     if ( fileContent && !res.write(fileConten)){ // отправить

//       res.once('drain', function(){ //подождать
//         filePath.on('readable', write);
//         write()
//       })

//     }
//   }

//   file.on('end', function(){
//     res.end()
//   })
// }

function sendFile(filePath, req, res){
  filePath.pipe(res);
  
  filePath.on('error', function(err){
    res.statusCode = 500;
    res.end('sendFileError');
    console.error(error)
  });

  filePath
    .on('open', function(){
      console.log('open')
    })
    .on('close', function(){ // close - нормальное завершение
      console.log('close')
    })
  
  res.on('close', function(){ 
    // close - оборвано соединение (нормальное - finish)
    filePath.destroy()
  })

}
