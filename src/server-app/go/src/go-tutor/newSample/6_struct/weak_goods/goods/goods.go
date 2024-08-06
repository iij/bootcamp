package goods

import (
	"fmt"
	"time"
)

type Goods struct {
	name string
}

func NewGoods() Goods { //変数定義用の関数
	return Goods{
		name: "My Server",
	}
}

func (self *Goods) Echo() (bool, error) {
	if self.name == "" {
		return false, fmt.Errorf("name is empty.")
	}

	time.Sleep(time.Second * 10) //擬似探している時間
	fmt.Println(self.name)
	return true, nil
}
