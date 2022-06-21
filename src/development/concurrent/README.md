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
docker run --name bootcamp_concurrent --rm -it iijrfujimoto/bootcamp_concurrent /bin/bash
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

以下のコマンドでvimを立ち上げ、Pythonコードを書いていきます。可能であればvscode等を利用しても構いません。

```termianl
root@0dd4d9fad678:/work# vim main.py
```

```python
from http.server import BaseHTTPRequestHandler, HTTPServer
import socketserver
import time

PORT = 8000

class MyHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    print('start processing path = {}'.format(self.path))

    # 何かの処理
    time.sleep(20)

    print('end processing path = {}'.format(self.path))
    
    self.send_response(200)
    self.send_header('Content-Type', 'text/plain; charset=utf-8')
    self.end_headers()
    self.wfile.write(b'Hello simple server!\n')

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```

`:wq` で保存したら、サーバを起動してみます。

```terminal
root@0dd4d9fad678:/work# python3 main.py
```

別のターミナルを開き、以下の通りコンテナに別セッションで接続しましょう。

```terminal
$ docker exec -it bootcamp_concurrent /bin/bash
root@ee45c9084604:/work#
```

以下のようにcurlでレスポンスが返ってこれば成功です

```terminal
root@1b48b3d0b7cc:/work# curl localhost:8000
Hello simple server!
```

リクエストした直後、サーバー側のログに`start processing path = /`と表示されたことを覚えておいてください。

### 共有メモリとレースコンディション

### アトミック処理・排他処理

### 非同期プログラミング

### 様々な並行・並列処理

#### マルチスレッド

#### マルチプロセス

<credit-footer/>
