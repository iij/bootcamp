package shop

import (
	"fmt"
	"time"
)

type Gyudon struct {
	menu string
}

func NewGyudon() Gydon { //変数定義用の関数
	return Gyudon{
		menu: "NegitamaGyudon",
	}
}

func (self *Gyudon) Eat() (bool, error) {
	if self.menu == "" {
		return false, fmt.Errorf("name is empty.")
	}

	time.Sleep(time.Second * 10) //擬似食べてる時間
	fmt.Println(name)
	return true, nil
}
