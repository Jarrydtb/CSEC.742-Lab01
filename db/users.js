var mysql      = require('mysql');
var connection = mysql.createConnection({
  multipleStatements: true,
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'theseus'
});


class users {

/* ------------------- PRIVATE FUNCTIONS --------------------- */
//Considering moving below to initdb.js and calling from app.js in mysql config

  //CREATE SQL CONNECTION
  initialize(){
    connection.connect(err => {
    	if(err) throw err;
    	console.log("Connected");
    })
  }
  //CLOSE SQL CONNECTION
  end(){
    connection.end()
  }

/* ------------------- PUBLIC SQL FUNCTIONS --------------------- */

  userFind(key,value){
    connection.query("SELECT * FROM users WHERE :key = :value",{
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


  addNew(name, email, password){
    connection.query("INSERT INTO users (name, email, password) VALUES(:name, :email, :password)",{
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

  updateName(name,email){
    //Continue like above.
    
  }


}


export default users
