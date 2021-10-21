module.exports = class inputValidation {

  validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validatePassword(){

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
  passwordHasher(){
    //use bcrypt with salt 10

  }
}
