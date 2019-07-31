const fs = require('fs');

module.exports = sendFile

// function sendFile(filePath, res){
//   fs.readFile(filePath, (err, content)=>{ // долго читается и зависает в памяти
//     if (err) {
//       res.statusCode = 500;
//       res.end('ServerError sendFileSafe');
//     }
//     const mime = require('mime').lookup(filePath);
//     res.setHeader('Content-Type', mime + "; charser=utf-8");
//     res.end(content)
//   })
// }

// function sendFile(filePath, res){ // простая реализация метода pipe
//   filePath=new fs.ReadStream(filePath); //поток входа
//   filePath.on('readable', write); //res.write - поток вывода данных

//   function write(){
//     const fileContent = filePath.read(); //считать
//     if ( fileContent && !res.write(fileConten)){ 
  //отправить, res.write == true если быстро отправился ответ если res.write===false  на время отписаться от   от  readable, подписаться на drain который при наступлении переподпишет на readable
          
//       filePath.removeListener('readeble', write)

//       res.once('drain', function(){ //подождать
//         filePath.on('readable', write);
//         write()
//       })

//     }
//   }

//   filePath.on('end', function(){
//     res.end()
//   })
// }

function sendFile(filePath, res){

  filePath=new fs.ReadStream(filePath);

  filePath.pipe(res); //readable.pipe(writeable)
  // filePath.pipe(process.stdout); //тот же поток в несколько выходных

  filePath.on('error', function(err){
    res.statusCode = 500;
    res.end('sendFileError');
    console.error(err)
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
