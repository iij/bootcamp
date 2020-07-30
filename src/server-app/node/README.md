---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Node.jsを使ったアプリケーション開発のハンズオンです
time: 1h
prior_knowledge: JavaScript
---

<header-table/>

# Node.jsでWebアプリを作る

## 下準備

### dockerコンテナの立ち上げ方

以下のコマンドでdockerコンテナを立ち上げてログインしてください。

```bash
$ docker run --name bootcamp-node --rm -it regunorf/bootcamp-node bash
```

同じdockerコンテナに複数のターミナルを接続するには以下のようにします。

```bash
$ docker exec -it bootcamp-node bash
```

ハンズオンでは同じコンテナに複数ターミナルでログインしていることを前提に記述している部分があるので、上記のように複数ターミナルを開いておいてください。

## Node.js とは

Node.js はサーバサイドで動作するJavaScriptのエンジンです。従来ブラウザ上でWebページを動的に動かすために使われていたJavaScriptを、ブラウザ上だけでなくサーバ上でも動かすためNode.jsなどが生まれました。

ブラウザ以外で動作するJavaScriptの実装としてはほかにもRhinoなどがあります。
最近ではTypeScriptがそのまま動作する [Deno](https://github.com/denoland/deno) も登場しています。

Node.jsの特徴としては、何よりもまず実装全体がイベント駆動で動作するという点です。これを説明するにはまずC10K問題から話をする必要があります。少し長くなりますが、Node.jsの立ち位置を知るためには必要なので簡単に解説します。

### C10K 問題

Webサーバーは当然の事ながらたくさんのユーザーからのアクセスに答えて、HTMLを返したりサーバーサイドのプログラム（C言語やJavaやRubyなどで書かれた）を動かしてレスポンスを返す必要があります。その際に１つ１つ順番に処理していたのではキリがないため、たくさんのアクセスを並列に処理する必要があります。

プログラムを並列に動かすやり方はいくつかありますが、たとえばApacheではスレッド・プロセスベースの並列処理が主要でした。
1つのリクエストに対してOSのプロセスを立ち上げ、それぞれのプロセスで別々のプログラムを動かすことで大量のリクエストをさばくことができます。
しかし1つのサーバ上で起動できるプロセスの数には限度があります。そのためたとえば1万人の同時リクエストを1台のサーバで（処理能力に余裕があったとしても）さばけないのが問題となりました。
プロセスを起動すること自体のオーバーヘッドも無視できません。

インターネットが普及して利用者が増えたことや、IoTなど大量の小さなデータを送信する機会が増えたことで、より効率の良い方法が求められました。

### イベント駆動

C10K 問題に対してNode.jsは「イベントループ」と「ノンブロッキングI/O」の２つの仕様で解決しています。下の図はイベントループとノンブロッキングI/Oを組み合わせたNode.jsにおける並行処理の概念図です。

![イベントループ](./event-loop.png "イベントループ")

まずNode.jsは基本的にシングルスレッドで動作します。Node.jsは動作中常にイベントループと呼ばれる無限ループで「diskへの書き込みが終わった」「リクエストを受けとった」のようなイベントの発生を監視しています。そして検知したイベントに対して指定されたcallback関数を実行します。

このようにイベントの発生に対して処理を行うプログラムを「イベント駆動型」と呼びます。

またNode.jsにおいて、diskへの書き込みやネットワークアクセスなど時間のかかる処理は全て非同期に実行されます。つまりdiskへの書き込みを始めた時点でプログラムは他の処理を始め、書き込みが行われている間別の処理を実行します。
そして「書き込みが完了した」というイベントが発生すると続きの処理を行います。

この非同期な処理はノンブロッキングIOと呼ばれます。

このようにNode.jsは「イベントループ」と「ノンブロッキングI/O」の２つによってシングルスレッドで多くのリクエストを並行して処理することで、C10K問題におけるスレッドの割り当てコストを解決しています。

ただし逆に気をつけないといけない点は、Node.jsはシングルスレッドで動作するため、CPUを多く使うような重たい処理を行うとアプリケーション全体が遅くなってしまうことです。
その点スレッドプログラミングでは、あるスレッドがどれだけ重くなっても他のスレッドには影響がないためアプリケーション全体のパフォーマンスが落ちることはありません。

## first step

まずは簡単なWebサーバを作ってみましょう。

下準備で立ち上げたdockerに入り、`bootcamp-node`というディレクトリを作成してください。
そしてそのディレクトリ内に以下のファイルを`app.js`という名前で作成してください。

```
mkdir bootcamp-node
cd bootcamp-node/
vi app.js
```

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

ファイルを作成したら以下のコマンドでサーバーを起動します。

```bash
$ node app.js
```

`Server running at http://127.0.0.1:3000/`というメッセージが表示されれば無事にサーバーが立ち上がっています。curlコマンドでリクエストを投げてみましょう。`Hello World` が表示されたはずです。

```bash
$ curl http://127.0.0.1:3000/
Hello World
```

### 簡単な解説

この短いコードでもNode.jsの特徴が出ています。コード中の

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
```

の部分は`createServer`というメソッドにcallbackとして無名関数を渡すことで、リクエストが来た際の動作を定義します。今回は`Hello World`という文字列を返すようにしました。

このようにNode.jsでは基本的にcallback関数を指定することでサーバーの挙動を定義して行きます。

## NPM

もう少し複雑なサーバーを作りたいところですが、素のNode.jsだと色々と機能が足りないので`express`という定番ライブラリを導入します。`express`はWebサーバーを作る際の基本的な機能を提供してくれる他、pluginとして様々な機能を組み合わせることができます。

Node.jsで追加ライブラリを導入するには`NPM (node package manager)`と呼ばれるパッケージマネージャを使います。npmはNode.jsをインストールすると自動的に追加されます。

まずは`bootcamp-node`ディレクトリ以下で`init`コマンドを実行し、npmで管理するアプリケーションの定義を作成しましょう。

```bash
$ npm init
```

色々聞かれますが全てenterで構いません。最後まで行くと`package.json`というファイルが作成されます。
npmはパッケージマネージャですが、このようにアプリケーションのメインファイルを指定したり`npm script`と呼ばれるコマンドを登録できるなど、Node.jsアプリケーション全体の管理もしてくれます。

以下のコマンドでアプリケーションに`express`を追加してみましょう。

必要であればプロキシを設定してください。

```
npm -g config set proxy http://proxy.iiji.jp:8080
npm -g config set https-proxy http://proxy.iiji.jp:8080
```

```bash
$ npm install express
```

すると`node_modules`というディレクトリ内に`express`と`express`が依存するライブラリの本体がダウンロードされ、アプリケーションから使えるようになります。

また`package.json`を見ると`dependencies`に`express`が追加されているのが分かります。このように依存するライブラリが`package.json`で一元管理されるため、他の場所でアプリケーションを動かそうとする場合に依存ライブラリを簡単に導入することができます。

npmの詳しい使い方は「npm 入門」などで検索したサイトなどを見てみてください（[公式のドキュメント](https://docs.npmjs.com/cli-documentation/)は非常に分かりにくいです・・・）。

## express アプリケーションの作成

npmでexpressを導入できたので、簡単なアプリケーションを作成してみましょう。`express.js`という名前で以下のようなファイルを作成してください。

```javascript
const express = require('express');
const app = express();

app.get('/bootcamp1', (req, res) => {
  res.send('BOOTCAMP 1\n');
});

app.get('/bootcamp2', (req, res) => {
  res.send('BOOTCAMP 2\n');
});

app.post('/create', (req, res) => {
  res.send('Create Bootcamp\n');
});

app.listen(3000);
```

修正したら先ほどと同じように`node express.js`で起動しましょう。今度はアクセスするパスやメソッドによって実行されるcallback関数が変わります。

```bash
$ curl 127.0.0.1:3000/bootcamp1
BOOTCAMP 1
$ curl 127.0.0.1:3000/bootcamp2
BOOTCAMP 2
$ curl -X POST 127.0.0.1:3000/create
Create Bootcamp
```

さきほどよりも少ないコードで多くの機能が実現できました。expressは人気のフレームワークで様々なプラグインやラップしたフレームワークが作られています。
もし興味があれば調べてみてください。

## データベースアクセス

最後にデータベースへのアクセスを実現してみましょう。データベースにはMongoDBを使用してみます。
（最近はあまり言われませんが、かつてはMongoDB・Express・AngularJS・Node.jsを合わせて「MEANスタック」と呼ばれたりしていました。）

事前準備で作られたvagrantやdockerコンテナにはmongodbが既にinstallされています。以下のコマンドでMongoDBを起動してください。

```bash
$ service mongodb start
```

node.jsからMongoDBにアクセスするために`mongoose`というライブラリを使います。
先ほどと同じようにnpmでインストールしましょう。ついでにjsonをパースするための`body-parser`も追加します。

```bash
$ npm install mongoose body-parser
```

今回は`peoples`というテーブルに`_id`と`name`属性をもつドキュメントを作成し、その一覧を取得するAPIを作ってみます。

まずはmongooseを使うためにmodelの定義を行います。以下の内容を`model.js`として作成してください。

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Peopleの定義
const People = new Schema({
  name: { type: String, require: true }
});

// MongoDBへの接続
mongoose.connect('mongodb://127.0.0.1:27017/bootcamp', { useNewUrlParser: true });

// モデルをエクスポート
exports.People = mongoose.model('People', People);
```

次に`mongo.js`を以下のように作成してAPIを定義しましょう。

```javascript
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const model = require('./model');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/peoples', (req, res) => {
  model.People.find((err, peoples) => {
    if(err)
      res.send(err);
    res.json(peoples);
  });
});

app.post('/peoples', (req, res) => {
  const people = new model.People();

  people.name = req.body.name;

  people.save(err => {
    if (err)
      res.send(err);
    res.json({ message: 'created!\n' });
  });
});

app.listen(3000);
```

`node mongo.js`でサーバーを起動してください。そして別のウィンドウから以下のようにcurlでリクエストを投げることができます。

`name=Alice`なデータを作成
```bash
$ curl -X POST -H 'Content-Type:application/json' -d '{"name": "Alice"}' 127.0.0.1:3000/peoples

{"message":"created!"}
```

一覧で取得
```bash
$ curl 127.0.0.1:3000/peoples

[{"_id":"5cf3f435a47f5c0cdb9023a6","name":"Alice","__v":0}]
```

## 最後に

ここまで簡単なNode.jsを使ったAPIサーバーの実装を行ってみました。なんとなくNode.jsのやり方が掴めたでしょうか。

ただし実際のプロダクトで使用する場合は、TypeScriptを使って開発したりAPIのcallback関数を別ファイルにする、ロギングの仕組みを整えるなど様々なことを考える必要があります。

今回の内容は本当に基礎的なものでしかないため、もし興味があれば様々なフレームワークや実装例を調べてみてください。

<credit-footer/>
