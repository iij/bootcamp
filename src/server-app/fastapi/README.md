---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
---

# FastAPI入門（FastAPIを使ったWebAPIサーバ作り)

## はじめに

この講義ではハンズオン形式でFastAPIについて学びます。
講義を受けるにあたり、事前に環境準備が必要です。

講義当日までにハンズオン事前準備を終え、Dockerが実行可能な環境を整えてください。
また、FastAPIはPython製のWebフレームワークのため、ある程度Pythonを触ったことがある方を想定しています。
従って本項では、Pythonの基本的な文法や書き方などについては扱いません。

また、Web APIについてもハンズオンで扱う限りにおいては解説をしますが、基本的なRDBMS・HTTPに関する知識についても体系だった説明は行いません。予めご了承ください。

## FastAPI概要

公式ドキュメント: <https://fastapi.tiangolo.com/ja/>

```
FastAPI は、Pythonの標準である型ヒントに基づいてPython 3.6 以降でAPI を構築するための、
モダンで、高速(高パフォーマンス)な、Web フレームワークです。
```

FastAPIとは、Python、特に3.5から導入されたtypehintと、ASGIサーバへの対応を強く意識したWebフレームワークです。

Pythonは元来、動的型言語、と言うことで長らく型を意識すること無くコードが書かれていましたが
3.5以降、急速に型を意識するようになっています。
FastAPIはその流れにいち早く対応し、`高速`、`堅牢`を実現するために最小限の構造とtypehintを元に
validationを強く意識した構造になっています。
## 開発環境の作成

すでにPython3.8以上 + IDE 環境を構築済みの方は本項を読み飛ばして構いませんが、
ここではWindowsユーザ向けに環境作りの一例を示しておきます。

### Ubuntu のインストール

[Install Ubuntu on WSL2](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview)、または[WSL のインストール](https://docs.microsoft.com/ja-jp/windows/wsl/install)を参考にWSL2上にUbuntuをインストールします。

2022年6月現在においては**Ubuntu 22.04 LTS**を選択すると良いでしょう。

### VScode - Remote-WSL2 の導入

[Linux 用 Windows サブシステムで Visual Studio Code の使用を開始する](https://docs.microsoft.com/ja-jp/windows/wsl/tutorials/wsl-vscode)を参考にvscode上でUbuntuが操作できるようにします。

### Python3.9 のインストール




## FastAPIのインストール・動作確認

開発環境の準備ができたならば、いよいよFastAPIを使った開発を行います。
まずは、FastAPIをインストールします。

Pythonのパッケージ管理を厳格に行うのであれば**poetry**等を使う事が好ましいのですが、本項とは主旨が外れるため、今回は
[公式ドキュメント](https://fastapi.tiangolo.com/ja/)にそのまま従ってインストールしてみましょう。


### FastAPI/uvicornのインストール


```bash
 pip3 install fastapi
 pip3 install uvicorn[standard]
```
## FastAPIを使ったAPIサーバの開発

### トップページの作成

インストールが完了したら次にFastAPI用のコードを作成します。
公式ドキュメントの通りmain.pyというファイルを作成し、以下のようにコードを書いてみましょう。

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

```

よく分からない方は[sample]([fastapi/sample](https://github.com/iij/bootcamp/tree/master/src/server-app/fastapi/sample))ディレクトリに作成済みのサンプルファイルがあるので参考にしてください。

### API(FastAPI)の起動

`main.py`ファイルが作成できたら起動してみましょう。
起動には先ほどインストールした`uvicorn`(コマンド)に`main:app`を引数として渡して実行します。

```bash
$ uvicorn main:app
```

正常に起動した場合、そのまま以下のように出力され `http://127.0.0.1:8000`と表示されます。
ここまでくれば無事に起動しています。

```
INFO:     Started server process [1990921]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

なお、上記のコマンドではターミナルがそのままフォアグラウンドで動き続けてしまうため、
動作確認は別のターミナルを起動する必要があります。
別ターミナルを起動したら、curlコマンドでアクセスしてみましょう。

```bash
$ curl --noproxy 127.0.0.1 http://127.0.0.1:8000

{"Hello":"World"}
```

main.pyに記載した Hello Worldの出力と同時にFastAPIのコンソールにもアクセスログが出力されます。

```bash
INFO:     127.0.0.1:60100 - "GET / HTTP/1.1" 200 OK
```

ひとまずここまでできればFastAPIの実行環境としては十分になりました。
終了には`Ctrl+c`で止めてください。

### swagger ドキュメントの確認

FastAPIには`swagger-ui`が含まれており、デフォルトの動作としてOpenAPIドキュメントを生成します。
このOpenAPIのドキュメントパスは `/docs`になっており起動と同時にアクセスが可能です。
それでは先ほどのmain.pyを再び起動しアクセスしてみましょう。
環境によってはListenアドレスが`127.0.0.1`のみでは都合が悪いので`--host 0.0.0.0`を追加します。
そうすることにより 0.0.0.0:8000　でListenするようになるため、外部からのアクセスも可能になります

```bash
 uvicorn main:app --host 0.0.0.0 --reload

INFO:     Started server process [1990921]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

起動したら `http://127.0.0.1:8000/docs/`にアクセスしてみましょう。[ここ](https://fastapi.tiangolo.com/ja/tutorial/first-steps/#api)で表示されているようなWeb画面にアクセスできれば正常です。
ここではFastAPIに定義した全てのパスについて入出力情報が記載されるだけで無く、swagger-clientも内包されているため、そのままテストを行うことも可能です。


#### 解説

- main.py
  - `from fastapi import FastAPI`: FastAPIモジュールのロード。Pythonではお馴染み
  - `app = FastAPI()`: appという名前でFastAPIをインスタンス化。後述のuvicornはこれを実行しているインスタンス化の際にいくつかオプションを渡すことができる
  - `@app.get("/")`: flask等でもお馴染みの記法。 `/` に `GET` メソッドが来たときの振る舞いを記載する
- uvicorn main:appの示すもの
  - `main` main.pyファイル (Python "module")。Pythonではディレクトリを`.`で表すため sample/main.pyの場合、 `sample.main` になる
  - `app` main.py内部で作られるobject（app = FastAPI()のように記述される）。
  - `--reload`: コードの変更時にサーバーを再起動させる。開発用。


## FastAPIでWebアプリケーションを作る

それではいよいよ本格的にWebアプリケーションの開発を行っていきます。

FastAPIに限らずWebアプリケーションを作る以上、ただの静的データを返すだけでは意味がありません。
また、固定値しか返さないのであればそれもまた意味が無いので以下の項目をそれぞれ実装してみます。


### パスパラメータ

Webアプリケーションを作る際にパス情報をパラメータとして何らかの処理をしたい場合を考えます。
FastAPIでは、Pythonのformat文字列と同様のシンタックスで`パスパラメータ`や`パス変数`を宣言できます。

先ほどのmain.pyにパスパラメータを扱うメソッドを定義してみましょう。

```python
@app.get("/items/{item_id}")
def read_item(item_id):
    return {"item_id": item_id}
```

追記できたら同様に起動してパスパラメータを与えてアクセスしてみましょう。

#### 解説

- `@app.get("/items/{item_id}")`: URLパスの宣言
  - パスパラメータ item_id の値は、引数 item_id として関数に渡されます。


<details>
<summary> 実行例</summary>

- FastAPI起動・コンソール出力

```bash
uvicorn main:app

INFO:     Started server process [1993570]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:60230 - "GET /items/hoge HTTP/1.1" 200 OK
```

- curl実行、及び結果

```bash
curl --noproxy localhost http://localhost:8000/items/hoge

{"item_id":"hoge"}
```

</details>

参考: https://fastapi.tiangolo.com/ja/tutorial/path-params/

### クエリパラメータ

パスパラメータが実現できたら次はクエリパラメータの操作を作ってみましょう。
FastAPIでは関数の引数を宣言した時にパスパラメータではない関数パラメータを宣言すると、それらは自動的に "クエリ" パラメータとして解釈されます。

それでは先ほどに続きmain.pyにクエリパラメータを扱うメソッドを定義してみましょう。

```python
fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
def read_query_item(skip: int = 0, limit: int = 10):
    """クエリパラメータ"""
    return fake_items_db[skip : skip + limit]
```

追記できたら再び起動してクエリパラメータを与えてアクセスしてみましょう。

#### 解説

- `fake_items_db`: クエリパラメータに応じて返答する数を変えるためのデータリスト
- `def read_query_item(skip: int = 0, limit: int = 10):`: クエリパラメータ向けのメソッド追加
  - クエリ名`skip`, `limit`を宣言。それぞれ int型で定義しているため、 `skip=hoge` みたいな形はエラーになる


<details>
<summary> 実行例</summary>

- FastAPI起動・コンソール出力

```bash
uvicorn main:app

INFO:     Started server process [1993570]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:60488 - "GET /items/?skip=0&limit=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:60514 - "GET /items/?skip=0&limit=2 HTTP/1.1" 200 OK
```

- curl実行、及び結果

```bash
curl --noproxy localhost "http://localhost:8000/items/?skip=0&limit=1"

[{"item_name":"Foo"}]

curl --noproxy localhost "http://localhost:8000/items/?skip=0&limit=2"

[{"item_name":"Foo"},{"item_name":"Bar"}]
```

</details>

参考: https://fastapi.tiangolo.com/ja/tutorial/query-params/

### リクエストボディ

パスパラメータ・クエリパラメータが実現できたら次はリクエストボディを扱ってみましょう。
リクエストボディはクライアントからAPIにデータを送信する時に使います。

それではmain.pyにリクエストボディを扱うメソッドを追加してみましょう。

#### Pydantic によるモデルの定義

FastAPIでは型を宣言することで入出力のvaidation checkを行っていることは冒頭で述べたとおりです。
パスパラメータの項では型宣言を行いませんでしたがのクエリパラメータの項では型を定義しチェックするようにしています。
では、リクエストボディの場合はどうすれば良いのでしょうか？
それに対する解が[pydantic](https://pydantic-docs.helpmanual.io/)です。

従ってまずは期待するリクエストボディの型を定義することから始めます。


```python
from pydantic import BaseModel
from typing import Optional


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None
```

##### 解説

- `from pydantic import BaseModel`: pydantic のモジュールロード。基本的にはBaseModelを使う
- `from typing import Optional`: Python typehintのロード
- `class Item(BaseModel):`: リクエストボディの型を定義するクラス pydanticのBaseModelを継承

#### リクエストボディを処理するメソッドの定義

リクエストボディの型定義が済んだらこの型を用いてPOSTを受け付けるメソッドを定義します。
本来であればPOSTされたデータをどこかに格納し、GETメソッドなどで中身を取り出すのですが
今回はそういったデータストアを用いていないため、リクエストボディで受け付けた内容をそのまま返すものとします。


```python
@app.post("/items/")
def create_item(item: Item):
    """リクエストボディ"""
    return item
```

追記できたら再び起動してリクエストボディを与えてアクセスしてみましょう。

<details>
<summary> 実行例</summary>

- FastAPI起動・コンソール出力

```bash
uvicorn main:app

INFO:     Started server process [1993570]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:60644 - "POST /items/ HTTP/1.1" 200 OK
```

- curl実行、及び結果

```bash
curl --noproxy localhost -X 'POST' \
  'http://localhost:8000/items/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "description": "string",
  "price": 0,
  "tax": 0
}'

{"name":"string","description":"string","price":0.0,"tax":0.0}
```

</details>

参考: https://fastapi.tiangolo.com/ja/tutorial/body/


## 発展学習

さて、ここまででFastAPIを用いて作るWebアプリケーションの基本的な部分は学びました。
しかし、本格的に開発を行うのであれば抑えておきたいポイントがいくつかありますので
それらの一例を記載しておきます。

### Gunicornの利用

これまでFastAPIの起動には`uvicorn`を使ってきましたが
uvicornのサイトにも記載されているとおり、Gunicornを使う方がより好ましいといえます。
事実、uvicornのサイトでもGunicornの利用を推奨しています。
https://www.uvicorn.org/

```
Gunicorn is a mature, fully featured server and process manager.
```

ではGunicornをインストールし、起動方法を変更してみましょう。
NOTE: 必要に応じて `--upgrade`オプションを追加してください

```bash
$ pip3 install fastapi Gunicorn uvicorn[standard]
```

GunicornがインストールできたらGunicornを使って先ほどのアプリケーションを起動してみましょう。
こちらも以下の通り実行するとuvicornで起動した時と同様にフォアグラウンドで動作する為、確認の際は別ターミナルを起動します。
また、終了も同じように`Ctrl+c`で終了してください。

<details>
<summary> 実行例</summary>

- FastAPI起動・コンソール出力

```bash
gunicorn -k uvicorn.workers.UvicornWorker main:app

[2021-07-07 16:22:57 +0900] [1998398] [INFO] Starting gunicorn 20.1.0
[2021-07-07 16:22:57 +0900] [1998398] [INFO] Listening at: http://127.0.0.1:8000 (1998398)
[2021-07-07 16:22:57 +0900] [1998398] [INFO] Using worker: uvicorn.workers.UvicornWorker
[2021-07-07 16:22:57 +0900] [1998400] [INFO] Booting worker with pid: 1998400
[2021-07-07 16:22:57 +0900] [1998400] [INFO] Started server process [1998400]
[2021-07-07 16:22:57 +0900] [1998400] [INFO] Waiting for application startup.
[2021-07-07 16:22:57 +0900] [1998400] [INFO] Application startup complete.
```

- curl実行、及び結果

```bash
curl --noproxy localhost "http://localhost:8000"

{"Hello":"World"}
```

</details>

参考: https://zenn.dev/ainamori/articles/76990129cac97de0e30b

### 非同期処理

起動をGunicornに変更できたら次はASGI対応のWebアプリケーションを作ってみましょう。
実はuvicornでもASGI対応のWebアプリケーション作成は可能なのですが、前述の通りGunicornを使え、と言うのが
公式の推奨という事もあり、まずはGunicornの活用を先に行っています。

また、ASGIとはWSGIと呼ばれるWebサーバとWebアプリケーションを接続するための、
標準化されたインタフェース定義の精神的(*)な後継仕様です。
ASGIとは 非同期サーバゲートウェイインタフェース(Asynchronous Server Gateway Interface)の名の通り
asyncioを介して非同期で動作するよう設計されています。
FastAPIでASGI対応のアプリケーションを作るためにはFastAPIのBackgroundTaskを使います。


```python
from fastapi import BackgroundTasks, FastAPI
from time import sleep

def print_wait_time(count: int):
    sleep(count)
    print(f"Wait {count} second & print!")


@app.get("/{count}")
async def asgi_task(count: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(print_wait_time, count)
    return {"status": "See the console log for wait time."}
```

参考: https://fastapi.tiangolo.com/ja/tutorial/background-tasks/

*)ASGIの公式ドキュメントにもspiritualと書いてあり、「精神的な」後継である事が明記されている。

### PlainText Response

FastAPIはWebアプリケーション開発用フレームワークという事もありデフォルトでは全てJSONで返す挙動となっています。
しかし、"/"のような場所はアプリケーションが起動しているか否かといった単純な監視用に定義するようなことがあり、そういうときには単純な平文を返したいと思うことでしょう。
そのような時にはResponse_classを変更する事でPlain Textを返すことができます。

```python
from fastapi.responses import PlainTextResponse

@app.get("/plaintext/ok", response_class=PlainTextResponse)
def return_plain_text() -> str:
    return "OK"
```


### エラーハンドリング

FastAPIは存在しない（未定義）のURLパスにアクセスすると404を返す、といった基本的な動作は備えています。
しかしながら受け付けたURLに対し、なんらかの処理を行い、その結果に応じてレスポンスコードを変化させたい、と言った時はどのようにすれば良いのでしょうか。

FastAPIにはHTTPExceptionが含まれている為、それを呼び出すことで任意のレスポンスコードを返すことができます。

```python
from fastapi import FastAPI, HTTPException

items = {"hoge": "This is Hoge"}


@app.get("/error/{item_id}")
def read_item_with_error_handling(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

参考: https://fastapi.tiangolo.com/ja/tutorial/handling-errors/


### Extra Info

FastAPIは起動時に様々な情報を追加することができます。
下記に一例を示しますので実際に設定を行ってみましょう。
どのような違いが出るか試してみてください。

```python
app = FastAPI(
    title="IIJ Bootcamp HandsOn",
    description="IIJ Bootcamp Web Application by FastAPI.",
    version="1.0",
)
```

## まとめ

今回は、FastAPIを使ってWebアプリケーションを作ってみました。
FastAPIは決して大規模なWebアプリケーションを作るために作られた物ではありませんが、作り方次第で多くの処理を任せることができます。

BootCampではあくまでチュートリアルのような形で作成したため、全てを一つのmain.pyに記載しましたが開発をスムーズに行う上ではpydanticで定義するモデルファイルは分ける。エンドポイントも階層化に合わせてファイルを分ける、といったテクニックが必要になってきますのでそういった所を今後は学んでいって頂ければと思います。

## Tips

### より詳細なログ出力をしたい時は？

Webアプリケーションを開発する上で不具合を調査する上でログは大変重要です。
ここでは処理時間やリクエストをログに出力するためのTipsをご紹介します。
先ほど示したsampleディレクトリに logging_context.py という、ログ出力のために作られたClassがあるので
これをimportし、LoggingContextRouteをappのrouter.route_class に指定することで詳細なログに出力されます。
お時間があればやってみてください。

- import/設定例

```python
from logging_context import LoggingContextRoute

app.router.route_class = LoggingContextRoute
```

<credit-footer/>
