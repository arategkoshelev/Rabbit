const fs = require('fs');

module.exports = streamFile;

const options = {encoding: 'utf-8'}

function streamFile(filename){
  const stream = new fs.ReadStream(filename, options); // try to read script finish work asyncroniously 

  stream.on('readable', function(){
    const data = stream.read();
    data && console.log(data);
  })

  stream.on('end', function(){
    console.log("THE END");
  })

  stream.on('error', (err)=>{

    if (err.code == 'ENOENT'){
      console.log("File not found: " + filename);
      return
    }
    console.error(err)
  })

}





