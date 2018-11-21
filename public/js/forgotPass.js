/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]
var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';
var tokenCookie = readCookie("token")

var stagingUrl = 'https://saccounts.cloudkibo.com/?continue=https://skiboengage.cloudkibo.com';
var productionUrl = 'https://accounts.cloudkibo.com/?continue=https://kiboengage.cloudkibo.com';
var defaultURL = (environment === 'staging') ? stagingUrl : productionUrl

if (queryString === undefined) {
  shouldWeRedirectTheLoggedIn(defaultURL)
  window.location.replace(defaultURL)
} else if (queryString.split('=')[1] === undefined) {
  shouldWeRedirectTheLoggedIn(defaultURL)
  window.location.replace(defaultURL)
} else {
  shouldWeRedirectTheLoggedIn(queryString)
}

function shouldWeRedirectTheLoggedIn (redirectURL) {
  if (tokenCookie) {
    var finalRedirectURL = redirectURL.split('=')[1];
    console.log('final redirect URL : ', finalRedirectURL);
    window.location.replace(finalRedirectURL);
  }
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