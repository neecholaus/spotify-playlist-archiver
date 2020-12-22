const fetch = require('node-fetch');

const baseEndpoint = 'https://api.spotify.com/v1';

fetch(baseEndpoint, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'fdsklfjsdlkf'
    }
})
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err);
    });