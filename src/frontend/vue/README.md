---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: フロントエンド開発フレームワークであるVue.jsで簡単なアプリケーションを作ってみます。
time: 1h
prior_knowledge: JavaScript, HTML, DOM
---

<header-table/>

# Vue.js を触ってみよう

## 事前準備

- HTML, javascriptを書くためのエディタを用意してください。
- 好きなブラウザを開き、開発者ツールが使える状態にしてください。

## Vue.js とは

公式サイト: [https://jp.vuejs.org/](https://jp.vuejs.org/)

2014年頃に登場したJavaScriptフレームワークです。軽量さと導入しやすさが主眼に置かれており、他のライブラリと組み合わせたり既存のアプリケーションに追加で導入するのも容易に作られています。

開発者のエヴァンさんはAngularJSの開発に関わった人で、Angularの本当に好きだった部分を抽出したかったそうです。

特徴としては

- view(JavaScriptとHTMLの紐付け)部分中心のフレームワーク
  - routerや状態管理など、SPAを構築するのに必須な機能は公式が出してる周辺ライブラリとして導入する
  - HTTPリクエストなども外部ライブラリ（今だとfetch APIを使いそう）
- SPAみたいな大規模なだけでなく、HTMLを少し動的にしたいような用途でも導入できる
  - 今回のハンズオンでやるのはこれ
- ファイルサイズが軽量
- VirtualDOM による高速なレンダリング
- component 指向
- [公式ドキュメント](https://jp.vuejs.org/v2/guide/index.html)が親切で充実している
- vue-routerやvue-cliなど準公式ライブラリが充実している

「公式ドキュメントが親切」というと曖昧な言い方ですが、かなり初期から日本語ドキュメントが充実していたり、書き方も全体的にとっつきやすいように作られています。

[https://jp.vuejs.org/v2/guide/index.html](https://jp.vuejs.org/v2/guide/index.html)

導入可能な幅が広く、小さなwebページにとりあえず導入するような使い方から、vue-cliなどを用いた本格的なSPAの構築まで幅広く利用可能です。

反面大規模なアプリケーションを構築する場合は、きちんと設計を行わないと生産性が低くなりがちです。

またSSR(サーバサイドレンダリング)用の[NuxtJS](https://ja.nuxtjs.org/guide/)も人気です。

## First Step...の前に

vueを使ってみる前に、まずはvueなしのJavaScriptでHTMLを操作するとどんな感じなのか、体験してみましょう。

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>iij-bootcample Vue.js</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  ここにメッセージ↓
  <div id="app">
  </div>

  <script type="text/javascript">
    const message = 'Welcome to iij-bootcamp!!';

    const elem = document.getElementById('app');
    elem.innerText = message;
  </script>
</body>
</html>
```

「ここにメッセージ↓」の下にJavaScriptで文字列を追加している簡単なコードです。
`document.getElementById('app')` はhtmlの中から`id`が`app`は要素を取得するJavaScriptの機能です。

この例にある`elem`のようなオブジェクトをDOM要素(element)だったり、HTML要素などと呼びます。

次はもう少し複雑な例を

```html
<!doctype html>
<html lang="ja">

<head>
  <meta charset="utf-8">
  <title>iij-bootcample Vue.js</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
  ここにメッセージ↓
  <div id="app">{{ message }}</div>

  <table id="people_table" border="1">
    <tr>
      <th>id</th>
      <th>name</th>
    </tr>
  </table>

  <script type="text/javascript">
    const message = "Welcome to iij-bootcamp!!";

    const elem = document.getElementById("app");
    elem.innerText = message;

    const peoples = [
      { id: 1, name: 'taro' },
      { id: 2, name: 'jiro' },
      { id: 3, name: 'saburo' }
    ];
    const table = document.getElementById("people_table");
    peoples.forEach(people => {
      const tr = document.createElement("tr");
      const idTd = document.createElement("td");
      const nameTd = document.createElement("td");

      idTd.innerText = people.id;
      nameTd.innerText = people.name;

      tr.appendChild(idTd);
      tr.appendChild(nameTd);

      table.appendChild(tr);
    });
  </script>
</body>

</html>
```

これは`peoples`という配列の中の値をJavaScriptでテーブルに追加する例です。ちょっと面倒になってきましたね。
`document.createElement("tr")`はHTMLの`tr`要素を作成します。`td`も同様に作成し、`appendChild`で子要素として追加します。

このようにhtmlのDOMにJavaScriptからアクセスし、DOM要素を操作することでhtmlを書き換えるのが基本になります。

## First Step

JavaScriptでDOM操作がなんとなくできたところで、Vue.jsを導入するとどうなるかやってみましょう。
以下のようなファイルを作ってブラウザでアクセスしてみてください。

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>iij-bootcample Vue.js</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>

  <script type="text/javascript">
    const app = new Vue({
      el: '#app',
      data: {
        message: 'Welcome to iij-bootcamp!!'
      }
    })
  </script>
</body>
</html>
```

`Welcome to iij-bootcamp!!`と表示されたでしょうか。これは一番最初の例と同じことをvueで行っています。

vueでは`new Vue()`の宣言時に`data`の変数や`el`で紐付けるHTML要素、その他メソッドなどを宣言的に記述して行きます。ここでは単に文字列を表示しているだけですが、表示内容はリアルタイムに（リアクティブに）変更可能です。javascript部分を以下のように変更してみてください。

```javascript
const app = new Vue({
  el: '#app',
  data: {
    message: 'Welcome to iij-bootcamp!!'
  }
})

setTimeout(function() {
  app.message = "message changed"
}, 5000)
```

これは画面が表示されてから５秒後に`app.message`の内容を変更するコードです。JavaScriptの変数に代入するだけで画面が自動的に更新されたのが分かると思います。このようにVueはVue Objectの中の変数の変更を検知して、それを自動的に画面に反映してくれます。

## ディレクティブ

ディレクティブとは、HTML要素の中に書けるvue独自の機能です。具体例を見てみましょう。
`body` タグの中身を以下のようにしてみてください。

```html
<div id="app">
  <span v-bind:style="{color: activeColor}">{{ message }}</span>

  <div v-if="activeColor === 'red'">赤です</div>
  <div v-if="activeColor === 'green'">緑です</div>
  <div v-if="activeColor === 'blue'">青です</div>
</div>

<script type="text/javascript">
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!',
      activeColor: 'black'
    }
  })

  setTimeout(() => {
    app.activeColor = 'red';
  }, 5000)

  setTimeout(() => {
    app.activeColor = 'green';
  }, 8000)

  setTimeout(() => {
    app.activeColor = 'blue';
  }, 11000)
</script>
```

指定した秒数ごとに色が変わりつつ、メッセージも変化したと思います。

上のコードでは`v-bind`と`v-if`の２種類、ディレクティブを使っています。

`v-bind`は`:`の後にHTMLの属性名を書くことで、その属性を動的に変更できるディレクティブです
（試しに`v-bind`を使わず`style="color: activeColor"`のように`style`属性に直接指定するとどうなるか試してみてください）。

`v-if`は非常によく使うディレクティブで、条件式の中身が`true`な場合のみ要素を表示してくれます。

このようにディレクティブを使うことで、リアルタイムな画面の表示切り替えをシンプルなコードで実現できます。

他に非常によく使うディレクティブとして、繰り返しを行う`v-for`があります。

```html
<div id="app">
  <span>{{ message }}</span>

  <table border="1">
    <tr>
      <th>id</th>
      <th>name</th>
    </tr>
    <tr v-for="people in peoples">
      <td>{{ people.id }}</td>
      <td>{{ people.name }}</td>
    </tr>
  </table>
</div>

<script type="text/javascript">
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!',
      peoples: [
        { id: 1, name: 'taro' },
        { id: 2, name: 'jiro' },
        { id: 3, name: 'saburo' }
      ]
    }
  })
</script>
```

これは最初にやったテーブルの例と同じことをvueでやってます。
このコードでは`tr`要素とその中身が`peoples`の長さだけ繰り返されます。先ほどと違ってJavaScriptでforを回さなくても、HTML側にわかりやすく記述することができます。
(shiroやgoroも足してあげてみてください)

## 入力を処理する

ユーザーがボタンを押したり、入力欄に何かを入力した時の処理を書いてみましょう。まずはボタンを押した時です。

```html
<div id="app">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>

<script type="text/javascript">
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!'
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
      }
    }
  })
</script>
```

`methods`という新しいプロパティが出てきました。Vue ではこのようにインスタンス(`app`)内で使用するメソッドを定義できます。

`v-on`は要素にイベントハンドラを追加するディレクティブです。つまりこの`button`要素をクリックした時に`reverseMessage`メソッドが呼ばれるように定義しています。`reverseMessage`が呼ばれると関数が`message`変数を書き換えます。`message`変数を書き換えると、Vue が勝手に変更を検知してDOMを書き換えてくれます。

ユーザーの入力を変数に反映するには`v-model`ディレクティブが便利です。

```html
<div id="app">
  <p>{{ message }}</p>
  <input v-model="message">
</div>

<script type="text/javascript">
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!'
    }
  })
</script>
```

入力欄を変更すると内容がリアルタイムに反映されます。ちなみに`HTML => 変数`と`変数 => HTML`の両方の変更が反映される機能を「双方向バインディング」と呼びます。

## サーバーからデータを取得する

Vue の使い方がだいたい分かったところで、サーバーからデータを取得して画面に反映してみましょう。Vue 自体にはajax通信をサポートする機能は含まれていないため、fetch APIを使ってみましょう。

取得するデータは以下のURLにあるjsonです。

[https://raw.githubusercontent.com/iij/bootcamp/master/test.json](https://raw.githubusercontent.com/iij/bootcamp/master/test.json)

```html
<div id="app">
  <div>{{ message }}</div>

  <button v-on:click="loadData">load data</button>

  <table border="1">
    <tr>
      <th>id</th>
      <th>name</th>
    </tr>
    <tr v-for="people in peoples">
      <td>{{ people.id }}</td>
      <td>{{ people.name }}</td>
    </tr>
  </table>
</div>

<script type="text/javascript">
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!',
      peoples: []
    },
    methods: {
      loadData: function () {
        const self = this;

        fetch('https://raw.githubusercontent.com/iij/bootcamp/master/test.json')
          .then(res => {
            return res.json();
          })
          .then(data => {
            console.log(data);
            self.peoples = data;
          });
      }
    }
  })
</script>
```

これまで出てきた要素が色々使われています。これで無事ボタンを押すとデータをロードして表示するアプリが作れました。

（データを読み込む前からテーブルのヘッダーが表示されているのがカッコ悪いですね。データを読み込むまではヘッダーを表示しないように修正してみてください。）

## コンポーネントを使う

これまで作ってきたVueアプリはごく小さいものであれば十分便利に使えます。しかしある程度の規模のアプリになってくるとコードのメンテナンスが大変になってきます。

そこでVueではコンポーネントと呼ばれる単位でアプリケーションを作れる機能があります。試しに上のコードからテーブル部分を分離するコンポーネントを作ってみましょう。`body`の中身を以下のように変更してください。

```html
<div id="app">
  <div>{{ message }}</div>

  <button v-on:click="loadData">load data</button>

  <people-table v-bind:peoples="peoples"></people-table>
</div>

<script type="text/javascript">
  Vue.component('people-table', {
    props: ['peoples'],
    template: `
<table border="1">
  <tr>
    <th>id</th>
    <th>name</th>
  </tr>
  <tr v-for="people in peoples">
    <td>{{ people.id }}</td>
    <td>{{ people.name }}</td>
  </tr>
</table>
`
  });
</script>

<script type="text/javascript">
  const app = new Vue({
    el: '#app',
    data: {
      message: 'Welcome to iij-bootcamp!!',
      peoples: []
    },
    methods: {
      loadData: function () {
        const self = this;

        fetch('https://raw.githubusercontent.com/iij/bootcamp/master/test.json')
          .then(res => {
            return res.json();
          })
          .then(data => {
            console.log(data);
            self.peoples = data;
          });
      }
    }
  })
</script>
```

ここでは1個目の`script`タグで`people-table`というコンポーネントを定義しています。コンポーネントは`template`というプロパティがあるのが特徴で、ここにコンポーネント内に表示したいHTMLを記述します。

さらにpropsでこのコンポーネントのインプットを定義しています。今回の`people-table`は、peoplesという変数で配列を受け取り、それをテーブルとして表示するコンポーネントです。

このようにアプリケーションをコンポーネントと呼ばれる小さな単位に分割していくとで、１つ１つのコンポーネントをシンプルに保ちつつ、アプリケーション全体を構築していくことが可能です。

<credit-footer/>
