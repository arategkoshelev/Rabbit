/**
 * Use websockets handler for http socket.io 
 */
const wlog = require('../libs/winstonlog')(module);


module.exports = function(server){

  const io = require('socket.io')(server);
  
  io.set('origins', 'localhost:*');
  io.set('logger', wlog);

  const chat = io.of('/chat');

  chat.on('connection', function(socket){
      socket.join('myroom');
      //console.log(Object.keys(io.sockets.connected))
      console.log(io.sockets.adapter.rooms)
      
      socket.on('chat message', function(msg, cb){
      // socket.broadcast.emit('chat message', msg);
      socket.emit('chat message', msg);
      socket.broadcast.to('myroom').emit('chat message', msg);
      // chat.emit('chat message', msg);
      cb(JSON.stringify(socket.adapter.rooms));
      }); 
    });

  // io.on('connection', function(socket){
  //   socket.on('chat message', function(msg){
  //     console.log('message: ' + msg);
  //     socket.broadcast.emit('chat message', msg);
  //     socket.emit('chat message', msg);
  //   }); 
  // });

}


