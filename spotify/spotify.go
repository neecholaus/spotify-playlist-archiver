package spotify

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

func GetAccessToken(oauthCode string) (*AccessToken, error) {
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

func GetUserProfile(accessToken string) (*UserProfile, error) {
	fmt.Println("GetUserProfile called")

	request, err := http.NewRequest(
		"GET",
		"https://api.spotify.com/v1/me",
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("building request (user profile): %w", err)
	}

	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("request: %w", err)
	}

	userProfile, err := parseUserProfileResponse(response)
	if err != nil {
		return nil, fmt.Errorf("parsing response (user profile): %w", err)
	}

	return userProfile, nil
}
