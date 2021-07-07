from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    """3.2 動作確認用アプリの作成、起動"""
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id):
    """4.1 パスパラメータ"""
    return {"item_id": item_id}
