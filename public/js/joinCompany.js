/**
 * Created by sojharo on 08/01/2018.
 */
var arr = window.location.pathname.split('/')
var token = arr[arr.length - 1]
console.log(token)

$(document).ready(function() {
  var emailString = readCookie("email").split('%40');
  emailString = emailString[0] + '@' + emailString[1];
  var nameString = readCookie("name").split('%20');
  if (nameString.length > 1) {
    var temp = nameString
    nameString = ''
    for(var i = 0; i < temp.length; i++)
      nameString += temp[i] + ' ';
  } else {
    nameString = nameString[0]
  }
  nameString = nameString.trim()
  var domainString = readCookie("domain").split('%20');
  if (domainString.length > 1) {
    var tempDomain = domainString
    domainString = ''
    for (var j = 0; j < tempDomain.length; j++) {
      domainString += tempDomain[i] + ' ';
    }
  } else {
    domainString = domainString[0]
  }
  $("#email").val(emailString)
  $("#name").val(nameString)
  $("#domain").val(domainString)
  $("#applyBtnJoinCompany").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var name = $("#name").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var rpassword = $("#rpassword").val()

    if (password !== rpassword) {
      return document.getElementById("alertMsg").innerHTML = "Passwords don't match."
    } else if (password.length <= 6) {
      return document.getElementById(
        "alertMsg").innerHTML = "Length of password should be greater than 6 "
    }

    $.ajax({
      url : '/api/v1/user/joinCompany',
      type : 'POST',
      data : {
        'name': name,
        'email': email,
        'password': password,
        'token': token
      },
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
        window.location = '/';
      },
      error : function(request,error)
      {
        console.log("Request: "+JSON.stringify(request));
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
