const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const userDB = require('../db/users.js')
const User = new userDB()




module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {


    User.userFindByEmail(email)
    .then(data=>{
      if(!data.results.length>0){return done(null, false, { msg: 'Email is not registered' })}
      bcrypt.compare(password, data.results[0].password, (err,isMatch) => {
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
    done(null, user.id);
  });



  passport.deserializeUser(function(id, done) {
    console.log("hit")
    User.userFindById(id)
    .then(data=>{
      if(!data.results.length>0){return done(null,false,{ msg: 'failed' })}
      console.log(data.results[0])
      done(data.status, data.results[0]);
    })
    .catch(err=>{console.log(err)});
  });

}
