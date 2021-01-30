console.log('== Spotify Playlist Archiver ==');

const exec = require('child_process');
const fs = require('fs');
const {log} = require('./drivers/log');
const auth = require('./drivers/Auth');

log('attempting to pull existing access token', 'auth');

try {
    const accessToken = auth.getAccessToken();
    log('token was found', 'auth');
} catch (e) {
    log('token could not be accessed', 'auth');
    const mustRunThroughAuth = true;
}

if (typeof mustRunThroughAuth !== 'undefined') {
    log('starting auth server', 'autha');

    // start server

    // open browser
}

log('attempting to pull account info', 'auth');

