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
        const
            likedSongs = await this.spotify.fetchAllLikedSongs(),
            playlists = await this.spotify.fetchAllPlaylists();

        likedSongs.map(track => {
            // echo into file
        });

        playlists.map(async playlist => {
            const tracks = await this.spotify.fetchAllTracksInPlaylist(playlist.id);

            tracks.forEach(x => {
                // echo into file
            });
        });
    }
}

module.exports = Archiver;