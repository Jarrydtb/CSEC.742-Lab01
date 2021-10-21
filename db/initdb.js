const mysql = require('mysql2')
const pool = mysql.createPool({                     //MYSQL DB Configuration
  multipleStatements: true,
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'theseus'
});


module.exports = class initdb {

    //CREATE SQL CONNECTION
    initialize(){
      connection.connect(err => {
      	if(err) throw err;
      	console.log("Connected");
      })
      return connection
    }


    //CLOSE SQL CONNECTION
    end(){
      connection.end()
    }
}
