from fastapi import FastAPI

################################################################
# 今回の講義ではプログラムの視認性を上げるため、セッションを使用せずに
# サーバの値を保持していますが、実際のプロダクトでこのようにユーザーを
# 識別せずに値を保持すると、セキュリティ・インシデントになるので
# 気をつけてください
################################################################
current_number = 0

def get_current_number():
    return current_number

def set_current_number(number: int):
    global current_number
    current_number = int(number)

################################################################

# コンソールから実行は以下のコマンド
# $  python3 -m uvicorn challenge:app --reload
app = FastAPI()

@app.get("/")
async def get_index():
    return {"current_number": get_current_number()}

@app.get("/add/{number}")
async def get_add(number: int):
    set_current_number(
        get_current_number() + number
    )
    return {"current_number": get_current_number()}

@app.get("/sub/{number}")
async def get_sub(number: int):
    set_current_number(
        get_current_number() - number
    )
    return {"current_number": get_current_number()}

@app.get("/mul/{number}")
async def get_mul(number: int):
    set_current_number(
        get_current_number() * number
    )
    return {"current_number": get_current_number()}

@app.get("/div/{number}")
async def get_div(number: int):
    set_current_number(
        get_current_number() / number
    )
    return {"current_number": get_current_number()}
