const express = require('express');
const router = express.Router();
const User = require('../models/user').User;

// const user = new User({
//   username: "Tester",
//   password: "secret",

// })

// user.save(function(err, user, affected){
//   console.log(arguments)
// })
// .then(
// User.findOne({username: "Tester"}, (err, tester)=>{console.log(tester)})



/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, (err, users) => {
    if(err) return next(err);
    res.json(users)
  })
});

module.exports = router;
