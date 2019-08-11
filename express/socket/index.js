/**
 * Use websockets handler for http socket.io 
 */
const cookie = require('cookie');
const connect = require('connect');
const sessionStore = require('../libs/sessionStore');
const config = require('../config');
const HttpError = require('../error').HttpError;
const User = require('../models/user').User;
const wlog = require('../libs/winstonlog')(module);


// function LoadSession(sid, callback){
//   sessionStore.load(sid, function(err, session){
//     if (arguments.length == 0){
//       return callback(null, null);
//     } else {
//       return callback(null, session);
//     }
//   })
// }

const loadSession = function(handshake){
  return new Promise((resolve, reject) => {

    const sidCookie = handshake.cookies[config.get('session:key')]; 
    const sid = connect.utils.parseSignedCookie(
      sidCookie, config.get('session:secret')
    );
    sessionStore.load(sid, function(err, session){
      if (arguments.length == 0){
        resolve(null);
      } 
      if (err) {
        reject(err)
      }   
      resolve(session) 
    })
  })
}


module.exports = function(server){

  const io = require('socket.io')(server);
  
  io.set('origins', 'localhost:*');
  io.set('logger', wlog);
  io.set('authorization', async function(handshake){

    try{
      handshake.cookies = cookie.parse(handshake.headers.cookie || '');

      const session = await loadSession(handshake);

      if (!session){
        throw (new HttpError(401, 'No session'))
      }

      handshake.session = session;

      if (!session.user){
        wlog.debug('Session %s is anonymous', session.id);
        throw new HttpError(403, 'Anonymous session may not connect')
      }

      const user = await User.findById(session.user).exec();

      handshake.user = user;

      return true

    } catch(err){
        if (err instanceof HttpError){
          return false
        }
    }

    
  })

  const chat = io.of('/chat');

  chat.on('connection', function(socket){


      const username = socket.handshake.user.get('username');
      console.log(socket.handshake, username);
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


