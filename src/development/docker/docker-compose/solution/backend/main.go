package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

var session *mgo.Session

type Note struct {
	ID    bson.ObjectId `bson:"_id"`
	Title string        `bson:"title"`
	Body  string        `bson:"body"`
}

func GetNote(w http.ResponseWriter, r *http.Request) {

	n := []Note{}
	db := session.DB("my_note")
	query := db.C("note").Find(bson.M{})
	err := query.All(&n)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "%+v\n", n)

}

func AddNote(w http.ResponseWriter, r *http.Request) {

	title := r.FormValue("title")
	body := r.FormValue("body")
	db := session.DB("my_note")
	note := &Note{
		ID:    bson.NewObjectId(),
		Title: title,
		Body:  body,
	}
	col := db.C("note")
	err := col.Insert(note)
	if err != nil {
		panic(err)
	}
	fmt.Fprintln(w, "Successfully added")

}

func main() {
	defer func() {
		if r := recover(); r != nil {
			switch x := r.(type) {
			case error:
				log.Printf("Error: %#v\n", x)
			default:
				err := errors.New("Unknown panic")
				log.Printf("Error: %#v\n", err)
			}
		}
	}()

	session, _ = mgo.Dial("mongodb://iijbootcamp-database")
	defer session.Close()

	http.HandleFunc("/add", AddNote)
	http.HandleFunc("/get", GetNote)
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		panic(err)
	}
}
