const mysql = require('mysql')


module.exports =  class users {

  userFind(conn,key,value){

    return new Promise((resolve,reject)=>{
    console.log(value)
    conn.execute("SELECT * FROM users WHERE ? = ?",[
      key,      // email, id, name etc...
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
    conn.query("INSERT INTO users (name, email, password) VALUES(:name, :email, :password)",{
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
    conn.query("UPDATE users SET name = :name WHERE email= :email; SELECT name FROM users WHERE email = :email;",{
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
