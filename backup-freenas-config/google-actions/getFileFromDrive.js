var Q = require('q');
var {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
var fs = require('fs');

module.exports = function (params) {
    
  const clientId = params.DRIVE_CLIENT_ID;
  const clientSecret = params.DRIVE_CLIENT_SECRET;
  const accessToken = params.accessToken;
  const refreshToken = params.DRIVE_REFRESH_TOKEN;
  const fileId = params.fileId;
  const fileName = params.fileName;

  const oAuth2Client = new OAuth2Client(clientId, clientSecret);
  
  oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
  });

  const drive = google.drive({version: 'v3', oAuth2Client});
  var deferred = Q.defer();

  var dest = fs.createWriteStream('/tmp/' + fileName);

  drive.files.get(
    {fileId, alt: 'media', auth: oAuth2Client},
    {responseType: 'stream'},
    (err, res) => {
      if (err) {
        console.error(err);
        throw err;
      }
      res.data.on('end', () => {
        deferred.resolve(params);

      })
        .on('error', err => {
          deferred.reject(err);
        })
        .pipe(dest);
    });

  return deferred.promise;
}