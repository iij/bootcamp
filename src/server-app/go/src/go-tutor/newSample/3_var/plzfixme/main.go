package main

import "fmt"

func main() {
	var WatashiNoHensu string = "GYUDON" //./main.go:6:2: undefined: WatashiNoHensu
	fmt.Println(WatashiNoHensu)          //./main.go:7:14: undefined: WatashiNoHensu
}
