const {log} = require('./drivers/log');
const auth = require('./drivers/Auth');

log('== Spotify Playlist Archiver ==');

(async function () {
    const accessToken = await auth.boot();

    // playlists
})();