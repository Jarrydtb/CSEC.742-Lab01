const mysql = require('mysql2')
const pool = require('./initdb.js')

module.exports =  class users {

  userFindByEmail(value){
    return new Promise((resolve,reject)=>{
      pool.execute("SELECT * FROM `users` WHERE `email` = ?",[
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

  addNew(name, email, password){
    return new Promise((resolve,reject)=>{
      pool.execute("INSERT INTO users (name, email, password, account_type) VALUES(?, ?, ?, 'customer')",[
        name,
        email,
        password
      ],(err,results)=>{
        if(err){
          reject(err)
        }else{
          resolve({status:200,results})
        }
      })
    })
  }

  updateName(name,email){
    return new Promise((resolve,reject)=>{
      pool.execute("UPDATE users SET name = ? WHERE email= ?; SELECT name FROM users WHERE email = ?;",[
          name,
          email,
          email
      ], (err, results)=> {
        if(err){
          reject(err)
        }else{
          resolve({status:200,results})
        }
      })
    })
  }


}
