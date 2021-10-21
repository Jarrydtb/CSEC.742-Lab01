const mysql = require('mysql');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const userDB = require('../db/users.js')
const User = new userDB()



module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true},(req, email, password, done) => {


    User.userFind(req.conn,"email",email)
    .then(data=>{
      console.log(data)
      if(data.results.length>0){return done(null, false, { msg: 'Email is not registered' })}
      bcrypt.compare(password, user.password,(err,isMatch)=>{
          if(err) throw err;
          if(isMatch){
            return done(null,user);
          }else{
            return done(null,false,{ msg: 'Incorrect Password' });
          }
      });
    })
    .catch(err => console.log(err));


  }));



  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });



  passport.deserializeUser(function(id, done) {
    User.userFind("id",id,function(err, user) {
      done(err, user);
    });
  });

}
