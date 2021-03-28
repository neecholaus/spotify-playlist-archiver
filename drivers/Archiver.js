const fs = require('fs');
const {log} = require('./Log');
const baseSpotify = require('./Spotify');
const path = require('path');

class Archiver {
    /** @var object */
    accountAccess;

    constructor(accountAccess) {
        this.accountAccess = accountAccess;

        this.spotify = new baseSpotify(this.accountAccess);
    }

    async archiveAllPlaylists() {
        // TODO - minimize file IO, join tracks on their desired info and emit once per playlist
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
            let filename = playlist.name;

            if (filename != path.basename(filename)) {
                console.log(`'${filename}' is an invalid filepath - ignoring`);

                filename = '[invalid-playlist-names]';
            }

            const playlistFilePath = outputPath + '/' + filename;

            const tracks = await this.spotify.fetchAllTracksInPlaylist(playlist.id);

            tracks.forEach(track => {
                track = track.track;

                fs.appendFileSync(playlistFilePath, "\n" + track.artists[0].name + ' - ' + track.name)
            });
        });
    }
}

module.exports = Archiver;