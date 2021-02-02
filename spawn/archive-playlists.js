const fs = require('fs');
const path = require('path');

const auth = require('../drivers/Auth');
const {log} = require('../drivers/Log');
const baseSpotify = require('../drivers/Spotify');

const authorizationFilePath = '../account_access.json';

(async function () {
    try {
        const accountAccess = auth.readAndParseAccountAccess();
    } catch (e) {
        log('no accounts access, run through auth flow', 'playlists');
        return;
    }

    // create instance of driver
    const SpotifyDriver = new baseSpotify(accountAccess);

    console.log(await SpotifyDriver.getPlaylists());
})();
