const mysql = require('mysql');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const userDB = require('../db/users.js')
const User = new userDB()



module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true},(req, email, password, done) => {


    User.userFindByEmail(req.conn,email)
    .then(data=>{
      if(!data.results.length>0){return done(null, false, { msg: 'Email is not registered' })}
      bcrypt.compare(password, data.results[0].password, (err,isMatch) => {
        console.log(err)
          if(err) throw err;
          if(isMatch){
            return done(null,data.results[0]);
          }else{
            return done(null,false,{ msg: 'Incorrect Password' });
          }
      });
    })
    .catch(err => console.log(err));


  }));



  passport.serializeUser(function(user, done) {
    console.log("Serialise")
    done(null, user.id);
  });



  passport.deserializeUser(function(id, done) {
    User.userFindById("id",id,function(err, user) {
      done(err, user);
    });
  });

}
