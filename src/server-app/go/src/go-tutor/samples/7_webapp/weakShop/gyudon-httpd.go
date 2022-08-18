package main

import (
	"./http"
	"./shop"
)

func main() {
	myshop := shop.NewGyudon()
	http.HandleFunc("/", myshop.Eat)
	err := http.ListenAndServe("localhost:8080", nil)
	if err != nil {
		panic(err)
	}
}
