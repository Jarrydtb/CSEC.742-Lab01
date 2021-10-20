

class initdb {
  /* ------------------- PRIVATE FUNCTIONS --------------------- */

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
}
