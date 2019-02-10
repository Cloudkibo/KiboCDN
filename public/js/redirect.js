var queryString = window.location.href.split('?')[1]
var query = window.location.href.split('?')[0]
var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';
var tokenCookie = readCookie("token")

var stagingUrl = 'https://saccounts.cloudkibo.com/?continue=https://skiboengage.cloudkibo.com';
var productionUrl = 'https://accounts.cloudkibo.com/?continue=https://kiboengage.cloudkibo.com';
var defaultURL = (environment === 'staging') ? stagingUrl : productionUrl

if (!isVerifyUrl(query)) {
  if (queryString === undefined) {
    if (tokenCookie) redirectTheLoggedIn(defaultURL)
    else window.location.replace(defaultURL)
  } else if (queryString.split('=')[1] === undefined) {
    if (tokenCookie) redirectTheLoggedIn(defaultURL)
    else window.location.replace(defaultURL)
  } else {
    if (tokenCookie) redirectTheLoggedIn(queryString)
  }
}

function redirectTheLoggedIn (redirectURL) {
  var finalRedirectURL = redirectURL.split('=')[1];
  console.log('final redirect URL : ', finalRedirectURL);
  window.location.replace(finalRedirectURL);
}

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

function isVerifyUrl (query) {
  if (query.includes('inviteagenttoken/verify') || query.includes('verificationtoken/verify')) {
    return true
  }
  return false
}
