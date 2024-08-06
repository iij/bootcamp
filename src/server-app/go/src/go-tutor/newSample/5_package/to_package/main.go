package main

import (
	"./goods"
	"fmt"
	"os"
)

func main() {
	var name1 string = "My Server"
	if _, err := goods.Echo(name1); err != nil {
		fmt.Fprintln(os.Stdout, "cannt echo: ", err)
	}

	var name2 string = ""
	if _, err := goods.Echo(name2); err != nil {
		fmt.Fprintln(os.Stdout, "cannt echo: ", err)
	}
}
