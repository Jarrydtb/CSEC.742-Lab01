const bcrypt = require('bcrypt');

module.exports = class inputValidation {

  validateEmail(email) {//returns true or false
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(passwordString) {//returns hashed password
    const re = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/;
    if (re.test(String(passwordString).toLowerCase()) == true) {
      return new Promise((resolve, reject) => {
        bcrypt
          .hash(passwordString, 10)
          .then(hashed => { resolve(hashed) })
          .catch(err => { reject(err) })
      })
    } else {
      return false
    }
  }

  validateString(string) {//validates input string
    const re = /^(?!\s*$).+/;
    return re.test(String(string))
  }

  validatePath(id, path) {
    if (path.split('/')[3] == id) {
      // /user_data/[user id]/[file name]                     -> VALID
      // /user_data/[user id]/../[other user id]/[file name]  -> INVALID
      const re = /^(?:\/[^\/]+(?!\.\.))+\/[^\/]+$/;
      return re.test(String(path).toLowerCase());
    } else {
      return false
    }
  }

  validateTransferAmount(email, amount) {
    return new Promise((resolve, reject) => {
      var accountsDB = require('../db/accounts.js')
      var Account = new accountsDB()
      Account.getBalance(email)
        .then(data => {
          console.log(data.data)
          if (amount > 0 && amount <= data.data.balance) {
            resolve(true)
          } else {
            console.log("Illegal Operation")
            reject(false)
          }
        })
        .catch(err => {
          reject(false)
        })
    })
  }

  validateTransferRecipient(selfEmail, recipientEmail) {
    return new Promise((resolve, reject) => {
      if (selfEmail !== recipientEmail && this.validateEmail(recipientEmail)) {
        //Check valid email
        var userDB = require('../db/users.js')
        var User = new userDB()
        User.userFindByEmail(recipientEmail)
          .then(data => {
            if (data.results.length > 0) { resolve(true) } else { reject(false) }
          })
          .catch(err => { reject(false) })
      } else {
        reject(false)
      }
    })
  }
}
