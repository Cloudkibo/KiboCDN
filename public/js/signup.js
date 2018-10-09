/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]
console.log('THIS IS TESTING SINGUP.JS')
console.log('URL Query is ' + queryString)

$(document).ready(function() {
  $(".applyBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var name = $("#name").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var rpassword = $("#confirm_password").val()

    if (password !== rpassword) {
      return document.getElementById("alertMsg").innerHTML = "Passwords don't match."
    } else if (password.length <= 6) {
      return document.getElementById(
        "alertMsg").innerHTML = "Length of password should be greater than 6 "
    }

    $.ajax({
      url : '/api/v1/user?' + queryString,
      type : 'POST',
      data : {
        'name': name,
        'email': email,
        'password': password
      },
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
        window.location = queryString.split('=')[1];
      },
      error : function(request,error)
      {
        console.log("Request: "+JSON.stringify(request));
      }
    });
  })
})
