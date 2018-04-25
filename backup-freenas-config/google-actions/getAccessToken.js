var Q = require('q');
var fetch = require('isomorphic-fetch');

module.exports = function (params) {
    
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