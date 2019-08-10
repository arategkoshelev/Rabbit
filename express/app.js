const createError = require('http-errors');
const express = require('express');
const errorhandler = require('errorhandler');

const app = express();
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('express-favicon');
const session = require('express-session')

const mongoose = require('./libs/mongoose');
const config = require('./config');
const routes = require('./routes');
const wlog = require('./libs/winstonlog')(module);
const HttpError = require('./error').HttpError;
const MongoStore = require('connect-mongo')(session);

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

if(app.get('env') == 'development'){
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //req.cookies
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    // host: '127.0.0.1',
    // port: '27017',
    // db: 'admin',
    // url: 'mongodb://localhost:27017/test',
    // username: "root",
    // password: "example",
    // collection: 'session'
  }),
  resave: true,
  saveUninitialized: true
}))

app.use((req,res,next)=>{
  req.session.numberOfVisits = req.session.numberOfVisits +1 || 1;
  // res.send("Visits: " + req.session.numberOfVisits);
  next()
})

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

app.use(sassMiddleware({
  src: path.join(__dirname, '/public'),
  dest: path.join(__dirname, '/public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, '/public')));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler

app.use((err, req,res,next)=>{
  if (typeof err == 'number'){
    err = new HttpError(err);
  }

  if (err instanceof HttpError){
    res.sendHttpError(err);
  } else {
    if (app.get('env')!=='development'){
      errorhandler()(err, req,res,next);
    } else {
      wlog.error(err);
      err = new HttpError(500);
      res.sendHttpError(err)
    }
  }
})


// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.use((err, req,res,next)=>{
//   if (app.get('env')=='development'){
//     const errorHandler = errorhandler();
//     errorHandler(err, req,res,next)
//   } else {
//     res.send(500)
//   }
// })

// app.use((req,res,next)=>{
//   if (req.url == '/'){
//     res.send('<h2>hello</h2>')
//   }else{
//     next()
//   }
// })

// app.use((req,res,next)=>{
//   if (req.url == '/test'){
//     res.end('test')
//   }else{
//     next()
//   }
// })

// app.use((req,res,next)=>{
//   if (req.url == '/error'){
//     next(new Error("oops"))
//   }else{
//     next()
//   }
// })

// app.use((req,res,next)=>{
//   res.send(404,'Page NOT found')
// })

module.exports = app;
