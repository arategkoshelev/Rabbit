const indexRouter = require('./main');
const pageRouter = require('./page');
const usersRouter = require('./users');
const userRouter = require('./user');

module.exports = function(app){
  app.use('/', indexRouter);
  app.use('/page', pageRouter);
  app.use('/user', userRouter);
  app.use('/users', usersRouter);
}
