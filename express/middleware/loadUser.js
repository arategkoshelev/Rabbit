const User = require('../models/user').User;

module.exports = async (req, res, next) => {
  res.locals.user = null;
  req.user = null;
  if (!req.session.user) return next();
  try{
    const user = await User.findById(req.session.user).exec()
    res.locals.user = user; //access for all templates
    req.user = user;
  }catch(err){
    return next(err);
  }
  next();
}
