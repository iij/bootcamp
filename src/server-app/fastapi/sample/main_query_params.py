from fastapi import FastAPI

app = FastAPI()
fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/")
def read_root():
    """動作確認用アプリの作成、起動"""
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id):
    """パスパラメータ"""
    return {"item_id": item_id}


@app.get("/items/")
def read_query_item(skip: int = 0, limit: int = 10):
    """クエリパラメータ"""
    return fake_items_db[skip : skip + limit]
