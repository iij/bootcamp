package main

import (
	"os"
	"fmt"
	"./shop"
)

func main() {
	myshop := shop.NewGyudon()
	if _, err := myshop.Eat(); err != nil {
		fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err)
	}
}
