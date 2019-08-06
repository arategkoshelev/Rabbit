const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  variables = {userId: req.session.user}
  res.render('chat', variables);
});

module.exports = router;
