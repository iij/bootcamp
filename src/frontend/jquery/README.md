---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: JavaScriptライブラリであるjQueryを通してHTMLのDOM操作などについて学びます。
time: 1h
prior_knowledge: JavaScript
---

<header-table/>

# jQueryを触ってみよう

## 事前準備

この講義ではコマンドライン（シェル）操作は必須ではありません。

このハンズオンでは、以下のような操作を行います。

- 手元で HTML, JavaScript ファイルを作成、編集する
- その HTML ファイルをブラウザから以下のような URL で開く
    - file:///ローカルのパス/iij-bootcamp-jquery/index.html
- ブラウザの開発者ツールでDOMツリーの表示、コンソールからの操作を行う

これらの操作を行えればよいので、特別な準備は必要ありません。

ブラウザも自由ですが、最新版の Firefox または Chrome の利用を想定して解説する予定です。

## 1章：作業用ディレクトリを作成しよう

デスクトップ上でもどこでもよいので、次のようなディレクトリと以下のファイルを作成してください。

### ディレクトリ構造

```
iij-bootcamp-jquery/
├── index.html
└── study.js
```

### index.html の中身

```
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>iij-bootcamp jQuery</title>
  <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
  <script src="study.js"></script>
</head>
<body>
  <header id="page-header">
    <h1 id="heading">Welcome to iij-bootcamp!</h1>
    <p class="lead">JavaScriptと開発者ツールを使ってみよう！</p>
    <p class="description">このハンズオンでは jQuery を使いながら、HTML, CSS, JavaScript とブラウザの開発者ツールの使い方を覚えていきます。</p>
  </header>
  <main id="page-main">
    <p>1章：JavaScript を読み込む（開発者ツールのコンソールを確認しよう）</p>
  </main>
</body>
</html>
```

#### study.js の中身

```
(function($) {
  'use strict';

  alert('study.js を呼び出した（コンソールを開いてください）');

  console.log('console.log は開発者ツールのコンソール欄に出力される');
  console.log(['apple', 'orange', 'peach'], 'hoge', 123, {'border': '1px solid red'}, 'console.log の引数は何個でも書ける');
  console.log('jQuery のバージョンは %c%s%c です', 'color: red; background: #ff0;', $.fn.jquery, '');
  console.log('object や function の値をデバッグ出力をしたいときに、console.log だと文字列になってしまう場合は console.dir を使う');
  console.log($);
  console.dir($);
}(jQuery))
```

ブラウザ上で開発者ツールを起動（表示）できたでしょうか。もしウィンドウの横に表示されている場合は、ウィンドウの下部に表示した方が良いかもしれません。開発者ツールを別ウィンドウで表示しても構いませんが、コンソールがある程度広く表示されるようにしておいてください。

コンソール出力の結果は、Chrome よりも Firefox の方が使いやすいかもしれません（Firefox では `console.log` の出力結果が `console.dir` と同じように扱えます）。

余談ですが `console.log` はフォーマット指定に対応しています。第1引数に `%s` など置換文字列を含む値を渡すと、他の言語でサポートされている `printf` のように機能します。

### この講義での HTML と JS について

この講義では「DOM を操作してみる」「jQuery を使ってみる」ことを目的にしています。

JavaScript の文法やコーディングパターンを解説するつもりはありませんが、この資料では、筆者が適当にサンプルコードを書いて用意しています。

- JavaScript ファイル冒頭の即時関数 `(function($) { ... }(jQuery))` という書き方や `'use strict';` は必須なものではありません。
- 以後のサンプルコードでは、変数宣言には `const` や `let` を使わず `var` を使うことにします。
- HTML は XHTML5 で記述し、HTML ファイル中では `study.js` を body 要素の末尾ではなく head 要素内で読み込んでいます。このあたりは筆者の好みです。
- ファイルの文字コードは UTF-8 を前提にしています。改行コードは指定していませんが CR+LF よりも LF を推奨します。

講義では本筋ではないので説明を割愛しますが、こうした細かい部分の意味や違いについて気になった方は質問してもらっても構いません。

### 1章：まとめ

作成した index.html をブラウザで開いてみてください。

Firefox や Chrome を起動して、index.html ファイルをドラッグすれば `file:///ローカルのパス/iij-bootcamp-jquery/index.html` のような URL でページが開かれると思います。

`alert` によるポップアップが表示されれば成功です。ブラウザの開発者ツールを開いてみましょう。

開発者ツールは、Windows であれば `Ctrl + Shift + C`、Mac であれば `Command + Shift + C` などでブラウザ内に表示されます。開発者ツールには、

- 「インスペクター(Elements)」
- 「コンソール(Console)」
- 「ネットワーク...」

などのタブが表示されると思いますが、この講義では「インスペクター(Elements)」と「コンソール(Console)」しか使いません。

コンソールに `study.js` で記述したデバッグ出力の内容が表示されていることが確認できたら、次の章に進みましょう。

## 2章：jQuery とは何か

jQuery（ジェイクエリー）です。"JQuery" でも "Jquery" でもありません。

2006年頃に登場した JavaScript のライブラリです。

フレームワークという言葉とライブラリという言葉の使い分けについて、一般のプログラミング言語がどうかはわかりませんが JavaScript ではあまり区別されていない印象があります。筆者の個人的な感覚では（MVC / MVVM 等の）Webアプリケーションを構築するための構造的な機能を提供しているものをフレームワークと呼び、それ以外はライブラリと呼ぶのが分かりやすいと思っています。ここでは jQuery はライブラリと呼ぶことにします。

現在では JavaScript の（MVC / MVVM 等の）フレームワークとして Angular や React, Vue.js が有名で、一昔前は Backbone.js や Underscore.js がありました（これ以外にもいくつもありますが）。

- （MVC / MVVM 等の）フロントエンド Web アプリケーションフレームワーク
    - Angular, React, Vue.js
    - Backbone.js
- ユーティリティ関数 / ヘルパー関数を提供するライブラリ
    - Underscore.js
- DOM を操作する（DOM Manipulator）ライブラリ
    - jQuery
    - prototype.js

jQuery は DOM Manipulator です。DOM を操作することを目的としたライブラリとして登場しました。また、jQuery ではユーティリティ関数もいくつか提供されています。

jQuery は React などのフレームワークとは目的が違うライブラリです。「2019年にもなって jQuery を使うのはどうなのか？」という発言を巷で見かけますが、jQuery を使うことが不適切だというわけではありません。

Webサイトを JavaScript を利用してWebアプリケーションとして構築したいというような場合には jQuery では力不足でしょう。そういう場面では Angular や React, Vue.js などのフレームワークを使うことを検討すべきかもしれません。

しかし、Webページにちょっとしたスクリプトを書いて処理をさせたい、DOM を操作したいというだけであれば、ライブラリとして jQuery を採用するのは選択肢として悪くない判断です。

現在ではネイティブの JavaScript DOM API の実装が充実してきているのでネイティブのメソッドだけでも比較的簡単にコードが書けますが、第二次ブラウザ戦争（詳しくは [フロントエンド Overview](/frontend/overview) の資料を参照）の時代以前はネイティブの API だけでは不便であったり、ブラウザ間で使える API に違いがあったりしました。

jQuery が登場したことで何が便利になったのかを理解するために、ブラウザがコンテンツを表示するまでの仕組みと DOM について確認していきましょう。

## 3章：DOM とは何か

DOM（ドム）とは、Document Object Model の略で、HTML で表現されているデータを、ブラウザ内部で表現するためのデータモデルです。ツリー構造で表現されるため DOM ツリーと呼ばれることもあります。

普段、Webブラウザで表示しているページは HTML ソースコードでできている「HTML ページ」です。

ブラウザは、HTML ソースコードを受け取ると、次のような順序で処理を行ってコンテンツを逐次表示しています。

- (1) HTML ソースコードの解析（パース）を開始する。
- (2) 解析した順に DOM ツリーを構築する。
- (3) 画像や CSS, JS ファイルなどリソース読み込みをするものがあれば、そのリソースの取得を開始する。
- (4) 同期読み込みリソースであれば、読み込みが完了するまで HTML の解析処理を止める。非同期読み込みリソースであれば、HTML の解析を進めながらリソースの読み込みを行う。
    - リソースの読み込みが完了したら、CSS や JS であればスタイルの適用、スクリプトの実行を行う。画像であれば表示処理を行う。
- (5) HTML ソースコードを最後まで解析したら、DOM の構築を完了する。
- (6) HTML ソースコードにあるリソースの取得が全て完了したら、ページの読み込みを完了する。

次の HTML を例に見ていきましょう。

### index.html を書いてみる

index.html に以下の内容を書いてみてください。

```
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>What is DOM?</title>
  <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
</head>
<body>
  <ul class="animals">
    <li class="alice"><img src="https://placekitten.com/300/150" alt="Alice" /></li>
    <li class="bob"><img src="https://placekitten.com/300/160" alt="Bob" /></li>
    <li class="carol"><img src="https://placekitten.com/300/180" alt="Carol" /></li>
  </ul>
  <script src="study.js"></script>
  <p class="message">Cats are Cute!</p>
</body>
</html>
```

このような HTML があったとき、最終的には次のような DOM ツリーが構築されます。

ツリーであるというのは、ある要素（ノード）が唯一の親を持つような、親子関係があるということです。DOM ツリーの頂点は常に Document というノードになり、その下に HTML の要素が DOM としてぶらさがっています。

```
[Document]
  └ [HTML]{lang: "ja"}
      ├ [HEAD]
      │  ├ [META]{charset: "utf-8"}
      │  ├ [TITLE]
      │  │  └ (TEXT) "What is DOM?"
      │  └ [SCRIPT]{src: ".../jquery-3.4.1.js", ...}
      └ [BODY]
          ├ [UL]{class: "animals"}
          │  ├ [LI]{class: "alice"}
          │  │  └ [IMG]{src: ".../300/150", alt: "Alice"}
          │  ├ [LI]{class: "bob"}
          │  │  └ [IMG]{src: ".../300/160", alt: "Bob"}
          │  └ [LI]{class: "carol"}
          │      └ [IMG]{src: ".../300/180", alt: "Carol"}
          ├ [SCRIPT]{src: "study.js"}
          └ [P]{class: "message"}
              └ (TEXT) "Cats are Cute!"
```

上記の HTML では、`study.js` の記述位置を `ul` 要素の後に書いています。

### study.js を書いてみる

この HTML の情報を `study.js` から取得してみましょう。JavaScript では DOM API メソッドを用いて、構築された DOM ツリーにアクセスすることができます。

試しに、2つの簡単な処理を行ってみます。

- animals_info 関数
    - `class="animals"` である `ul` 要素に含まれるリストアイテムの数を出力する
- message_info 関数
    - `class="message"` である要素のテキストを出力する

`class 属性値` にマッチする要素は1個であるという前提で以下のようなコードを書いてみます。

```
(function() {
  'use strict';

  section3_works();

  function section3_works() {
    console.log(animals_info());
    console.log(message_info());

    function animals_info() {
      var ul = document.getElementsByClassName('animals')[0];
      if (ul == null) return 'class="animals" の要素が見つかりません';
      var li_elems = ul.getElementsByTagName('li');
      if (li_elems == null) return 'li 要素が見つかりません';
      return '動物の画像は ' + li_elems.length + ' 枚あります';
    }

    function message_info() {
      var p = document.getElementsByClassName('message')[0];
      if (p == null) return 'class="message" の要素が見つかりません';
      return 'メッセージは "' + p.textContent + '" です';
    }
  }
}());
```

この状態で index.html をブラウザで表示して、コンソールを開くと何が出力されるでしょうか。

### 3章：まとめ

コンソールには、

```
動物の画像は 3 枚あります
class="message" の要素が見つかりません
```

と表示されるはずです。`animals_info` の方は期待通り動きましたが、`message_info` の方はメッセージを取得することに失敗してしまいました。

この原因と仕組みを次の章で確認していきます。

## 4章：イベント処理とは何か

3章の study.js では、メッセージの取得に失敗してしまいました。`class="message"` の綴りを間違えたりしているわけでもありません。

もう一度、ブラウザの内部処理の流れを確認してみましょう。

- (1) HTML ソースコードの解析（パース）を開始する。
- (2) 解析した順に DOM ツリーを構築する。
- (3) 画像や CSS, JS ファイルなどリソース読み込みをするものがあれば、そのリソースの取得を開始する。
- (4) 同期読み込みリソースであれば、読み込みが完了するまで HTML の解析処理を止める。非同期読み込みリソースであれば、HTML の解析を進めながらリソースの読み込みを行う。
    - リソースの読み込みが完了したら、CSS や JS であればスタイルの適用、スクリプトの実行を行う。画像であれば表示処理を行う。
- (5) HTML ソースコードを最後まで解析したら、DOM の構築を完了する。
- (6) HTML ソースコードにあるリソースの取得が全て完了したら、ページの読み込みを完了する。

この (2) の動作がここでは重要です。3章で書いた HTML では、`<script src="study.js"></script>` を記述している箇所が `<p class="message">Cats are Cute!</p>` よりも手前です。

つまり、study.js のリソースを取得して実行したタイミングでは、DOM ツリーには `<p class="message">Cats are Cute!</p>` が追加されていません。`<script src="study.js"></script>` の解析をした時点で構築できている DOM ツリーを対象に処理を実行したため、それ以前に構築が済んでいる `<ul class="animals">` の DOM にはアクセスできたものの、まだ存在しない `<p class="message">` の要素にはアクセスできないという状況が生じてしまいました。

### どうすればよかったのか？

DOM が構築されてからスクリプトを実行したいので、`body` 要素の末尾に `<script>` タグを書けばよい、という考えることができます。

この方法でも前述の問題は回避できますが、`body` の末尾で script を読み込む方法はデメリットが生じるケースがあります。JavaScript では、DOM の操作以外の処理を行うこともあります。例えば、ページ内リンクをスムーススクロールにしたり、ウィンドウ幅に応じてスタイルや `class 属性値` を動的に書き換えるといった処理をしたり、アクセス解析をしたり、様々な処理を行う可能性があります。

スクリプト自体の読み込みが遅いと、スクリプトがページ表示前に実行したい処理が始まるまでに時間がかかってしまい、HTML（DOM）が表示された後で処理が開始するためチラツキが生じたり、スクリプト側でイベントリスナーの実行タイミングをコントロールできなくなってしまったりします。

このため、基本的には `head` 要素の中で CSS や JavaScript ファイルを読み込むことが推奨されたりもしています。`<script src="study.js"></script>` を手前の方に書きつつ `<p class="message">` の要素にアクセスできるようにする方法は、次のセクションで説明します。

### イベント処理という仕組み

先程までは、`<script src="study.js"></script>` を読み込んだら処理を「即時実行する」という書き方しかしていませんでした。

イベント処理を使うと、「あるイベントが発生したら、処理を実行する」というような「処理の予約」を行うことができます。

つまり、「DOMの構築が完了したら、処理を実行する」という予約を行っておけば、`<script src="study.js"></script>` を手前の方に書きつつ `<p class="message">` の要素にアクセスすることを実現できます。

### 4章：まとめ

3章で書いた study.js の `section3_works();` の呼び出し部分を、次のように書き換えてみてください。

```
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    section3_works();
  }, false);

  function section3_works() {
    console.log(animals_info());
    console.log(message_info());

    function animals_info() {
      var ul = document.getElementsByClassName('animals')[0];
      if (ul == null) return 'class="animals" の要素が見つかりません';
      var li_elems = ul.getElementsByTagName('li');
      if (li_elems == null) return 'li 要素が見つかりません';
      return '動物の画像は ' + li_elems.length + ' 枚あります';
    }

    function message_info() {
      var p = document.getElementsByClassName('message')[0];
      if (p == null) return 'class="message" の要素が見つかりません';
      return 'メッセージは "' + p.textContent + '" です';
    }
  }
}());
```

`DOMContentLoaded` というのが、「DOMの構築が完了したタイミング」の予約イベントです。

イベント処理の予約（イベントリスナーの追加）は、イベントの発生対象ノードに対して `addEventListener` メソッドを呼ぶことによって予約することができます。このイベントは特定の要素ノードの話ではないので `document` ノードに対して予約します。

index.html の中身は3章のままですが、index.html を表示すると「メッセージ」もコンソールに表示されると思います。

## 5章：jQuery は何が便利だったのか

4章までの説明では jQuery を一切使っていません。jQuery は何が便利なのでしょうか。

その答えをいくつか書いてみます。

- `DOMContentLoaded` というイベントは HTML5 の仕様で導入された。IE8 以前ではサポートされていない。
- IE8 以前では、そもそも `addEventListener` というメソッドすらサポートされていない。
- ネイティブの DOM API では、複数の要素と単数の要素を区別して扱う必要がある（先程のコードでも `getElements...()[0]` のようにリストの1つ目を取り出して使っていた）。
- その他、ネイティブの DOM API では要素の作成、追加、削除、属性の変更などのメソッドが貧弱で、DOM API 用の独自ライブラリを各自で書いて使っていた。
- 第二次ブラウザ戦争の時代に、それらの問題を解決する「DOM Manipulator ライブラリ」として登場したのが2005年の prototype.js, 2006年の jQuery だった。
- jQuery は（ネイティブの DOM API の抽象化だけでなく）便利なメソッドが沢山実装されているため、jQuery さえあれば JavaScript でやりたいことが（簡単に）実現できる強力なライブラリとして広まった。

IE6 〜 IE8 が多くの人に使われていた時代に「DOM の構築が完了したタイミング」の予約イベントを追加したいと思ったとき、一体どんなコードを書けばよいか想像できるでしょうか。この機能は jQuery の機能の一部に過ぎません。

また、要素ノードの取得やノードに対するメソッド操作も、ネイティブの DOM API と比べると使いやすいものでした。当時は `getElementById` や `getElementsByTagName` メソッドを用いて要素を取得する必要があり、CSS のセレクタのように表現力の高い要素の指定ができませんでした（`getElementsByClassName` メソッドすらサポートされておらずこれが使えませんでした）。

そのような時代（2009年頃）に「今」と同じくらいの DOM 操作が可能な API を実現したのが jQuery だったのです。当時としては jQuery は画期的なライブラリであり、jQuery UI なども登場することで JavaScript 開発のデファクトスタンダードとなっていきました。

## 6章：DOM を操作してみよう

jQuery のメソッドをいくつか使ってみましょう。

index.html は以下のものにしておき、study.js で色々なコードを書いていきましょう。

### index.html

```
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>iij-bootcamp jQuery</title>
  <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
  <script src="study.js"></script>
</head>
<body>
  <header id="page-header">
    <h1 id="heading">Welcome to iij-bootcamp!</h1>
    <p class="lead">JavaScriptと開発者ツールを使ってみよう！</p>
    <p class="description">このハンズオンでは jQuery を使いながら、HTML, CSS, JavaScript とブラウザの開発者ツールの使い方を覚えていきます。</p>
  </header>
  <main id="page-main">
    <p class="description">jQuery で DOM を操作してみよう！</p>
    <ul class="animals">
      <li class="alice"><img src="https://placekitten.com/300/150" alt="Alice" /></li>
      <li class="bob"><img src="https://placekitten.com/300/160" alt="Bob" /></li>
      <li class="carol"><img src="https://placekitten.com/300/180" alt="Carol" /></li>
    </ul>
  </main>
</body>
</html>
```

### 練習1 - study.js

```
(function($) {
  'use strict';

  $(function() {
    work1();
  });

  work2();

  function work1() {
    console.log('==== work1 が実行されました ====');
    // $() メソッドに CSS のセレクタを与えると、それにマッチする要素を取得します
    var $desc = $('.description');
    console.log('class="description" の要素は %d 個ありました', $desc.length)
  }

  function work2() {
    console.log('==== work2 が実行されました ====');
    var $desc = $('.description');
    console.log('class="description" の要素は %d 個ありました', $desc.length)
  }
}(jQuery));
```

`work2` の方が先に実行されると思います。この study.js を読んで、そのことが理解できるでしょうか。そして、work2 が実行されたタイミングでは DOM ツリーの構築が完了していないため、「そのタイミング」までで構築されたノードしか参照できません。まだ `class="description"` の要素ノードが DOM ツリーに入っていないので `work2` では「0個」と表示されます。

`work1` が実行されるのは「DOMの構築が完了したタイミング」です。

```
document.addEventListener('DOMContentLoaded', function() {
  // ここにコードを書く
}, false);
```

このようなコードと同等の動作を、jQuery では次のように書くことができます。

```
$(function() {
  // ここにコードを書く
});
```

たまに jQuery で、

```
$(document).ready(function() {
  // ここにコードを書く
});
```

のような書き方を説明している記事などを見かけますが、これらは同じ動作をします。`$` という1文字の変数は `jQuery` の別名です。`$(document).ready(function() {...})` の簡略記法が `$(function() {...})` です。

### 練習2 - study.js

html はそのままで、study.js を別のものにしてみます。

```
(function($) {
  'use strict';

  $(function() {
    work1();
  });

  function work1() {
    var $main = $('#page-main');

    var $desc1 = $('.description');
    // 実際に $desc1 としてどの要素がマッチして取得できたのかをコンソールに出力します
    console.log('desc1 の状態', $desc1);

    // $desc1 に含まれる全ての要素に、赤文字を適用します
    $desc1.css({'color': '#f00'});

    var $desc2 = $('#page-main .description');
    console.log('desc2 の状態', $desc2);
    // $desc2 に含まれる全ての要素に、黄色背景、黒い枠線を適用します
    $desc2.css({'background': '#ff0', 'border': '1px solid #000'});

    add_paragraph();
    // 関数にして、変数のスコープ（影響範囲）が関数内だけになるようにしています
    function add_paragraph() {
      // $() メソッドに CSS セレクタではなくタグ文字列を与えると、要素の取得ではなく、新しい要素の生成が行われます。
      // これは $(document.createElememt('p')) と等価です。

      var $p = $('<p>').addClass('new_p');
      $p.addClass('hogehoge'); // さらにクラスを追加
      $p.text('こんにちは！').css({'background': '#0f0'});

      // メソッドチェーンがサポートされているので、上記は
      // $('<p>').addClass('new_p').addClass('hogehoge').text('こんにちは！');
      // のようにも書けます。

      // $main の中の末尾に $p を追加（移動）します。これで $p は DOM ツリーに追加されます。
      $main.append($p);
    }

    // 3000 ミリ秒後（3秒後）に add_images() を実行します
    setTimeout(function() {
      add_image();
    }, 3000);

    function add_image() {
      var $animals = $('.animals');
      var $li = $('<li>');
      var $img = $('<img>').attr({
        src: 'https://placeimg.com/300/300/nature',
        alt: 'a random nature image'
      }).appendTo($li);

      // class="bob" はもともと HTML に出力されている「2個目の li 要素」です
      var $bob = $animals.find('.bob');

      // $bob の直前に $li を追加（移動）します。
      $bob.before($li);
    }
  }
}(jQuery));
```

練習2では、要素の取得、属性の変更（style 属性）、要素の追加を試してみました。

関連する jQuery メソッドを紹介しておきます。

- 要素の取得
    - `$('#page-main')`, `$('#page-main .description')`
        - DOM ツリーの `document` 以下に含まれる全てのノードから、セレクタにマッチする要素を取得します。
    - `var $main = $('#page-main'); $main.find('.description')`
        - すでに取得している要素に含まれる、子孫要素を `find` メソッドで取得できます。
        - `$('セレクタ')` は `$(document).find('セレクタ')` の簡略記法です。
- 要素の追加
    - `$main.before($new_p)`
        - `$main` の直前に `$new_p` を追加
        - `$new_p.insertBefore($main)` でも同じ結果になる
    - `$main.prepend($new_p)`
        - `$main` の先頭の子供として `$new_p` を追加
        - `$new_p.prependTo($main)` でも同じ
    - `$main.append($new_p)`
        - `$main` の末尾の子供として `$new_p` を追加
        - `$new_p.appendTo($main)` でも同じ
    - `$main.after($new_p)`
        - `$main` の直後に `$new_p` を追加
        - `$new_p.insertAfter($main)` でも同じ結果になる
- 要素の削除
    - `$new_p.remove()`
        - DOM ツリーから `$new_p` を取り除く
        - DOM ツリーにないノードでも JavaScript 側で操作することができ、再度 DOM ツリーに追加し直すこともできる。
            - 新しい要素を `$('<p>')` のように作成したけれど DOM ツリーに追加していない状態のそれと同じ扱い。
            - あくまで DOM ツリーに含まれていないだけで、JavaScript 上では存在している。
    - `$new_p.detach()`
        - DOM ツリーからノードを削除したい場合、通常は `remove()` を使えばよい。
        - イベント処理の予約（例えばクリックイベントなど）を登録した要素を DOM ツリーから取り除き、その後で取り除いた要素を再度 DOM ツリーに戻すような場合、`remove` と `detach` で挙動が変わる。
            - `remove` で取り除くと、登録していたイベントリスナーが全て削除される。
            - `detach` で取り除くと、登録していたイベントリスナーは保持される。

要素の追加（移動）のメソッドについて。

```
<body>
  <!-- $main.before() はここ -->
  <main>
    <!-- $main.prepend() はここ -->
    <ul class="animals">
      ...
    </ul>
    <!-- $main.append() はここ -->
  </main>
  <!-- $main.after() はここ -->
</body>
```

また上記では「追加」と書いていますが、正確には「移動」です。つまり、`$main.append($new_p)` の後で `$another.append($new_p)` のようなことをすると、`$main` に `append` した `$new_p` は移動するので `$main` の子ノードからは消えたかのように振舞います。

同じ要素を次々と「量産」したいような場合は、`clone` メソッドを使います。

`$main.before($new_p.clone(true))` と `$main.after($new_p.clone(true))` を実行すると、before と after にそれぞれ新しい `$new_p` のクローンが追加されます。`clone` メソッドを実行した時点で `$new_p` とは別の実体が生成されます。（`clone` の引数 `true` の意味は `remove` と `detach` の違いに似ています。`true` にするとイベント登録内容も引き継がれます。）

### 6章：まとめ

jQuery で DOM を操作してみました。

jQuery では上記に書いた `find` などのメソッドが使えますが、これらのメソッドは `jQuery オブジェクト` に定義されているメソッドです。

- jQuery API
    - [https://api.jquery.com/category/manipulation/](https://api.jquery.com/category/manipulation/)
- jQuery 1.9 日本語リファレンス（非公式）
    - [http://js.studio-kingdom.com/jquery/](http://js.studio-kingdom.com/jquery/)

jQuery の最新版は 3.4.x ですが、個人的な感覚では API はバージョン 1.6 くらいから安定しているので 1.9 のドキュメントでも十分参考になると思います。

jQuery の変数（オブジェクト）について。

```
var p = document.getElementsByTagName('p')[0];
var $p = $(p);
// これは $p = $('p').eq(0) と等価です。

// $p は、ネイティブのノード p を jQuery インスタンスでラップしたオブジェクトです。
// $p.eq(0) は、$p に含まれる要素が複数ある場合に、インデックス[0]の値だけを取り出すメソッドです。
var $ul = $('.animals');
var $li = $ul.find('li');
// このようにすれば、インデックス[1]（つまり2個目）の li 要素（jQuery オブジェクト）を取り出せます。
console.log($li.eq(1));

// $li.eq(k) ではインデックス[k]の要素を jQuery オブジェクトとして取り出しますが、
// $li.get(k) ではインデックス[k]の要素をネイティブのノードとして取り出します。
console.log($p.get(0));

// p == $p.get(0) であり、 $p == $(p) == $($p.get(0)) です
```

一般的にはあまり推奨されませんが、jQuery を使った JavaScript コードでは（システム）ハンガリアン記法がしばしば採用されます。jQuery オブジェクトを保持する変数は `$p` のように変数名を `$` から始めるというものです。これは好みの問題なので変数名はどのように書いても構いません。

## おわりに

今回は DOM 操作以外のテーマについてあまり触れられませんでした。

- DOM 操作
- スクロール制御（ページ内リンクのスムーススクロール）
- jQuery アニメーション（フェード、スライドショー、イージング）
- Ajax 通信（ajax メソッド、load メソッド）

jQuery は DOM Manipulator ライブラリであり、DOM 操作を中心に上記のような応用をする際には有用なライブラリです。

一方で、途中でも述べましたが Angular や React, Vue.js は JavaScript ベースの Web アプリケーションを開発する際に有用なフレームワークです。それらの使い方は jQuery とは目的が異なるため、「Vue.js と jQuery のどちらを使うべきか」という単純な比較はあまり意味がありません。

また、最近では IE6 〜 IE8 のような古いブラウザを考慮する必要がなくなったため、jQuery を使わずともネイティブの JavaScript メソッドや HTML5, CSS3 の時代に使えるようになった機能を用いることで、ブラウザごとの実装状況や不具合に悩まされずに JavaScript 開発ができるようになってきました。

ブラウザ戦争の歴史や JavaScript の歴史を知ると、どういう JavaScript フレームワークがなぜ便利で、どのような場面で使うべきなのかというのを判断できるようになるかもしれません。そのような歴史や背景についても興味を持っていただけたら幸いです。

<credit-footer/>
