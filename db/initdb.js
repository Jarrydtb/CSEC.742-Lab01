const mysql = require('mysql2')

var pool = mysql.createPool({                     //MYSQL DB Configuration
        multipleStatements: true,
        host     : 'localhost',
        user     : 'root',
        password : 'TheseusPassword',
        database : 'theseus'
      });
module.exports = pool
