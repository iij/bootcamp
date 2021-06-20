package main

import (
	"fmt"
	"./shop"
	"./http"
)

func main() {
	myshop := NewGyudon()
	http.HandleFunc("/", myshop.Eat)
	http.ListenAndServe("localhost:8080", nil)
}
