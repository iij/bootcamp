package main

import (
	"fmt"
	"os"
)

func Echo(name string) (bool, error) {
	if name == "" {
		return false, fmt.Errorf("name is empty.")
	}
	fmt.Println(name)
	return true, nil
}

func main() {
	var name1 string = "My Server"
	if _, err := Echo(name1); err != nil {
		fmt.Fprintln(os.Stdout, "cannt echo: ", err)
	}

	var name2 string = ""
	if _, err := Echo(name2); err != nil {
		fmt.Fprintln(os.Stdout, "cannt echo: ", err)
	}
}
