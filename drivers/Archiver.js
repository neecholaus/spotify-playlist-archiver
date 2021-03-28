const {log} = require('./Log');
const baseSpotify = require('./Spotify');

class Archiver {
    /** @var object */
    accountAccess;

    constructor(accountAccess) {
        this.accountAccess = accountAccess;
    }

    async archiveAllPlaylists() {
        const SpotifyDriver = new baseSpotify(this.accountAccess);

        console.log(await SpotifyDriver.getPlaylists());
    }
}

module.exports = Archiver;