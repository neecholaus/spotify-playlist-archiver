package main

import (
	"github.com/gorilla/mux"
	"neecholaus/spa/routing"
	"net/http"
)

func main() {
	router := mux.NewRouter()

	routing.RegisterRoutes(router)

	server := http.Server{
		Handler: router,
		Addr:    ":8080",
	}

	_ = server.ListenAndServe()
}
