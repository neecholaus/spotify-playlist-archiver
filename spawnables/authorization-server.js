const
    express = require('express'),
    fs = require('fs'),
    app = express(),
    path = require('path');

// env variables
require('dotenv').config();

// json payloads
app.use(express.json());

/**
 * Entrypoint to spotify account access granting.
 */
app.get('/', (req, res) => {
    // pull client id from env
    const clientID = process.env.SPOTIFY_CLIENT_ID;

    const scopes = 'user-read-email user-read-private playlist-read-private playlist-read-collaborative user-library-read';

    let spotifyUrl = [
        'https://accounts.spotify.com/authorize',
        `?client_id=${clientID}`,
        '&response_type=token',
        '&scope=' + encodeURIComponent(scopes),
        '&redirect_uri=http://localhost/redirect'
    ].join('');

    res.send(`<script>window.location="${spotifyUrl}"</script>`);
    res.end();
});

/**
 * Handles the redirection after signing into spotify.
 */
app.get('/redirect', (req, res) => {
    res.send('<script>' + fs.readFileSync(path.resolve(__dirname, '../web/parse-auth-fragment.js')) + '</script>');
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

    // estimate token expiration
    let time = new Date();
    time.setTime(time.getTime() + parseInt(mappedVals.expires_in));
    mappedVals.approximate_token_expiration = time;

    // write values to a file
    fs.writeFileSync('account_access.json', JSON.stringify(mappedVals));

    res.sendStatus(200).end();

    // server is no longer needed
    process.exit();
});

app.listen(80);
