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
        const playlists = this.fetchAllPlaylists();
    }

    async fetchAllPlaylists() {
        const initialResponse = await this.spotify.getPlaylists();

        let playlists = initialResponse.items;

        // spotify provided `next` value which is a url providing easy pagination
        if (initialResponse.next) {
            let nextUrl = initialResponse.next;

            // as long as there are more pages, keep pulling playlists
            while (nextUrl) {
                const morePlaylists = await this.spotify.getPlaylistsFromURL(nextUrl);
                playlists = playlists.concat(morePlaylists.items);
                nextUrl = morePlaylists.next ?? null;
            }
        }

        return playlists;
    }
}

module.exports = Archiver;