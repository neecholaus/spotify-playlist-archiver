package routing

import (
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"net/url"
	"os"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/auth", redirectToOauth)
	router.HandleFunc("/ingest-auth", ingestOAuth)
}

func redirectToOauth(w http.ResponseWriter, r *http.Request) {
	scopes := "user-read-email user-read-private playlist-read-private playlist-read-collaborative user-library-read"

	redirectUrl := "https://accounts.spotify.com/authorize"
	redirectUrl = redirectUrl + fmt.Sprintf("?client_id=%s", os.Getenv("SPOTIFY_CLIENT_ID"))
	redirectUrl = redirectUrl + fmt.Sprintf("&response_type=%s", "code")
	redirectUrl = redirectUrl + fmt.Sprintf("&scope=%s", url.QueryEscape(scopes))
	redirectUrl = redirectUrl + fmt.Sprintf("&redirect_uri=%s", "http://localhost/from-auth")

	http.Redirect(w, r, redirectUrl, 302)
}

func ingestOAuth(w http.ResponseWriter, r *http.Request) {
	query, err := parseFromAuthRequestQuery(r)
	if err != nil {
		fmt.Printf("error while parsing query: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}

	fmt.Println(query.Code)

	parsed, err := template.ParseFiles(
		"resources/html/layout.html",
		"resources/html/from-auth.html",
	)
	if err != nil {
		fmt.Printf("error while parsing from-auth.html: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}

	err = parsed.Execute(w, nil)
	if err != nil {
		fmt.Printf("error while executing parsed from-auth.html: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}
}
