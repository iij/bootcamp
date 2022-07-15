from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import Optional
from time import sleep
from logging_context import LoggingContextRoute


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


app = FastAPI()
app.router.route_class = LoggingContextRoute
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
    """クエリパラメータ"""
    return fake_items_db[skip : skip + limit]


@app.post("/items/")
def create_item(item: Item):
    """リクエストボディ"""
    return item


def print_wait_time(count: int):
    """非同期処理の為の関数"""
    sleep(count)
    print(f"Wait {count} second & print!")


@app.get("/{count}")
async def asgi_task(count: int, background_tasks: BackgroundTasks):
    """非同期処理"""
    background_tasks.add_task(print_wait_time, count)
    return {"status": "See the console log for wait time."}


@app.get("/plaintext/ok", response_class=PlainTextResponse)
def return_plain_text() -> str:
    """PlainText Response"""
    return "OK"


items = {"hoge": "This is Hoge"}


@app.get("/error/{item_id}")
def read_item_with_error_handling(item_id: str):
    """5.4 エラーハンドリング"""
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
