package main

import (
	"./goods"
	"fmt"
	"os"
)

func main() {
	myGoods := goods.NewGoods()
	if _, err := myshop.Echo(); err != nil {
		fmt.Fprintf(os.Stderr, "cannot echo: '%s'\n", err)
	}
}
