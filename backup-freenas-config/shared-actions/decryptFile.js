var Q = require('q');
var fs = require('fs');
var crypto = require('crypto');

module.exports = function (params) {
  
  const fileName = params.fileName;

  var deferred = Q.defer();
  var readStream = fs.createReadStream('/tmp/' + fileName);
  params.fileName = fileName.replace(".enc","");
  var writeStream = fs.createWriteStream('/tmp/' + params.fileName);
  
  var decipher = crypto.createDecipher('aes-256-cbc', params.BACK_ENC_KEY);
  
  var stream = readStream.pipe(decipher).pipe(writeStream);

  stream.on('finish', function () { 
    deferred.resolve(params);
  });

  return deferred.promise;
};