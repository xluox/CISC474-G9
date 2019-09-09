$(function(){     //this code runs after page is fully loaded    
    $("#nameform").on('submit',function(e){e.preventDefault();    
    var fname=$('#fname').val();      
    var lname=$('#lname').val(); 
    var newHTML='<h1>'+fname+ ' '+lname+'</h1>';  
    $(".jumbotron").removeClass('d-none').html(newHTML);
    return false;  //prevents reload on submit    
 }); });