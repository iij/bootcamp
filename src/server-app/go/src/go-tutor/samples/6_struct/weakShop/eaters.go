package main

import (
	"fmt"
	"./shop"
)

func main() {
	myshop := NewGyudon()
	if _, err := myshop.Eat(); err != nil {
		fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err)
	}
}
