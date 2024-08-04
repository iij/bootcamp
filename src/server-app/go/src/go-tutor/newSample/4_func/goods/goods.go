package main

import "fmt"

func Echo(name string) bool {
	if name == "" {
		return false
	}
	fmt.Println(name)
	return true
}

func main() {
	var name1 string = "My Server"
	if ok := Echo(name1); !ok {
		fmt.Println("cannt echo: ", name1)
	}

	var name2 string = ""
	if ok := Echo(name2); !ok {
		fmt.Println("cannt echo: ", name2)
	}
}
