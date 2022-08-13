---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: 
description: 
time: 1.5h
prior_knowledge: 
---

<header-table/>

# {{$page.frontmatter.title}}

## 環境準備

以下のdockerコマンドでコンソールを取得してください。

```terminal
docker pull iijrfujimoto/bootcamp_concurrent
mkdir bootcamp_work  # 作業用のディレクトリ。名前はなんでもいい
cd bootcamp_work
docker run --name bootcamp_concurrent -p 8000:8000 -v $PWD:/work --rm -it iijrfujimoto/bootcamp_concurrent /bin/bash
```

## このハンズオンの目的

このハンズオンでは、Webアプリケーションの実装に欠かせない「並行処理」について取り扱います。

プログラミングにおいて、同時に複数の処理を行う「並行処理」は複雑で実装が難しいものです。
それは・・・（実装が難しい理由を本から引用）

しかしユーザからの多数のリクエストに対応するため、Webアプリケーションに並行処理の実装は必須です。
昨今ではライブラリやフレームワークが発達し並行処理を意識しなくてもWebアプリケーションを作ることが可能ですが、
並行処理の勘所を理解せずに使うと思わぬバグや事故を起こす可能性があります。

このハンズオンではWebアプリケーションにおける並行処理実装の初歩的な注意点を紹介し、不具合を起こさないための知識を得てもらうことを目的としています。

::: tip 並行処理と並列処理

並行処理(concurrent processing)と並列処理(parallel processing)は似た言葉ですが異なる動作を指す言葉です。

- 並行処理: ある時間内に複数のタスクを処理すること
- 並列処理: 複数のタスクを「同時に」処理すること

「並行処理」と言う場合はある時間内に複数タスクを実行できればいいので、コンテキストスイッチによってタスクを切り替えながら処理する動作も含みます。
一方で「並列処理」の場合は複数のCPUコアによって全く同時に複数タスクを処理することを指します。

（参考: [Concurrency is not parallelism](https://go.dev/blog/waza-talk)）

:::

## ハンズオン

### 簡単な並行処理サンプル

まずはPythonで簡単なWebサーバを書いてみましょう。

vscode等を利用して作業用ディレクトリ(`bootcamp_work`)でpythonコードを書いていきましょう。

```termianl
$ vim main.py
```

```python
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import time

PORT = 8000

class SimpleHelloHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    print('start processing path = {}'.format(self.path))

    time.sleep(10) # 何かの処理

    print('end processing path = {}'.format(self.path))

    self.send_response(200)
    self.send_header('Content-Type', 'text/plain; charset=utf-8')
    self.end_headers()
    self.wfile.write(b'Hello simple server!\n')

with ThreadingHTTPServer(("", PORT), SimpleHelloHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```

保存したら、dockerコンテナ内からサーバを起動してみます。

```terminal
root@0dd4d9fad678:/work# python3 main.py
```

手元のホストから以下のようにcurlで叩いてみましょう。
「Hello simple server!」と返ってくれば成功です。

```terminal
$ curl localhost:8000
Hello simple server!
```

リクエストした直後、サーバー側のログに`start processing path = /`と表示されたことを覚えておいてください。

### 共有メモリとレースコンディション

#### サンプルコード

先ほどのプログラムを少し改造して、今までのアクセス数をカウントできるようにしてみましょう。

```python
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import time

PORT = 8000

class SimpleHelloHandler(BaseHTTPRequestHandler):
    request_total = 0

    def count_and_do_something(self, path):
        t = SimpleHelloHandler.request_total
        print('start processing path = {}, before request count = {}'.format(path, t))

        time.sleep(10)  # 何かの処理

        t = t + 1
        print('end processing path = {}, after request count = {}'.format(path, t))

        SimpleHelloHandler.request_total = t

    def do_GET(self):
        self.count_and_do_something(self.path)

        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b'Hello simple server!\n')

with ThreadingHTTPServer(("", PORT), SimpleHelloHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()

```

以下のようにcurlを複数叩いてみます。`&`はコマンドをバックグラウンドで実行する書き方です。
先ほどはサーバ側が処理をする10秒間curlコマンドはずっと待っていましたが、`&`をつけることですぐに次のコマンドを叩けます。

```terminal
$ curl localhost:8000 &
$ curl localhost:8000 &
$ curl localhost:8000 &
```

さて結果はどうでしょうか。3回コマンドを実行しましたが、サーバのログは以下のようになったのではないでしょうか。

```terminal
serving at port 8000
start processing path = /, before request count = 0
start processing path = /, before request count = 0
start processing path = /, before request count = 0
end processing path = /, after request count = 1
end processing path = /, after request count = 1
end processing path = /, after request count = 1
```

きちんとリクエスト数をカウントできていない、重大な不具合があるようです。

#### コード解説

#### forkとthread

このプログラムではユーザからのリクエストを同時に処理するために [ThreadingHTTPServer](https://docs.python.org/ja/3.7/library/http.server.html#http.server.ThreadingHTTPServer) を利用しています。
ThreadingHTTPServer の説明を見てみましょう。

> This class is identical to HTTPServer but uses threads to handle requests by using the ThreadingMixIn.

どうやらリクエストを処理(handle)するために「スレッド」を利用するようです。
[ThreadingMixIn](https://docs.python.org/ja/3.7/library/socketserver.html#socketserver.ThreadingMixIn) の説明も見てみましょう。

> Forking and threading versions of each type of server can be created using these mix-in classes.

`fork`もしくは`thread`いずれかの仕組みで渡したServerオブジェクトを並列に実行してくれるようです。`fork`と`thread`は両方とも並列処理のための方法ですが、大きな違いがあります。

![fork](./fork.drawio.png "fork")

![thread](./thread.drawio.png "thread")

図の通り`fork`の場合forkで分かれたプロセス上で`SimpleHelloHandler`のインスタンスが実行されます。そのためリクエストを処理する各インスタンス間でメモリ空間を共有していません（できないとも言う）。
一方で`thread`の場合はメモリ空間を共有した同じプロセス内で`SimpleHelloHandler`インスタンスが実行されます。

今回`request_total`はクラス変数として宣言されています。そのため各`SimpleHelloHandler`インスタンスから共有するメモリ上の変数としてアクセスが可能です。
Webサーバを実装する時に限りませんが、ライブラリやフレームワークを利用する際にはそれがどういう仕組みで動くのか把握しておく必要があります。

#### クリティカルセッション

`count_and_do_something`の以下の部分に注目してみましょう（といっても中身全てですが）。

```python{2-10}
    def count_and_do_something(self, path):
        t = SimpleHelloHandler.request_total
        print('start processing path = {}, before request count = {}'.format(path, t))

        time.sleep(10)  # 何かの処理

        t = t + 1
        print('end processing path = {}, after request count = {}'.format(path, t))

        SimpleHelloHandler.request_total = t
```

上記2-10行目は`SimpleHelloHandler.request_total`という共有資源にアクセスしており、複数のスレッドから同時にアクセスされると不具合が起きます。このような箇所を「**クリティカルセクション**」と呼びます。
また実際にクリティカルセクションに複数のスレッドが同時にアクセスしてしまい、不具合が起きている状態を「**レースコンディション**」と呼びます。

スレッドなどを利用する並列処理プログラミングではこのクリティカルセクションを如何に減らし、そして保護するかが大切になります。

### アトミック処理・排他処理

### 非同期プログラミング

### 様々な並行・並列処理

#### マルチスレッド

#### マルチプロセス

<credit-footer/>
