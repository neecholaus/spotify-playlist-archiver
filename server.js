const express = require('express');

const app = express();

// json payloads
app.use(express.json());

app.get('/', (req, res) => {
    let spotifyUrl = 'https://accounts.spotify.com/authorize';

    // client id
    spotifyUrl += '?client_id=fd5307aee53c4b16a676f2ca349e1323';

    spotifyUrl += '&response_type=token';

    spotifyUrl += '&redirect_uri=http://localhost:3000/redirect';

    res.send(`<a href="${spotifyUrl}">authenticate with spotify</a>`);
    res.end();
});

app.get('/redirect', (req, res) => {
    const parseFragment = '<script>console.log(window.location.hash)</script>';
    console.log(req.originalUrl);
    res.send('acknowledged' + parseFragment);
    res.end();
});

console.log('server starting');
app.listen(3000);