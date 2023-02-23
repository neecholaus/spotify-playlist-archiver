package spotify

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// Api wants the values as url params
func makeAccessTokenRequestParams(oauthCode string) *url.Values {
	params := url.Values{}

	params.Set("grant_type", "authorization_code")
	params.Set("code", oauthCode)
	params.Set("redirect_uri", "localhost/ingest-auth")

	return &params
}

func parseAccessTokenResponse(r *http.Response) (*AccessTokenResponse, error) {
	body, _ := io.ReadAll(r.Body)

	if r.Status != "200" {
		var errorResponse struct {
			Error string `json:"error"`
		}
		_ = json.Unmarshal(body, &errorResponse)
		return nil, errors.New(fmt.Sprintf("response had error: %s", errorResponse.Error))
	}

	var tokenRes AccessTokenResponse
	err := json.Unmarshal(body, &tokenRes)
	if err != nil {
		return nil, fmt.Errorf("unmarshalling (access token): %w", err)
	}

	return &tokenRes, nil
}
