var Q = require('q');
var http = require('http');
var querystring = require('querystring');
var setCookie = require('set-cookie-parser');

module.exports = function (params) {
  var deferred = Q.defer();

  var post_data = querystring.stringify({
      'username' : 'root',
      'password': params.DEFAULT_INSECURE_PASSWORD,
      'next': '/',
      'csrfmiddlewaretoken' : params.formCsrf
  });

  var options = {
  host: params.host,
  port: 80,
  path: '/account/login/',
  method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data),
          'Cookie': 'csrftoken=' + params.cookieCsrf
      }
  };

  var post_req = http.request(options, function(res) {
      res.on('data', function (chunk) { });

      res.on('end', function () {
        var cookies = setCookie.parse(res);
        cookies.forEach( cookie => params[cookie.name] = cookie.value);
        deferred.resolve(params);
      });
  });

  post_req.write(post_data);
  post_req.end();

  return deferred.promise;
}