from fastapi import FastAPI

############################################################################
# 今回の講義ではプログラムの視認性を上げるため、セッションを使用せず値を保持しています。
# 実際のプロダクトコードでこのようにするとセキュリティ事故になり得るので気をつけてください。
# (任意のユーザが読み書きできる値をサーバが保持しており、情報漏洩に繋がる可能性があるため)
############################################################################

current_number = 0
app = FastAPI()


def get_current_number():
    return current_number


def set_current_number(number: int):
    global current_number
    current_number = int(number)


@app.get("/")
def get_index():
    return {"current_number": get_current_number()}


@app.get("/add/{number}")
def get_add(number: int):
    set_current_number(
        get_current_number() + number
    )
    return {"current_number": get_current_number()}


@app.get("/sub/{number}")
def get_sub(number: int):
    set_current_number(
        get_current_number() - number
    )
    return {"current_number": get_current_number()}


@app.get("/mul/{number}")
def get_mul(number: int):
    set_current_number(
        get_current_number() * number
    )
    return {"current_number": get_current_number()}


@app.get("/div/{number}")
def get_div(number: int):
    set_current_number(
        get_current_number() / number
    )
    return {"current_number": get_current_number()}
