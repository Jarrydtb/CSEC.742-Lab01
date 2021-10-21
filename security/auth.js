module.exports = ensureAuthenticated(req,res, next){
    console.log(req)
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
