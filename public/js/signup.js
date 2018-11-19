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
  $(".signUpBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var name = $("#name").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var rpassword = $("#confirm_password").val()
    var domain = $("#domain").val()
    var company_name = $("#CompanyName").val()
    var response = grecaptcha.getResponse();

    if (password !== rpassword) {
      return document.getElementById("alertMsg").innerHTML = "Passwords don't match."
    } else if (password.length <= 6) {
      return document.getElementById(
        "alertMsg").innerHTML = "Length of password should be greater than 6 "
    }

    if(response.length == 0) {
      return document.getElementById(
        "alertMsg").innerHTML = "please select captcha field"
    }

    let payload = {
        'name': name,
        'email': email,
        'password': password
    }

    if (window.location.href.includes('team')) {
        if (domain.length <= 3) {
          return document.getElementById(
            "alertMsg").innerHTML = "Domain name required and length should be greater than 2"
        }
        if (company_name.length <= 3) {
          return document.getElementById(
            "alertMsg").innerHTML = "Company name required and length should be greater than 2"
        }

        payload.domain = domain
        payload.company_name = company_name
    }

    $.ajax({
      url : '/api/v1/user?' + queryString,
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