# Spotify Playlist Archiver
## Prerequisites
Before this app is useful to you, you need to have a [Spotify Developer](https://developer.spotify.com/) account. Once you have an account create a new app. The only configuration you need to set is the redirect url. Set it to `http://localhost/redirect`. Last step is to copy your `Client ID` and set in the `.env` file under the name `SPOTIFY_CLIENT_ID`.

---

## Usage
Start the app by running:

```node kernel.js```

The app first ensures there is valid authentication. If no access is stored on disk, a small webserver boots up and the user is prompted on the command line to visit the page being served on `localhost`. 

Once the user has navigated there, they will need to sign into Spotify in order to grant the app permission. Once signed in, the browser can be discarded.

There will then be a json file called `account_access.json` in the root directory. This includes the access token which is used with Spotify's api.

The archiver will verify the access token is valid, (it expires after 1 hour) and then move on to the actual archiving. All liked songs will be pulled and put into `./archives/Liked Songs` while each song belonging to one of your created/followed playlists will be put into `./archives/{PLAYLIST_NAME}`.