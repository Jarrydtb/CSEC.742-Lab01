$(document).ready(function(){
  //do something
  alert("Hello")
});


$(document).on('click','#update_button',function(req,res){
  var input = $("#inp_name").val()
  $.post('/api/update/name',{name:input},(data,status)=>{
    console.log(data.result);
    $('.update_result').append($("<p>Successfully Updated to: " + JSON.stringify(data.result) + "</p>" ));
  });
});
