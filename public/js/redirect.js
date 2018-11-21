var queryString = window.location.href.split('?')[1]
var environment = window.location.href.split('.')[0].split('//')[1] === 'saccounts' ? 'staging' : 'production';
var tokenCookie = readCookie("token")

var stagingUrl = 'https://saccounts.cloudkibo.com/?continue=https://skiboengage.cloudkibo.com';
var productionUrl = 'https://accounts.cloudkibo.com/?continue=https://kiboengage.cloudkibo.com';
var defaultURL = (environment === 'staging') ? stagingUrl : productionUrl

if (queryString === undefined) {
  if (tokenCookie) redirectTheLoggedIn(defaultURL)
  else window.location.replace(defaultURL)
} else if (queryString.split('=')[1] === undefined) {
  if (tokenCookie) redirectTheLoggedIn(defaultURL)
  else window.location.replace(defaultURL)
} else {
  if (tokenCookie) redirectTheLoggedIn(queryString)
}

function redirectTheLoggedIn (redirectURL) {
  var finalRedirectURL = redirectURL.split('=')[1];
  console.log('final redirect URL : ', finalRedirectURL);
  window.location.replace(finalRedirectURL);
}