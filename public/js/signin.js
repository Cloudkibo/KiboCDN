/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]

var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';
var tokenCookie = readCookie("token")

console.log(queryString)

if (queryString === undefined) {
  shouldWeRedirectTheLoggedIn(defaultURL())
  window.location.replace(defaultURL())
} else if (queryString.split('=')[1] === undefined) {
  shouldWeRedirectTheLoggedIn(defaultURL())
  window.location.replace(defaultURL())
}

function defaultURL() {
  var stagingUrl = 'https://saccounts.cloudkibo.com/?continue=https://skiboengage.cloudkibo.com';
  var productionUrl = 'https://accounts.cloudkibo.com/?continue=https://kiboengage.cloudkibo.com';
  return (environment === 'staging') ? stagingUrl : productionUrl
}

function shouldWeRedirectTheLoggedIn (redirectURL) {
  if (tokenCookie) {
      window.location.replace(redirectURL.split('=')[1]);
  }
}

shouldWeRedirectTheLoggedIn(queryString)

$(document).ready(function() {
  $(".loginBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var email = $("#email").val()
    var password = $("#password").val()
    var domain = $("#domain").val()

    let payload = {}

    if (window.location.href.includes('team')) {
      if (domain === '') {
        return document.getElementById("alertMsg")
          .innerHTML = "Domain name is required."
      } else if (email === '') {
        return document.getElementById("alertMsg")
          .innerHTML = "Email is required."
      } else if (password === '') {
        return document.getElementById(
          "alertMsg").innerHTML = "Password is required."
      }
      payload.email = email
      payload.domain = domain
      payload.password = password
    } else {
      if (email === '') {
        return document.getElementById("alertMsg")
          .innerHTML = "Email is required."
      } else if (password === '') {
        return document.getElementById(
          "alertMsg").innerHTML = "Password is required."
      }
      payload.email = email
      payload.password = password
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
