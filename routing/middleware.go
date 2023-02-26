package routing

import (
	"fmt"
	"net/http"
)

// requireSession redirects any requests that do not have valid session cookie
// to the main landing page.
func requireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check for session cookie
		cookie, err := r.Cookie("session")
		if err != nil {
			http.Redirect(w, r, "/", 302)
			fmt.Println("requireSession - denied request without cookie")
			return
		}

		sessionName := cookie.Value

		// Check that session is tied to token
		token := getToken(sessionName)
		if token == "" {
			removeCookie := &http.Cookie{
				Name:   "session",
				MaxAge: -1,
			}
			http.SetCookie(w, removeCookie)
			http.Redirect(w, r, "/", 302)
			fmt.Println("requireSession - denied request without matching token")
			return
		}

		next.ServeHTTP(w, r)
	})
}
