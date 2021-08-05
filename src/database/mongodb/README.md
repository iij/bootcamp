---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
title: MongoDBを触ってみよう
description: MongoDBに対してクエリを投げながら、レプリカセットなど特徴的な機能について紹介します。
time: 1h
prior_knowledge: なし
---

<header-table/>

# {{$page.frontmatter.title}}

## 今日のサンプル環境

以下のレポジトリを手元にクローンして、`docker-compose up -d`を実行してください。

[iij/bootcamp-mongodb-sample](https://github.com/iij/bootcamp-mongodb-sample)

```terminal
$ git clone git@github.com:iij/bootcamp-mongodb-sample.git
$ docker-compose up -d
Docker Compose is now in the Docker CLI, try `docker compose up`

Pulling mongo-primary (mongo:)...
latest: Pulling from library/mongo
16ec32c2132b: Pull complete
6335cf672677: Pull complete
cbc70ccc8ebe: Pull complete
0d1a3c6bd417: Pull complete
960f3b9b27d3: Pull complete
aff995a136b4: Pull complete
4249be7550a8: Pull complete
4da411c5a406: Pull complete
4b9c6ac629be: Pull complete
4de7437f497e: Pull complete
Digest: sha256:d78c7ace6822297a7e1c7076eb9a7560a81a6ef856ab8d9cde5d18438ca9e8bf
Status: Downloaded newer image for mongo:latest
Creating bootcamp-mongodb-sample_mongo-arbiter_1   ... done
Creating bootcamp-mongodb-sample_mongo-secondary_1 ... done
Creating bootcamp-mongodb-sample_mongo-primary_1   ... done
$ docker-compose ps
                 Name                               Command               State                   Ports
-----------------------------------------------------------------------------------------------------------------------
bootcamp-mongodb-sample_mongo-           docker-entrypoint.sh mongo ...   Up      27017/tcp, 0.0.0.0:27019->27019/tcp,:
arbiter_1                                                                         ::27019->27019/tcp
bootcamp-mongodb-sample_mongo-           docker-entrypoint.sh mongo ...   Up      0.0.0.0:27017->27017/tcp,:::27017->27
primary_1                                                                         017/tcp
bootcamp-mongodb-sample_mongo-           docker-entrypoint.sh mongo ...   Up      27017/tcp, 0.0.0.0:27018->27018/tcp,:
secondary_1                                                                       ::27018->27018/tcp
```

## MongoDBの紹介

[MongoDB](https://www.mongodb.com/)は2009年に初版がリリースされた、MongoDB社が開発しているドキュメント指向のデータベース。
MySQLなどのRDBが「行と列」からなるテーブル形式でデータを管理するのに対して、ドキュメント指向であるMongoDBには以下のjsonデータのようなオブジェクトをそのまま保存・検索ができるデータベースです。

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

他の特徴として、「レプリカセット」と呼ばれる仕組みで3台（奇数台）1セットの冗長構成を簡単に作れる他、シャーディングによる負荷分散構成も簡単に構築することができます。

### 個人的な雑感

MongoDBはスキーマレスでありながらRDBMSのような使い方もできることから、サービス立ち上げ時に開発スピードが求められる段階において、データスキーマを含めて試行錯誤を高速に繰り返すような使われ方が話題になりました。
アプリケーションの開発手法としての有効性はともかく、MongoDBが「とりあえずデータを突っ込んで高速に検索する」用途において非常に強力なDBであることは間違いありません。

- きちんとスキーマと検索クエリが設計されたRDBMS
- 大量データの保存・検索に特化したNoSQL
- 全文検索に特化したエンジン

などユースケースに完全に特化した他のDBにパフォーマンスが及ばなくても、ほぼあらゆるユースケースで満足のいくパフォーマンスを出せるDBという存在がMongoDBの立ち位置だと思います。
（レプリカセットによる冗長化とシャーディングの負荷分散も含めて）

## 早速使ってみよう

何はともあれ使ってみましょう。`docker-compose up -d`に成功していれば、以下のコマンドでMongoDBのコンソールが使えます。

```terminal
$ docker-compose exec mongo-arbiter mongo --port 27017 --host mongo-primary

MongoDB shell version v5.0.1
connecting to: mongodb://mongo-primary:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("c90c0469-9eb0-4583-bb9d-5af4b7a3f907") }
MongoDB server version: 5.0.1

~~略~~

> 
> rs.initiate()
{
	"info2" : "no configuration specified. Using a default configuration for the set",
	"me" : "edd2f8708eef:27017",
	"ok" : 1
}
mongo-set:SECONDARY>
mongo-set:PRIMARY>
```

まずはおまじないとして`rs.initiate()`を実行しておいてください。あとで紹介します。

とりあえず適当なデータを作成してみましょう。

```terminal
mongo-set:PRIMARY> use bootcamp-db
switched to db bootcamp-db
mongo-set:PRIMARY> db.people.insert({name: "tanaka-san", age: 22})
WriteResult({ "nInserted" : 1 })
mongo-set:PRIMARY> db.people.insert({name: "sato-san", age: 25})
WriteResult({ "nInserted" : 1 })

mongo-set:PRIMARY> db.people.find()
{ "_id" : ObjectId("61065f590ea234e44f402acf"), "name" : "tanaka-san", "age" : 22 }
{ "_id" : ObjectId("61065f650ea234e44f402ad0"), "name" : "sato-san", "age" : 25 }
mongo-set:PRIMARY>
```

RDBMSにおける「テーブル」は、MongoDBでは「collection」と呼ばれます。ここでは`people`がcollectionです。

```terminal
mongo-set:PRIMARY> show collections;
people
```

MySQLなどのように事前に`CREATE TABLE...`などでテーブルを作成しなくても、勝手にcollectionが作成されています。
MongoDBはスキーマレスなので、形式を問わずデータを保存できます。

```terminal
mongo-set:PRIMARY> db.people.insert({name: "watanabe-san", age: 23, address: "tokyo"})
WriteResult({ "nInserted" : 1 })
mongo-set:PRIMARY> db.people.insert({name: "fujimoto-san", age: 23, address: {post: "123-4567", city: "tokyo"}})
WriteResult({ "nInserted" : 1 })
mongo-set:PRIMARY> db.people.insert({name: "kawai-san", age: 30, address: {post: "123-9876", city: "tokyo"}})
WriteResult({ "nInserted" : 1 })
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
例えばMySQLの`group by`と同じことをするには以下のようにします。

```terminal
db.people.aggregate([
  { $match: {"address.city": "tokyo"} },
  { $group: {_id: "$address.city", age_sum: {$sum: "$age"}} }
])
```

ここでは`address.city`が`tokyo`になってる人のデータを集計し、`age`を合計して表示しています。

aggregationで使える機能はたくさんあるので、色々と試してみてください。=> [Aggregation Pipeline Stages](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/)

例えば`$replaceRoot`というpipelineを使うとどうなるか試してみてください。他に個人的には [$unwind](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/) をよく使ったりします。

```terminal
db.people.aggregate([
  { $match: {"address.city": "tokyo"} },
  { $replaceRoot: {newRoot: "$address"} }
])
```

## レプリカセット

### 解説

MongoDBでは [レプリカセット](https://docs.mongodb.com/manual/replication/) と呼ばれる構成を奇数台（最小3台）で構成することができます。

![replica-set-primary-with-two-secondaries](./replica-set-primary-with-two-secondaries.bakedsvg.svg)

通常ではクライアントやアプリケーションは「Primary」になっているMongoDBに対してデータを更新します。すると更新されたデータは「Secondary」にもレプリケーションされます。
そしてレプリカセットを構成しているMongoDBはお互いに投票処理を行い、その結果によって自動的にPrimary役が決定されます。

もしPrimaryが停止したりネットワーク的に分断された場合、残り2台のMongoDB同士で通信（画像のHeartbeat通信）ができる場合、2台による投票処理によって自動的に次のPrimaryが決定します。

![replica-set-trigger-election](./replica-set-trigger-election.bakedsvg.svg)

この時元々Primaryだったホストでは、他2台との通信ができなくなったことで自動的にPrimaryではなくなります（更新クエリを受け付けなくなる）。

### ハンズオン

実際にやってみましょう。`mongo-primary`でレプリカセットの設定をします。

```terminal
$ docker-compose exec mongo-arbiter mongo --port 27017 --host mongo-primary
rs.reconfig( {
   _id : "mongo-set",
   members: [
      { _id: 0, host: "mongo-primary:27017", priority: 2 },
      { _id: 1, host: "mongo-secondary:27018", priority: 1 },
      { _id: 2, host: "mongo-arbiter:27019", priority: 0 }
   ]
})
```

すると残りの2台にも設定が反映され、レプリカセットが構築されます。`rs.status()`で設定状況を確認してみてください。

```terminal
$ docker-compose exec mongo-arbiter mongo --port 27018 --host mongo-secondary

mongo-set:SECONDARY> rs.status() # 設定確認
```

`"ok" : 1`などでレプリカセットの正常性を確認できます。

以下のようにsecondaryにprimaryからデータがreplicateされていることが確認できます。

```terminal
mongo-set:SECONDARY> rs.secondaryOk()
mongo-set:SECONDARY> use bootcamp-db
switched to db bootcamp-db
mongo-set:SECONDARY> db.people.find()
{ "_id" : ObjectId("610674ca6c750f55ca8b580d"), "name" : "tanaka-san", "age" : 22 }
{ "_id" : ObjectId("610674ce6c750f55ca8b580e"), "name" : "sato-san", "age" : 25 }
{ "_id" : ObjectId("610674d46c750f55ca8b580f"), "name" : "watanabe-san", "age" : 23, "address" : "tokyo" }
{ "_id" : ObjectId("610674d86c750f55ca8b5810"), "name" : "fujimoto-san", "age" : 23, "address" : { "post" : "123-4567", "city" : "tokyo" } }
{ "_id" : ObjectId("610674dc6c750f55ca8b5811"), "name" : "kawai-san", "age" : 30, "address" : { "post" : "123-9876", "city" : "tokyo" } }
```

ここで例えばPrimaryのMongoDBを落としてみましょう

```terminal
$ docker-compose stop mongo-primary
Stopping bootcamp-mongodb-sample_mongo-primary_1 ... done
$ docker-compose ps
                Name                              Command                State                    Ports
-----------------------------------------------------------------------------------------------------------------------
bootcamp-mongodb-sample_mongo-         docker-entrypoint.sh mongo ...   Up         27017/tcp, 0.0.0.0:27019->27019/tcp,
arbiter_1                                                                          :::27019->27019/tcp
bootcamp-mongodb-sample_mongo-         docker-entrypoint.sh mongo ...   Exit 137
primary_1
bootcamp-mongodb-sample_mongo-         docker-entrypoint.sh mongo ...   Up         27017/tcp, 0.0.0.0:27018->27018/tcp,
secondary_1                                                                        :::27018->27018/tcp
```

するとSecondaryのプロンプトが`mongo-set:PRIMARY>`に変わるのが確認できます。

```terminal
mongo-set:SECONDARY>
mongo-set:PRIMARY>
mongo-set:PRIMARY>
mongo-set:PRIMARY>
```

`rs.status()`をもう一度Secondaryで叩いてみてください。先ほどとどう変わったでしょうか。

<credit-footer/>
