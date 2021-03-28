const fs = require('fs');
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

        const outputPath = './archives';

        // clear all output and recreate dir
        if (fs.existsSync(outputPath)) {
            fs.rmdirSync(outputPath, {
                recursive: true
            });
        }
        fs.mkdirSync(outputPath);

        // archive all liked songs
        likedSongs.map(track => {
            track = track.track;

            const likedSongFilepath = outputPath + '/Liked\ Songs';

            fs.appendFileSync(likedSongFilepath, "\n" + track.artists[0].name + ' - ' + track.name);
        });

        playlists.map(async playlist => {
            const playlistFilePath = outputPath + '/' + playlist.name;

            const tracks = await this.spotify.fetchAllTracksInPlaylist(playlist.id);

            tracks.forEach(track => {
                track = track.track;

                fs.appendFileSync(playlistFilePath, "\n" + track.artists[0].name + ' - ' + track.name)
            });
        });
    }
}

module.exports = Archiver;