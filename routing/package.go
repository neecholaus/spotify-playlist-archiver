package routing

import (
	"github.com/gorilla/mux"
	"net/http"
)

func RegisterPublicDir(router *mux.Router) {
	fs := http.FileServer(http.Dir("resources/public"))
	router.PathPrefix("/public/").Handler(http.StripPrefix("/public/", fs))
}

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/auth", redirectToOauth)
	router.HandleFunc("/ingest-auth", ingestOAuth)
}
