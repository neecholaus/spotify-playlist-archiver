console.log('== Spotify Playlist Archiver ==');

const child = require('child_process');
const fs = require('fs');
const path = require('path');

const {log} = require('./drivers/log');
const auth = require('./drivers/Auth');
const baseSpotify = require('./drivers/Spotify');

log('attempting to pull existing access token', 'auth');

(async function () {

    /** @var object */
    let accountAccess;

    /** @var int */
    let authAttemps = 0;

    /** @var bool */
    let mustRunThroughAuth = false;

    while (!accountAccess && authAttemps <= 2) {
        try {
            accountAccess = auth.getAccountAccess();
            log('token was found', 'auth');
        } catch (e) {
            log('token could not be accessed', 'auth');
            mustRunThroughAuth = true;
        }

        if (mustRunThroughAuth) {
            // allow 2 attempts, on third show error and exit
            if (authAttemps == 2) {
                log('failed to authenticate twice, shutting down', 'auth');
                process.exit();
            }

            log('starting auth server', 'auth');

            // start server
            child.execFileSync(path.resolve(__dirname, './scripts/start-server.sh'));
        }

        authAttemps++;
    }

    // hit spotify and check validity of token
    log('checking token with spotify', 'auth');

    let spotify = new baseSpotify(accountAccess);

    let userData = await spotify.getUser();

    if (! userData) {
        log('spotify rejected the token', 'auth');
    } else {
        log(`you are authenticated as "${userData.display_name}"`, 'auth');
    }

})();