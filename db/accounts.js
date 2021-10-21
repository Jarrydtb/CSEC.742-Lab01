const mysql = require('mysql2')
const pool = require('./initdb.js')

module.exports = class accounts {

  balanceUpdate(recipient,sender,amount){
    return new Promise((resolve,reject)=>{
      pool.execute(
        "UPDATE accounts SET balance = balance + ? WHERE email = ?;" +
        "UPDATE accounts SET balance = balance - ? WHERE email = ?;",
        [
          amount,
          recipient,
          amount,
          sender
        ],(err,result,fields)=>{
          if(err){
            reject(err)
          }else{
            resolve({status:200,msg:results})
          }
      })
    })
  }


}
