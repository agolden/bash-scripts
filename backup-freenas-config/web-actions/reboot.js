
var Q = require('q');
var http = require('http');

module.exports = function (params) {
  var deferred = Q.defer();
  
  var options = {
    host: params.host,
    port: 80,
    path: '/system/reboot/run/',
    method: 'GET',
      headers: {
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid
      }
  };

  var request = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
    });

    res.on('end', function () {

      deferred.resolve(params);
    });
  });

  request.on('error', function(err) {
    //We fully expect the reboot to fail.
    deferred.resolve(params);
  });
  
  request.end();

  return deferred.promise;
}