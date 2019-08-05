const express = require('express');
const router = express.Router();

const variables = { title: 'Express' }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index', variables);
});

module.exports = router;
