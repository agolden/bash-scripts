var Q = require('q');

var getLoginCSRF = require ('./web-actions/getLoginCSRF');
var login = require ('./web-actions/login');
var getLoggedInCSRF = require ('./web-actions/getLoggedInCSRF');
var uploadConfigBackup = require ('./web-actions/uploadConfigBackup');
var reboot = require ('./web-actions/reboot');

var getGoogleAccessToken = require('./google-actions/getAccessToken');
var findFileInDrive = require('./google-actions/findFileInDrive');
var getFileFromDrive = require('./google-actions/getFileFromDrive');

var getSecret = require ('./shared-actions/getSecret');
var decryptFile = require ('./shared-actions/decryptFile');

Q.fcall(getLoginCSRF, { host: process.argv[2], searchTerm: process.argv[3], driveDirId: '1LKHW6o-WrDwyFfXVwdZA8pCECar4Csoa' })
.then(getSecret('DEFAULT_INSECURE_PASSWORD'))
.then(login)
.then(getLoggedInCSRF)
.then(getSecret('DRIVE_CLIENT_ID'))
.then(getSecret('DRIVE_CLIENT_SECRET'))
.then(getSecret('DRIVE_REFRESH_TOKEN'))
.then(getGoogleAccessToken)
.then(findFileInDrive)
.then(getFileFromDrive)
.then(getSecret('BACK_ENC_KEY'))
.then(decryptFile)
.then(uploadConfigBackup)
.then(reboot)
.then(function (params) {
})
.catch(function (error) {
  console.error(error);
})
.done();