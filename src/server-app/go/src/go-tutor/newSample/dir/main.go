package main

import (
	"./api"
	"net/http"
)

func main() {
	handler := authHandler(api.NewApiHandler())

	if err := http.ListenAndServe(":8080", handler); err != nil {
		panic(err)
	}

}

func authHandler(handler http.Handler) http.Handler {
	{
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, pass, ok := r.BasicAuth()
			if !ok {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			switch {
			case user == "user" && pass == "pass":
			case user == "barry" && pass == "kun":
			default:
				w.WriteHeader(http.StatusUnauthorized)
			}

			handler.ServeHTTP(w, r)
		})
	}

}
