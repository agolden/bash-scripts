var Q = require('q');
var {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
var fs = require('fs');

module.exports = function (params) {
  
  const clientId = params.DRIVE_CLIENT_ID;
  const clientSecret = params.DRIVE_CLIENT_SECRET;
  const accessToken = params.accessToken;
  const refreshToken = params.DRIVE_REFRESH_TOKEN;
  const fileName = params.filename;
  const folder = params.driveFileId;

  const oAuth2Client = new OAuth2Client(clientId, clientSecret);
  
  oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
  });

  const drive = google.drive({version: 'v3', oAuth2Client});
  var deferred = Q.defer();

  var fileMetadata = {
    'name': params.filename
  };

  if (folder) {
    fileMetadata['parents'] = [folder];
  }

  var media = {
    body: fs.createReadStream(params.filename)
  };

  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
    auth: oAuth2Client
  }, function (err, file) {
    if (err) {
      deferred.reject(err);
    } else {
      //console.log('File Id: ', file.data.id);
      fs.unlinkSync(params.filename);
      deferred.resolve(params);
    }
  });

  return deferred.promise;
}