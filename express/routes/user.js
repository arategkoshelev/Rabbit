const express = require('express');
const router = express.Router();
const HttpError = require('../error').HttpError;
const User = require('../models/user').User;

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, (err, user) => {
    if(err) return next(err);
    if (!user){
      next(new HttpError(404, "User not found"));
    }
    res.json(user);
  })
});

module.exports = router;
