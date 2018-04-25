var Q = require('q');
var http = require('http');
var setCookie = require('set-cookie-parser');

module.exports = function (params) {
  var deferred = Q.defer();

  var options = {
    host: params.host,
    port: 80,
    path: '/account/login/',
    method: 'GET'
  };

  const chunks = [];

  http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      let body = chunks.join();

      let startDelim = "name='csrfmiddlewaretoken' value='";
      let startIndex = body.indexOf(startDelim);
      var csrf = body.substring(startIndex + startDelim.length, body.length);
      
      params.formCsrf = csrf.substring(0,csrf.indexOf("'"));

      var cookies = setCookie.parse(res);

      var theCookie = cookies.filter(cookie => cookie.name.localeCompare('csrftoken') == 0 );
      params.cookieCsrf = theCookie[0].value;

      deferred.resolve(params);
    });
  }).end();

  return deferred.promise;
}