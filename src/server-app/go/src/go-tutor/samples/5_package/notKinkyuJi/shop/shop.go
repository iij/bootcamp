package shop

import (
	"fmt"
)

func Eat(name string) (bool, error) {
	if name == "" {
		return false, fmt.Errorf("name is empty.")
	}
	fmt.Println(name)
	return true, nil
}

