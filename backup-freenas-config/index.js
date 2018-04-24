var Q = require('q');
var http = require('http');
var querystring = require('querystring');
var setCookie = require('set-cookie-parser');
var fs = require('fs');
var fetch = require('isomorphic-fetch');
var {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
var crypto = require('crypto');

function getLoginPage() {
  var deferred = Q.defer();

  let params = {};
  params.host = process.argv[2];
  
  var options = {
    host: params.host,
    port: 80,
    path: '/account/login/',
    method: 'GET'
  };

  const chunks = [];

  http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      let body = chunks.join();

      let startDelim = "name='csrfmiddlewaretoken' value='";
      let startIndex = body.indexOf(startDelim);
      var csrf = body.substring(startIndex + startDelim.length, body.length);
      
      params.formCsrf = csrf.substring(0,csrf.indexOf("'"));

      var cookies = setCookie.parse(res);

      var theCookie = cookies.filter(cookie => cookie.name.localeCompare('csrftoken') == 0 );
      params.cookieCsrf = theCookie[0].value;

      deferred.resolve(params);
    });
  }).end();

  return deferred.promise;
}

function login(params) {
  var deferred = Q.defer();

  var post_data = querystring.stringify({
      'username' : 'root',
      'password': params.DEFAULT_INSECURE_PASSWORD,
      'next': '/',
      'csrfmiddlewaretoken' : params.formCsrf
  });

  var options = {
  host: params.host,
  port: 80,
  path: '/account/login/',
  method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data),
          'Cookie': 'csrftoken=' + params.cookieCsrf
      }
  };

  var post_req = http.request(options, function(res) {
      res.on('data', function (chunk) { });

      res.on('end', function () {
        var cookies = setCookie.parse(res);
        cookies.forEach( cookie => params[cookie.name] = cookie.value);
        deferred.resolve(params);
      });
  });

  post_req.write(post_data);
  post_req.end();

  return deferred.promise;
}

function getHomePage(params) {
  var deferred = Q.defer();
  
  var options = {
    host: params.host,
    port: 80,
    path: '/',
    method: 'GET',
      headers: {
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid
      }
  };

  const chunks = [];

  http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      let body = chunks.join();

      let startDelim = "var CSRFToken = '";
      let startIndex = body.indexOf(startDelim);
      let csrf = body.substring(startIndex + startDelim.length, body.length);
      
      params.xcsrfToken = csrf.substring(0,csrf.indexOf("'"));

      deferred.resolve(params);
    });
  }).end();

  return deferred.promise;
}

function createConfigBackup(params) {
  var deferred = Q.defer();
  
  var post_data = querystring.stringify({
      '__all__' : null,
      'secret': 'on',
      '__form_id': 'form_ConfigSaveForm'
  });

  var options = {
  host: params.host,
  port: 80,
  path: '/system/config/save/',
  method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data),
          'Cookie': 'csrftoken=' + params.csrftoken + "; sessionid=" + params.sessionid,
          'X-CSRFToken': params.xcsrfToken
      }
  };

  var post_req = http.request(options, function(res) {
      res.on('data', function (chunk) {  });

      res.on('end', function () {
        deferred.resolve(params);
      });
  });

  post_req.write(post_data);
  post_req.end();

  return deferred.promise;
}

function downloadConfigBackup(params) {
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
    params.destDriveFolder = '1LKHW6o-WrDwyFfXVwdZA8pCECar4Csoa';
    var file = fs.createWriteStream(params.filename);
    var cipher = crypto.createCipher('aes-256-cbc', params.BACK_ENC_KEY);
    res.pipe(cipher).pipe(file);
    deferred.resolve(params);
  }).end();

  return deferred.promise;
}

function getReadFunction(secretFile) {
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

function getGoogleAccessToken(params) {
    
    var deferred = Q.defer();
    const refresh_token = params.DRIVE_REFRESH_TOKEN;
    const client_id = params.DRIVE_CLIENT_ID;
    const client_secret = params.DRIVE_CLIENT_SECRET;
    const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

    const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

    let refresh_request = {
        body: post_body,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // post to the refresh endpoint, parse the json response and use the access token to call files.list
    fetch(refresh_url, refresh_request).then( response => {
            return(response.json());
        }).then( response_json =>  {
            params.accessToken = response_json.access_token;
            deferred.resolve(params);
    });

    return deferred.promise;
}

function writeFileToDrive(params)
{
  const clientId = params.DRIVE_CLIENT_ID;
  const clientSecret = params.DRIVE_CLIENT_SECRET;
  const accessToken = params.accessToken;
  const refreshToken = params.DRIVE_REFRESH_TOKEN;
  const fileName = params.filename;
  const folder = params.destDriveFolder;

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

Q.fcall(getLoginPage)
.then(getReadFunction('DEFAULT_INSECURE_PASSWORD'))
.then(login)
.then(getHomePage)
.then(createConfigBackup)
.then(getReadFunction('BACK_ENC_KEY'))
.then(downloadConfigBackup)
.then(getReadFunction('DRIVE_CLIENT_ID'))
.then(getReadFunction('DRIVE_CLIENT_SECRET'))
.then(getReadFunction('DRIVE_REFRESH_TOKEN'))
.then(getGoogleAccessToken)
.then(writeFileToDrive)
.then(function (params) {
})
.catch(function (error) {
  console.error(error);
})
.done();