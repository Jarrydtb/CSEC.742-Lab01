const mysql = require('mysql2')
const pool = require('./initdb.js')

module.exports =  class users {

  userFindByEmail(value){

    return new Promise((resolve,reject)=>{
    console.log(value)
    pool.execute("SELECT * FROM `users` WHERE `email` = ?",[
  //    key,      // email, id, name etc...
      value,    // example@example.com etc...
    ],(err,results,fields)=>{
      if(err){
        reject(err)
      }else{
        resolve({status:200,results})
      }
    })

  })
}

userFindById(value){

  return new Promise((resolve,reject)=>{
  pool.execute("SELECT * FROM `users` WHERE `id` = ?",[
    value,    // example@example.com etc...
  ],(err,results,fields)=>{
    if(err){
      reject(err)
    }else{
      resolve({status:200,results})
    }
  })

})
}

  addNew(conn,name, email, password){
    pool.query("INSERT INTO users (name, email, password) VALUES(:name, :email, :password)",{
      name: name,
      email: email,
      password: password
    },(err,results)=>{
      if(err){
        throw err
      }else{
        return {status:200,results}
      }
    })
  }

  updateName(conn,name,email){
    pool.query("UPDATE users SET name = :name WHERE email= :email; SELECT name FROM users WHERE email = :email;",{
        name: name,
        email: email
    }, (err, resutls)=> {
      if (err){
        throw err
      } else {
        return {status:200, msg:resutls}
      }
  })
  }

}
