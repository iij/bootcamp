package main

import (
	"os"
	"fmt"
//	"time"
	http "./http"
)

func die(s string, msg ...interface{}) {
	fmt.Fprintf(os.Stdout, s, msg...)
	os.Exit(1)
}

func httphandler(w http.ResponseWriter, r *http.Request) {
//	time.Sleep(10 * time.Second)
	fmt.Fprintf(w, "Hello, %q", r.URL.Path)
}

func zakohttpd() error {
	http.HandleFunc("/", httphandler)
	http.ListenAndServe("localhost:8080", nil)
	return nil
}

func main() {
	if err := zakohttpd(); err != nil {
		die("%s\n", err)
	}
}
