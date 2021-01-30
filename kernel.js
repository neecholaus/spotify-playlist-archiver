const {log} = require('./drivers/log');
const auth = require('./drivers/Auth');

log('== Spotify Playlist Archiver ==');

log('attempting to pull existing access token', 'auth');

(async function () {
    auth.boot()
})();