package routing

import (
	"fmt"
	"net/http"
)

func requireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionCookie, err := r.Cookie("session")
		if err != nil {
			http.Redirect(w, r, "/", 302)
			fmt.Println("requireSession - denied request without cookie")
			return
		}

		token := getToken(sessionCookie.Value)
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
