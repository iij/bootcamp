---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

# FastAPIを使ったAPIサーバ作り

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [FastAPIを使ったAPIサーバ作り](#fastapiを使ったapiサーバ作り)
  - [はじめに](#はじめに)
    - [演習環境](#演習環境)
  - [0. 事前準備](#0-事前準備)
  - [FastAPI概要](#fastapi概要)
  - [1. FastAPIのインストール](#1-fastapiのインストール)
  - [2. FastAPIを使ったAPIサーバの開発](#2-fastapiを使ったapiサーバの開発)
    - [2.1 トップページの作成](#21-トップページの作成)
    - [2.2 API(FastAPI)の起動](#22-apifastapiの起動)
  - [Ex1. コンテナの外からアクセスを可能にする](#ex1-コンテナの外からアクセスを可能にする)
    - [コンテナの外から FastAPIを起動する](#コンテナの外から-fastapiを起動する)
    - [コンテナの外からもアクセスできるようにする](#コンテナの外からもアクセスできるようにする)
  - [3. swagger によるAPIドキュメントの自動生成](#3-swagger-によるapiドキュメントの自動生成)
  - [Ex2. 解説](#ex2-解説)
  - [4. FastAPIでWebアプリケーションを作る](#4-fastapiでwebアプリケーションを作る)
    - [4.1 パスパラメータ](#41-パスパラメータ)
      - [解説](#解説)
    - [4.2 クエリパラメータ](#42-クエリパラメータ)
      - [解説](#解説-1)
    - [4.3 リクエストボディ](#43-リクエストボディ)
      - [Pydantic によるモデルの定義](#pydantic-によるモデルの定義)
        - [解説](#解説-2)
      - [リクエストボディを処理するメソッドの定義](#リクエストボディを処理するメソッドの定義)
  - [Ex3. より本番環境らしくFastAPIを起動するために](#ex3-より本番環境らしくfastapiを起動するために)
    - [Gunicornの利用](#gunicornの利用)
  - [5. プレーンテキストを返す](#5-プレーンテキストを返す)
  - [6. エラーハンドリング](#6-エラーハンドリング)
  - [7. アプリケーション情報の追加](#7-アプリケーション情報の追加)
  - [Ex4. 非同期処理](#ex4-非同期処理)
  - [まとめ](#まとめ)
  - [発展学習](#発展学習)
    - [より詳細なログ出力をしたい時は？](#より詳細なログ出力をしたい時は)

<!-- /code_chunk_output -->

## はじめに

この講義ではハンズオン形式でFastAPIを使ったAPIサーバ作りについて学びます。

講義を受けるにあたり、事前に環境準備が必要です。
講義当日までに**0.事前準備**を終え、Dockerが実行可能な環境を整えてください。


FastAPIはPythonのフレームワークのため、Pythonを触ったことがある方を想定しています。
従って本項では、Pythonの基本的な文法や書き方などについては扱いません。

また、WebAPIについてもハンズオンで扱う限りにおいては解説をしますが、基本的なRDBMS・HTTPに関する知識についても体系だった説明は行いません。予めご了承ください。

### 演習環境

本講義では`vscode + python` を使って演習を行います。
vim等による開発や`PyCharm`などでも問題ありませんが、講義においては講師の環境を`vscode`にて説明を行うため、vscode以外で開発を行う場合は適宜自身で読み替えてください。

## 0. 事前準備

以下のような`docker-compose.yml`を作成し、FastAPI開発用、値の保存用(redis)2つのコンテナを起動してください。

- docker-compose.yml
  ```yaml
  version: '3'
  services:
    fastapi:
      container_name: iijbootcamp-fastapi
      image: python:3.11.4-bullseye
      ports:
        - "8088:8000"
      working_dir: /app
      tty: true
      volumes:
        - ./app:/app
    redis:
      container_name: iijbootcamp-backend
      image: "redis:alpine"
  ```
- app ディレクトリ作成
  ```bash
   mkdir app
  ```
- docker-compose.ymlと同じ階層で実行
  ```bash
   docker compose up -d
  ```
- 動作確認
  ```bash
  $ docker ps
  CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  41539a83d3e1   redis:alpine             "docker-entrypoint.s…"   5 seconds ago   Up 3 seconds   6379/tcp                                    iijbootcamp-backend
  a26d57ce6c8e   python:3.11.4-bullseye   "python3"                5 seconds ago   Up 3 seconds   0.0.0.0:8088->5000/tcp, :::8088->5000/tcp   iijbootcamp-fastapi
  ```
  - 二つのコンテナの`STATUS`が**Up**であること
- docker コンテナの終了
  ```bash
  docker compose down
  ```

## FastAPI概要

では作業に入る前にFastAPIについておさらいしておきましょう。
FastAPIについては公式ドキュメントに以下のような記載があります。

`FastAPI は、Pythonの標準である型ヒントに基づいてPython 3.6 以降でAPI を構築するための、
モダンで、高速(高パフォーマンス)な、Web フレームワークです。`
<https://fastapi.tiangolo.com/ja/>

Pythonは動的型言語であるため、長らく型を意識すること無くコードを書くことが通常でした。

しかし、Python3.5以降、様々な要因から急速に型を意識して書くことが求められるようになってきました。
従って従来のモジュール・フレームワークについても型を定義することが求められるようになっていますが歴史のあるモジュールほど対応が難しく、型定義の恩恵を受けられる機会が限定的でした。

そんな中、FastAPIはその流れにいち早く対応した形で登場し、注目を集めています。

## 1. FastAPIのインストール

では、早速FastAPIを使ってAPIサーバを開発していきましょう。
FastAPIはPythonのWebフレームワークですが、Pythonコアパッケージには含まれていません。
もっともこれは他のPython製のフレームワークにも同様の事が言える為、インストール、という作業が必要な事は当然と言えましょう。

皆さんは既に事前準備で FastAPI用のコンテナが作成済みかと思います。
従ってFastAPIコンテナにログインし、実際にFastAPIをインストールしてみましょう

- FastAPIコンテナへのログイン
  ```bash
   docker exec -it iijbootcamp-fastapi bash
  ```
- FastAPI のインストール
  ```bash
  pip install fastapi
  ```
- uvicorn のインストール
  ```bash
  pip install "uvicorn[standard]"
  ```
- インストール確認
  ```bash
  pip list
  ```
  - fastapi, uvicorn が出力結果に含まれること
  - 出力例
    ```bash
    root@02d373178837:/app# pip list
    Package           Version
    ----------------- -------
    annotated-types   0.5.0
    anyio             3.7.1
    click             8.1.4
    fastapi           0.100.0
    h11               0.14.0
    httptools         0.6.0
    idna              3.4
    pip               23.1.2
    pydantic          2.0.2
    pydantic_core     2.1.2
    python-dotenv     1.0.0
    PyYAML            6.0
    setuptools        65.5.1
    sniffio           1.3.0
    starlette         0.27.0
    typing_extensions 4.7.1
    uvicorn           0.22.0
    uvloop            0.17.0
    watchfiles        0.19.0
    websockets        11.0.3
    wheel             0.40.0
    ```
## 2. FastAPIを使ったAPIサーバの開発

FastAPIのインストールができたならばいよいよAPIの開発です。
`vscode`での開発を行うため、いったん dockerコンテナからはログアウトします。
事前準備の項で示した FastAPIコンテナは `app`フォルダを共有しているため、コンテナにログインすること無くアプリケーション開発を行う事が可能です。
### 2.1 トップページの作成

では、始めに公式ドキュメントの通り`main.py`というファイルを作成し、以下のようにコードを書いてみましょう。

- app ディレクトリへの移動
  ```bash
   cd app
  ```
- vscode にて `main.py` を作成
  - main.pyの中身は以下の通りに作成します
    ```python
    from fastapi import FastAPI

    app = FastAPI()


    @app.get("/")
    def read_root():
        return {"Hello": "World"}

    ```

- よく分からない方は[sample]([fastapi/sample](https://github.com/iij/bootcamp/tree/master/src/server-app/fastapi/sample))ディレクトリに作成済みのサンプルファイルがあるので参考にしてください。

### 2.2 API(FastAPI)の起動

`main.py`ファイルが作成できたら起動してみましょう。
起動には先ほどインストールした`uvicorn`(コマンド)に`main:app`を引数として渡して実行します。

- コンテナにログイン
  ```bash
   docker exec -it iijbootcamp-fastapi bash
  ```
- FastAPIの起動
  ```bash
  $ uvicorn main:app
  ```

- 正常に起動した場合、そのまま以下のように出力され `http://127.0.0.1:8000`と表示されます。
  ```
  INFO:     Started server process [1990921]
  INFO:     Waiting for application startup.
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
  ```

- なお、上記のコマンドではターミナルがそのままフォアグラウンドで動き続けてしまうため、動作確認は別のターミナルを起動する必要があります。
  - 別ターミナルを起動したら、コンテナにログインし、curlコマンドでアクセスしてみましょう。
  ```bash
  $ curl --noproxy 127.0.0.1 http://127.0.0.1:8000

  {"Hello":"World"}
  ```

- `main.py`に記載した Hello Worldの出力と同時にFastAPIのコンソールにもアクセスログが出力されます。
  ```bash
  INFO:     127.0.0.1:60100 - "GET / HTTP/1.1" 200 OK
  ```

- ひとまずここまでできればFastAPIの実行環境としては十分になりました。
  - 終了には`Ctrl+c`で止めてください。

## Ex1. コンテナの外からアクセスを可能にする

さて、ここまでの作業でアプリケーション開発自体はコンテナの外でもできることが分かりました。
では、起動は？アクセスは？
これらもコンテナの外部からできないのでしょうか。
都度、コンテナへの出入りを繰り返さなければならないのでしょうか。

心配要りません、以下のようなことをする事でコンテナの外部からもアクセスが可能になります。

### コンテナの外から FastAPIを起動する

先ほどは `docker exec`の後に `bash`を引数としていましたが、ログイン後に実行していた`uvicorn main:app`を docker exec... の後に渡すことでそのまま実行する事が可能です。

```bash
 docker exec -it iijbootcamp-fastapi uvicorn main:app
```

### コンテナの外からもアクセスできるようにする

FastAPIは何も指定しなければ`127.0.0.1(locahost)`のみListenするようになっています。しかし、これではコンテナの内部からしかアクセスができません。
せっかく `docker-compose.yml`でportをエクスポートしたのですから、直接アクセスできるよう起動オプションを変更しましょう。

```bash
 docker exec -it iijbootcamp-fastapi uvicorn main:app --host 0.0.0.0
```

## 3. swagger によるAPIドキュメントの自動生成

FastAPIのもう一つの優れた機能にAPIドキュメントおよびswagger clientの自動生成があります。

つまり、FastAPIではプログラムを書く事＝ドキュメント作成になります。このおかげでアプリケーション開発につきまとうドキュメント作成のコストが大幅に削減できます。
ドキュメントはOpenAPIという規格に沿って生成されており、そのドキュメントパスは `/docs`になっています。

それでは先ほどの`main.py`を再び起動しアクセスしてみましょう。
なお、今回は敢えてFastAPIを起動する際のコマンドをそのまま記載してみましたので、コンテナ上で実行するにはどうすればよいか考えてみてください。

- コマンド
  ```bash
   uvicorn main:app --host 0.0.0.0
  ```
- コンソール出力例
  ```bash
  INFO:     Started server process [1990921]
  INFO:     Waiting for application startup.
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
  ```

- 起動したら `http://127.0.0.1:8000/docs/`にアクセスしてみましょう。[ここ](https://fastapi.tiangolo.com/ja/tutorial/first-steps/#api)で表示されているようなWeb画面にアクセスできれば正常です。
  - ここではFastAPIに定義した全てのパスについて入出力情報が記載されるだけで無く、swagger-clientも内包されているため、そのままテストを行うことも可能です。

## Ex2. 解説

ここでは本項で扱ったコードの解説を記載しています。
演習の実施には必要ではありませんが、可能であれば呼んで理解を深めてください。

- main.py
  - `from fastapi import FastAPI`: FastAPIモジュールのロード。Pythonではお馴染み
  - `app = FastAPI()`: appという名前でFastAPIをインスタンス化。後述のuvicornはこれを実行しているインスタンス化の際にいくつかオプションを渡すことができる
  - `@app.get("/")`: flask等でもお馴染みの記法。 `/` に `GET` メソッドが来たときの振る舞いを記載する
- uvicorn main:appの示すもの
  - `main` main.pyファイル (Python "module")。Pythonではディレクトリを`.`で表すため sample/main.pyの場合、 `sample.main` になる
  - `app` main.py内部で作られるobject（app = FastAPI()のように記述される）。

## 4. FastAPIでWebアプリケーションを作る

それではいよいよ本格的にWebアプリケーションの開発を行っていきます。
FastAPIに限らずWebアプリケーションを作る以上、ただの静的データを返すだけでは意味がありませ
ん。
APIサーバを作る際には、アクセスする際に何らかのパラメータを受け、それに応じた応答を返す必要があります。
ここで代表的な3つの例を挙げて作ってみることにします。
### 4.1 パスパラメータ

Webアプリケーションを作る際にパス情報をパラメータとして何らかの処理をしたい場合を考えます。
FastAPIでは、Pythonのformat文字列と同様のシンタックスで`パスパラメータ`や`パス変数`を宣言できます。

先ほどの`main.py`にパスパラメータを扱うメソッドを定義してみましょう。

- 追記する内容
  ```python
  @app.get("/items/{item_id}")
  def read_item(item_id):
      return {"item_id": item_id}
  ```

追記できたらFastAPIを起動しなおしてパスパラメータを与えてアクセスしてみましょう。

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

### 4.2 クエリパラメータ

パスパラメータが実現できたら次はクエリパラメータの操作を作ってみましょう。
FastAPIでは関数の引数を宣言した時にパスパラメータではない関数パラメータを宣言すると、それらは自動的に "クエリ" パラメータとして解釈されます。

それでは先ほどに続きmain.pyにクエリパラメータを扱うメソッドを定義してみましょう。

- 追記する内容
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

### 4.3 リクエストボディ

パスパラメータ・クエリパラメータが実現できたら次はリクエストボディを扱ってみましょう。
リクエストボディはクライアントからAPIにデータを送信する時に使います。

それでは`main.py`にリクエストボディを扱うメソッドを追加してみましょう。

#### Pydantic によるモデルの定義

FastAPIでは型を宣言することで入出力のvaidation checkを行っていることは冒頭で述べたとおりです。
パスパラメータの項では型宣言を行いませんでしたがクエリパラメータの項では型を定義しチェックするようにしています。
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


## Ex3. より本番環境らしくFastAPIを起動するために

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


## 5. プレーンテキストを返す

FastAPIはWebアプリケーション開発用フレームワークという事もありデフォルトでは全てJSONで返す挙動となっています。
しかし、"/"のような場所はアプリケーションが起動しているか否かといった単純な監視用に定義するようなことがあり、そういうときには単純な平文を返したいと思うことでしょう。
そのような時にはResponse_classを変更する事でPlain Textを返すことができます。

```python
from fastapi.responses import PlainTextResponse

@app.get("/plaintext/ok", response_class=PlainTextResponse)
def return_plain_text() -> str:
    return "OK"
```

## 6. エラーハンドリング

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


## 7. アプリケーション情報の追加

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

## Ex4. 非同期処理

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

## まとめ

今回は、FastAPIを使ってWebアプリケーションを作ってみました。
FastAPIは決して大規模なWebアプリケーションを作るために作られた物ではありませんが、作り方次第で多くの処理を任せることができます。

BootCampではあくまでチュートリアルのような形で作成したため、全てを一つのmain.pyに記載しましたが開発をスムーズに行う上ではpydanticで定義するモデルファイルは分ける。エンドポイントも階層化に合わせてファイルを分ける、といったテクニックが必要になってきますのでそういった所を今後は学んでいって頂ければと思います。

## 発展学習

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
