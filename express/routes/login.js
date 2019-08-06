const express = require('express');
const router = express.Router();
const multer = require('multer')();
const User = require('../models/user').User;
const AuthError = require('../models/user').AuthError;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', multer.none(), (req, res, next) => {
  const { username, password } = req.body;

  authorize(username, password, res, next)

});

module.exports = router;


async function authorize(username, password, res, next){

  let user;

  try{
    user =  await User.findOne({username}).exec();

    if (user) {
      if (user.checkPassword(password)){
        res.status(200).send("OK")
        return
      }
      res.status(403).send("Forbidden password")
    }else{
// if (!user) return next(new HttpError(403, "User not found"));
// if (!user) res.send(403, "User not found");
      try{
        const reqUser = new User({username, password});
        user = await reqUser.save();
        res.status(200).send("OK")
      }catch(err){
        wlog.error(err, "can't save user")
        err = new AuthError(500);
        res.sendHttpError(err)
      }
      
    }
    req.session.user = user._id;

  }catch(e){
    return next(e)
  }
}
