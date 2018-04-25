
var Q = require('q');
var http = require('http');

module.exports = function (params) {
  var deferred = Q.defer();
  
  var options = {
    host: params.host,
    port: 80,
    path: '/',
    method: 'GET',
      headers: {
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid
      }
  };

  const chunks = [];

  http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      let body = chunks.join();

      let startDelim = "var CSRFToken = '";
      let startIndex = body.indexOf(startDelim);
      let csrf = body.substring(startIndex + startDelim.length, body.length);
      
      params.xcsrfToken = csrf.substring(0,csrf.indexOf("'"));

      deferred.resolve(params);
    });
  }).end();

  return deferred.promise;
}