package spotify

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

func GetAccessToken(oauthCode string) (*AccessTokenResponse, error) {
	params := makeAccessTokenRequestParams(oauthCode)

	request, err := http.NewRequest(
		"POST",
		"https://accounts.spotify.com/api/token",
		strings.NewReader(params.Encode()),
	)

	request.Header.Set("content-type", "application/x-www-form-urlencoded")

	request.SetBasicAuth(
		os.Getenv("SPOTIFY_CLIENT_ID"),
		os.Getenv("SPOTIFY_CLIENT_SECRET"),
	)

	client := &http.Client{}
	res, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("post (access token): %w", err)
	}

	tokenResponse, err := parseAccessTokenResponse(res)
	if err != nil {
		return nil, fmt.Errorf("parse response (access token): %w", err)
	}

	return tokenResponse, nil
}
