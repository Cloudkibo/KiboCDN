/**
 * Created by sojharo on 08/01/2018.
 */
var queryString = window.location.href.split('?')[1]
var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';
var tokenCookie = readCookie("token")
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
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
      }
      else if(!validateEmail(email)) {
        return document.getElementById(
          "alertMsg").innerHTML = "please Enter valid email"
      }
      else if (password === '') {
        return document.getElementById(
          "alertMsg").innerHTML = "Password is required."
      }
      else if (password.length <= 6) {
        return document.getElementById(
          "alertMsg").innerHTML = "Length of password should be greater than 6 "
      }
      payload.email = email
      payload.domain = domain
      payload.password = password
    } else {
      if (email === '') {
        return document.getElementById("alertMsg")
          .innerHTML = "Email is required."
      }
      else if(!validateEmail(email)) {
        return document.getElementById(
          "alertMsg").innerHTML = "please Enter valid email"
      }
      else if (password === '') {
        return document.getElementById(
          "alertMsg").innerHTML = "Password is required."
      }
      else if (password.length <= 6) {
        return document.getElementById(
          "alertMsg").innerHTML = "Length of password should be greater than 6 "
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
        console.log('Data token: ' + data.token);
        window.location.replace(queryString.split('=')[1]);
      },
      error : function(request,error)
      {
        console.log(request)
        console.log(error)
        console.log("Request: " + JSON.stringify(request));
        console.log("Request JSON: " + request.responseJSON);
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
