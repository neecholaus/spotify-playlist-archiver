package routing

import (
	"encoding/json"
	"fmt"
	"neecholaus/spa/spotify"
	"net/http"
)

func userProfile(w http.ResponseWriter, r *http.Request) {
	// Get cookie
	cookie, err := r.Cookie("session")
	if err != nil {
		fmt.Println("no cookie")
		w.WriteHeader(400)
		return
	}

	// Get token from session cookie
	accessToken := getToken(cookie.Value)
	if accessToken == "" {
		fmt.Println("no session")
		w.WriteHeader(400)
		return
	}

	// Request profile from api
	userProfile, err := spotify.GetUserProfile(accessToken)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	// Encode profile data
	encoded, err := json.Marshal(userProfile)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	_, _ = w.Write(encoded)
}
