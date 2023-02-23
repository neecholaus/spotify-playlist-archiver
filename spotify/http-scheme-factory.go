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

func parseAccessTokenResponse(r *http.Response) (*AccessTokenResponse, error) {
	body, _ := io.ReadAll(r.Body)

	if r.StatusCode != 200 {
		var errorResponse struct {
			Error            string `json:"error"`
			ErrorDescription string `json:"error_description"`
		}
		err := json.Unmarshal(body, &errorResponse)
		if err != nil {
			return nil, fmt.Errorf("unmarshaling error response: %w", err)
		}
		return nil, errors.New(fmt.Sprintf("response had error (%s): %s", r.Status, errorResponse))
	}

	var tokenRes AccessTokenResponse
	err := json.Unmarshal(body, &tokenRes)
	if err != nil {
		return nil, fmt.Errorf("unmarshalling (access token): %w", err)
	}

	return &tokenRes, nil
}
