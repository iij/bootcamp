---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Redisの概要を学び、Pythonを使って実際に使ってみます。
time: 1h
prior_knowledge: なし
---

# Database: Redis 編

このハンズオンの狙い

- Docker に慣れる
- Redis を実際に使ってみる
- よく使いたくなる処理(部品)を作ってみる

## 事前準備

- Docker を使用できる
    - install は主題ではないので、Docker image を使用します
- 何らかの LL を使える
    - 例は Python で書きますが、Ruby, Perl, JavaScript, Go なども使えます。適当に読み替えてください

### 事前準備手順

1. Redis と Python のイメージを使えるようにする

    ```Shell
    docker pull redis:5
    docker pull python:3.7
    docker pull python:3.7.8-alpine3.12
    docker images

    REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
    docker.io/python               3.7.8-alpine3.12    6ca3e0b1ab69        2 weeks ago         73.1 MB
    python                         3.7                 4c0fd7901be8        29 hours ago        929MB
    redis                          5                   bb0ab8a99fe6        6 days ago          95MB
    ```

1. サーバを起動する

    ```Shell
    docker run --rm --name test-server redis:5
    ```

1. 別のターミナルを開いて、redis-cli でサーバに接続してみる

    ```Shell
    
    172.17.0.2:6379> ping
    PONG
    172.17.0.2:6379> exit
    ```

    - Windows 環境は Git Bash の MINGW64 環境で動作確認しました
        - winpty docker -it 〜 としたらいけました

1. (最初に起動した Redis サーバは C-c で止められます)

1. Python Clientから接続用のReidsサーバを起動する

    ```Shell
    docker run -d --rm --name test-server -p 6379:6379 redis:5
    ```
1. さらに別のターミナルを開いて、python が使えるコンテナイメージを展開する

    ```Shell
     docker run -it python:3.7.8-alpine3.12 ash
    / # 
    / # pip3 install redis
    Collecting redis
    Downloading redis-3.5.3-py2.py3-none-any.whl (72 kB)
     |〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓         | 51 kB 3.0 MB/s eta 0     
     |〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓     
     |〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
     |〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓| 72 kB 747 kB/s 
    Installing collected packages: redis
    Successfully installed redis-3.5.3
    / # python3
    Python 3.7.8 (default, Jun 30 2020, 19:02:38) 
    [GCC 9.3.0] on linux
    Type "help", "copyright", "credits" or "license" for more information.
    >>> import redis
    >>> conn = redis.StrictRedis(host='172.17.0.1', port=6379)
    
    // 複数データセット: mset コマンド
    >>> ret = conn.mset({'key1': 'value1', 'key2': 'value2'})
    >>> print(ret)
    True
    
    // 複数データゲット: mget コマンド
    >>> values = conn.mget(['key1', 'key2'])
    >>> print(values)
   [b'value1', b'value2']
    
    // 複数データセット,ゲットを別手法でやってみる : mset,mget,scan コマンド
    >>> keys = conn.scan(match='key*')
    >>> values_1 = conn.mget(keys[1])
    >>> print(values_1)
    [b'value1', b'value2']
    >>> ret = conn.mset({'key1': 'value1', 'key2': 'value2', 'id1': 'ichiro', 'id2': 'jiro'})  // データ追加して
    >>> keys = conn.scan(match='key*')
    >>> values_1 = conn.mget(keys[1])
    >>> print(values_1)
    [b'value1', b'value2']
    
    >>> keys = conn.scan(match='id*')
    >>> all_id = conn.mget(keys[1])
    >>> print(all_id)
    [b'ichiro', b'jiro']
    
    // 複数データ削除: delete コマンド
    >>> _, keys = conn.scan(match='key*')
    >>> print(conn.mget(keys))
    [b'value1', b'value2']
    >>> ret = conn.delete(*keys)
    >>> print(conn.mget(keys))
    [None, None]
    >>> print(all_id)
    [b'ichiro', b'jiro']
    >>>  
    ```

    - Windows 環境は Git Bash の MINGW64 環境で動作確認しました
        - winpty docker -it 〜 としたらいけました

1. (最初に起動した Redis サーバは C-c で止められます)

## あらすじ

- Redis ざっくり説明
- Redis を直接触ってみよう
- プログラムで DB 登録しよう
- 応用課題

## 資料

### Redis とは何か

- KVS の一種
    - LAMP (Linux, Apache, MySQL, PHP/Perl/Python) と言ってたけど…
    - RDB はたいていの Web サービスにはリッチすぎる
- オンメモリで動作し、速い
    - 設定で永続化やクラスタリングもできる
- 便利な機能やデータ型がある
    - string, list, set, sorted set, hash, (bitmap, HLL, pubsub, streaming)
    - expire
- 世間での使用例
    - Web server のセッション保持
    - 高速にアクセスしたいメタデータの保持
    - コンテンツ/データのキャッシュ
    - データの一時キュー
    - sorted set 型によるランキング
    - set 型によるタグ付けと集合演算

### Redis を直接触ってみよう

- [Redis コマンド一覧](https://redis.io/commands)

- データベースの選択
    - select
    - info
    - dbsize

- 基本操作と文字列型
    - set/get
    - キーの操作
        - keys
        - exists
        - del/unlink/rename/renamenx
    - incr/decr/incrby/decrby
    - mset/mget
    - getset
    - setnx

- expiration
    - expire/expireat/persist
    - ttl/pttl
    - set/setex

### プログラムから Redis を使おう

- 手元の適当なディレクトリに (Python の) スクリプトを作成します。仮に ~/app ディレクトリを使うとします
    - Python から Redis を扱うためのライブラリ [Redis Python Client](https://github.com/andymccurdy/redis-py) を pip でインストールする

    ```Shell
    docker run -it --link test-server:redis --rm --name test-python -v ~/app:/app python:3.7 bash
    root@24108149af23:/# cd app
    root@24108149af23:/app# pip install redis
    Collecting redis
      Downloading https://files.pythonhosted.org/packages/ac/a7/cff10cc5f1180834a3ed564d148fb4329c989cbb1f2e196fc9a10fa07072/redis-3.2.1-py2.py3-none-any.whl (65kB)
         |████████████████████████████████| 71kB 3.2MB/s
    Installing collected packages: redis
    Successfully installed redis-3.2.1
    root@24108149af23:/app# env | grep REDIS
    REDIS_PORT_6379_TCP_PROTO=tcp
    REDIS_PORT=tcp://172.17.0.2:6379
    REDIS_NAME=/test-python/redis
    REDIS_PORT_6379_TCP_ADDR=172.17.0.2
    REDIS_PORT_6379_TCP=tcp://172.17.0.2:6379
    REDIS_ENV_REDIS_DOWNLOAD_URL=http://download.redis.io/releases/redis-5.0.5.tar.gz
    REDIS_PORT_6379_TCP_PORT=6379
    REDIS_ENV_REDIS_DOWNLOAD_SHA=2139009799d21d8ff94fc40b7f36ac46699b9e1254086299f8d3b223ca54a375
    REDIS_ENV_GOSU_VERSION=1.10
    REDIS_ENV_REDIS_VERSION=5.0.5
    root@24108149af23:/app#
    ```

- ~/app ディレクトリにプログラムを作って、上記の Shell で実行してみましょう。

#### 要素を入れてみる

- 普通に List や Hash として使って、適当に要素を入れてみよう
    - /etc/services の ポート -> プロトコル名称 対応表を作る

    ```Python
    {
        '1/tcp': [ 'tcpmux' ],
        '7/tcp': [ 'echo' ],
        '7/udp': [ 'echo' ],
        '9/tcp': [ 'discard', 'sink', 'null' ],
        '9/udp': [ 'discard', 'sink', 'null' ],
        '11/tcp': [ 'systat', 'users' ],
        # ...
    }
    ```

    - /etc/passwd の内容をユーザごとのハッシュに格納する

    ```Python
    {
        'root': { 'passwd': 'x', 'uid': '0', 'gid': '0', 'name': 'root', 'home': '/root', 'shell': '/bin/bash' },
        'daemon': { 'passwd': 'x', 'uid': '1', 'gid': '1', 'name': 'daemon', 'home': '/usr/sbin', 'shell': '/usr/sbin/nologin' }
        # ...
    }
    ```

### Expire を試してみる

- expire 付きで値を格納し、実際にその時間が過ぎると値が消えていくことを確認する

### メッセージキューを実装する

- メッセージキュー的なものを実装してみよう
    - 依頼側: ランダム秒 sleep して、メッセージをキューに入れる
    - 取り出し側: ランダム秒 sleep して、メッセージをキューから取り出す

- 使用例: web クローラー
    - 依頼側: URL をどんどんキューに入れる
    - 取り出し側: キューを見て URL が入っていたら、取得してファイルに保存する
        - 結果(ファイルの場所)を別のキューで戻してもいいですね

### Advanced: Redis Pub/Sub, Streams を使ってみよう

- [Pub/Sub](https://redis.io/topics/pubsub)
- [Introduction to Redis Streams](https://redis.io/topics/streams-intro)

### Advanced: Jupyter notebook イメージを使ってみよう

```Shell
docker pull jupyter/base-notebook
docker run --rm --link test-server:redis -p 8888:8888 -v ~/app:/home/jovyan/work jupyter/base-notebook
# メッセージを見て、ブラウザから localhost:8888 に接続する
```

### Advanced: Dockerfile, docker-compose を使ってみよう

- pip install redis をしなくてよいイメージを作成する
- ~/app ディレクトリをマウントせず、コピーして実行してみる
- Redis, Python コンテナが起動するように docker-compose 設定を作る

## 参考資料

- [Redis 本家](https://redis.io/)
- [Redis Python Client](https://github.com/andymccurdy/redis-py)

<credit-footer/>
