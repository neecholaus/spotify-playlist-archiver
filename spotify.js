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

    async getUser() {
        console.log(this.acctAccess);
        return await fetch(this.baseEndpoint + '/me', {
            headers: {
                'Authorization': 'Bearer ' + this.acctAccess.access_token
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Spotify;