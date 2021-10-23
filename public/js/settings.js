$(document).ready(function(){
  
});


$(document).on('click','#update_button',function(req,res){
  var input = $("#inp_name").val()
  $.post('/api/update/name',{name:input},(data,status)=>{
    console.log(data.results.name);
    $('.update_result').append($("<p>Successfully Updated to: " + data.results.name + "</p>" ));
  });
});
