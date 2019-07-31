const winston = require('winston');

module.exports = function(module){
  return makeLogger(module.filename)
}

function makeLogger(path){
  if(path.match(/app.js$/)){
    const transports = [
      new winston.transports.Console({
        timestamp:true,
        colorize:true,
        level: 'info'
      }),
      new winston.transports.File({filename:'debug.log', level:'debug'})
    ]
    return new winston.createLogger({transports:transports});

  } else {

    return new winston.createLogger({
      transports:[]
    })
  }
}
