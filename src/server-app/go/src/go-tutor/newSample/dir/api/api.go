package api

import (
	"../store"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func NewApiHandler() http.Handler {
	h := http.NewServeMux()
	h.HandleFunc("GET /api/goods", getAllGoods)
	h.HandleFunc(timeHandlerFunc("POST /api/goods", createGoods))
	h.HandleFunc("GET /api/goods/{id}", getGoods)
	h.HandleFunc("PUT /api/goods/{id}", updateGoods)
	h.HandleFunc("DELETE /api/goods/{id}", deleteGoods)

	return h
}

func getAllGoods(w http.ResponseWriter, r *http.Request) {
	gs := store.GetAllGoods()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	b, err := json.Marshal(gs)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

type createGoodsResponse struct {
	Id      string      `json:"id"`
	Content store.Goods `json:"content"`
}

func createGoods(w http.ResponseWriter, r *http.Request) {
	var g store.Goods
	if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	id, ng := store.AddGoods(g)

	res := createGoodsResponse{
		Id:      id,
		Content: ng,
	}

	b, err := json.Marshal(res)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(b)
}

func getGoods(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	g, ok := store.GetGoods(id)
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	b, err := json.Marshal(g)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

func updateGoods(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var g store.Goods
	if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	g, ok := store.UpdateGoods(id, g)
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	b, err := json.Marshal(g)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(b)
}

func deleteGoods(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	store.DeleteGoods(id)

	w.WriteHeader(http.StatusNoContent)
}

func timeHandlerFunc(p string, handlerFunc http.HandlerFunc) (string, http.HandlerFunc) {
	return p, func(w http.ResponseWriter, r *http.Request) {
		t := time.Now()
		handlerFunc(w, r)
		dt := time.Now().Sub(t)
		fmt.Printf("%s\t: time: %s \n", p, dt)
	}
}
