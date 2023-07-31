---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
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
    docker pull redis:6.2.3-alpine3.13
    docker pull python:3.9.5-slim-buster
    docker pull erikdubbelboer/phpredisadmin:v1.17.0
    docker images

    REPOSITORY                                           TAG                 IMAGE ID            CREATED             SIZE
    python                                               3.9.5-slim-buster   afaa64e7c7fe        15 hours ago        115MB
    redis                                                6.2.3-alpine3.13    efb4fa30f1cf        9 days ago          32.3MB
    erikdubbelboer/phpredisadmin                         v1.17.0             82d60d8fd132        6 months ago        196MB
    ```

1. サーバを起動する

    ```Shell
    docker run --rm --name test-server redis:6.2.3-alpine3.13
    ```
    * ```test-server``` という名前で redis サーバーを 起動します
    * ``` Ready to accept connections ``` と出ればOK このターミナルは開いたままにします
    * もし、ターミナルが閉じたり、Ctrl-C で終了してしまったら、再度 起動してください

1. 別のターミナルを開いて、redis-cli でサーバに接続してみる

    * redis-cli を起動します。 これで対話的に コマンドが打てます。
    * 下の二通りの使い方があります。どちらも ```test-server``` として先程起動したredis の中を見れます
    ```Shell
    # ネットワーク越し 別コンテナ
    docker run -it --link test-server:redis --rm redis:6.2.3-alpine3.13 sh -c 'exec redis-cli -h "$REDIS_PORT_6379_TCP_ADDR" -p "$REDIS_PORT_6379_TCP_PORT"'
    # 直接 乗り込んで起動
    docker exec -it test-server redis-cli
    ```

    * redis のping コマンドで PONG と帰ってくれば 正常に接続できています。
    ```Shell
    172.17.0.2:6379> ping
    PONG
    172.17.0.2:6379> exit
    ```

    *  Ctrl-C もしくは exit コマンドで抜けます。

    - Windows 環境は Git Bash の MINGW64 環境で動作確認しました
        - winpty docker -it 〜 としたらいけました

1. WebUI でRedis を操作するためのコンテナをデプロイしてみる

    * phpredisadmin を起動します。 これでRedis を操作するためのWebUI を起動します。
    ```Shell
    docker run -d --link test-server:redis --name test-web --rm -e REDIS_1_HOST=redis -e REDIS_1_AUTH= -p 9000:80 erikdubbelboer/phpredisadmin:v1.17.0
    ```
    * 9000番ポートにアクセスするとphpRedisAdmin の画面を開くことができます。ここでは既に接続をするための情報をコンテナの起動時に渡しているため、ログインの必要はなくRedis の中身を閲覧することができます。

3. 終了
    * ここまで完了できたら 事前準備完了です。 無事 これらを行うことができました。
      1. docker image の 取得
      1. redis server の起動
      1. redis-cli による Redis の操作
      1. phpRedisAdmin (WebUI) による Redisの操作

## あらすじ

- Redis ざっくり説明
- Redis を直接触ってみよう
- プログラムで DB 登録しよう
- 応用課題

## 資料

### Redis とは何か

- KVS(Key-Value-Store) の一種
    - データを Key と Value で 管理するもの
    - 構造が単純故に、気軽に使えたり、分散しやすいなど RDBMS とは違った特性を持つデータストア

- RDBMS vs KVS
    - よく言われるWebサービスの最小構成として LAMP (Linux, Apache, MySQL, PHP/Perl/Python) と言う言葉がある
    - データを扱うのに MySQL, PostgreSQL のような データを 表で管理する RDBMS を使うのはよくあること。
        - 帳簿のように 決められた形式で決められた属性のデータをきれいに整理するのには向いていた
    - でも、 RDBMS では 困る場合もある。
        - 多様: 例えばセンサーの情報 センサーが100種類あれば100種類のテーブルを作るのか? 1万なら? 現実的ではない
        - 大量: 巨大な表同士を連携しながら1つのデータにするRDBMS では 1台のマシンで扱える規模に限界がある。
        - 高頻度: 毎秒凄まじい数のリクエストを高速に処理しないといけない時、RDBMS の負荷分散では仕組み上の限界がある
    - そこで RDBMS とは別の仕組みでデータを処理できるデータベースが 最近 利用されてきた
        - KVSやドキュメントデータベース、JSONのママ登録できるRDBMSや、グラフデータベースなど

- Redis の特徴
    - オンメモリで動作し、速い
        - 設定で永続化やクラスタリングもできる
    - 便利な機能やデータ型がある
        - 単純な KVS に加えて Redis では いくつものデータ型がサポートされている
          - String: 512MB までの テキストやバイナリ
          - Hashes: フィールドと値のリスト
          - Lists: 順序を保持してくれる文字列の集合 (4番目に入れたやつ などが取れる)
          - Sets: 順序なしの文字列の集合で、他のSets 同士で 足したり引いたり 共通する要素を抜き出したりなどの 演算ができる
          - Sorted sets: ソート済みのSets. 値を入れるときに並べ替えながら入れてくれる、 また、 決められた範囲で何件あるか、 3~5位は誰か などの演算ができる
         (bitmap, HLL, pubsub, streaming)
        - expire(データの有効期限): 決められた時間が立ったあとデータを消すという処理をする必要がない
        - トランザクション: Luaスクリプトなどを用意することで 複数の操作を一連の操作として行えることができる
        - Pub/Sub のメッセージング: 多対多の疎結合なやりとりをサポートしている。 これにより チャットや 配信の仕組みなどを 簡単に作れる
        - 地理データ用のコマンド: 二点間の距離とか 10km四方にある ラーメン屋の検索 とかができる
    - シンプルに出来が良い
        - 機能がコンパクトにまとまっており、信頼性が高く動かしていて気持ちがいい（主観）

- 世間でのRedis の 使用例
    - Web server のセッション保持
    - 高速にアクセスしたいメタデータの保持
    - コンテンツ/データのキャッシュ
    - データの一時キュー
    - sorted set 型によるランキング
    - set 型によるタグ付けと集合演算

### Redis を直接触ってみよう

[Redis コマンド一覧](https://redis.io/commands) も見ながら色々触ってみましょう。

#### 一番単純なkey-value

[set](https://redis.io/commands/set)/[get](https://redis.io/commands/get)

`set`で保存して`get`で取り出します。

```terminal
172.17.0.2:6379> set key1 yamagarashi
OK
172.17.0.2:6379> set key2 kaizoku
OK
172.17.0.2:6379> get key1
"yamagarashi"
172.17.0.2:6379> get key2
"kaizoku"
172.17.0.2:6379> get key3
(nil)
```

これがredisで最も基本的なkeyとvalueの扱いです。`set`や`get`を「コマンド」と呼び、その後ろは引数です。
keyを色々操作してみましょう。

[keys](https://redis.io/commands/keys) はkeyの検索ができます。`keys *`とすると存在するすべてのキーが出力されます。
ちなみにredisはシングルスレッドで動作するソフトウェアで、`keys *`で大量のkeyを表示すると一定時間処理が止まってしまい、本番サーバに重大な影響を与えてしまうので注意しましょう。

```terminal
172.17.0.2:6379> keys key*
1) "key1"
2) "key2"
```

他にも色々

- [exists](https://redis.io/commands/exists): もうセットされてるのか とかがわかる
- [del](https://redis.io/commands/del): key を指定してそれを削除する
- [rename](https://redis.io/commands/rename): key の 名前を変えられる

```terminal
172.17.0.2:6379> exists key2
(integer) 1                           # 存在しているので1(true)
172.17.0.2:6379> exists key3
(integer) 0                           # 存在しないので0(false)
172.17.0.2:6379> del key2
(integer) 1
172.17.0.2:6379> keys *
1) "key1"
172.17.0.2:6379> rename key1 key5
OK
172.17.0.2:6379> get key5
"yamagarashi"
```

キーには有効期限を設定し、一定時間後に自動削除することができます。
キャッシュなどの用途において、アプリケーション側でキャッシュ削除をしなくても勝手に削除されるのが非常に便利です。

```terminal
172.17.0.2:6379> set key7 kiemasu
OK
172.17.0.2:6379> expire key7 20         # 20秒後に消す
(integer) 1
172.17.0.2:6379> ttl key7               # ttlは残り秒数を表示する
(integer) 17
172.17.0.2:6379> ttl key7
(integer) 14
172.17.0.2:6379> get key7               # まだ見えてる
"kiemasu"
172.17.0.2:6379> ttl key7
(integer) 8
172.17.0.2:6379> ttl key7
(integer) 3
172.17.0.2:6379> ttl key7
(integer) 1
172.17.0.2:6379> ttl key7
(integer) -2
172.17.0.2:6379> get key7               # 消えた
(nil)
```

#### 数値の扱い

redisはよくランキング情報を一時的にキャッシュしたり数値を扱うことが多いため、そのためのコマンドが用意されています。

- [incr](https://redis.io/commands/incr): 1足す
- [decr](https://redis.io/commands/decr): 1引く
- [incrby](https://redis.io/commands/incrby): n足す
- [decrby](https://redis.io/commands/decrby): n引く

```terminal
172.17.0.2:6379> set boss_damage 0
OK
172.17.0.2:6379> incr boss_damage
(integer) 1
172.17.0.2:6379> incr boss_damage
(integer) 2
172.17.0.2:6379> get boss_damage
"2"
172.17.0.2:6379> incr boss_damage
(integer) 3
172.17.0.2:6379> get boss_damage
"3"
172.17.0.2:6379> decrby boss_damage 2
(integer) 1
172.17.0.2:6379> get boss_damage
"1"
172.17.0.2:6379> incrby boss_damage 10
(integer) 11
172.17.0.2:6379> get boss_damage
"11"
```

#### 色々なデータ型

上で例に出したのは全てstring(文字列)型の単純なデータです。redisにはそれ以外にも面白いデータ型を用意しています。

最初に紹介するのは [Lists](https://redis.io/docs/data-types/lists/) 型です。

```terminal
172.17.0.2:6379> rpush enemy_list slime
(integer) 1
172.17.0.2:6379> rpush enemy_list drakee
(integer) 2
172.17.0.2:6379> lrange enemy_list 0 -1
1) "slime"
2) "drakee"
172.17.0.2:6379> lpush enemy_list magician
(integer) 3
172.17.0.2:6379> lrange enemy_list 0 -1
1) "magician"
2) "slime"
3) "drakee"
```

### プログラムから Redis を使おう
* それでは、実際にPythonでRedis を利用するコードを書いていきます。
* 手元の環境で好きなエディタを使って Python のコードを書いた上で docker container の中から そのコードを読み出せるようにします。
* 事前準備のおさらいも兼ねています

#### コンテナの中から実行する
* どこか作業用のディレクトリを作成してそこに移動してください
    ```Shell
    mkdir iij_bootcamp_redis
    cd iij_bootcamp_redis
    ```

* プログラムを置く場所として iij_bootcamp_redisの中に app ディレクトリを作成し その中にhello_world.py を作成してください エディタは自由です。
    ```Shell
    mkdir app
    vim app/hello_world.py
    ```
    ```Python
    print("Hello World!")
    ```

* 今いる場所から見ると app/hello_world.py が作られたはずです。
    ```
    $ cat app/hello_world.py
    print("Hello World!")
    ```
    * そうでない場合は cd コマンドで 階層を移動して 必ず app ディレクトリのひとつ上の階層に移動してください (例だとiij_bootcamp_redisにいてほしい)

* コンテナ の中から起動
    * -v で 今いるところの app ディレクトリを コンテナの中では /app に マウントします。
        ```Shell
            docker run -it --rm -v `pwd`/app:/app python:3.9.5-slim-buster bash
        ```
    * ls -l で ファイルが有るか確認します。
        ```Shell
        コンテナ内部 $ ls -l /app
        total 4
        -rw-rw-r-- 1 1000 1000 22 May 13 08:37 hello_world.py
        ```
    * python で起動します
        ```Shell
        コンテナ内部: $ python /app/hello_world.py
        Hello World!
        ```
    * うまく Hello World! と表示されたら このコンテナは一旦閉じてしまいましょう
        ```Shell
        コンテナ内部: $ exit
        ```

* これで、 手元で書いたファイルを コンテナ内のPython から起動することができました。

#### Redis Server 起動
* 事前準備の通り Redis Server を起動してください。
```Shell
docker run --rm --name test-server redis:6.2.3-alpine3.13
```
* ``` Ready to accept connections ``` と出ればOK このターミナルは開いたままにします。
* もし、ターミナルが閉じたり、Ctrl-C で終了してしまったら、再度 起動してください

#### Redis Server 接続
* Redis には redis-cli という ツールが有ります。 事前準備では ping などを試しました。
  * 他にも どんな動きがRedis に対して実行されているか知ることができる機能があるので紹介します
    * ref: https://redis.io/topics/notifications

* 以下の二通りの接続方法のうち好きな方を選んでください
```Shell
# ネットワーク越し 別コンテナ
docker run -it --link test-server:redis --rm redis:6.2.3-alpine3.13 sh -c 'exec redis-cli -h "$REDIS_PORT_6379_TCP_ADDR" -p "$REDIS_PORT_6379_TCP_PORT"'

# 直接 乗り込んで起動
docker exec -it test-server redis-cli
```

* エラーメッセージ以外のすべてを通知するように設定
```
127.0.0.1:6379> config set 'notify-keyspace-events' AKE
```

* すべてのキーに対して通知を購読
```
127.0.0.1:6379> psubscribe '__key*__:*'
```

* 最初は真っ黒のままです。 何かしら redis に対して操作を行うと どんなことを行ったのか画面に表示されるようになります。
* 今は開きっぱなしにしましょう

#### WebUI 起動

    * phpredisadmin を起動します。 これでRedis を操作するためのWebUI を起動します。
    ```Shell
    docker run -d --link test-server:redis --name test-web --rm -e REDIS_1_HOST=redis -e REDIS_1_AUTH= -p 9000:80 erikdubbelboer/phpredisadmin:v1.17.0
    ```
    * 9000番ポートにアクセスするとphpRedisAdmin の画面を開くことができます。ここでは既に接続をするための情報をコンテナの起動時に渡しているため、ログインの必要はなくRedis の中身を閲覧することができます。

#### コンテナの中から Redis Server へ接続
* 次に Redis へ接続するコードを書いてみます。
    - 再度、Pythonのコンテナを起動します。 先ほどと同様 iij_bootcamp_redis の中から実行してください。
    ```Shell
    docker run -it --link test-server:redis --rm --name test-python -v `pwd`/app:/app python:3.9.5-slim-buster bash
    ```

    - 先程と同様に /app には hello_world.py があるはずです
    ```
    コンテナ内部: $ cd /app
    コンテナ内部: $ ls
    hello_world.py
    ```

    - さて、今度は redis と接続をするため 事前準備で行ったようにライブラリのインストールをしましょう。
      * なお、現状 コンテナを起動するたびに 必要ですが 自分でDockerfile を書くなど image を build することで割愛することも可能です
    ```
    コンテナ内部: $ pip install redis
    Collecting redis
      Downloading https://files.pythonhosted.org/packages/ac/a7/cff10cc5f1180834a3ed564d148fb4329c989cbb1f2e196fc9a10fa07072/redis-3.2.1-py2.py3-none-any.whl (65kB)
         |████████████████████████████████| 71kB 3.2MB/s
    Installing collected packages: redis
    Successfully installed redis-3.2.1
    ```

    - 先程起動したRedis Server の情報が連携できているか確認します。
      * 細かい値が違くても問題ないです。
    ```
    コンテナ内部: $ env | grep REDIS
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
    ```

- Python には 事前準備にも使った対話式のUIがあります。
    * 起動
    ```Shell
    コンテナ内部: $ python
    ```

    * ping してみる。
    ```python
    >>> import os, redis
    >>> conn = redis.Redis(host=os.environ['REDIS_PORT_6379_TCP_ADDR'], port=os.environ['REDIS_PORT_6379_TCP_PORT'], db=0)
    >>> conn.ping()
    True
    ```

    * 事前準備ではここまででした。 それでは実際にこの対話式UIを利用して redis へ書き込みをしてみましょう

    ```python
    // 複数データセット: mset コマンド
    >>> conn.mset({'key1': 'value1', 'key2': 'value2'})
    True

    // 複数データゲット: mget コマンド
    >>> conn.mget(['key1', 'key2'])
    [b'value1', b'value2']
    ```

    ```python
    // 複数データセット,ゲットを別手法でやってみる : mset,mget,scan コマンド
    >>> keys = conn.scan(match='key*')
    >>> values_1 = conn.mget(keys[1])
    >>> print(values_1)
    [b'value1', b'value2']

    // データを追加して
    >>> conn.mset({'key1': 'value1', 'key2': 'value2', 'id1': 'ichiro', 'id2': 'jiro'})

    // key から始まるキーに紐づく値
    >>> keys = conn.scan(match='key*')
    >>> values_1 = conn.mget(keys[1])
    >>> print(values_1)
    [b'value1', b'value2']

    // id から始まるキーに紐づく値
    >>> keys = conn.scan(match='id*')
    >>> all_id = conn.mget(keys[1])
    >>> print(all_id)
    [b'ichiro', b'jiro']
    ```

    ```python
    // 複数データ削除: delete コマンド
    >>> _, keys = conn.scan(match='key*')
    >>> print(conn.mget(keys))
    [b'value1', b'value2']

    >>> ret = conn.delete(*keys)

    >>> print(conn.mget(keys))
    [None, None]

    // もちろん消してないやつは消えていない
    >>> _, keys = conn.scan(match='id*')
    >>> print(conn.mget(keys))
    [b'ichiro', b'jiro']
    >>>
    ```


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
    サンプル: https://github.com/iij/bootcamp/blob/master/src/database/redis/ex01.py

    - /etc/passwd の内容をユーザごとのハッシュに格納する

    ```Python
    {
        'root': { 'passwd': 'x', 'uid': '0', 'gid': '0', 'name': 'root', 'home': '/root', 'shell': '/bin/bash' },
        'daemon': { 'passwd': 'x', 'uid': '1', 'gid': '1', 'name': 'daemon', 'home': '/usr/sbin', 'shell': '/usr/sbin/nologin' }
        # ...
    }
    ```
    サンプル: https://github.com/iij/bootcamp/blob/master/src/database/redis/ex02.py

### Expire を試してみる

- expire 付きで値を格納し、実際にその時間が過ぎると値が消えていくことを確認する
  サンプル: https://github.com/iij/bootcamp/blob/master/src/database/redis/ex03.py

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
cd iij_bootcamp_redis/app
wget "https://raw.githubusercontent.com/iij/bootcamp/master/src/database/redis/Redis%20hands-on.ipynb"
docker pull jupyter/base-notebook
docker run --rm --link test-server:redis -p 8888:8888 -v `pwd`:/home/jovyan/work jupyter/base-notebook
# copy and paste one of these URLs のメッセージを見て、ブラウザから接続する
```

### Advanced: GIS で遊んでみよう
* 今どき オープンデータとして 様々な施設の座標を公開している自治体があります。
* jupyter nodebook では csv の 処理などはとても簡便にすることができます
*  
* redis.geoadd で登録: https://redis-py.readthedocs.io/en/stable/#redis.Redis.geoadd
* redis.georadius で検索が可能です。:https://redis-py.readthedocs.io/en/stable/#redis.Redis.georadius

## 参考資料

- [Redis 本家](https://redis.io/)
- [Redis Python Client](https://github.com/andymccurdy/redis-py)

<credit-footer/>
