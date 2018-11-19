/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]

var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';

console.log(queryString)

if (queryString === undefined) {
  window.location.replace(defaultURL())
} else if (queryString.split('=')[1] === undefined) {
  window.location.replace(defaultURL())
}

function defaultURL() {
  var stagingUrl = 'https://saccounts.cloudkibo.com/?continue=https://skiboengage.cloudkibo.com';
  var productionUrl = 'https://accounts.cloudkibo.com/?continue=https://kiboengage.cloudkibo.com';
  return (environment === 'staging') ? stagingUrl : productionUrl
}

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