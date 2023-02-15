package routing

import (
	"github.com/gorilla/mux"
	"net/http"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/authenticate", toOAuth)
}

func toOAuth(w http.ResponseWriter, r *http.Request) {
	// todo - build permission auth string for spotify
	redirectString := ""
	http.Redirect(w, r, redirectString, 302)
}
