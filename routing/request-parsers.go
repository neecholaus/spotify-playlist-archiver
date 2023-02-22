package routing

import (
	"errors"
	"net/http"
)

func parseFromAuthRequestQuery(r *http.Request) (*fromAuthRequestParams, error) {
	params := r.URL.Query()

	// Ensure `code` value was provided
	exists := params.Has("code")
	if !exists {
		return nil, errors.New("NO_CODE")
	}

	return &fromAuthRequestParams{
		Code: params.Get("code"),
	}, nil
}
