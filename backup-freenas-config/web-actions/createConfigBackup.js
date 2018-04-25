var Q = require('q');
var http = require('http');
var querystring = require('querystring');

module.exports = function (params) {
  var deferred = Q.defer();
  
  var post_data = querystring.stringify({
      '__all__' : null,
      'secret': 'on',
      '__form_id': 'form_ConfigSaveForm'
  });

  var options = {
  host: params.host,
  port: 80,
  path: '/system/config/save/',
  method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data),
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid,
          'X-CSRFToken': params.xcsrfToken
      }
  };

  var post_req = http.request(options, function(res) {
      res.on('data', function (chunk) {  });

      res.on('end', function () {
        deferred.resolve(params);
      });
  });

  post_req.write(post_data);
  post_req.end();

  return deferred.promise;
}