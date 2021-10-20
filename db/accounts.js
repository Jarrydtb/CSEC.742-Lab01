

class accounts {

  balanceUpdate(recipient,sender,amount){
    connection.query(
      "UPDATE accounts SET balance = balance + :amount WHERE email = :recipient;" +
      "UPDATE accounts SET balance = balance - :amount WHERE email = :sender;",
      {
        amount: amount,
        recipient: recipient,
        sender: sender
      },(err,result,fields)=>{
        if(err){
          throw error
        }else{
          return {status:200,msg:results}
        }
      })
  }

  


}
