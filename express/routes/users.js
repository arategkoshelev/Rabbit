var express = require('express');
var router = express.Router();
const User = require('../models/user').User;

const user = new User({
  username: "Tester",
  password: "secret",

})


// user.save(function(err, user, affected){
//   console.log(arguments)
// })
// .then(
User.findOne({username: "Tester"}, (err, tester)=>{console.log(tester)})



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a users resource');
});

module.exports = router;
