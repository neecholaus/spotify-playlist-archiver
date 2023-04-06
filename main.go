package main

import (
	"fmt"
	"neecholaus/spa/routing"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("could not load .env")
		return
	}

	router := mux.NewRouter()

	routing.Register(router)

	server := http.Server{
		Handler: router,
		Addr:    ":80",
	}

	_ = server.ListenAndServe()
}
