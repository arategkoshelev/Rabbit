const createError = require('http-errors');
const express = require('express');
const errorhandler = require('errorhandler');

const app = express();
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config');
const wlog = require('./libs/winstonlog')(module);
const indexRouter = require('./routes/index');
const pageRouter = require('./routes/page');
const usersRouter = require('./routes/users');

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

if(app.get('env') == 'development'){
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //req.cookies
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/page', pageRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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
