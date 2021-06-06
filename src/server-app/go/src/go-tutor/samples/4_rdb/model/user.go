package model

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var db, _ = sql.Open("sqlite3", "db/chat.db")

type User struct {
	ID   uint64
	Name string
}

func FindUserByID(id uint64) (*User, error) {
	sql := "SELECT id, name FROM users WHERE id = $1;"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	user := User{}
	if err := stmt.QueryRow(id).Scan(&user.ID, &user.Name); err != nil {
		return nil, err
	}

	return &user, nil
}
