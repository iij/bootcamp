package main

import (
	"errors"
	"fmt"
)

func Echo(name string) (bool, error) {
	if name == "" {
		return false, errors.New("name is empty.")
	}
	fmt.Println(name)
	return true, nil
}

func main() {
	var name1 string = "My Server"
	if _, err := Eat(name1); err != nil {
		fmt.Println("cannt echo: ", err)
	}

	var name2 string = ""
	if _, err := Eat(name2); err != nil {
		fmt.Println("cannt echo: ", err)
	}
}
