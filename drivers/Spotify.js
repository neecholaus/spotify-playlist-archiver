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
     * Returns the first list of the user's playlists.
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
        return await this.getResponseFromSpotify(endpoint);
    }

    /**
     * @return array
     */
    async fetchAllPlaylists() {
        const initialResponse = await this.getFirstPlaylists();

        let playlists = initialResponse.items;

        // spotify provided `next` value which is a url providing easy pagination
        if (initialResponse.next) {
            let nextUrl = initialResponse.next;

            // as long as there are more pages, keep pulling playlists
            while (nextUrl) {
                const morePlaylists = await this.getResponseFromSpotify(nextUrl);
                playlists = playlists.concat(morePlaylists.items);
                nextUrl = morePlaylists.next ?? null;
            }
        }

        return playlists;
    }

    /**
     * @param int playlistId 
     * @return array
     */
    async fetchAllTracksInPlaylist(playlistId) {
        let initialResponse = await this.getFirstTracksInPlaylist(playlistId);

        let tracks = initialResponse.items;

        let nextUrl = initialResponse.next;
    
        // while 'next' field, pull tracks
        while (nextUrl) {
            const moreTracks = await this.getResponseFromSpotify(nextUrl);
            tracks = tracks.concat(moreTracks.items);
            nextUrl = moreTracks.next ?? null;
        }

        return tracks;
    }
}

module.exports = Spotify;
