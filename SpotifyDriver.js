const fetch = require('node-fetch');

class SpotifyDriver {
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
     * Get all info relating to the user's profile.
     * @return object|null 
     */
    async getUser() {
        return await fetch(this.baseEndpoint + '/me', {
            headers: {
                Authorization: 'Bearer ' + this.acctAccess.access_token
            }
        })
            .then(res => {
                if (res.status !== 200)
                    throw new Error('Response was not 200');

                return res.json()
            })
            .catch(() => null);
    }

    /** 
     * Returns a list of the user's playlists.
     * @return object|null 
     */
    async getPlaylists() {
        return await fetch(this.baseEndpoint + '/me/playlists', {
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
}

module.exports = SpotifyDriver;
