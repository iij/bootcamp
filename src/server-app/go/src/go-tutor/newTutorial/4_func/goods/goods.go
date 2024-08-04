package main

import "fmt"

// Eat関数の定義から書く
// func Echo

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
