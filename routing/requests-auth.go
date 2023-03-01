package routing

import (
	"fmt"
	"html/template"
	"neecholaus/spa/spotify"
	"net/http"
	"net/url"
	"os"
)

func landing(w http.ResponseWriter, r *http.Request) {
	parsed, err := template.ParseFiles(
		"resources/html/layout.html",
		"resources/html/nav.html",
		"resources/html/landing.html",
	)
	if err != nil {
		fmt.Printf("error while parsing authed-landing.html: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}

	_ = parsed.Execute(w, r)
}

func redirectToOauth(w http.ResponseWriter, r *http.Request) {
	scopes := "user-read-email user-read-private playlist-read-private playlist-read-collaborative user-library-read"

	redirectUrl := "https://accounts.spotify.com/authorize"
	redirectUrl = redirectUrl + fmt.Sprintf("?client_id=%s", os.Getenv("SPOTIFY_CLIENT_ID"))
	redirectUrl = redirectUrl + fmt.Sprintf("&response_type=%s", "code")
	redirectUrl = redirectUrl + fmt.Sprintf("&scope=%s", url.QueryEscape(scopes))
	redirectUrl = redirectUrl + fmt.Sprintf("&redirect_uri=%s", "http://localhost/ingest-auth")

	http.Redirect(w, r, redirectUrl, 302)
}

func ingestOAuth(w http.ResponseWriter, r *http.Request) {
	query, err := makeSpotifyOauthScheme(r)
	if err != nil {
		fmt.Printf("error while parsing query: %s\n", err.Error())
		http.Redirect(w, r, "/error", 302)
		return
	}

	access, err := spotify.GetAccessTokenResponse(query.Code)
	if err != nil {
		fmt.Printf("get (access token): %s\n", err.Error())
		http.Redirect(w, r, "/error", 302)
		return
	}

	// todo - need dynamic session
	session := "test"
	setToken(session, access.AccessToken)

	http.SetCookie(w, &http.Cookie{
		Name:  "session",
		Value: session,
	})

	http.Redirect(w, r, "/authed", 302)
}

func errorLanding(w http.ResponseWriter, r *http.Request) {
	parsed, err := template.ParseFiles(
		"resources/html/layout.html",
		"resources/html/nav.html",
		"resources/html/error-landing.html",
	)
	if err != nil {
		fmt.Printf("error while parsing error-landing.html: %s", err)
		w.WriteHeader(500)
		return
	}

	_ = parsed.Execute(w, nil)
}

func authedLanding(w http.ResponseWriter, r *http.Request) {
	// todo - make into middleware
	// Ensure session cookie was provided
	_, err := r.Cookie("session")
	if err != nil {
		http.Redirect(w, r, "/", 302)
		return
	}

	parsed, err := template.ParseFiles(
		"resources/html/layout.html",
		"resources/html/nav.html",
		"resources/html/authed-landing.html",
	)
	if err != nil {
		fmt.Printf("error while parsing authed-landing.html: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}

	err = parsed.Execute(w, nil)
	if err != nil {
		fmt.Printf("error while executing parsed authed-landing.html: %s\n", err.Error())
		w.WriteHeader(500)
		return
	}
}

func logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		MaxAge: -1,
	})

	http.Redirect(w, r, "/", 302)
}
