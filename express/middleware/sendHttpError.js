module.exports = function(req, res, next){
  res.sendHttpError = error =>{
    res.status(error.status);
    if (res.req.headers['x-requested-with'] == 'XMLHttpReauest'){
      res.json(error)
    } else {
      res.render('error', {error});
    }
  };

  next();

};
