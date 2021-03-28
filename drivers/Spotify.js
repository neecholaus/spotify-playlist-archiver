const fetch = require('node-fetch');

class Spotify {
    /** @var object */
    acctAccess;

    /** @var string */
    baseEndpoint = 'https://api.spotify.com/v1';

    constructor(acctAccess) {
        if (!acctAccess) {
            throw new Error('account access must be provided');
        }

        this.acctAccess = acctAccess;
    }

    /**
     * Generic 'GET' request, if HTTP code is not 200, null is returned.
     * @param string url 
     */
    async getResponseFromSpotify(url) {
        return await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + this.acctAccess.access_token
            }
        })
            .then(res => {
                if (res.status !== 200)
                    throw new Error('Response was not 200');

                return res.json();
            })
            .catch(() => null);
    }

    /** 
     * Get all info relating to the user's profile.
     * @return object|null 
     */
    async getUser() {
        const endpoint = this.baseEndpoint + '/me';
        return this.getResponseFromSpotify(endpoint);
    }

    /**
     * Get the first list of user's liked songs.
     * @return object|null
     */
    async getFirstLikedSongs() {
        const endpoint = this.baseEndpoint + '/me/tracks?limit=50';
        return this.getResponseFromSpotify(endpoint);
    }

    /**
     * Get the first list of the user's playlists.
     * @return object|null
     */
    async getFirstPlaylists() {
        const endpoint = this.baseEndpoint + '/me/playlists';
        return this.getResponseFromSpotify(endpoint);
    }

    /**
     * Get first tracks belonging to playlist with the passed ID.
     * @param int playlistId 
     */
    async getFirstTracksInPlaylist(playlistId) {
        const endpoint = `${this.baseEndpoint}/playlists/${playlistId}/tracks`;
        return this.getResponseFromSpotify(endpoint);
    }

    /**
     * Will navigate through all pages spotify offers for the resource
     * present in the first page.
     * @param object firstPage 
     */
    async _pullAllItemsFromAllPages(firstPage) {
        let items = firstPage.items;

        // spotify provided `next` value which is a
        // url providing easy pagination
        if (firstPage.next) {
            let nextUrl = firstPage.next;

            // as long as there are more pages, keep pulling playlists
            while (nextUrl) {
                const nextPage = await this.getResponseFromSpotify(nextUrl);
                items = items.concat(nextPage.items);
                nextUrl = nextPage.next ?? null;
            }
        }

        return items;
    }

    /**
     * @return array
     */
    async fetchAllPlaylists() {
        const firstPage = await this.getFirstPlaylists();

        return this._pullAllItemsFromAllPages(firstPage);
    }

    /**
     * @param int playlistId 
     * @return array
     */
    async fetchAllTracksInPlaylist(playlistId) {
        let firstPage = await this.getFirstTracksInPlaylist(playlistId);

        return this._pullAllItemsFromAllPages(firstPage);
    }

    /**
     * @return array
     */
    async fetchAllLikedSongs() {
        let firstPage = await this.getFirstLikedSongs();

        return this._pullAllItemsFromAllPages(firstPage);
    }

    // TODO - abstract multipage resource fetching into one reusable method
}

module.exports = Spotify;
