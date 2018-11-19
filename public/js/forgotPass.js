/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]

var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';

if (queryString === undefined || queryString.split('=')[1] === undefined) {
  if (environment === 'staging') {
    queryString = 'continue=https://skiboengage.cloudkibo.com'
  }
  else {
    queryString = 'continue=https://kiboengage.cloudkibo.com'
  }
}

console.log(queryString)

var tokenCookie = readCookie("token")

if (tokenCookie) {
    window.location.replace(queryString.split('=')[1]);
}

$(document).ready(function() {
  $(".forgetBtn").click(function () {
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
        console.log('Data: '+ JSON.stringify(data));
        return document.getElementById(
            "alertMsg").innerHTML = data.description
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