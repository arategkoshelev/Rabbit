const mongoose = require('./mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  // host: '127.0.0.1',
  // port: '27017',
  // db: 'admin',
  // url: 'mongodb://localhost:27017/test',
  // username: "root",
  // password: "example",
  // collection: 'session'
})

module.exports = sessionStore;
