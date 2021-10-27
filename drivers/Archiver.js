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
        const playlists = await this.spotify.fetchAllPlaylists();

        const outputPath = './archives';

        // clear all output and recreate dir
        if (fs.existsSync(outputPath)) {
            fs.rmSync(outputPath, {
                recursive: true
            });
        }
        fs.mkdirSync(outputPath);

        // archive all liked songs
        console.log('[ARCHIVER] pulling playlist (Liked Songs)');
        const likedSongs = await this.spotify.fetchAllLikedSongs();
        likedSongs.map(track => {
            const trackInfo = track.track;
            const likedSongFilepath = outputPath + '/Liked\ Songs.txt';
            fs.appendFileSync(likedSongFilepath, "\n" + trackInfo.artists[0].name + ' - ' + trackInfo.name + ' - ' + track.added_at);
        });

        playlists.map(async playlist => {
            let filename = playlist.name;

            if (filename != path.basename(filename)) {
                console.log(`'${filename}' is an invalid filepath - modifying`);
                filename = '[invalid-playlist-names]';
            }
            console.log(`[ARCHIVER] pulling playlist (${filename})`);

            const playlistFilePath = outputPath + '/' + filename + '.txt';

            const tracks = await this.spotify.fetchAllTracksInPlaylist(playlist.id);

            tracks.forEach(track => {
                const trackInfo = track.track;

                fs.appendFileSync(playlistFilePath, "\n" + trackInfo.artists[0].name + ' - ' + trackInfo.name + ' - ' + track.added_at)
            });
        });
    }
}

module.exports = Archiver;