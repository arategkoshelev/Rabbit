const winston = require('winston');
const ENV = process.env.NODE_ENV;

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 5
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "magenta",
    http: "bold black whiteBG",
    debug: "cyan"
  }
};

function wlogger(module){
  const path = module.filename.split('/').slice(-2).join('/');

  const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
        colors: logLevels.colors,
    }),
    winston.format.label({
        label:path
    }),
    winston.format.timestamp({
        format:"YY-MM-DD HH:MM:SS"
    }),
    winston.format.printf(
        info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
  );

  return  winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
        level: (ENV == 'development') ? 'debug' : 'error',
      })
    ]
  })

   
}

module.exports = wlogger;
