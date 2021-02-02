const child = require('child_process');
const fs = require('fs');
const path = require('path');

const {log} = require('./Log');
const baseSpotify = require('./Spotify');

class Auth {
    static async getVerifiedAccountAccessToken() {
        return new Promise(async (resolve, reject) => {
            /** @var object */
            let verifiedAccountAccess;

            /** @var int */
            let authAttemps = 0;

            while (! verifiedAccountAccess && authAttemps <= 2) {
                let unverifiedAccountAccess = await Auth._getExistingAccountAccessOrObtainNew();

                if (unverifiedAccountAccess) {
                    verifiedAccountAccess = await Auth._verifyAccountAccess(
                        unverifiedAccountAccess
                    );
                }

                // allow 2 attempts, on third show error and exit
                if (authAttemps >= 2 && ! verifiedAccountAccess) {
                    log('failed to authenticate twice, shutting down', 'auth');
                    process.exit();
                }

                authAttemps++;
            }

            resolve(verifiedAccountAccess.access_token);
        });
    }

    /**
     * Check for existing account access json file, starts
     * auth server if not found.
     * 
     * Returns promise that resolves to object or null.
     */
    static async _getExistingAccountAccessOrObtainNew() {
        /** @var object */
        let accountAccess;

        return new Promise(async (resolve, reject) => {
            try {
                accountAccess = this.readAccountAccessFile();
                log('token was found', 'auth');
                resolve(accountAccess);
            } catch (e) {
                log('token could not be accessed', 'auth');
                log('starting auth server', 'auth');
                log('navigate here: http://localhost', 'auth');

                // start server, resolve onece spawn dies
                child.execFile(path.resolve(__dirname, '../scripts/start-server.sh'), () => {
                    log('new authorization obtained, re-checking', 'auth');
                    resolve(null);
                });
            }
        })
    }

    /**
     * Takes passed account authorization and attempts
     * to get user data from spotify.
     * 
     * Returns promise that resolves to object or null.
     * 
     * @param object unverifiedAccountAccess 
     */
    static async _verifyAccountAccess(unverifiedAccountAccess) {
        return new Promise(async (resolve, reject) => {
        
            // hit spotify and check validity of token
            log('verifying token with spotify', 'auth');

            let spotify = new baseSpotify(unverifiedAccountAccess);

            let userData = await spotify.getUser();

            if (! userData) {
                log('spotify rejected the token', 'auth');
                log('deleting bad token and trying again', 'auth');

                // token was bad for some reason,
                // remove existing access json so we run through auth server again
                fs.unlinkSync(path.resolve(__dirname, '../account_access.json'));
            } else {
                log(`you are authenticated as "${userData.display_name}"`, 'auth');

                resolve(unverifiedAccountAccess);
            }

            resolve(null);
        });
    }

    /**
     * @throws Error
     * @returns object|void
     */
    static readAccountAccessFile() {
        if (! fs.existsSync(path.resolve(__dirname, '../account_access.json'))) {
            throw Error('account access file does not exist');
        }

        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../account_access.json')));
        } catch (e) {
            throw Error('account access file exists, but was corrupted');
        }
    }
}

module.exports = Auth;