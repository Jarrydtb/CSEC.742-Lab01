const mysql = require('mysql');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const initDb = require('../db/initdb.js')
const InitDb = new initDb()
const conn = InitDB.initialize()

const userDB = require('../db/users.js')
const User = new userDB()



module.exports = function(passport){

  passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {
    User.userFind(conn,"email",email)
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
    .then( InitDB.end() )
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
