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

# 以下に、テスト駆動開発を使用して、加減乗除を行うAPIのエンドポイントを
# 作成していこう
