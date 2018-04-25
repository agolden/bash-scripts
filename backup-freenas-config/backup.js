var Q = require('q');

var getLoginCSRF = require ('./web-actions/getLoginCSRF');
var login = require ('./web-actions/login');
var getLoggedInCSRF = require ('./web-actions/getLoggedInCSRF');
var createConfigBackup = require ('./web-actions/createConfigBackup');
var downloadConfigBackup = require ('./web-actions/downloadConfigBackup');

var getSecret = require ('./shared-actions/getSecret');

var getGoogleAccessToken = require('./google-actions/getAccessToken');
var writeFileToDrive = require('./google-actions/writeFileToDrive');

Q.fcall(getLoginCSRF, { host: process.argv[2], driveFileId: '1LKHW6o-WrDwyFfXVwdZA8pCECar4Csoa' })
.then(getSecret('DEFAULT_INSECURE_PASSWORD'))
.then(login)
.then(getLoggedInCSRF)
.then(createConfigBackup)
.then(getSecret('BACK_ENC_KEY'))
.then(downloadConfigBackup)
.then(getSecret('DRIVE_CLIENT_ID'))
.then(getSecret('DRIVE_CLIENT_SECRET'))
.then(getSecret('DRIVE_REFRESH_TOKEN'))
.then(getGoogleAccessToken)
.then(writeFileToDrive)
.then(function (params) {
})
.catch(function (error) {
  console.error(error);
})
.done();