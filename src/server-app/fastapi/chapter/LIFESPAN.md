---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

# Lifespan イベントを活用して起動時・終了時の処理を追加する


## 本章の目的

- FastAPIのlifespanイベントシステムを理解し、アプリケーションのライフサイクル管理を行う方法を学ぶ。
- lifespanイベントを活用し、アプリケーションの起動時や終了時にリソースの初期化やクリーンアップ処理を実行する実践的な方法を学ぶ。

## lifespanイベント概要

- Lifespanイベントとは、アプリケーションの起動時 (startup) および終了時 (shutdown) に実行される特定の処理を定義するためのイベントシステムです
- 以前は`@app.on_event` デコレータに"startup"や"shutdown"を使用することで実現していましたが、より柔軟で明確な方法としてlifespanが導入されました
  - 2024年現在、app.on_eventも利用可能ですが非推奨になっています

## Lifespanの基本構造

lifespanは、アプリケーションのライフサイクルを管理するためのコンテキストマネージャを提供しています。
具体的には`@asynccontextmanager`デコレータを付与したメソッドを作成し、FastAPIに`lifespan=`として明け渡すことで機能します。
具体的には以下のようなコードを作成します。

```python
from contextlib import asynccontextmanager

from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時に実行したい処理を書く
    startup_task()
    # yieldの部分がFastAPI実行となる為、こういう物だと思って書く
    yield
    # 終了時に実行したい処理を書く
    finish_task()

app = FastAPI(lifespan=lifespan)
```

### 演習: lifespanイベントを用いて起動・終了時に任意のメッセージをコンソールに出力する

では、実際に起動時と終了時にそれぞれメッセージを表示するlifespanを作成してみましょう。
表示したいメッセージは以下の通りです

| タイミング  | メッセージ内容  |
|---|---|
|起動時   |  Start IIJ bootcamp |
|終了時   |  Finish IIJ bootcamp |

- 基本構造の項に習って、Pythonコードを追加します
  ```python
  @asynccontextmanager
  async def lifespan(app: FastAPI):
      # 起動時に実行したい処理を書く
      print("Start IIJ bootcamp")
      # yieldの部分がFastAPI実行となる為、こういう物だと思って書く
      yield
      # 終了時に実行したい処理を書く
      print("Finish IIJ bootcamp")
  ```
- app = FastAPIの部分にはlifespanを追加します
  ```python
  app = FastAPI(lifespan=lifespan)
  ```
- 追加できたら起動してコンソール画面を確かめてみましょう
  ```bash
  ```





## 公式ドキュメントリンク

 - https://fastapi.tiangolo.com/advanced/events/

<credit-footer/>
