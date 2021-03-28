const {log} = require('./Log');
const baseSpotify = require('./Spotify');

class Archiver {
    /** @var object */
    accountAccess;

    constructor(accountAccess) {
        this.accountAccess = accountAccess;

        this.spotify = new baseSpotify(this.accountAccess);
    }

    async archiveAllPlaylists() {
        // const playlists = await this.spotify.fetchAllPlaylists();

        let playlists = await this.spotify.getFirstPlaylists();

        playlists = playlists.items;

        playlists.map(async playlist => {
            const tracks = await this.spotify.fetchAllTracksInPlaylist(playlist.id);

            tracks.forEach(x => {
                console.log(playlist.name + ' - ' + x.track.name);
            });
        });
    }
}

module.exports = Archiver;