---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
title: MongoDBを触ってみよう
description: MongoDBに対してクエリを投げながら、レプリカセットなど特徴的な機能について紹介します。
time: 1h
prior_knowledge: なし
---

<header-table/>

# {{$page.frontmatter.title}}

## 今日のサンプル環境

以下のレポジトリを手元にクローンして、`docker compose up -d`を実行してください。

[iij/bootcamp-mongodb-sample](https://github.com/iij/bootcamp-mongodb-sample)

```terminal
$ git clone https://github.com/iij/bootcamp-mongodb-sample.git
$ cd bootcamp-mongodb-sample/
$ docker compose up -d
[+] Running 3/3
 ⠿ Container bootcamp-mongodb-sample-mongo-secondary-1  Started                                                                                 7.3s
 ⠿ Container bootcamp-mongodb-sample-mongo-primary-1    Started                                                                                 7.1s
 ⠿ Container bootcamp-mongodb-sample-mongo-arbiter-1    Started                                                                                 8.0s
$ docker compose ps
NAME                                        COMMAND                  SERVICE             STATUS              PORTS
bootcamp-mongodb-sample-mongo-arbiter-1     "docker-entrypoint.s…"   mongo-arbiter       running             0.0.0.0:27019->27019/tcp, :::27019->27019/tcp
bootcamp-mongodb-sample-mongo-primary-1     "docker-entrypoint.s…"   mongo-primary       running             0.0.0.0:27017->27017/tcp, :::27017->27017/tcp
bootcamp-mongodb-sample-mongo-secondary-1   "docker-entrypoint.s…"   mongo-secondary     running             0.0.0.0:27018->27018/tcp, :::27018->27018/tcp                                                  ::27018->27018/tcp
```

## MongoDBの紹介

[MongoDB](https://www.mongodb.com/)は2009年に初版がリリースされた、MongoDB社が開発しているドキュメント指向のデータベースです。
MySQLなどのRDBが「行と列」からなるテーブル形式でデータを管理するのに対して、ドキュメント指向であるMongoDBには以下のjsonデータのようなオブジェクトをそのまま保存・検索ができます。

```json
{
    "username" : "bob",
    "address" : {
        "street" : "123 Main Street",
        "city" : "Springfield",
        "state" : "NY"
    }
}
```

いわゆる「NoSQL」としてRDBMSに比べて大量のデータを柔軟に保存し、複雑な検索クエリで比較的高速に検索・集計することができます。
さらにレプリケーションやインデックス、ドキュメント単位のロックなどRDBMSと同じような機能を持つため、スキーマレス（テーブル定義を事前に決めなくてもいい）でありながらRDBMSのような使い方ができます。

他の特徴として、「レプリカセット」と呼ばれる仕組みで3台（奇数台）1セットの冗長構成を簡単に作れる他、「シャーディング」による負荷分散構成も簡単に構築することができます。

### 個人的な雑感

MongoDBはスキーマレスでありながらRDBMSのような使い方もできることから、サービス立ち上げ時に開発スピードが求められる段階において、データスキーマを含めて試行錯誤を高速に繰り返すような使われ方が話題になりました。
現在では上記のような開発手法で利用されることは少なく、主に以下のような場面で利用されます。

- IoTのセンサーデータなど、insert manyなデータの格納・検索
  - データ間のリレーションや更新の一貫性があまり求められず、更新よりもデータの追加が頻発するケース
  - 書き込みが多く、write操作の負荷分散が必要になるケース
- データのaggregation(集計)、地理情報などによる特殊な検索用途
  - スキーマレスを活かし、データを雑に投入して後からゴリゴリクエリを書いて集計するデータレイク的な使い方
  - 地理情報(geo location)検索など特殊な検索が必要になるケース

もちろん上記のようなケースはRDBでも可能ですし、個々の機能について言えばもっと得意なDB製品は存在します。
一方でMongoDBは幅広いケースについて80点くらいを取れるような製品と言えます。

## 早速使ってみよう

何はともあれ使ってみましょう。`docker compose up -d`に成功していれば、以下のコマンドでMongoDBのコンソールが使えます。

```terminal
$ docker compose exec mongo-arbiter mongosh --port 27017 --host mongo-primary

MongoDB shell version v5.0.1
connecting to: mongodb://mongo-primary:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("c90c0469-9eb0-4583-bb9d-5af4b7a3f907") }
MongoDB server version: 5.0.1

~~略~~

test> 
test> rs.initiate()
{
	"info2" : "no configuration specified. Using a default configuration for the set",
	"me" : "edd2f8708eef:27017",
	"ok" : 1
}
mongo-set [direct: secondary] test>
mongo-set [direct: primary] test>
```

まずはおまじないとして`rs.initiate()`を実行しておいてください。あとで紹介します。

とりあえず適当なデータを作成してみましょう。

```terminal
mongo-set [direct: primary] local> use bootcamp-db
switched to db bootcamp-db
mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "tanaka-san", age: 22})
{
  acknowledged: true,
  insertedId: ObjectId("64c5ccab2c5bc0ff08cb33cd")
}
mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "sato-san", age: 25})
{
  acknowledged: true,
  insertedId: ObjectId("64c5ccb82c5bc0ff08cb33ce")
}
mongo-set [direct: primary] bootcamp-db>
mongo-set [direct: primary] bootcamp-db> db.people.find()
[
  {
    _id: ObjectId("64c5ccab2c5bc0ff08cb33cd"),
    name: 'tanaka-san',
    age: 22
  },
  {
    _id: ObjectId("64c5ccb82c5bc0ff08cb33ce"),
    name: 'sato-san',
    age: 25
  }
]
mongo-set [direct: primary] bootcamp-db>
```

RDBMSにおける「テーブル」は、MongoDBでは「collection」と呼ばれます。ここでは`people`がcollectionです。

```terminal
mongo-set [direct: primary] bootcamp-db> show collections;
people
```

MySQLなどのように事前に`CREATE TABLE...`などでテーブルを作成しなくても、勝手にcollectionが作成されています。
MongoDBはスキーマレスなので、形式を問わずデータを保存できます。

```terminal
mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "watanabe-san", age: 23, address: "tokyo"})
{
  acknowledged: true,
  insertedId: ObjectId("64c5cdcc2c5bc0ff08cb33cf")
}
mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "fujimoto-san", age: 23, address: {post: "123-4567", city: "tokyo"}})
{
  acknowledged: true,
  insertedId: ObjectId("64c5cdd12c5bc0ff08cb33d0")
}
mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "kawai-san", age: 30, address: {post: "123-9876", city: "tokyo"}})
{
  acknowledged: true,
  insertedId: ObjectId("64c5cdd82c5bc0ff08cb33d1")
}
```

`db.people.find()` してみてください。`people` collectionの中にいろんな形式でデータが保存されています。

## 検索と集計(Aggregation)

単純な検索であれば`find()`で可能です。

```terminal
# 名前が`sato-san`なデータを検索
db.people.find({name: "sato-san"})

# ageが23以上なデータを検索
db.people.find({age: {$gte: 23}})
```

`$gte`は`greater than or equal`の略で「以上」のデータを検索します。例えばageが23「未満」なデータを検索する場合は`$lt`(`lower than`)です。
詳しくはこちら => [Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)

ネストされたデータも検索できます。

```terminal
> db.people.find({"address.city": "tokyo"})
```

さらに詳しい検索や集計をする場合、強力な [Aggregation](https://docs.mongodb.com/manual/core/aggregation-pipeline/) 機能が使えます。

まずは何も集計せずに検索してみましょう。

```terminal
mongo-set [direct: primary] bootcamp-db> db.people.aggregate([ { $match: {"address.city": "tokyo"} } ])
{ "_id" : ObjectId("62e5e5265beeb8a010811279"), "name" : "fujimoto-san", "age" : 23, "address" : { "post" : "123-4567", "city" : "tokyo" } }
{ "_id" : ObjectId("62e5e52e5beeb8a01081127a"), "name" : "kawai-san", "age" : 30, "address" : { "post" : "123-9876", "city" : "tokyo" } }
m
```

例えばここからMySQLの`group by`と同じことをするには以下のようにします。

```terminal
db.people.aggregate([
  { $match: {"address.city": "tokyo"} },
  { $group: {_id: "$address.city", age_sum: {$sum: "$age"}} }
])
```

ここでは`address.city`が`tokyo`になってる人のデータを集計し、`age`を合計して表示しています。
年齢を合計するのもおかしいので、平均を取ってみましょう。平均を取るコマンドは`$avg`です。

```terminal
db.people.aggregate([
  { $match: {"address.city": "tokyo"} },
  { $group: {_id: "$address.city", age_avg: {$avg: "$age"}} }
])
```

aggregationで使える機能はたくさんあるので、色々と試してみてください。=> [Aggregation Pipeline Stages](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/)

例えば`$replaceRoot`というpipelineを使うとどうなるか試してみてください。

```terminal
db.people.aggregate([
  { $match: {"address.city": "tokyo"} },
  { $replaceRoot: {newRoot: "$address"} }
])
```

他には [$unwind](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/) も面白い機能です。

## レプリカセット

### 解説

MongoDBでは [レプリカセット](https://docs.mongodb.com/manual/replication/) と呼ばれる構成を奇数台（最小3台）で構成することができます。

(以下画像は [https://docs.mongodb.com/manual/replication/](https://docs.mongodb.com/manual/replication/) より)

![replica-set-primary-with-two-secondaries](./replica-set-primary-with-two-secondaries.bakedsvg.svg)

通常ではクライアントやアプリケーションは「Primary」になっているMongoDBに対してデータを更新します。すると更新されたデータは「Secondary」にもレプリケーションされます。
そしてレプリカセットを構成しているMongoDBはお互いに投票処理を行い、その結果によって自動的にPrimary役が決定されます。

もしPrimaryが停止したりネットワーク的に分断された場合、残り2台のMongoDB同士で通信（画像のHeartbeat通信）を行い、2台による投票処理によって自動的に次のPrimaryが決定します。

![replica-set-trigger-election](./replica-set-trigger-election.bakedsvg.svg)

この時元々Primaryだったホストは他2台との通信ができなくなったことで、自動的にSecondaryとなり更新クエリを受け付けなくなります。

### ハンズオン

実際にやってみましょう。今回用意したサンプルの`docker-compose.yml`では以下のホストを立ち上げています。

- mongo-primary
- mongo-secondary
- mongo-arbiter

この3台でレプリカセットを構築してみましょう。

::: tip Aribiterとは？
先ほどMongoDBのレプリカセットは最低3台の奇数台で構成されると説明しました。
これは投票処理におけるsplit brainを防ぐためですが、一方でreplicationによるデータコピーは1台で十分というケースは多々あります。
その場合3台目に1~2台目と同じスペックのサーバを用意するのは無駄です。そこで使われるのが「投票処理しか行わない」 [Arbiter](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/) というサーバです。

Aribiterにはデータのreplicationが行われず、データの書き込みも読み込みもできません。レプリカセットに参加しPrimaryを選出するための投票処理しか行わないため、低スペックで安いサーバに構築することが可能です。

ちなみにこのハンズオンでは、ArbiterのホストをMongoDB clientを起動するためのホストとしても利用しています。
:::

先ほどと同様に、mongo-arbiterホストから`mongo-primary`のコンソールに入り、レプリカセットの設定をします。
（先程までのコンソールを使い回しても大丈夫です）

```terminal
$ docker compose exec mongo-arbiter mongosh --port 27017 --host mongo-primary
rs.reconfig( {
   _id : "mongo-set",
   members: [
      { _id: 0, host: "mongo-primary:27017", priority: 2 },
      { _id: 1, host: "mongo-secondary:27018", priority: 1 },
      { _id: 2, host: "mongo-arbiter:27019", priority: 0 }
   ]
})
```

以下のような結果が返ってくるはずです。

```json
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1690685501, i: 1 }),
    signature: {
      hash: Binary(Buffer.from("0000000000000000000000000000000000000000", "hex"), 0),
      keyId: Long("0")
    }
  },
  operationTime: Timestamp({ t: 1690685501, i: 1 })
}
```

すると残りの2台にも設定が反映され、レプリカセットが構築されます。
新しいコンソールで以下のようにmongo-secondaryを開き、`rs.status()`を実行して設定状況を確認してみてください。

```terminal
$ docker compose exec mongo-arbiter mongosh --port 27018 --host mongo-secondary

mongo-set [direct: secondary] test> rs.status() # 設定確認
```

`"ok" : 1`などでレプリカセットの正常性を確認できます。

以下のようにsecondaryにprimaryからデータがreplicateされていることを確認します。

```terminal
mongo-set [direct: secondary] test> use bootcamp-db
switched to db bootcamp-db
mongo-set [direct: secondary] bootcamp-db> db.getMongo().setReadPref("primaryPreferred")
mongo-set [direct: secondary] bootcamp-db> db.people.find()
[
  {
    _id: ObjectId("64c5ccab2c5bc0ff08cb33cd"),
    name: 'tanaka-san',
    age: 22
  },
  {
    _id: ObjectId("64c5ccb82c5bc0ff08cb33ce"),
    name: 'sato-san',
    age: 25
  },
  {
    _id: ObjectId("64c5cdcc2c5bc0ff08cb33cf"),
    name: 'watanabe-san',
    age: 23,
    address: 'tokyo'
  },
  {
    _id: ObjectId("64c5cdd12c5bc0ff08cb33d0"),
    name: 'fujimoto-san',
    age: 23,
    address: { post: '123-4567', city: 'tokyo' }
  },
  {
    _id: ObjectId("64c5cdd82c5bc0ff08cb33d1"),
    name: 'kawai-san',
    age: 30,
    address: { post: '123-9876', city: 'tokyo' }
  }
]
```

最初にprimaryに登録したデータが、secondaryにも保存されていました。これはprimaryからsecandaryにデータがコピー（replicate）されているからです。

ここで別のターミナルを開き、PrimaryのMongoDBを落としてみましょう

```terminal
$ sudo docker compose stop mongo-primary
[sudo] password for r-fujimoto:
[+] Stopping 1/1
 ✔ Container bootcamp-mongodb-sample-mongo-primary-1  Stopped    11.1s
$ sudo docker compose ps
NAME                                        IMAGE               COMMAND                  SERVICE             CREATED             STATUS              PORTS
bootcamp-mongodb-sample-mongo-arbiter-1     mongo               "docker-entrypoint.s…"   mongo-arbiter       37 minutes ago      Up 37 minutes       27017/tcp, 0.0.0.0:27019->27019/tcp, :::27019->27019/tcp
bootcamp-mongodb-sample-mongo-secondary-1   mongo               "docker-entrypoint.s…"   mongo-secondary     37 minutes ago      Up 37 minutes       27017/tcp, 0.0.0.0:27018->27018/tcp, :::27018->27018/tcp                                                           :::27018->27018/tcp
```

するとSecondaryのプロンプトが`mongo-set:PRIMARY>`に変わるのが確認できます。

```terminal
mongo-set [direct: secondary] bootcamp-db>
mongo-set [direct: primary] bootcamp-db>
mongo-set [direct: primary] bootcamp-db>
mongo-set [direct: primary] bootcamp-db>
```

`rs.status()`をもう一度Secondaryで叩いてみてください。先ほどとどう変わったでしょうか。

`rs.status()`が確認できたら、Primaryを起動してみましょう。

```terminal
$ sudo docker compose start mongo-primary
[+] Running 1/1
 ✔ Container bootcamp-mongodb-sample-mongo-primary-1  Started                                                                    0.3s
~/w/b/t/bootcamp-mongodb-sample (main|✔) $
```

するとsecondaryが再度secondaryに戻ります。

```terminal
mongo-set [direct: primary] bootcamp-db>

mongo-set [direct: primary] bootcamp-db>

mongo-set [direct: primary] bootcamp-db>

mongo-set [direct: secondary] bootcamp-db>

mongo-set [direct: secondary] bootcamp-db>
```

これは`rs.reconfig()`で設定した`priority`というパラメータに従い、より値の大きいホストがPrimaryになるように設定されているためです。

このようにMongoDBのレプリカセットでは、一台が落ちても自動的に他がPrimaryに昇格し、データの保存を継続できる構成を簡単に作ることができます。

<credit-footer/>
