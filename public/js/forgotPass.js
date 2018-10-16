/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]

var tokenCookie = readCookie("token")

if (tokenCookie) {
    // TODO CORRECT THIS TO NEW URLs WHEN AVAILABLE
    window.location.replace('https://app.kibopush.com');
}

$(document).ready(function() {
  $(".applyBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var email = $("#email").val()

    let payload = {
        'email': email
    }

    $.ajax({
      url : '/api/v1/reset_password/forgot',
      type : 'POST',
      data : payload,
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
        return document.getElementById(
            "alertMsg").innerHTML = request.responseJSON.description
      },
      error : function(request,error)
      {
        console.log(request)
        console.log(error)
        console.log("Request: " + JSON.stringify(request));
        return document.getElementById(
            "alertMsg").innerHTML = request.responseJSON.description
      }
    });
  })
})

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }