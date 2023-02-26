package routing

import (
	"encoding/json"
	"fmt"
	"neecholaus/spa/spotify"
	"net/http"
)

func userProfile(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		fmt.Println("no cookie")
		w.WriteHeader(400)
		return
	}

	accessToken := getToken(cookie.Value)
	if accessToken == "" {
		fmt.Println("no session")
		w.WriteHeader(400)
		return
	}

	userProfile, err := spotify.GetUserProfile(accessToken)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	marshalledUserProfile, err := json.Marshal(userProfile)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}

	_, _ = w.Write(marshalledUserProfile)
}
