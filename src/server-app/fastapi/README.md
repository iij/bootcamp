---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

# FastAPIを使ったAPIサーバ作り

- [FastAPIを使ったAPIサーバ作り](#fastapiを使ったapiサーバ作り)
  - [はじめに](#はじめに)
    - [FastAPI概要](#fastapi概要)
    - [演習環境について](#演習環境について)
  - [演習0. 事前準備](#演習0-事前準備)
  - [演習1. FastAPIのインストール](#演習1-fastapiのインストール)
      - [トラブルシューティング](#トラブルシューティング)
  - [FastAPIを使ったAPIサーバの開発](#fastapiを使ったapiサーバの開発)
  - [演習2. トップページの作成](#演習2-トップページの作成)
  - [演習3. API(FastAPI)の起動](#演習3-apifastapiの起動)
    - [発展演習1. コンテナの外からアクセスを可能にする](#発展演習1-コンテナの外からアクセスを可能にする)
      - [コンテナの外から FastAPIを起動する](#コンテナの外から-fastapiを起動する)
      - [コンテナの外からもアクセスできるようにする](#コンテナの外からもアクセスできるようにする)
  - [演習4. swagger によるAPIドキュメントの自動生成](#演習4-swagger-によるapiドキュメントの自動生成)
  - [演習解説](#演習解説)
  - [演習5. FastAPIでWebアプリケーションを作る](#演習5-fastapiでwebアプリケーションを作る)
    - [5.1 パスパラメータ](#51-パスパラメータ)
      - [解説](#解説)
    - [5.2 クエリパラメータ](#52-クエリパラメータ)
      - [解説](#解説-1)
    - [5.3 リクエストボディ](#53-リクエストボディ)
      - [Pydantic によるモデルの定義](#pydantic-によるモデルの定義)
        - [解説](#解説-2)
      - [リクエストボディを処理するメソッドの定義](#リクエストボディを処理するメソッドの定義)
  - [発展演習2. より本番環境らしくFastAPIを起動するために](#発展演習2-より本番環境らしくfastapiを起動するために)
    - [Gunicornの利用](#gunicornの利用)
  - [演習6. プレーンテキストを返す](#演習6-プレーンテキストを返す)
  - [演習7. エラーハンドリング](#演習7-エラーハンドリング)
  - [演習8. アプリケーション情報の追加](#演習8-アプリケーション情報の追加)
  - [発展演習3. 非同期処理](#発展演習3-非同期処理)
  - [まとめ](#まとめ)

## はじめに

この講義ではハンズオン形式でFastAPIを使ったAPIサーバ作りについて学びます。

講義を受けるにあたり、事前に環境準備が必要です。
講義当日までに**0.事前準備**を終え、Dockerが実行可能な環境を整えてください。


FastAPIはPythonのフレームワークのため、Pythonを触ったことがある方を想定しています。
従って本項では、Pythonの基本的な文法や書き方などについては扱いません。

また、WebAPIについてもハンズオンで扱う限りにおいては解説をしますが、基本的なRDBMS・HTTPに関する知識についても体系だった説明は行いません。予めご了承ください。

### FastAPI概要

iijbootcampでは、演習を中心に行っていますが、演習作業に入る前にFastAPIについておさらいしておきましょう。
FastAPIについては公式ドキュメントに以下のような記載があります。

`FastAPI は、Pythonの標準である型ヒントに基づいてPython 3.6 以降でAPI を構築するための、
モダンで、高速(高パフォーマンス)な、Web フレームワークです。`
<https://fastapi.tiangolo.com/ja/>

Pythonは動的型言語であるため、長らく型を意識すること無くコードを書くことが通常でした。

しかし、Python3.5以降、様々な要因から急速に型を意識して書くことが求められるようになり、現在ではPythonにおいても型を定義することが求められています。

従って従来のモジュール・フレームワークについても型を定義することが求められるようになっており、修正や追加が行われておりますが歴史のあるモジュールほど対応が難しく、型定義の恩恵を受けられる機会が限定的でした。

そんな中、FastAPIはその流れにいち早く対応した形で登場し、高速な動作とAPI開発に優位である特性に注目が集まっています。

### 演習環境について

本講義では`vscode + python` を使って演習を行います。
vim等による開発や`PyCharm`などでも問題ありませんが、講義においては講師の環境を`vscode`にて説明を行うため、vscode以外で開発を行う場合は適宜自身で読み替えてください。

## 演習0. 事前準備

以下のような`compose.yml`を作成し、FastAPI開発用、値の保存用(redis)2つのコンテナを起動してください。

- compose.yml
  ```yaml
  version: '3'
  services:
    fastapi:
      container_name: iijbootcamp-fastapi
      image: python:slim-bookworm
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
- compose.ymlと同じ階層で実行
  ```bash
   docker compose up -d
  ```
- 動作確認
  ```bash
  $ docker ps
  CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  41539a83d3e1   redis:alpine             "docker-entrypoint.s…"   5 seconds ago   Up 3 seconds   6379/tcp                                    iijbootcamp-backend
  a26d57ce6c8e   python:slim-bookworm   "python3"                5 seconds ago   Up 3 seconds   0.0.0.0:8088->5000/tcp, :::8088->5000/tcp   iijbootcamp-fastapi
  ```
  - 二つのコンテナの`STATUS`が**Up**であること
- docker コンテナの終了
  ```bash
  docker compose down
  ```

## 演習1. FastAPIのインストール

では、早速FastAPIを使ってAPIサーバを開発していきましょう。
FastAPIはPythonのWebフレームワークであるため、Pythonのインストールが必須となっています。
また、FastAPIはPythonコアパッケージには含まれていないため、Pythonのインストール後にFastAPIを別途、インストールする必要があります。

これは他のPython製のフレームワークにも同様の事が言える為、インストール、という作業が必要な事は当然と言えます。

先ほどのFastAPIのインストールにはPythonのインストールが必須と記載しましたが、本項ではPythonのインスト－ルは講義の範囲外となるため、予めPythonがインストール済みの環境にて演習を行っていただきます。

Pythonがインストール済みの環境がどこにあるのか、と言うと皆さんは既に事前準備で FastAPI用のコンテナが作成済みかと思います。
compose.ymlを見て気づいた方もおられるかと思いますが、iijbootcamp-fastapiコンテナはpythonがインストール済みのコンテナイメージを元にしているため、これがPythonインストール済み環境、ということになります。

従ってFastAPIのインストールには、iijbootcamp-fastapiコンテナにログインして、以下の手順を実行することになります。

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

#### トラブルシューティング

- 事象
  - pip でパッケージが取得できない
- 主な原因
  - proxy配下にある環境下で実施している為、pipが繋がらない
- 対処方法
  - pip --proxy <proxy server>を追加して実施する
    - 実行例）
      ```bash
      pip install fastapi --proxy http://proxy-server:port
      ```

## FastAPIを使ったAPIサーバの開発

FastAPIのインストールができたならばいよいよAPIの開発です。
iijbootcampではFastAPIの開発に`vscode`を使います。
従って、演習.1 でログインしたdockerコンテナからはログアウトします。

その状況でどのようにしてvscodeで開発を行うか、となりますがcompose.ymlを見ていただくとおわかりかと思いますが事前準備の項で示した FastAPIコンテナは `app`フォルダを母艦と共有しています。

従って、`app`フォルダ配下のファイルを母艦で操作すると、同時にコンテナにも反映されることになるため、コンテナにログインすることなくアプリケーション開発を行う事が可能です。

## 演習2. トップページの作成

では、始めに公式ドキュメントの通り`main.py`というファイルを作成し、以下のようにコードを書いてみましょう。

- `main.py` の作成
  - main.pyの中身は以下の通りに作成します
    ```python
    from fastapi import FastAPI

    app = FastAPI()


    @app.get("/")
    def read_root():
        return {"Hello": "World"}

    ```

- よく分からない方は[sample]([fastapi/sample](https://github.com/iij/bootcamp/tree/master/src/server-app/fastapi/sample))ディレクトリに作成済みのサンプルファイルがあるので参考にしてください。

## 演習3. API(FastAPI)の起動

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

### 発展演習1. コンテナの外からアクセスを可能にする

さて、ここまでの作業でアプリケーション開発自体はコンテナの外でもできることが分かりました。
では、起動は？アクセスは？
これらもコンテナの外部からできないのでしょうか。
都度、コンテナへの出入りを繰り返さなければならないのでしょうか。

心配要りません、以下のようなことをする事でコンテナの外部からもアクセスが可能になります。

#### コンテナの外から FastAPIを起動する

先ほどは `docker exec`の後に `bash`を引数としていましたが、ログイン後に実行していた`uvicorn main:app`を docker exec... の後に渡すことでそのまま実行する事が可能です。

```bash
 docker exec -it iijbootcamp-fastapi uvicorn main:app
```

#### コンテナの外からもアクセスできるようにする

FastAPIは何も指定しなければ`127.0.0.1(locahost)`のみListenするようになっています。しかし、これではコンテナの内部からしかアクセスができません。
せっかく `docker-compose.yml`でportをエクスポートしたのですから、直接アクセスできるよう起動オプションを変更しましょう。

```bash
 docker exec -it iijbootcamp-fastapi uvicorn main:app --host 0.0.0.0
```

## 演習4. swagger によるAPIドキュメントの自動生成

さて、演習3.では実際にFastAPIを使ってAPIサーバのエンドポイントを作成してみました。
しかし、APIの利用者は作成されたAPIサーバがどのようなエンドポイントを持ち、どういった動作(レスポンス)を返してくれるのでしょうか。

APIサーバの開発にはAPI利用者に向けて、そういった動作仕様を説明する必要があり、そのためのドキュメント作成が必要になります。

しかし、開発のコードとドキュメントを別々の作業で行っていた場合、
、どのようなことが起こるのでしょうか。
ドキュメントと実際の動作が異なる、というのは残念ながらよくあることですが、開発者としてはできる限りそういったことを避けねばなりません。

FastAPIで開発を行う際にもドキュメント作成の業務からは逃れられませんがドキュメント作成を簡単にしてくれる優れた機能があります。
それが、APIドキュメントおよびswagger clientの自動生成機能です。

これを利用することでFastAPIではプログラムを書く事＝ドキュメント作成になります。
このおかげでアプリケーション開発につきまとうドキュメント作成のコストが大幅に削減できます。

この自動作成されたドキュメントはOpenAPIという規格に沿って生成されており、そのドキュメントパスは `/docs`になっています。

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

## 演習解説

ここでは本項で扱ったコードの解説を記載しています。
演習の実施には必要ではありませんが、可能であれば呼んで理解を深めてください。

- main.py
  - `from fastapi import FastAPI`: FastAPIモジュールのロード。Pythonではお馴染み
  - `app = FastAPI()`: appという名前でFastAPIをインスタンス化。後述のuvicornはこれを実行しているインスタンス化の際にいくつかオプションを渡すことができる
  - `@app.get("/")`: flask等でもお馴染みの記法。 `/` に `GET` メソッドが来たときの振る舞いを記載する
- uvicorn main:appの示すもの
  - `main` main.pyファイル (Python "module")。Pythonではディレクトリを`.`で表すため sample/main.pyの場合、 `sample.main` になる
  - `app` main.py内部で作られるobject（app = FastAPI()のように記述される）。

## 演習5. FastAPIでWebアプリケーションを作る

それではいよいよ本格的にWebアプリケーションの開発を行っていきます。
FastAPIに限らずWebアプリケーションを作る以上、ただの静的データを返すだけでは意味がありませ
ん。
APIサーバを作る際には、アクセスする際に何らかのパラメータを受け、それに応じた応答を返す必要があります。
ここで代表的な3つの例を挙げて作ってみることにします。

### 5.1 パスパラメータ

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

### 5.2 クエリパラメータ

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

### 5.3 リクエストボディ

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


## 発展演習2. より本番環境らしくFastAPIを起動するために

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


## 演習6. プレーンテキストを返す

FastAPIはWebアプリケーション開発用フレームワークという事もありデフォルトでは全てJSONで返す挙動となっています。
しかし、"/"のような場所はアプリケーションが起動しているか否かといった単純な監視用に定義するようなことがあり、そういうときには単純な平文を返したいと思うことでしょう。
そのような時にはResponse_classを変更する事でPlain Textを返すことができます。

```python
from fastapi.responses import PlainTextResponse

@app.get("/plaintext/ok", response_class=PlainTextResponse)
def return_plain_text() -> str:
    return "OK"
```

## 演習7. エラーハンドリング

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


## 演習8. アプリケーション情報の追加

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

## 発展演習3. 非同期処理

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

<credit-footer/>
