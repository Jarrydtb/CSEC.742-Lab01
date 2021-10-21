function ensureAuthenticated(req,res, next){
  console.log("session")
  console.log(req.session)
  console.log("auth")
  console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}

module.exports = ensureAuthenticated
