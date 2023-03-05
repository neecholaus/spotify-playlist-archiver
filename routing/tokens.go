package routing

import (
	"errors"
	"net/http"
	"sync"
)

var tokenStore struct {
	mu     sync.Mutex
	Tokens map[string]string
}

func setToken(session string, token string) {
	tokenStore.mu.Lock()
	defer tokenStore.mu.Unlock()

	tokenStore.Tokens[session] = token
}

func getToken(session string) string {
	tokenStore.mu.Lock()
	defer tokenStore.mu.Unlock()
	token, ok := tokenStore.Tokens[session]
	if ok != true {
		return ""
	}
	return token
}

func getTokenForRequest(r *http.Request) (string, error) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return "", errors.New("no session cookie")
	}

	accessToken := getToken(cookie.Value)
	if accessToken == "" {
		return "", errors.New("no token for cookie")
	}

	return accessToken, nil
}
