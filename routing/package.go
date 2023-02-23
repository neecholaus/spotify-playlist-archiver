package routing

import (
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/auth", redirectToOauth)
	router.HandleFunc("/ingest-auth", ingestOAuth)
}
