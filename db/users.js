class users {

  userFind(conn,key,value){
    conn.query("SELECT * FROM users WHERE :key = :value",{
      key:key,
      value:value
    },(err,result,fields)=>{
      if(err){
        throw error
      }else{
        return {status:200,msg:results}
      }
    })
  }


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
    //Continue like above.

  }


}


export default users
