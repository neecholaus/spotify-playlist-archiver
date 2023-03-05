package routing

import (
	"encoding/json"
	"fmt"
	"neecholaus/spa/spotify"
	"net/http"
)

func userProfile(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		fmt.Println("no cookie")
		w.WriteHeader(400)
		return
	}

	accessToken := getToken(cookie.Value)
	if accessToken == "" {
		fmt.Println("no session")
		w.WriteHeader(400)
		return
	}

	userProfile, err := spotify.GetUserProfileResponse(accessToken)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	marshalledUserProfile, err := json.Marshal(userProfile)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	_, _ = w.Write(marshalledUserProfile)
}

func userPlaylistsHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		fmt.Println("no cookie")
		w.WriteHeader(400)
		return
	}

	accessToken := getToken(cookie.Value)
	if accessToken == "" {
		fmt.Println("no session")
		w.WriteHeader(400)
		return
	}

	userPlaylists, err := spotify.GetAllUserPlaylists(accessToken)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	marshalledUserPlaylists, err := json.Marshal(userPlaylists)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	_, _ = w.Write(marshalledUserPlaylists)
}

func playlistItemsHandler(w http.ResponseWriter, r *http.Request) {
	accessToken, err := getTokenForRequest(r)
	if err != nil {
		fmt.Printf("getting access token: %s\n", err)
		w.WriteHeader(400)
		return
	}

	requestScheme, err := parsePlaylistItemsRequestParams(r)
	if err != nil {
		fmt.Printf("parsing request body: %s\n", err)
		w.WriteHeader(500)
		return
	}

	playlistItems, err := spotify.GetAllPlaylistItems(accessToken, requestScheme.PlaylistId)
	if err != nil {
		fmt.Printf("getting playlist items: %s\n", err)
		w.WriteHeader(500)
		return
	}

	marshalled, err := json.Marshal(playlistItems)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	_, _ = w.Write(marshalled)
}
