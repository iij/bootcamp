package main

import "fmt"

func Eat(name string) (bool, error) {
	if name == "" {
		return false, fmt.Errorf("name is empty.")
	}
	fmt.Println(name)
	return true, nil
}

func main() {
	var name1 string = "GYUDON"
	if _, err := Eat(name1); err != nil {
		fmt.Println("cannt eat: ", err)
	}

	var name2 string = ""
	if _, err := Eat(name2); err != nil {
		fmt.Println("cannt eat: ", err)
	}
}
