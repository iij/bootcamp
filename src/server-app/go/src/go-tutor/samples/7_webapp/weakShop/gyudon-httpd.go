package main

import (
	"./shop"
	"./http"
)

func main() {
	myshop := shop.NewGyudon()
	http.HandleFunc("/", myshop.Eat)
	http.ListenAndServe("localhost:8080", nil)
}
