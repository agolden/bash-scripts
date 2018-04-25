var Q = require('q');
var fs = require('fs');

module.exports = function (secretFile) {
  return function(params) {
    var deferred =Q.defer();
    fs.readFile('/etc/agolden/' + secretFile, 'utf-8', function (err, data) {
      if (err) {deferred.reject(err)}
      else { 
        params[secretFile] = data.trim()
        deferred.resolve(params) }
    });
    return deferred.promise;
  }
}