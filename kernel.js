const Auth = require('./drivers/Auth');
const Archiver = require('./drivers/Archiver');
const {log} = require('./drivers/log');

log('== Spotify Playlist Archiver ==');

(async function () {
    // NOTE: accountAccess is expected to be the full object stored in ./account_access.json not just the access token.

    const accountAccess = await Auth.getVerifiedAccountAccessToken();

    (new Archiver(accountAccess)).archiveAllPlaylists();
})();