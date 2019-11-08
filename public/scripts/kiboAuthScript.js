function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

(function () {
  // console.log("IIFE called.")
  const token = readCookie('token')
  // console.log("token in cookie " + token)
  var wa = document.createElement('script')
  wa.type = 'application/javascript'
  wa.async = true
  const environment = readCookie('environment') || window.__kibo_environment
  // console.log("environment found in cookie " + environment)
  if (environment === 'development') wa.src = 'http://localhost:3024/auth/scripts/jsonp?callback=CloudKiboAuthFunction'
  if (environment === 'staging') wa.src = 'https://saccounts.cloudkibo.com/auth/scripts/jsonp?callback=CloudKiboAuthFunction'
  if (environment === 'production') wa.src = 'https://accounts.cloudkibo.com/auth/scripts/jsonp?callback=CloudKiboAuthFunction'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(wa, s)
})();


function redirectToLoginAccounts() {
  const environment = readCookie('environment') || window.__kibo_environment
  const url_production = readCookie('url_production') || window.__url_production
  const url_staging = readCookie('url_staging') || window.__url_staging
  const url_development = window.__url_development || readCookie('url_development')
  if (environment === 'development') window.location.replace('http://localhost:3024/?continue=' + url_development)
  if (environment === 'staging') window.location.replace('https://saccounts.cloudkibo.com/?continue=' + url_staging)
  if (environment === 'production') window.location.replace('https://accounts.cloudkibo.com/?continue=' + url_production)
}

// eslint-disable-next-line
function CloudKiboAuthFunction(token) {
  console.log("token came from accounts server " + token)
  if (window.location.pathname !== '/demoSSA') {
    if (token === 'undefined') redirectToLoginAccounts()
    else {
      document.cookie = "token=" + token;
      // const environment = readCookie('environment')
      // if (environment === 'development') window.location.replace(window.__url_development)
      // if (environment === 'staging') window.location.replace(window.__url_staging)
      // if (environment === 'production') window.location.replace(window.__url_production)
    }
  }
}
