const bcrypt = require('bcrypt');

module.exports = class inputValidation {

  validateEmail(email){//returns true or false
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validatePassword(passwordString){//returns hashed password
    return new Promise((resolve,reject)=>{
      bcrypt
        	 .hash(passwordString,10)
           .then(hashed =>{resolve(hashed)})
           .catch(err =>{reject(err)})
    })
  }
  validateString(string){//validates input string
    const re = /^(?!\s*$).+/;
    return re.test(String(string))
  }

  validateSearch(){

  }
  validatePath(id,path){
    if(path.split('/')[3]==id){
      return true
    }else{
      return false
    }
  }
  validateTransferAmount(){

  }
}
