package spotify

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

func GetAccessTokenResponse(oauthCode string) (*AccessTokenResponse, error) {
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

func GetUserProfileResponse(accessToken string) (*UserProfileResponse, error) {
	fmt.Println("GetUserProfileResponse called")

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

func GetAllUserPlaylists(accessToken string) (*UserPlaylists, error) {
	playlists := UserPlaylists{}
	offset := 0
	limit := 50

	for {
		userPlaylistResponse, err := getUserPlaylistsResponse(accessToken, limit, offset)
		if err != nil {
			return nil, fmt.Errorf("get (all user playlists): %w", err)
		}

		offset += limit

		for _, v := range userPlaylistResponse.Items {
			playlists.Items = append(playlists.Items, v)
		}

		if userPlaylistResponse.Next == "" {
			break
		}
	}

	return &playlists, nil
}

func getUserPlaylistsResponse(accessToken string, limit int, offset int) (*UserPlaylistsResponse, error) {
	fmt.Println("GetUserPlaylists called")

	requestQuery, err := makeUserPlaylistRequestParams(limit, offset)
	if err != nil {
		return nil, fmt.Errorf("building query: %w", err)
	}

	endpoint := "https://api.spotify.com/v1/me/playlists" + "?" + requestQuery

	request, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("building request: %w", err)
	}

	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("sending request: %w", err)
	}

	playlistsResponse, err := parseUserPlaylistsResponse(response)
	if err != nil {
		return nil, fmt.Errorf("parsing response: %w", err)
	}

	return playlistsResponse, nil
}
