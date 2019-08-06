const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const HttpError = require('../error').HttpError;
const User = require('../models/user').User;
const wlog = require('../libs/winstonlog')(module);

router.get('/:id', (req, res, next) => {
  try{
    const id = new ObjectID(req.params.id); 
  } catch (e) {
    return next(new HttpError(404, "User id not found"));
  }

  User.findById(req.params.id, (err, user) => {
    if(err) return next(err);
    if (!user){
      return next(new HttpError(404, "User not found"));
    }
    res.json(user);
  })
});

module.exports = router;
