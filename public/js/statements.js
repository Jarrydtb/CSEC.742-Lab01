//run on page load
$(document).ready(function(){
  alert("works")
  //fetch statements from api
  fetchStatements();


});
//On click handlers
$(document).on('click',".statement_button",function(){
  downloadStatement(this.id)
})

//function definitions
function downloadStatement(location){
  $.get("/api/documents/download?file="+location,(result,status)=>{
    console.log(result)
  });
}

function fetchStatements(){
  $.get("/api/fetch/statement_list",function(data,status){
    console.log(data);
    data.data.statements.forEach(element => {
      console.log(element)
      $("#statements_list").append("<li><a class='statement_button' id='"+ element.file_location +"'>"+ element.file_name +"</a></li>")
    });
  })
}
