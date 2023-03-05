package routing

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
)

func makeSpotifyOauthScheme(r *http.Request) (*ingestOauthScheme, error) {
	params := r.URL.Query()

	// Ensure `code` value was provided
	exists := params.Has("code")
	if !exists {
		return nil, errors.New("NO_CODE")
	}

	return &ingestOauthScheme{
		Code: params.Get("code"),
	}, nil
}

func parsePlaylistItemsRequestParams(r *http.Request) (*playlistItemsRequestScheme, error) {
	endpoint, err := url.Parse(r.RequestURI)
	if err != nil {
		return nil, fmt.Errorf("parsing url: %w", err)
	}

	params, err := url.ParseQuery(endpoint.RawQuery)
	if err != nil {
		return nil, fmt.Errorf("parsing query: %w", err)
	}

	if params.Get("playlistId") == "" {
		return nil, errors.New("no playlist id")
	}

	return &playlistItemsRequestScheme{
		PlaylistId: params.Get("playlistId"),
	}, nil
}
