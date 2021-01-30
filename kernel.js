console.log('== Spotify Playlist Archiver ==');

const exec = require('child_process');
const fs = require('fs');
const auth = require('./drivers/Auth');

console.log('[auth] attempting to pull existing access token');
try {
    const accessToken = auth.getAccessToken();
    console.log('[auth] token was found')
} catch (e) {
    console.log('[auth] token could not be accessed');
    const mustRunThroughAuth = true;
}

if (typeof mustRunThroughAuth !== 'undefined') {
    console.log('[auth] starting auth server');

    // start server

    // open browser
}

console.log('[auth] attempting to pull account info');

