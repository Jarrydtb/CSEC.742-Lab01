const mysql = require('mysql');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/users.js')
module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {
    
    User.userFind("email",email)
    .then(user=>{
      if(user.length[0]){return done(null, false, { msg: 'Email is not registered' })}
      bcrypt.compare(password,user.password,(err,isMatch)=>{
          if(err) throw err;
          if(isMatch){
            return done(null,user);
          }else{
            return done(null,false,{ msg: 'Incorrect Password' });
          }
      });
    })
    .catch(err => console.log(err));
  );


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
