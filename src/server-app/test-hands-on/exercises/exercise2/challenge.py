from fastapi import FastAPI
import random


# コンソールから実行は以下のコマンド
# $  python3 -m uvicorn challenge:app --reload
app = FastAPI()

@app.get("/")
async def get_index():
    return {"message": "hello world"}


@app.get("/echo/{data}")
async def get_echo(data: str):
    return {
        "message": "got the message: {0}".format(data)
    }

# 100分の1で当たるガチャ関数
def _exec_gacha():
    return random.randrange(0, 100) == 0

@app.get("/gacha")
async def get_gacha():
    message = "you lose"
    if _exec_gacha():
        message = "you win"
    return {
        "message": message
    }
