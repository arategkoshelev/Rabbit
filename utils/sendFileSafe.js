const fs = require('fs');
const path = require('path');
const sendFile = require('./sendFile');

module.exports = sendFileSafe


function sendFileSafe(filePath, res, ROOT){


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


    sendFile(filePath, res)

  }) 
}
