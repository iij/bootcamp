(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{376:function(s,a,n){s.exports=n.p+"assets/img/replica-set-primary-with-two-secondaries.bakedsvg.71ff1fec.svg"},377:function(s,a,n){s.exports=n.p+"assets/img/replica-set-trigger-election.bakedsvg.a65dbacf.svg"},548:function(s,a,n){"use strict";n.r(a);var e=n(16),t=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("header-table"),s._v(" "),a("h1",{attrs:{id:"page-frontmatter-title"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#page-frontmatter-title"}},[s._v("#")]),s._v(" "+s._s(s.$page.frontmatter.title))]),s._v(" "),a("h2",{attrs:{id:"今日のサンプル環境"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#今日のサンプル環境"}},[s._v("#")]),s._v(" 今日のサンプル環境")]),s._v(" "),a("p",[s._v("以下のレポジトリを手元にクローンして、"),a("code",[s._v("docker compose up -d")]),s._v("を実行してください。")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/iij/bootcamp-mongodb-sample",target:"_blank",rel:"noopener noreferrer"}},[s._v("iij/bootcamp-mongodb-sample"),a("OutboundLink")],1)]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ git clone https://github.com/iij/bootcamp-mongodb-sample.git\n$ cd bootcamp-mongodb-sample/\n$ docker compose up -d\n[+] Running 3/3\n ⠿ Container bootcamp-mongodb-sample-mongo-secondary-1  Started                                                                                 7.3s\n ⠿ Container bootcamp-mongodb-sample-mongo-primary-1    Started                                                                                 7.1s\n ⠿ Container bootcamp-mongodb-sample-mongo-arbiter-1    Started                                                                                 8.0s\n$ docker compose ps\nNAME                                        COMMAND                  SERVICE             STATUS              PORTS\nbootcamp-mongodb-sample-mongo-arbiter-1     "docker-entrypoint.s…"   mongo-arbiter       running             0.0.0.0:27019->27019/tcp, :::27019->27019/tcp\nbootcamp-mongodb-sample-mongo-primary-1     "docker-entrypoint.s…"   mongo-primary       running             0.0.0.0:27017->27017/tcp, :::27017->27017/tcp\nbootcamp-mongodb-sample-mongo-secondary-1   "docker-entrypoint.s…"   mongo-secondary     running             0.0.0.0:27018->27018/tcp, :::27018->27018/tcp                                                  ::27018->27018/tcp\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br")])]),a("h2",{attrs:{id:"mongodbの紹介"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mongodbの紹介"}},[s._v("#")]),s._v(" MongoDBの紹介")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://www.mongodb.com/",target:"_blank",rel:"noopener noreferrer"}},[s._v("MongoDB"),a("OutboundLink")],1),s._v("は2009年に初版がリリースされた、MongoDB社が開発しているドキュメント指向のデータベースです。\nMySQLなどのRDBが「行と列」からなるテーブル形式でデータを管理するのに対して、ドキュメント指向であるMongoDBには以下のjsonデータのようなオブジェクトをそのまま保存・検索ができます。")]),s._v(" "),a("div",{staticClass:"language-json line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"username"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"bob"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"address"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"street"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"123 Main Street"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"city"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Springfield"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"state"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"NY"')]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("p",[s._v("いわゆる「NoSQL」としてRDBMSに比べて大量のデータを柔軟に保存し、複雑な検索クエリで比較的高速に検索・集計することができます。\nさらにレプリケーションやインデックス、ドキュメント単位のロックなどRDBMSと同じような機能を持つため、スキーマレス（テーブル定義を事前に決めなくてもいい）でありながらRDBMSのような使い方ができます。")]),s._v(" "),a("p",[s._v("他の特徴として、「レプリカセット」と呼ばれる仕組みで3台（奇数台）1セットの冗長構成を簡単に作れる他、「シャーディング」による負荷分散構成も簡単に構築することができます。")]),s._v(" "),a("h3",{attrs:{id:"個人的な雑感"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#個人的な雑感"}},[s._v("#")]),s._v(" 個人的な雑感")]),s._v(" "),a("p",[s._v("MongoDBはスキーマレスでありながらRDBMSのような使い方もできることから、サービス立ち上げ時に開発スピードが求められる段階において、データスキーマを含めて試行錯誤を高速に繰り返すような使われ方が話題になりました。\n現在では上記のような開発手法で利用されることは少なく、主に以下のような場面で利用されます。")]),s._v(" "),a("ul",[a("li",[s._v("IoTのセンサーデータなど、insert manyなデータの格納・検索\n"),a("ul",[a("li",[s._v("データ間のリレーションや更新の一貫性があまり求められず、更新よりもデータの追加が頻発するケース")]),s._v(" "),a("li",[s._v("書き込みが多く、write操作の負荷分散が必要になるケース")])])]),s._v(" "),a("li",[s._v("データのaggregation(集計)、地理情報などによる特殊な検索用途\n"),a("ul",[a("li",[s._v("スキーマレスを活かし、データを雑に投入して後からゴリゴリクエリを書いて集計するデータレイク的な使い方")]),s._v(" "),a("li",[s._v("地理情報(geo location)検索など特殊な検索が必要になるケース")])])])]),s._v(" "),a("p",[s._v("もちろん上記のようなケースはRDBでも可能ですし、個々の機能について言えばもっと得意なDB製品は存在します。\n一方でMongoDBは幅広いケースについて80点くらいを取れるような製品と言えます。")]),s._v(" "),a("h2",{attrs:{id:"早速使ってみよう"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#早速使ってみよう"}},[s._v("#")]),s._v(" 早速使ってみよう")]),s._v(" "),a("p",[s._v("何はともあれ使ってみましょう。"),a("code",[s._v("docker compose up -d")]),s._v("に成功していれば、以下のコマンドでMongoDBのコンソールが使えます。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ docker compose exec mongo-arbiter mongosh --port 27017 --host mongo-primary\n\nMongoDB shell version v5.0.1\nconnecting to: mongodb://mongo-primary:27017/?compressors=disabled&gssapiServiceName=mongodb\nImplicit session: session { "id" : UUID("c90c0469-9eb0-4583-bb9d-5af4b7a3f907") }\nMongoDB server version: 5.0.1\n\n~~略~~\n\ntest> \ntest> rs.initiate()\n{\n\t"info2" : "no configuration specified. Using a default configuration for the set",\n\t"me" : "edd2f8708eef:27017",\n\t"ok" : 1\n}\nmongo-set [direct: secondary] test>\nmongo-set [direct: primary] test>\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br")])]),a("p",[s._v("まずはおまじないとして"),a("code",[s._v("rs.initiate()")]),s._v("を実行しておいてください。あとで紹介します。")]),s._v(" "),a("p",[s._v("とりあえず適当なデータを作成してみましょう。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('mongo-set [direct: primary] local> use bootcamp-db\nswitched to db bootcamp-db\nmongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "tanaka-san", age: 22})\n{\n  acknowledged: true,\n  insertedId: ObjectId("64c5ccab2c5bc0ff08cb33cd")\n}\nmongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "sato-san", age: 25})\n{\n  acknowledged: true,\n  insertedId: ObjectId("64c5ccb82c5bc0ff08cb33ce")\n}\nmongo-set [direct: primary] bootcamp-db>\nmongo-set [direct: primary] bootcamp-db> db.people.find()\n[\n  {\n    _id: ObjectId("64c5ccab2c5bc0ff08cb33cd"),\n    name: \'tanaka-san\',\n    age: 22\n  },\n  {\n    _id: ObjectId("64c5ccb82c5bc0ff08cb33ce"),\n    name: \'sato-san\',\n    age: 25\n  }\n]\nmongo-set [direct: primary] bootcamp-db>\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br")])]),a("p",[s._v("RDBMSにおける「テーブル」は、MongoDBでは「collection」と呼ばれます。ここでは"),a("code",[s._v("people")]),s._v("がcollectionです。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("mongo-set [direct: primary] bootcamp-db> show collections;\npeople\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[s._v("MySQLなどのように事前に"),a("code",[s._v("CREATE TABLE...")]),s._v("などでテーブルを作成しなくても、勝手にcollectionが作成されています。\nMongoDBはスキーマレスなので、形式を問わずデータを保存できます。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('mongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "watanabe-san", age: 23, address: "tokyo"})\n{\n  acknowledged: true,\n  insertedId: ObjectId("64c5cdcc2c5bc0ff08cb33cf")\n}\nmongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "fujimoto-san", age: 23, address: {post: "123-4567", city: "tokyo"}})\n{\n  acknowledged: true,\n  insertedId: ObjectId("64c5cdd12c5bc0ff08cb33d0")\n}\nmongo-set [direct: primary] bootcamp-db> db.people.insertOne({name: "kawai-san", age: 30, address: {post: "123-9876", city: "tokyo"}})\n{\n  acknowledged: true,\n  insertedId: ObjectId("64c5cdd82c5bc0ff08cb33d1")\n}\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br")])]),a("p",[a("code",[s._v("db.people.find()")]),s._v(" してみてください。"),a("code",[s._v("people")]),s._v(" collectionの中にいろんな形式でデータが保存されています。")]),s._v(" "),a("h2",{attrs:{id:"検索と集計-aggregation"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#検索と集計-aggregation"}},[s._v("#")]),s._v(" 検索と集計(Aggregation)")]),s._v(" "),a("p",[s._v("単純な検索であれば"),a("code",[s._v("find()")]),s._v("で可能です。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('# 名前が`sato-san`なデータを検索\ndb.people.find({name: "sato-san"})\n\n# ageが23以上なデータを検索\ndb.people.find({age: {$gte: 23}})\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("p",[a("code",[s._v("$gte")]),s._v("は"),a("code",[s._v("greater than or equal")]),s._v("の略で「以上」のデータを検索します。例えばageが23「未満」なデータを検索する場合は"),a("code",[s._v("$lt")]),s._v("("),a("code",[s._v("lower than")]),s._v(")です。\n詳しくはこちら => "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/reference/operator/query-comparison/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Comparison Query Operators"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("ネストされたデータも検索できます。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('> db.people.find({"address.city": "tokyo"})\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("さらに詳しい検索や集計をする場合、強力な "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/core/aggregation-pipeline/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Aggregation"),a("OutboundLink")],1),s._v(" 機能が使えます。")]),s._v(" "),a("p",[s._v("まずは何も集計せずに検索してみましょう。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('mongo-set [direct: primary] bootcamp-db> db.people.aggregate([ { $match: {"address.city": "tokyo"} } ])\n{ "_id" : ObjectId("62e5e5265beeb8a010811279"), "name" : "fujimoto-san", "age" : 23, "address" : { "post" : "123-4567", "city" : "tokyo" } }\n{ "_id" : ObjectId("62e5e52e5beeb8a01081127a"), "name" : "kawai-san", "age" : 30, "address" : { "post" : "123-9876", "city" : "tokyo" } }\nm\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("例えばここからMySQLの"),a("code",[s._v("group by")]),s._v("と同じことをするには以下のようにします。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('db.people.aggregate([\n  { $match: {"address.city": "tokyo"} },\n  { $group: {_id: "$address.city", age_sum: {$sum: "$age"}} }\n])\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("ここでは"),a("code",[s._v("address.city")]),s._v("が"),a("code",[s._v("tokyo")]),s._v("になってる人のデータを集計し、"),a("code",[s._v("age")]),s._v("を合計して表示しています。\n年齢を合計するのもおかしいので、平均を取ってみましょう。平均を取るコマンドは"),a("code",[s._v("$avg")]),s._v("です。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('db.people.aggregate([\n  { $match: {"address.city": "tokyo"} },\n  { $group: {_id: "$address.city", age_avg: {$avg: "$age"}} }\n])\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("aggregationで使える機能はたくさんあるので、色々と試してみてください。=> "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Aggregation Pipeline Stages"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("例えば"),a("code",[s._v("$replaceRoot")]),s._v("というpipelineを使うとどうなるか試してみてください。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('db.people.aggregate([\n  { $match: {"address.city": "tokyo"} },\n  { $replaceRoot: {newRoot: "$address"} }\n])\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("他には "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/",target:"_blank",rel:"noopener noreferrer"}},[s._v("$unwind"),a("OutboundLink")],1),s._v(" も面白い機能です。")]),s._v(" "),a("h2",{attrs:{id:"レプリカセット"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#レプリカセット"}},[s._v("#")]),s._v(" レプリカセット")]),s._v(" "),a("h3",{attrs:{id:"解説"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#解説"}},[s._v("#")]),s._v(" 解説")]),s._v(" "),a("p",[s._v("MongoDBでは "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/replication/",target:"_blank",rel:"noopener noreferrer"}},[s._v("レプリカセット"),a("OutboundLink")],1),s._v(" と呼ばれる構成を奇数台（最小3台）で構成することができます。")]),s._v(" "),a("p",[s._v("(以下画像は "),a("a",{attrs:{href:"https://docs.mongodb.com/manual/replication/",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://docs.mongodb.com/manual/replication/"),a("OutboundLink")],1),s._v(" より)")]),s._v(" "),a("p",[a("img",{attrs:{src:n(376),alt:"replica-set-primary-with-two-secondaries"}})]),s._v(" "),a("p",[s._v("通常ではクライアントやアプリケーションは「Primary」になっているMongoDBに対してデータを更新します。すると更新されたデータは「Secondary」にもレプリケーションされます。\nそしてレプリカセットを構成しているMongoDBはお互いに投票処理を行い、その結果によって自動的にPrimary役が決定されます。")]),s._v(" "),a("p",[s._v("もしPrimaryが停止したりネットワーク的に分断された場合、残り2台のMongoDB同士で通信（画像のHeartbeat通信）を行い、2台による投票処理によって自動的に次のPrimaryが決定します。")]),s._v(" "),a("p",[a("img",{attrs:{src:n(377),alt:"replica-set-trigger-election"}})]),s._v(" "),a("p",[s._v("この時元々Primaryだったホストは他2台との通信ができなくなったことで、自動的にSecondaryとなり更新クエリを受け付けなくなります。")]),s._v(" "),a("h3",{attrs:{id:"ハンズオン"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ハンズオン"}},[s._v("#")]),s._v(" ハンズオン")]),s._v(" "),a("p",[s._v("実際にやってみましょう。今回用意したサンプルの"),a("code",[s._v("docker-compose.yml")]),s._v("では以下のホストを立ち上げています。")]),s._v(" "),a("ul",[a("li",[s._v("mongo-primary")]),s._v(" "),a("li",[s._v("mongo-secondary")]),s._v(" "),a("li",[s._v("mongo-arbiter")])]),s._v(" "),a("p",[s._v("この3台でレプリカセットを構築してみましょう。")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("Aribiterとは？")]),s._v(" "),a("p",[s._v("先ほどMongoDBのレプリカセットは最低3台の奇数台で構成されると説明しました。\nこれは投票処理におけるsplit brainを防ぐためですが、一方でreplicationによるデータコピーは1台で十分というケースは多々あります。\nその場合3台目に1~2台目と同じスペックのサーバを用意するのは無駄です。そこで使われるのが「投票処理しか行わない」 "),a("a",{attrs:{href:"https://www.mongodb.com/docs/manual/core/replica-set-arbiter/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Arbiter"),a("OutboundLink")],1),s._v(" というサーバです。")]),s._v(" "),a("p",[s._v("Aribiterにはデータのreplicationが行われず、データの書き込みも読み込みもできません。レプリカセットに参加しPrimaryを選出するための投票処理しか行わないため、低スペックで安いサーバに構築することが可能です。")]),s._v(" "),a("p",[s._v("ちなみにこのハンズオンでは、ArbiterのホストをMongoDB clientを起動するためのホストとしても利用しています。")])]),s._v(" "),a("p",[s._v("先ほどと同様に、mongo-arbiterホストから"),a("code",[s._v("mongo-primary")]),s._v("のコンソールに入り、レプリカセットの設定をします。\n（先程までのコンソールを使い回しても大丈夫です）")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ docker compose exec mongo-arbiter mongosh --port 27017 --host mongo-primary\nrs.reconfig( {\n   _id : "mongo-set",\n   members: [\n      { _id: 0, host: "mongo-primary:27017", priority: 2 },\n      { _id: 1, host: "mongo-secondary:27018", priority: 1 },\n      { _id: 2, host: "mongo-arbiter:27019", priority: 0 }\n   ]\n})\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("p",[s._v("以下のような結果が返ってくるはずです。")]),s._v(" "),a("div",{staticClass:"language-json line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  ok"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  '$clusterTime'"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    clusterTime"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Timestamp("),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" t"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1690685501")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" i"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(")"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    signature"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      hash"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Binary(Buffer.from("),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"0000000000000000000000000000000000000000"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"hex"')]),s._v(")"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(")"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n      keyId"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Long("),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"0"')]),s._v(")\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  operationTime"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Timestamp("),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" t"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1690685501")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" i"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(")\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br")])]),a("p",[s._v("すると残りの2台にも設定が反映され、レプリカセットが構築されます。\n新しいコンソールで以下のようにmongo-secondaryを開き、"),a("code",[s._v("rs.status()")]),s._v("を実行して設定状況を確認してみてください。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ docker compose exec mongo-arbiter mongosh --port 27018 --host mongo-secondary\n\nmongo-set [direct: secondary] test> rs.status() # 設定確認\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[a("code",[s._v('"ok" : 1')]),s._v("などでレプリカセットの正常性を確認できます。")]),s._v(" "),a("p",[s._v("以下のようにsecondaryにprimaryからデータがreplicateされていることを確認します。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("mongo-set [direct: secondary] test> use bootcamp-db\nswitched to db bootcamp-db\nmongo-set [direct: secondary] bootcamp-db> db.getMongo().setReadPref(\"primaryPreferred\")\nmongo-set [direct: secondary] bootcamp-db> db.people.find()\n[\n  {\n    _id: ObjectId(\"64c5ccab2c5bc0ff08cb33cd\"),\n    name: 'tanaka-san',\n    age: 22\n  },\n  {\n    _id: ObjectId(\"64c5ccb82c5bc0ff08cb33ce\"),\n    name: 'sato-san',\n    age: 25\n  },\n  {\n    _id: ObjectId(\"64c5cdcc2c5bc0ff08cb33cf\"),\n    name: 'watanabe-san',\n    age: 23,\n    address: 'tokyo'\n  },\n  {\n    _id: ObjectId(\"64c5cdd12c5bc0ff08cb33d0\"),\n    name: 'fujimoto-san',\n    age: 23,\n    address: { post: '123-4567', city: 'tokyo' }\n  },\n  {\n    _id: ObjectId(\"64c5cdd82c5bc0ff08cb33d1\"),\n    name: 'kawai-san',\n    age: 30,\n    address: { post: '123-9876', city: 'tokyo' }\n  }\n]\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br"),a("span",{staticClass:"line-number"},[s._v("31")]),a("br"),a("span",{staticClass:"line-number"},[s._v("32")]),a("br"),a("span",{staticClass:"line-number"},[s._v("33")]),a("br"),a("span",{staticClass:"line-number"},[s._v("34")]),a("br")])]),a("p",[s._v("最初にprimaryに登録したデータが、secondaryにも保存されていました。これはprimaryからsecandaryにデータがコピー（replicate）されているからです。")]),s._v(" "),a("p",[s._v("ここで別のターミナルを開き、PrimaryのMongoDBを落としてみましょう")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ sudo docker compose stop mongo-primary\n[sudo] password for r-fujimoto:\n[+] Stopping 1/1\n ✔ Container bootcamp-mongodb-sample-mongo-primary-1  Stopped    11.1s\n$ sudo docker compose ps\nNAME                                        IMAGE               COMMAND                  SERVICE             CREATED             STATUS              PORTS\nbootcamp-mongodb-sample-mongo-arbiter-1     mongo               "docker-entrypoint.s…"   mongo-arbiter       37 minutes ago      Up 37 minutes       27017/tcp, 0.0.0.0:27019->27019/tcp, :::27019->27019/tcp\nbootcamp-mongodb-sample-mongo-secondary-1   mongo               "docker-entrypoint.s…"   mongo-secondary     37 minutes ago      Up 37 minutes       27017/tcp, 0.0.0.0:27018->27018/tcp, :::27018->27018/tcp                                                           :::27018->27018/tcp\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("p",[s._v("するとSecondaryのプロンプトが"),a("code",[s._v("mongo-set:PRIMARY>")]),s._v("に変わるのが確認できます。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("mongo-set [direct: secondary] bootcamp-db>\nmongo-set [direct: primary] bootcamp-db>\nmongo-set [direct: primary] bootcamp-db>\nmongo-set [direct: primary] bootcamp-db>\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[a("code",[s._v("rs.status()")]),s._v("をもう一度Secondaryで叩いてみてください。先ほどとどう変わったでしょうか。")]),s._v(" "),a("p",[a("code",[s._v("rs.status()")]),s._v("が確認できたら、Primaryを起動してみましょう。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ sudo docker compose start mongo-primary\n[+] Running 1/1\n ✔ Container bootcamp-mongodb-sample-mongo-primary-1  Started                                                                    0.3s\n~/w/b/t/bootcamp-mongodb-sample (main|✔) $\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("するとsecondaryが再度secondaryに戻ります。")]),s._v(" "),a("div",{staticClass:"language-terminal line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("mongo-set [direct: primary] bootcamp-db>\n\nmongo-set [direct: primary] bootcamp-db>\n\nmongo-set [direct: primary] bootcamp-db>\n\nmongo-set [direct: secondary] bootcamp-db>\n\nmongo-set [direct: secondary] bootcamp-db>\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("p",[s._v("これは"),a("code",[s._v("rs.reconfig()")]),s._v("で設定した"),a("code",[s._v("priority")]),s._v("というパラメータに従い、より値の大きいホストがPrimaryになるように設定されているためです。")]),s._v(" "),a("p",[s._v("このようにMongoDBのレプリカセットでは、一台が落ちても自動的に他がPrimaryに昇格し、データの保存を継続できる構成を簡単に作ることができます。")]),s._v(" "),a("credit-footer")],1)}),[],!1,null,null,null);a.default=t.exports}}]);