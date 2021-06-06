package main

import (
	"log"
	"net/http"
	"os"
	"test/handler"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/user/", handler.UserRead)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
