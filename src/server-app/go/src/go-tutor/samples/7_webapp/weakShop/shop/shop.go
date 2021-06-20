ackage shop

import (
	"fmt"
	"time"
	"./http"
)

type Gyudon struct {
	menu string
}

func NewGyudon() Gydon {
	return Gyudon{
		menu: "NegitamaGyudon",
	}
}

func (self *Gyudon) Eat(w http.ResponseWriter, r *http.Request) { //引数をhttpdのセッション状態を受け取れるように追加
	if self.menu == "" {
		return false, fmt.Errorf("name is empty.")
	}

	time.Sleep(time.Second * 10) //擬似食べてる時間
	fmt.Fprintf(w, "'%s'\n", self.name) //食べた事を報告
	return true, nil
}
