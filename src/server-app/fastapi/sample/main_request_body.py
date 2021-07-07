from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


app = FastAPI()
fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/")
def read_root():
    """3.2 動作確認用アプリの作成、起動"""
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id):
    """4.1 パスパラメータ"""
    return {"item_id": item_id}


@app.get("/items/")
def read_query_item(skip: int = 0, limit: int = 10):
    """4.2 クエリパラメータ"""
    return fake_items_db[skip : skip + limit]


@app.post("/items/")
def create_item(item: Item):
    """4.3 リクエストボディ"""
    return item
