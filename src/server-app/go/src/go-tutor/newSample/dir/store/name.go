package store

import (
	"strconv"
	"sync"
	"sync/atomic"
)

var latestGoodsId goodsId
var store goodsStore

func init() {
	latestGoodsId = goodsId{id: atomic.Int64{}}
	store = goodsStore{goods: map[string]Goods{}}
}

type goodsId struct {
	id atomic.Int64
}

func (g *goodsId) NewGoodsId() string {
	v := g.id.Add(1)

	return strconv.FormatInt(v, 10)
}

func (g *goodsId) GetGoodsId() string {
	v := g.id.Load()

	return strconv.FormatInt(v, 10)
}

type goodsStore struct {
	m     sync.RWMutex
	goods map[string]Goods
}

func (s *goodsStore) GetGoods(id string) (Goods, bool) {
	s.m.RLock()
	defer s.m.RUnlock()

	g, ok := s.goods[id]

	return g, ok
}

func (s *goodsStore) AddGoods(g Goods) (string, Goods) {
	s.m.Lock()
	defer s.m.Unlock()

	id := latestGoodsId.NewGoodsId()
	s.goods[id] = g

	return id, g
}
func (s *goodsStore) UpdateGoods(id string, g Goods) (Goods, bool) {
	s.m.Lock()
	defer s.m.Unlock()

	if _, ok := s.goods[id]; !ok {
		return g, false
	}

	s.goods[id] = g

	return g, true
}

func (s *goodsStore) GetAllGoods() map[string]Goods {
	s.m.RLock()
	defer s.m.RUnlock()

	return s.goods
}

func (s *goodsStore) DeleteGoods(id string) {
	s.m.Lock()
	defer s.m.Unlock()

	delete(s.goods, id)
}

type Goods struct {
	Name  string
	Count int
}

func GetAllGoods() map[string]Goods {
	return store.GetAllGoods()
}

func GetGoods(id string) (Goods, bool) {
	return store.GetGoods(id)
}

func AddGoods(g Goods) (string, Goods) {
	return store.AddGoods(g)
}

func UpdateGoods(id string, g Goods) (Goods, bool) {
	return store.UpdateGoods(id, g)
}

func DeleteGoods(id string) {
	store.DeleteGoods(id)
}
