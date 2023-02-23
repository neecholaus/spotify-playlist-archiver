package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"neecholaus/spa/routing"
	"net/http"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("could not load .env")
		return
	}

	router := mux.NewRouter()

	routing.RegisterPublicDir(router)
	routing.RegisterRoutes(router)

	server := http.Server{
		Handler: router,
		Addr:    ":80",
	}

	_ = server.ListenAndServe()
}
