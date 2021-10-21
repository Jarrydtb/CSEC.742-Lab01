const mysql = require('mysql2')

var connection = mysql.createConnection({                     //MYSQL DB Configuration
        multipleStatements: true,
        host     : 'localhost',
        user     : 'root',
        password : 'TheseusPassword',
        database : 'theseus'
      });
connection.connect()
module.exports = connection
