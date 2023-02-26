package spotify

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

// Api wants the values as url params
func makeAccessTokenRequestParams(oauthCode string) *url.Values {
	params := url.Values{}

	params.Set("grant_type", "authorization_code")
	params.Set("code", oauthCode)
	params.Set("redirect_uri", os.Getenv("REDIRECT_URI"))

	return &params
}

func parseAccessTokenResponse(r *http.Response) (*AccessToken, error) {
	body, _ := io.ReadAll(r.Body)

	// Check for error response body
	if r.StatusCode != 200 {
		var response struct {
			Error             string `json:"error"`
			ErrorDescriptions string `json:"error_description"`
		}
		err := json.Unmarshal(body, &response)
		if err != nil {
			return nil, fmt.Errorf("unmarshaling error response: %w", err)
		}
		return nil, errors.New(fmt.Sprintf("response had error (%s): %s", r.Status, response))
	}

	var tokenRes AccessToken
	err := json.Unmarshal(body, &tokenRes)
	if err != nil {
		return nil, fmt.Errorf("unmarshalling (access token): %w", err)
	}

	return &tokenRes, nil
}

func parseUserProfileResponse(r *http.Response) (*UserProfile, error) {
	fmt.Println("parseUserProfileResponse called")

	fmt.Println(r.StatusCode)

	var userProfile UserProfile

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, fmt.Errorf("reading body (user profile): %w", err)
	}

	// Check for error response body
	if r.StatusCode != 200 {
		errorResponse, err := parseApiErrorResponse(body)
		if errorResponse != nil {
			err = errors.New(errorResponse.Error.Messages)
		}
		return nil, err
	}

	err = json.Unmarshal(body, &userProfile)
	if err != nil {
		return nil, fmt.Errorf("unmarshalling (user profile): %w", err)
	}

	return &userProfile, nil
}

func parseApiErrorResponse(body []byte) (*apiErrorResponse, error) {
	var response apiErrorResponse
	err := json.Unmarshal(body, &response)
	if err != nil {
		return nil, fmt.Errorf("unmarshaling error response: %w", err)
	}

	return &response, nil
}
