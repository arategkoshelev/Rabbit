const indexRouter = require('./main');
const pageRouter = require('./page');
const usersRouter = require('./users');
const userRouter = require('./user');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const chatRouter = require('./chat');
const checkAuth = require('../middleware/checkAuth');

module.exports = function(app){
  app.use('/', indexRouter);
  app.use('/page', pageRouter);
  app.use('/user', userRouter);
  app.use('/users', usersRouter);
  app.use('/login', loginRouter);
  app.use('/logout', logoutRouter);
  app.use('/chat', checkAuth, chatRouter);
}
