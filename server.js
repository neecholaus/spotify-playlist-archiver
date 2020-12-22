const express = require('express');

const app = express();

// env variables
require('dotenv').config();

// pull client id from env
const clientID = process.env.SPOTIFY_CLIENT_ID;

// json payloads
app.use(express.json());

app.get('/', (req, res) => {
    let spotifyUrl = 'https://accounts.spotify.com/authorize';

    // client id
    spotifyUrl += `?client_id=${clientID}`;

    spotifyUrl += '&response_type=token';

    spotifyUrl += '&redirect_uri=http://localhost:3000/redirect';

    res.send(`<a href="${spotifyUrl}">authenticate with spotify</a>`);
    res.end();
});

app.get('/redirect', (req, res) => {
    const parseFragmentScript = '<script>fetch("/store-user-token", {headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:window.location.hash})});console.log(window.location.hash);</script>';
    res.send('acknowledged' + parseFragmentScript);
    res.end();
});

app.post('/store-user-token', (req, res) => {
    console.log(req.body.token);

    // todo - store token

    res.end();
});

console.log('server starting');
app.listen(3000);