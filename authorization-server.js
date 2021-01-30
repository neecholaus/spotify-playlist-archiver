const
    express = require('express'),
    fs = require('fs'),
    app = express();

// env variables
require('dotenv').config();

// pull client id from env
const clientID = process.env.SPOTIFY_CLIENT_ID;

// json payloads
app.use(express.json());

/**
 * Entrypoint to spotify account access granting.
 */
app.get('/', (req, res) => {
    let spotifyUrl = 'https://accounts.spotify.com/authorize';

    // client id
    spotifyUrl += `?client_id=${clientID}`;

    spotifyUrl += '&response_type=token';

    spotifyUrl += '&scope=' + encodeURIComponent('user-read-email user-read-private playlist-read-private playlist-read-collaborative');

    spotifyUrl += '&redirect_uri=http://localhost/redirect';

    res.send(`<a href="${spotifyUrl}">authenticate with spotify</a>`);
    res.end();
});

/**
 * Handles the redirection after signing into spotify.
 */
app.get('/redirect', (req, res) => {
    const parseFragmentScript = '<script>fetch("/store-user-token", {headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:window.location.hash})});console.log(window.location.hash);</script>';
    res.send('acknowledged' + parseFragmentScript);
    res.end();
});

/**
 * Accepts token field, parses and then stores in a file.
 */
app.post('/store-user-token', (req, res) => {
    let vals = req.body.token.replace('#', '').split(/[?&]/);

    // map values into an object for easy access
    let mappedVals = {};
    vals.map(val => {
        const [key, value] = val.split('=');
        mappedVals[key] = value;
    });

    // write values to a file
    fs.writeFileSync('account_access.json', JSON.stringify(mappedVals));

    res.sendStatus(200).end();

    // server is no longer needed
    process.exit();
});

app.listen(80);
