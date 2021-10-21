const mysql = require('mysql')
const initDB = require('./initdb.js')
const InitDB = new initDB()

module.exports =  class users {

  userFind = Promise((key,value)=>{
    var conn = InitDB.initialize()
    conn.query("SELECT * FROM users WHERE :key = :value",{
      key:key,
      value:value
    },(err,result,fields)=>{
      if(err){
        throw error
      }else{
        InitDB.end()
        return {status:200,msg:results}
      }
    })
  })

  addNew(conn,name, email, password){
    conn.query("INSERT INTO users (name, email, password) VALUES(:name, :email, :password)",{
      name: name,
      email: email,
      password: password
    },(err,results)=>{
      if(err){
        throw error
      }else{
        return {status:200,msg:results}
      }
    })
  }

  updateName(conn,name,email){
    conn.query("UPDATE users SET name = :name WHERE email= :email; SELECT name FROM users WHERE email = :email;",{
        name: name,
        email: email
    }, (err, resutls)=> {
      if (err){
        throw error
      } else {
        return {status:200, msg:resutls}
      }
  })
  }

}
