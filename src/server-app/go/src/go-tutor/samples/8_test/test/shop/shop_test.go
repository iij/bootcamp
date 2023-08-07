package shop

import (
	"../http"
	"bytes"
	"testing"
)

func TestGyudon_EatSimple(t *testing.T) {
	w := bytes.Buffer{}
	r := http.Request{}

	gd := NewGyudon()
	//gd.menu="<入れたい文字列>"
	want := "'NegitamaGyudon'\n"
	gd.Eat(&w, &r)
	// 関数の結果を格納
	got := w.String()

	if want != got {
		t.Errorf("want = %s, got = %s\n", want, got)
	}
}

func TestGyudon_Eat(t *testing.T) {
	tests := []struct {
		name   string
		change bool
		arg    string
		want   string
	}{
		{
			name:   "default",
			change: false,
			want:   "'NegitamaGyudon'\n",
		},
		{
			name:   "change",
			change: true,
			arg:    "TokumoriGyudon",
			want:   "'TokumoriGyudon'\n",
		},
		{
			name:   "no data",
			change: true,
			arg:    "",
			want:   "",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			w := bytes.Buffer{}
			r := http.Request{}

			gd := NewGyudon()
			if test.change {
				gd.menu = test.arg
			}
			gd.Eat(&w, &r)

			if test.want != w.String() {
				t.Errorf("want = %s, got = %s\n", test.want, w.String())
			}

			return
		})
	}
}
