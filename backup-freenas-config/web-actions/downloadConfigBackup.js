var Q = require('q');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');

module.exports = function (params) {
  var deferred = Q.defer();
  
  var options = {
    host: params.host,
    port: 80,
    path: '/system/config/download/?secret=1',
    method: 'GET',
      headers: {
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid
      }
  };

  http.request(options, function(res) {

    params.filename = res.headers['content-disposition'].split("=")[1].replace(/"/g,"") + ".enc";
    //params.destDriveFolder = '1LKHW6o-WrDwyFfXVwdZA8pCECar4Csoa';
    var file = fs.createWriteStream(params.filename);
    var cipher = crypto.createCipher('aes-256-cbc', params.BACK_ENC_KEY);
    res.pipe(cipher).pipe(file);
    deferred.resolve(params);
  }).end();

  return deferred.promise;
};