package routing

import (
	"errors"
	"net/http"
)

func makeSpotifyOauthScheme(r *http.Request) (*spotifyOauthScheme, error) {
	params := r.URL.Query()

	// Ensure `code` value was provided
	exists := params.Has("code")
	if !exists {
		return nil, errors.New("NO_CODE")
	}

	return &spotifyOauthScheme{
		Code: params.Get("code"),
	}, nil
}
