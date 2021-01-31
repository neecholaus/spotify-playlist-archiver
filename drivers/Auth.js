const child = require('child_process');
const fs = require('fs');
const path = require('path');

const {log} = require('./Log');
const baseSpotify = require('./Spotify');

class Auth {
    static async boot(dieOnFail=false) {
        /** @var object */
        let accountAccess;

        /** @var int */
        let authAttemps = 0;

        while (!accountAccess && authAttemps <= 2) {
            /** @var bool */
            let mustRunThroughAuth = false;

            try {
                accountAccess = this._readAndParseAccountAccess();
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

                log('navigate here: http://localhost');

                // start server
                child.execFileSync(path.resolve(__dirname, '../scripts/start-server.sh'));
            }

            authAttemps++;
        }

        // hit spotify and check validity of token
        log('checking token with spotify', 'auth');

        let spotify = new baseSpotify(accountAccess);

        let userData = await spotify.getUser();

        if (! userData) {
            log('spotify rejected the token', 'auth');
            log('deleting bad token and trying again', 'auth');

            if (!dieOnFail) {
                // token was bad for some reason,
                // remove existing access json so we run through auth server again
                fs.unlinkSync(path.resolve(__dirname, '../account_access.json'));
                this.boot(true);
            }
        } else {
            log(`you are authenticated as "${userData.display_name}"`, 'auth');

            // todo - call next step in app?
        }
    }

    /**
     * @throws Errora
     * @returns object|void
     */
    static _readAndParseAccountAccess() {
        if (! fs.existsSync(path.resolve(__dirname, '../account_access.json'))) {
            throw Error('account access file does not exist');
        }

        try {
            return JSON.parse(fs.readFileSync('account_access.json'));
        } catch (e) {
            throw Error('account access file exists, but was corrupted');
        }
    }
}

module.exports = Auth;