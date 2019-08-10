const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // variables = {userId: req.session.user}
  // const variables = {user: req.user}
  res.render('chat');
});

module.exports = router;
