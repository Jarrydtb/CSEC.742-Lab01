const mysql = require('mysql2')

module.exports = class initdb {

    //CREATE SQL CONNECTION
    initialize(){
      return mysql.createPool({                     //MYSQL DB Configuration
        multipleStatements: true,
        host     : 'localhost',
        user     : 'root',
        password : 'TheseusPassword',
        database : 'theseus'
      });
    }


    //CLOSE SQL CONNECTION
    end(){
      connection.end()
    }
}
