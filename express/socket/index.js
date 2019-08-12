/**
 * Use websockets handler for http socket.io 
 */
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
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
    const sid = cookieParser.signedCookie(
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
  
  // io.set('origins', 'localhost:*');
  // io.set('logger', wlog);

  io.of('/chat').use( async function(socket, next){

    try{
      const handshake = socket.request;
      socket.handshake.cookies = cookie.parse(handshake.headers.cookie || '');
      // console.log(socket.handshake)
      const session = await loadSession(socket.handshake);
      //console.log(session, "session")
      

      if (!session){
        throw (new HttpError(401, 'No session'))
      }

      socket.handshake.session = session;

      if (!session.user){
        wlog.debug('Session %s is anonymous', session.id);
        throw new HttpError(403, 'Anonymous session may not connect')
      }

      const user = await User.findById(session.user).exec();
      console.log(user, 'user')
      if (!user){
        wlog.info('user %s not found', user);
        throw new HttpError(404, 'user not found')
      }

      socket.handshake.user = user;

    } catch(err){
      return next(err)
    }
    next()
    
  })

  const chat = io.of('/chat');

  chat.on('connection', function(socket){
      console.log('+++++++++++++');
      console.log(socket.handshake.user.username);

      const username = socket.handshake.user.username;
      socket.join('myroom');
      socket.broadcast.emit('join', username)
      //console.log(Object.keys(io.sockets.connected))
      //console.log(io.sockets.adapter.rooms)
      
      socket.on('chat message', function(msg, cb){
      // socket.broadcast.emit('chat message', msg);
      socket.emit('chat message', username, msg);
      socket.broadcast.to('myroom').emit('chat message', username, msg);
      // chat.emit('chat message', msg);
      cb(JSON.stringify(socket.adapter.rooms));
      });
      
      socket.on('disconnect', ()=>{
        socket.emit('leave', username)
        socket.broadcast.emit('leave', username)
      })
    });

  // io.on('connection', function(socket){
  //   socket.on('chat message', function(msg){
  //     console.log('message: ' + msg);
  //     socket.broadcast.emit('chat message', msg);
  //     socket.emit('chat message', msg);
  //   }); 
  // });

  return io;

}


