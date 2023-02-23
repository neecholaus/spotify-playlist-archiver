package spotify

import (
	"fmt"
	"net/http"
)

func GetAccessToken(oauthCode string) (*AccessTokenResponse, error) {
	params := makeAccessTokenRequestParams(oauthCode)

	encodedParams := params.Encode()

	res, err := http.Post(
		"https://accounts.spotify.com/api/token?"+encodedParams,
		"application/x-www-form-urlencoded",
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("post (access token): %w", err)
	}

	tokenResponse, err := parseAccessTokenResponse(res)
	if err != nil {
		return nil, fmt.Errorf("parse response (access token): %w", err)
	}

	return tokenResponse, nil
}
