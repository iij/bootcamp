package main

import "fmt"

// Eat関数の定義から書く
// func Eat

func main() {
	var name1 string = "GYUDON"
	if ok := Eat(name1); !ok {
		fmt.Println("cannt eat: ", name1)
	}

	var name2 string = ""
	if ok := Eat(name2); !ok {
		fmt.Println("cannt eat: ", name2)
	}
}
