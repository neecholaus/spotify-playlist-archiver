const Auth = require('./drivers/Auth');
const Archiver = require('./drivers/Archiver');
const {log} = require('./drivers/log');

log('== Spotify Playlist Archiver ==');

(async function () {
    const accessToken = await Auth.getVerifiedAccountAccessToken();

    // playlists
    const archiver = new Archiver(accessToken);
})();