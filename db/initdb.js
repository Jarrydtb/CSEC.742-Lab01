const mysql = require('mysql2')

module.exports = class initdb {

    //CREATE SQL CONNECTION
    initialize(){
      const pool = mysql.createPool({                     //MYSQL DB Configuration
        multipleStatements: true,
        host     : 'localhost',
        user     : 'root',
        password : 'TheseusPassword',
        database : 'theseus'
      });
      return pool
    }


    //CLOSE SQL CONNECTION
    end(){
      connection.end()
    }
}
