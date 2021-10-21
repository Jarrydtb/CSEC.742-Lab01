const mysql = require('mysql')
const connection = mysql.createConnection({                     //MYSQL DB Configuration
  multipleStatements: true,
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'theseus'
});


export default class initdb {

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
