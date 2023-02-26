package routing

import (
	"github.com/gorilla/mux"
	"net/http"
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
	authRouter.HandleFunc("/logout", logout)
}
