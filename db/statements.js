const mysql = require('mysql2')
const pool = require('./initdb.js')

module.exports = class statements {

  fetchStatements(email){
    return new Promise((resolve,reject)=>{
      pool.execute(
        "SELECT * FROM statements WHERE customer_email = ?;",[
          email
        ],(err,result,fields)=>{
          if(err){
            console.log(err)
            reject(err)
          }else{
            resolve({status:200,data:result})
          }
      })
    })
  }

}
