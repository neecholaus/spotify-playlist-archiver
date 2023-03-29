package routing

import (
	"crypto/rand"
	"math/big"
	"net/http"

	"github.com/gorilla/mux"
)

func Register(router *mux.Router) {
	tokenStore.Tokens = map[string]string{}

	registerPublicDir(router)
	registerRoutes(router)
}

func registerPublicDir(router *mux.Router) {
	fs := http.FileServer(http.Dir("resources/public"))
	router.PathPrefix("/public/").Handler(http.StripPrefix("/public/", fs))
}

func registerRoutes(router *mux.Router) {
	router.HandleFunc("/", landing)
	router.HandleFunc("/auth", redirectToOauth)
	router.HandleFunc("/ingest-auth", ingestOAuth)
	router.HandleFunc("/error", errorLanding)

	authRouter := router.PathPrefix("/").Subrouter()
	authRouter.Use(requireSession)
	authRouter.HandleFunc("/authed", authedLanding)
	authRouter.HandleFunc("/user-profile", userProfile)
	authRouter.HandleFunc("/playlists", userPlaylistsHandler)
	authRouter.HandleFunc("/playlist/tracks", playlistTracksHandler)
	authRouter.HandleFunc("/logout", logout)
}

func createRandomSessionString(desiredLength int) string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	charsetLength := big.NewInt(int64(len(charset)))
	var text string
	for i := 0; i < desiredLength; i++ {
		randIndex, err := rand.Int(rand.Reader, charsetLength)
		if err != nil {
			panic("could not generate random Int")
		}
		text += string(charset[randIndex.Int64()])
	}

	return text
}
