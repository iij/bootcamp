package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
)

type Pokemon struct {
	ID    int
	Name  string
	moves []Move
}

func (p Pokemon) Moves(isDynamax bool) ([]Move, error) {
	if isDynamax {
		dynamaxMoves := []Move{}

		for _, move := range p.moves {
			dynMove, err := move.dynamax()
			if err != nil {
				return nil, err
			}

			dynamaxMoves = append(dynamaxMoves, dynMove)
		}

		return dynamaxMoves, nil
	}

	return p.moves, nil
}

type Move struct {
	Name string
	Type string
}

func (m Move) dynamax() (Move, error) {
	switch m.Type {
	case "くさ":
		return Move{
			Name: "ダイソウゲン",
			Type: m.Type,
		}, nil
	case "ほのお":
		return Move{
			Name: "ダイバーン",
			Type: m.Type,
		}, nil
	case "みず":
		return Move{
			Name: "ダイストリーム",
			Type: m.Type,
		}, nil
	default:
		return Move{}, errors.New("unknown type")
	}
}

var party = []Pokemon{
	{ID: 3, Name: "フシギバナ", moves: []Move{{Name: "つるのむち", Type: "くさ"}}},
	{ID: 6, Name: "リザードン", moves: []Move{{Name: "かえんほうしゃ", Type: "ほのお"}}},
	{ID: 9, Name: "カメックス", moves: []Move{{Name: "みずでっぽう", Type: "みず"}}},
}

func getParty(w http.ResponseWriter, r *http.Request) {
	renderResponse(w, party, http.StatusOK)
}

func getPokemon(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 3 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	renderResponse(w, party[index], http.StatusOK)
}

func getMove(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 4 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	poke := party[index]

	moves, err := poke.Moves(true)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}

	renderResponse(w, moves, http.StatusOK)
}

func router(w http.ResponseWriter, r *http.Request) {
	p := path.Clean(r.URL.Path)

	ok, err := path.Match("/party", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getParty(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getPokemon(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]/move", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getMove(w, r)
		return
	}
}

func main() {
	http.HandleFunc("/", router)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// === 以下は JSON をクライアントに返すための細かい制御をするための関数 ===

func renderError(w http.ResponseWriter, err error, code int) {
	// JSONで返すので"Content-Type"ヘッダに"application/json"を指定します。
	w.Header().Set("Content-Type", "application/json")
	// 引数で指定されたレスポンスコードを登録します。
	w.WriteHeader(code)

	ret := struct {
		// `json:"error"`というのは構造体型のアノテーションと呼ばれるもので、特定の関数に構造体の情報を伝えるために使います。
		// この場合はJSONに変換されるとき`error`というフィールド名にすることを指示しています。
		Error string `json:"error"`
	}{
		Error: err.Error(),
	}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Println("render error", err)
	}
	/*
	   enc := json.NewEncoder(w)
	   err := enc.Encode(ret)
	   if err != nil {
	     log.Println("render error", err)
	   }
	   と同等
	*/
}

// interface{}型というのは、メソッドが一つも定義されていないインターフェイスを意味します。
// つまり任意の型はinterface{}型を満たします。
// Goではインタフェースは明示的に書かずともインタフェース型で定義されたメソッドを全て定義した型は、
// そのインタフェースを満たしている、と判断されます。
// このような値を引数にとることで、静的型付言語でありながら、任意の型を引数に取る関数を簡単に作ることができます。
func renderResponse(w http.ResponseWriter, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Println("render error", err)
	}
}
