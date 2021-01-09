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

    async getUser() {
        return await fetch(this.baseEndpoint + '/me', {
            headers: {
                'Authorization': 'Bearer ' + this.acctAccess.access_token
            }
        })
            .then(res => {
                if (res.status !== 200)
                    throw new Error('Response was not 200');

                return res.json()
            })
            .then(res => res)
            .catch(() => null);
    }
}

module.exports = SpotifyDriver;
