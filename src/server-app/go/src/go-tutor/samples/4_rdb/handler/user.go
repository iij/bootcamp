package handler

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"test/model"
)

func UserRead(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.NotFound(w, r)
		return
	}

	userIDStr := strings.SplitN(r.URL.Path, "/", 3)[2]
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		log.Println(err)
		renderError(w, err, http.StatusBadRequest)
		return
	}

	user, err := model.FindUserByID(userID)
	if err != nil {
		log.Println(err)
		renderError(w, err, http.StatusInternalServerError)
		return
	}

	renderResponse(w, user, http.StatusOK)
}
