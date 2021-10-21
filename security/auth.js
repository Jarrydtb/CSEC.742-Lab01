function ensureAuthenticated(req,res, next){
  console.log(req.session)
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}

module.exports = ensureAuthenticated
