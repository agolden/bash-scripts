var Q = require('q');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');
var unirest = require('unirest');

module.exports = function (params) {
  var deferred = Q.defer();

  unirest.post("http://" + params.host + "/system/config/upload/?X-Progress-ID=b7193229-c4c6-409d-803a-e3fd2f5e623b")
    .headers({'Content-Type': 'multipart/form-data'})
    .headers({'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid })
    .field('__all__', null) // Form field
    .field('__form_id', null) // Form field
    .field('csrfmiddlewaretoken', params.xcsrfToken) // Form field
    .attach('config', '/tmp/' + params.fileName) // Attachment
    .end(function (response) {
      fs.unlinkSync('/tmp/' + params.fileName);
      fs.unlinkSync('/tmp/' + params.fileName + '.enc');
      deferred.resolve(params);
    });

  return deferred.promise;
};

