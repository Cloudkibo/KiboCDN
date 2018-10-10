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
  $(".loginBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var email = $("#email").val()
    var password = $("#password").val()
    var domain = $("#domain").val()

    if (password.length <= 6) {
      return document.getElementById(
        "alertMsg").innerHTML = "Length of password should be greater than 6 "
    }

    let payload = {
        'email': email,
        'password': password
    }

    if (window.location.href.includes('team')) {
        if (domain.length <= 3) {
          return document.getElementById(
            "alertMsg").innerHTML = "Domain name required and length should be greater than 2"
        }
        payload.domain = domain
    }

    $.ajax({
      url : '/auth/local?' + queryString,
      type : 'POST',
      data : payload,
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
        window.location.replace(queryString.split('=')[1]);
      },
      error : function(request,error)
      {
        console.log(request)
        console.log(error)
        console.log("Request: "+JSON.stringify(request));
        return document.getElementById(
            "alertMsg").innerHTML = request.responseText.description
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