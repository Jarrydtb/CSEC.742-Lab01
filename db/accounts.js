const mysql = require('mysql2')
const pool = require('./initdb.js')

module.exports = class accounts {

  getBalance(email){
    return new Promise((resolve,reject)=>{
      pool.execute(
        "SELECT balance FROM accounts WHERE email = ?;",[
          email
        ],(err,result,fields)=>{
          if(err){
            console.log(err)
            reject(err)
          }else{
            resolve({status:200,data:result[0]})
          }
      })
    })
  }

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
