package routing

import (
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
