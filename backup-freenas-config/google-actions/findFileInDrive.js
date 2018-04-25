var Q = require('q');
var {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
var fs = require('fs');

module.exports = function (params) {
    
  const clientId = params.DRIVE_CLIENT_ID;
  const clientSecret = params.DRIVE_CLIENT_SECRET;
  const accessToken = params.accessToken;
  const refreshToken = params.DRIVE_REFRESH_TOKEN;
  
  const searchTerm = params.searchTerm;
  const directory = params.driveDirId;

  const oAuth2Client = new OAuth2Client(clientId, clientSecret);
  
  oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
  });

  const drive = google.drive({version: 'v3', oAuth2Client});
  var deferred = Q.defer();

  var dirTerm = "";
  if (directory)
  {
    dirTerm = " and parents in '" + directory + "'"
  }

  drive.files.list({
    q: "name contains '" + searchTerm + "'" + dirTerm,
    fields: 'files(id, name)',
    spaces: 'drive',
    auth: oAuth2Client
  }, function (err, file) {
    if (err) {
      deferred.reject(err);
    } else {
      if(file.data.files.length == 1) {
        params.fileId = file.data.files[0].id;
        params.fileName = file.data.files[0].name;
        deferred.resolve(params);
      }
      else {
        deferred.reject("more than one matching file found");
      }
    }
  });

  return deferred.promise;
}