module.exports = {
  ensureAuthenticated: function(req,res, next){
    console.log("Authenticate")
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
}
