---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: JavaScriptフレームワークであるReactを使ってみよう
time: 2h
prior_knowledge: 特になし
---

<header-table/>

# ReactでクライアントサイドWebアプリケーションを書こう

## 事前準備

本ハンズオンの環境として、node.jsが必要です。

講師はバージョン10.15.3を使いました。

node.jsが動作しているなら、WindowsでもMacOSでもLinuxでも問題ありません。

### おすすめ

nodenv等、複数のバージョンのnode.jsを管理するツールの利用をおすすめします。

Reactに限らず、node.jsを必要とするソフトウェア開発は、プロジェクト毎に異なるバージョンのnode.jsが必要になることが、ほぼ確実だからです。

## Reactとは

Reactは、Facebook社が開発しているWebユーザインターフェースのためのライブラリです。

### メリット

簡単に言うと、Webアプリケーションの画面表示まわりをいい感じに実装するためのライブラリで、以下の特徴があります。

1. 保守性が高い。
    - 関数型プログラミングの作法を大幅に導入し、状態（ステート）が一意であれば、一意の表示を得ることができます。（jQueryなどと比較して、デバッグが容易）
2. 仮想DOMによる高いパフォーマンス
    - 画面の背後にあるステートを更新すると、画面の中の「更新すべき部分だけ」自動的に更新することができます。（jQueryでは、プログラマが「更新すべき部分」を決定して、そこだけを更新するように自分で作り込まなければなりません。）
3. JSXと呼ばれるHTMLにそっくりの記法でビューを記述する。
    - あとで出てくるサンプルコードを見るとわかりますが、ビューの記述はほとんどHTMLそのままです。このため、デザイナーの作成したHTMLをビューの記述に取り込むことがカンタンになっています。

なお、Facebook自身のUIこそが、Reactで書かれたものの実例です（Facebook社がFacebookのUIを、テスト/デバッグしやすく、素早くバージョンアップしていくために、Reactを作ったというわけです）。

### 弱点

Reactは非常に強力なライブラリではありますが、色々と敷居の高いライブラリでもあります。

1. バージョンアップのペースが速い。
    - Reactは非常に速いペースでバージョンアップされています。しかも、バージョンが少し違うだけで、APIが大幅に変化することが珍しくありません。
	- あるバージョンのために学習した経験が、あっという間に陳腐化するのは、辛いものがあります。
2. 学習コストが高い。
    - Reactは、React自身の学習コストがそこそこ高いことに加えて、Reactと組み合わせて使用すべきライブラリも多数あります。そして、それらのライブラリも、バージョンアップのペースが速いのです。
	- Reactの実装をスムーズに行なうための周辺ツールが多数あります。これらのツールをどう組み合わせてどう使うべきか、ある程度のベストプラクティスはあるものの、そのベストプラクティスの寿命はけっして長くありません。Web上に散在するヒント的なドキュメントの多くは、もはや陳腐化していることがほとんどです。
3. 関数型プログラミングの知識が期待される。
   - Reactは関数型プログラミングのアイデアを大幅に採用しています。関数型プログラミングの知識や経験の少ない人は、Reactで何が可能で何が難しいかをイメージすることが難しいと思われます。

本講座では、2019年6月現在において、もっとも安定して使える、なるべく新しいバージョンを使っていきます。

## Create React App


Reactを始めるための方法としては、いくつかの方法があります。

Reactの基礎を体験したいだけなら、オンラインサービスを使って体験するのが一番簡単です。

* [CodePen](https://reactjs.org/redirect-to-codepen/hello-world)
* [CodeSandbox](https://codesandbox.io/s/new)
* [Glitch](https://glitch.com/edit/#!/remix/starter-react-template)

また、既存のHTMLページの中にReactで書いたものを埋め込むだけなら、下記のチュートリアルが参考になります。

* [Add React to a WebSite](https://reactjs.org/docs/add-react-to-a-website.html)

しかし、一般的には、Reactを利用する目的は、ある程度の規模と機能をそなえたSingle Page Applicationを実装するためでしょう。

この場合の公式サイト上の出発点は、以下になります。

* [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)

ここにあるように、以下を実行すると、プロジェクトmy-appが作成され、サンプルアプリケーションをブラウザで確認できます。


```
npx create-react-app my-app
cd my-app
npm start
```

(`npx`を使うためには、version 5.2.0以降のnpmが必要です。講師は、node 10.15.3に同梱されているversion 6.4.1で動作確認しています。)

わかると思いますが、一応説明しますと`npx create-react-app my-app`がプロジェクトの作成です。my-appがプロジェクト名で、まさしくその名前のディレクトリが作成されます。

プロジェクトディレクトリに入りまして、`npm start`しますと、ソースコードのビルドが行なわれた後、開発サーバが起動しまして http://localhost:3000/ にてブラウザで開発中のアプリケーションを確認できるという塩梅です。（なお、npm startで起動した開発サーバを止めるには、npm startしたコンソールでCtrl-Cをタイプしてください。）

それぞれのコマンドが、実際のところ何をしているかは、最終的には把握した方が良いですが、入門段階では「人間が勉強するにはかったるいことを、いろいろやってくれているんだなあ、便利だなあ」と思っておけば十分です。

開発サーバは、ソースコードの変更を察知して、その変更を即座にブラウザに伝えてくれます。

さっそくひとつやってみましょう。

src/App.jsを適当なエディタ(私はWebStormというIDEを使っています)で開きますと、以下のようなコードが見えます。

```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

にわかにJavaScriptのコードだとは思えない、HTMLとES2015のコードが混ぜこぜになっているようなコードが出てきます。

このHTML風の表現になっている部分は、[JSX](http://facebook.github.io/jsx/)というJavaScriptの拡張構文で、実際にはJavaScriptにトランスパイルされてから実行されます。

JSXについての詳細には踏み込みませんが、3点だけ注意しておきます。

1. JSXはHTML風の記法でHTML出力のためのコードを記述できるものであって、HTMLそのものではありません。
2. HTMLではCSSのクラス名を適用するのにclass属性を記述しますが、classはECMAScriptの予約語なので、これを避けてclassNameという語を用います。(上の例にあるとおりです。)
3. (上記の例では出てきませんが)HTMLではlabelタグにfor属性を使いますが、forはJavaScriptの予約語なので、これを避けてhtmlForという語を用います。

ここではdivタグによって作られたDOMツリーを表現するオブジェクトを生成してreturnしています。

(JSXは、あくまでも記法なので、JSXを使わずに同じ意味のコードを書くことは可能です。が、Reactで開発する人のほとんどはJSXを利用しますので、本チュートリアルでは解説しません。)

さて、このコードを適当に変更してみましょう。

たとえば、このような具合です。

```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reactを学ぶ。
        </a>
      </header>
    </div>
  );
}

export default App;
```

ブラウザに戻ってみますと、リロードするまでもなく、反映されているのがわかると思います。

### (補足) ユニットテスト

ユニットテスト とは、メソッドや関数単位でテストコードを作成し、コードを書くのと同時に自動でテストを行う開発手法です。TDD (Test Driven Development) など聞いたことがあるかもしれません。

実は、create react appで作ったプロジェクトには、ユニットテスト用の環境も用意してくれています。以下のコマンドを実行してください。(npm startを止めてこちらを実行した方がいいかもしれません)

```
npm test
```

[スクリーンショット001](./Screenshot001.png "スクリーンショット001")

このような画面が出力され、テストがパスしていることが報告されています。

そのテストコードはsrc/App.test.jsにあります。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

```

ここでは、document.createElement('div')で作ったdivオブジェクトの中に、<App />をレンダリングしてトラブルがないことを確認しています。

開始タグと終了タグの対応を壊したりしますと、テストに失敗するはずです。

npm startで起動させた開発サーバ同様、npm testで起動させたテストランナーも、ソースファイルを保存すると自動的にテストをやりなおしてくれます。

## Componentを作ってみる

次はComponentを作ってみましょう。

実は、Componentを記述する方法はいくつもあるのですが、ここではクラスベースのオブジェクト指向のスタイルで書いてみます。

以下のソースコードをsrc/Peoples.jsに作成してください。

```javascript
import React from 'react';

export default class Peoples extends React.Component {
    render() {
        return (
            <p>peoples works!</p>
        );
    }
}
```

その上で、src/App.jsでPeoplesを使うように修正します。

```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Peoples from './Peoples';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
        </p>
        <Peoples />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reactを学ぶ。
        </a>
      </header>
    </div>
  );
}

export default App;
```

さあ、ブラウザに表示されている内容が変化したと思います。

つまり、ReactではComponentを作ることによって、JSXに記述できるタグを増やすことができます。

この程度のことでは面白くないので、人々のリストを表示させてみましょう。

まずはsrc/Peoples.js

```javascript
import React from 'react';

export default class Peoples extends React.Component {
    render() {
        return (
            <div>
                <p>peoples works!</p>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.peoples.map((people) => {
                                return (
                                    <tr key={people.id}>
                                        <td>{people.id}</td>
                                        <td>{people.name}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
```

そして、src/App.js

```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Peoples from './Peoples';

const peoples = [
  { "id": "1", "name": "bob" },
  { "id": "2", "name": "alice" },
  { "id": "3", "name": "John" }
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
        </p>
        <Peoples peoples={peoples}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reactを学ぶ。
        </a>
      </header>
    </div>
  );
}

export default App;
```

どうなりましたか。

peoples works!の下に、テーブルが表示され、その中に人々の一覧が表示されましたね。

どのようにして、この仕組みが動いているのか、解説します。

まずsrc/App.jsですが、ここでは定数peoplesに表示したい人々のデータを定義しています。

（ここで記述している人々のデータは、後でAPIサーバから取得することになるJSONと同じものです。)

そして、そのpeoplesを以下のようにしてPeoplesタグのpeoples属性として渡しています。

```JSX
<Peoples peoples={peoples}/>
```

このpeoples属性は、src/Peoples.jsに定義しているPeoplesクラスの中では、`this.props.peoples`で参照することができます。(`this.props`はそのインスタンスに与えられた属性を保持しているオブジェクトで、このオブジェクトのことを「プロパティ」と呼びます。どこでプロパティがセットされるかというと、上記のJSXがPeoplesクラスのインスタンスをnewしており、その引数として属性リストが渡されるという塩梅です。)

上記のコードでは`this.props.peoples`にmapメソッドを適用して、配列(リスト)の各要素をJSXにてHTMLに展開しています（より正確に言うと、プロパティpeoplesと仮想DOMの対応を定義している、ということになりますが、さしあたりHTMLに展開していると思っておいて良いです）。

`<tr>`にkey属性を指定しています。これはHTMLでは不要の記述で、React独特の書き方です。key属性に、mapで展開される各要素を特定するユニークな値を指定することで、this.props.peoplesの中身が変化したとき、画面を自動的に（リアクティヴに）更新することができるようになっているのです。（あとで、実際に変化させる実験をします。）

mapメソッドは、関数型プログラミングにおけるHello World的な存在です。

ここでは、`this.props.peoples`に定義されているオブジェクトのリストの写像(map)として`<tr>`から`</tr>`で表現されるテーブルの行のリストを仮想DOMの中に展開しています。

`this.props.peoples`に対してforEach的なループを記述するのではなく、mapを使う、というところがReactのReactらしいところです。

Reactでは、ほぼほぼ、プロパティにあるリストをmapで展開する、という方法でのみ繰り返しデータをレンダリングします。

関数型プログラミング（とりわけHaskellのような遅延評価のある言語）に親しんでいる人には、renderメソッドが実際にレンダリング処理を記述しているというよりは、renderメソッドの定義を通じて「プロパティと仮想DOMの対応を宣言している」という言い方が通じると思います。

ここで重要なことは、`this.props`の内容が同一であれば、出力される画面も同一になる、ということです。

`this.props`以外の情報をrenderは参照していません。

このような原則を守らせる強制力をJavaScriptは持っていないのですが、Reactのプログラマーは自主的に`this.props`以外の情報をrenderが参照しないように留意します。この原則を守ることによってデバッグが容易になり、複雑なアプリケーションを安心して開発/保守できるようになるのです。

せっかくなので、ここでユニットテストを書きましょう。

まずはテストを書くために便利なライブラリであるreact-test-rendererをインストールします。

```sh
npm install react-test-renderer
```

そして、以下の内容でsrc/Peoples.test.jsを記述してください。

```javascript
import React from 'react';
import Peoples from './Peoples';
import renderer from 'react-test-renderer';

const peoples = [
    { "id": "1", "name": "bob" },
    { "id": "2", "name": "alice" },
    { "id": "3", "name": "John" }
];

it('renders with peoples correctly', () => {
    const peoplesTable = renderer.create(<Peoples peoples={peoples} />).toJSON();
    expect(peoplesTable).toMatchSnapshot();
});
```

こうしておいて、`npm test`を実行すると、srcディレクトリの中に`__snapshots__`というディレクトリができて、その中にPeoples.test.js.snapなるファイルが作られます。

```javascript
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders with peoples correctly 1`] = `
<div>
  <p>
    peoples works!
  </p>
  <table
    border="1"
  >
    <thead>
      <tr>
        <th>
          ID
        </th>
        <th>
          Name
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          1
        </td>
        <td>
          bob
        </td>
      </tr>
      <tr>
        <td>
          2
        </td>
        <td>
          alice
        </td>
      </tr>
      <tr>
        <td>
          3
        </td>
        <td>
          John
        </td>
      </tr>
    </tbody>
  </table>
</div>
`;
```

この出力を良く眺めて、意図どおりであるなら、まずはOKです。

スナップショットは、そのテストについてスナップショットがない状態で`npm test`すると自動的に生成されます。以後は、このスナップショットをテストの正解として、テストが実行されます。

Peoples.jsを少し変更（たとえば`<tr>`の中のIDの`<td>`とNameの`<td>`を入れ替えてみるとか）して`npm test`し、テストが失敗することを確認してみましょう。

期待どおりにエラーがレポートされたと思います。

## APIからデータを取得してみる

次は外からHTTPアクセスでデータを取得してみます。実際にはWebサーバのAPIを叩くことが多いですが、今回はjQueryの時と同様に以下のJSONファイルの内容を取得してみます。

https://https://iij.github.io/bootcamp//test.json

React自身は外部との通信をどのように記述するかの規則はありません。この点、Serviceを使うことになっているAngularとは異なります。

React自身は外部で通信することだけではなく、状態の管理についてもオープンです。ここで私が慣れているという理由でReduxというライブラリを使います。

なぜ状態管理が必要なのかというと、通信が走る前と通信が完了した後では状態を変化させる必要があるためです。

実際のコードを書いて、このあたりのことを実感しながら前進しましょう。

まずはHTTPクライアントとして、axiosをインストールします。

```sh
npm install --save axios

```

続いてsrc/App.jsを以下のように修正します。

```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Peoples from './Peoples';
import axiosBase from 'axios';

const axios = axiosBase.create({
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});

const url = 'https://iij.github.io/bootcamp//test.json';

let peoples = [];

axios.get(url)
    .then((response) => {
          if (response.status === 200) {
            peoples = response.data;
            console.log('got!');
            console.dir(peoples);
          } else {
            alert(`response status is ${response.status}`);
          }
        })
    .catch((error) => {
      alert('an error occurs.');
      console.error(`an error on get ${url}`);
      console.dir(error);
    });

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
        </p>
        <Peoples peoples={peoples}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reactを学ぶ。
        </a>
      </header>
    </div>
  );
}

export default App;
```


ここでブラウザで見ようとするとエラーになります。

詳しくは長くなるので別途勉強してほしいのですが、localhost:3000で提供されているJavaScriptのコードから、別サイトのgithub.comのリソースをGETしようとしたので、Cross-Originリクエストとしてブロックされたのです。

実際にアプリケーションを作るときには、APIとアプリケーションを別のドメインで提供することはあるので、そのときにはこの問題を解決するためにAPIサーバにちょっとした設定をします。今回はそこまでの設定をするほどのことではないので、安直な解決策を選びます。

chromeないしchromium-browserを使っているなら、起動オプションに`--user-data-dir=/tmp/myhome --disable-web-security`を付与します。こうすることで、Cross-Originリクエストがブロックされなくなります。（もちろん、この起動オプションをつけて起動したブラウザは危険ですから、自分の開発中のアプリケーション以外にアクセスしてはいけません。）

今度はどうでしょう。エラーは出なくなりましたが、画面には人々が表示されません。

コンソールを確認すると、ちゃんと通信は成功しています。

(axiosの処理の部分で.thenおよび.catchを使った構文があります。これはES2015で採用されたPromiseという仕組みを利用しています。このあたりについても詳しいことは述べませんが、.thenの中身は通信が成功した後に処理されるのであって、最初は通信を始めた後、通信の結果を待たずに先に進んでしまう、ということを知っておいてください。つまり、peoplesは空配列のまま先に進んでAppクラスのインスタンスが生成されます。その後になって通信が成功して.thenの中身が実行される、という順番になります。)

要するに通信が成功してpeoplesが更新されたにも関わらず、peoplesが変化したことにAppクラスのインスタンスが気付いていないのです。

peoplesの変化をAppクラスのインスタンスに伝える必要があります。

そこでReduxを導入していきます。

```sh
npm install --save react-redux redux-thunk redux
```

Reduxは、React専用の状態管理ライブラリというわけではありません。

そのため、ReactからReduxを使うためのモジュールとしてreact-reduxがあります。

redux-thunkは、あるアクションの結果を受けて続きのアクションを実行するための「サンク」を提供するReduxのための「ミドルウェア」です。

順番に見ていきましょう。

まず、src/index.jsですが、以下のように修正します。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

重要なことは、2つ。

1. react-reduxモジュールからProviderをインポートし、AppをProviderで囲んでいます。
2. Providerに渡すstoreなるものをsrc/redux/store.jsからインポートしています。

src/redux/store.jsは、以下の内容です。

```javascript
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk)
    )
);
```

reduxモジュールからapplyMiddleware, compose, createStoreをインポートしています。

createStoreは、文字どおり「ストア」を作るメソッドです。

composeは関数合成のためのメソッドで、applyMiddlewareはミドルウェアを導入するためのメソッドです。ここではひとつしかミドルウェアがないのでcomposeは不要なのですが、あとでミドルウェアを追加することを考えてcomposeを使っています。（実際、追加することになります。）

redux-thunkモジュールからthunkをインポートしています。thunkは前述のとおり、複数のアクションをひとつのアクションとしてまとめる機能を実現するミドルウェアです。

src/redux/reducers/index.jsからrootReducerをインポートしています。

リデューサとは、Reduxのコンセプト上の用語で、具体的には「状態」と「アクション」を引数にとって、「新しい状態」を返す関数として定義します。

Reduxの「ストア」の中には「状態 state」が存在するのですが、この状態は不変オブジェクトです。状態を変更することは許可されておらず、新しい状態を作るための唯一の方法が、ストアにアクションをdispatchすることです。ストアにアクションをdispatchすると、ストアはリデューサに現在の状態とアクションを渡します。リデューサは、状態とアクションから新しい状態を作り、ストアに返します。ストアは、新しい状態を、ストアとconnectしているコンポーネントに反映させます。

そのsrc/redux/reducers/index.jsは以下の内容です。

```javascript
import { combineReducers } from 'redux';
import peoples from './peoples';

export default combineReducers({ peoples });
```

reduxモジュールからcombineReducersをインポートします。combineReducersは複数のリデューサを合成します。

そしてsrc/redux/reducers/peoples.jsからpeopleをインポートし、combineReducersを使って合成してエクスポートしていますね。

そのsrc/redux/reducers/peoples.jsの内容は以下のとおりです。

```javascript
import { SET_FETCHING, FETCH_PEOPLES } from '../actionTypes';

const initialState = {
    inFetching: false,
    peoples: []
};

export default function(state = initialState, action) {
    console.log("PEOPLES Reducer");
    console.dir(state);
    console.dir(action);
    switch (action.type) {
        case SET_FETCHING:
            return {
               inFetching: true,
               peoples: []
            };
        case FETCH_PEOPLES:
            return {
                inFetching: false,
                peoples: action.peoples
            }
        default:
            return state;
    }
}
```

src/redux/actionTypes.jsから`SET_FETCHING`, `FETCH_PEOPLES`をインポートしています。あとで見ますが、これは単にアクションの種別を区別するための定数で、その実体は同名の文字列です。

定数initialStateは初期状態です。ここではisFetching すなわちAPIから人々のデータを取得中であるかどうかのフラグおよびpeoples すなわち人々のデータを格納するリストを定義しています。isFetchingはfalse、peoplesは空リストを初期値としました。

export defaultしている関数が、peoplesリデューサです。

状態とアクションを引数としてとります。

consoleは、デバッグ用の出力です。実際には必要ありません。

switchからがリデューサの本体です。

`SET_FETCHING`に対しては、isFetchingをtrueにして、peopleを空リストにした新しい状態を返しています。

`FETCH_PEOPLES`に対しては、isFetchingをfalseにして、アクションのpeopleプロパティをpeopleに渡した新しい状態を返しています。

デフォルトは古い状態をそのまま返しています。

src/redux/actionTypes.jsも見ておきましょう。

```javascript
export const SET_FETCHING = 'SET_FETCHING';
export const FETCH_PEOPLES = 'FETCH_PEOPLES';

```

見てのとおりですね。特に面白くはありません。

さて、以上でindex.jsにインポートされたstoreの正体がわかりました。

要するに...

1. src/redux/actionTypes.jsに反応するリデューサと、redux-thunkモジュールの提供するthunkミドルウェアを適用してcreateStoreしたストアであるstoreを用意し、
2. Providerにそのstoreを渡してAppを囲んでいる

...わけです。

そしてAppクラスとstoreをconnectします。

src/App.jsは以下のように修正しました。

```javascript
import React from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Peoples from './Peoples';
import * as actions from './redux/actions';

let lastFetching = null;

class App extends React.Component {
    render() {
        console.log('App render');
        console.dir(this.props);
        if (this.props.peoples.length === 0 && !this.props.isFetching) {
            const now = Date.now();
            if (lastFetching === null) {
                lastFetching = now;
                console.log("FETCH_PEOPLES");
                this.props.fetchPeoples();
            }
            return (
                <div>fetch peoples</div>
            );
        }
        if (this.props.isFetching) {
            return (
                <div>now loading</div>
            );
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
                    </p>
                    <Peoples peoples={this.props.peoples} />
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Reactを学ぶ。
                    </a>
                </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.dir(state);
    const props = {
        isFetching: state.peoples.isFetching,
        peoples: state.peoples.peoples,
    }
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPeoples() {
            const action = actions.fetchPeoples();
            dispatch(action);
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

react-reduxモジュールからconnect関数をインポートしています。

connectはsrc/App.jsの最後の行で、2つの関数とAppクラスとを接続するために使っています。

簡単に言うと、Providerに渡されたstoreとAppクラスを接続するのがconnectの役割です。

connectの最初の引数mapStateToPropsは、状態を引数としてとり、これをAppのプロパティとしてどのように対応させるかを定義する関数です。ここではstate.peoples.isFetchingをプロパティisFetchingに、state.peoples.peoplesをプロパティpeoplesに対応させています。

stateの次にpeoplesとあるのは、peoplesリデューサの管理下の状態であることを意味しています。規模が大きくなってくると、リデューサも大きくなってくるので、リデューサを適当な粒度で分割できるようにしているわけです。

connectの2つ目の引数mapDispatchToPropsは、ストアにアクションをdispatchするための関数オブジェクトdispatchを引数にとって、Appのプロパティに実際にアクションをdispatchする関数オブジェクトを定義する関数です。ここではプロパティfetchPeoplesに、src/redux.actions.jsに定義されているactions.fetchPeoplesをdispatchする関数オブジェクトを定義しています。

そのsrc/actions.jsは最後に述べるので、その前に、Appクラスのrenderメソッドを読んでいきましょう。

最初にあるconsoleはデバッグを助けるためのもので、実際には不要です。

次のif文は、プロパティpeoplesが空リストであり、プロパティisFetchingがfalseであるなら、ということですから、初期状態であるなら、という意味です。

const nowにはエポックからのミリ秒をセットします。

その上で、モジュールAppに閉じた変数lastFetching (初期値null) がnullであるかを検査し、nullであるなら、lastFetchingにnowをセットした上で、プロパティfetchPeoplesにある関数オブジェクトを評価します。つまりactions.jsで定義されたactions.fetchPeoplesをストアにdispatchするわけです。

その上で<div>fetch peoples</div>をreturnしています。ほんの一瞬だけ、画面にはfetch peoplesが見えるかも、しれません。

ここでsrc/redux/actions.jsを見てみましょう。

```javascript
import { FETCH_PEOPLES, SET_FETCHING } from './actionTypes';
import axiosBase from 'axios';

const axios = axiosBase.create({
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'
});

function errorHandler(error) {
    alert('failed to call api');
}

export function fetchPeoples() {
    const url = 'https://iij.github.io/bootcamp//test.json';
    return async (dispatch) => {
        dispatch({
            type: SET_FETCHING,
        });
        const response = await axios.get(url).catch((error) => errorHandler(error));
        if (response.status === 200) {
            const peoples = response.data;
            console.log('got!');
            console.dir(peoples);
            dispatch({
                type: FETCH_PEOPLES,
                peoples,
            });
        }
    };
}
```

src/redux/actionTypes.jsから`FETCH_PEOPLES`と`SET_FETCHING`をインポートしているのは、リデューサに伝えるアクション種別が必要だからです。

関数fetchPeoplesの定義を見ていきましょう。

定数urlに取得したいリソースのURLが定義されています。

そしてasyncで修飾された、dispatchを引数とするラムダ式をreturnしています。

このdispatchを引数とするラムダ式としてアクションを表現する技法が「サンク thunk」なのです。

サンクとは、コンピュータ科学の世界では、遅延評価される関数オブジェクトのようなものを指しています。

redux-thunkミドルウェアを適用されたReduxストアは、dispatchされたアクションが単純なオブジェクトであればそのままリデューサに渡します(言わば通常どおりの挙動です)。dispatchされたアクションが、dispatchを引数とするラムダ式であるなら、そのラムダ式にdispatchオブジェクトを渡します。

かくして、多段階的なアクションをエレガントに表現することができるのです。

fetchPeoplesでは、まず以下のオブジェクトをdispatchしてます。

```json
{
  type: SET_FETCHING
}
```

すでにpeoplesリデューサで見たように、`SET_FETCHING`アクションは、状態isFetchingをtrueにして状態peoplesを空リストにした新しい状態を作り出すアクションです。つまるところ、通信中のフラグを立てた、ということです。

その上で、axiosを使ってurlをGETし、結果をresponseにセットします。

このとき、axios.getの前にキーワードawaitが修飾されています。awaitはasyncと対になっているキーワードで非同期処理を表現しています。

ここでは、responseはaxios.getが成功した場合にセットされ、その後の行の処理に進みます。
非同期なので、axios.getを実行したら、結果を待たずに抜けてしまいます。

ここではif (response.status === 200) 以降の処理は、axios.getが成功した後に、コールバック処理として、呼び出されます。

なので、最初の瞬間は`SET_FETCHING`をdispatchして、axios.getをリクエストする、というアクションとして実行されます。

ここでAppクラスのrenderに戻りましょう。

アクション`SET_FETCHING`がpeoplesリデューサに処理されますと、isFetchingがtrueな新しい状態が作られます。state.peoples.isFetchingが変化したので、mapStateToPropsの定義にしたがってAppクラスのプロパティisFetchingが変化しますので、renderメソッドが呼び出されます。

renderメソッドの最初のif文はisFetchingがtrueなので、次のif文に進みます。

次のif文では、プロパティisFetchingがtrueなので<div>now loading</div>をreturnします。やはり一瞬だけ、now loadingが画面に見えるかもしれません。

この後、axios.getが完了しますと、if (response.status === 200)以降が評価されます。

response.dataに https://iij.github.io/bootcamp//test.json が返してきたJSONオブジェクトが入っています。

これをアクション `FETCH_PEOPLES` にpepolesとして加えてdispatchします。

するとpeoplesリデューサによって、isFetchingがfalseであり、peoplesにアクションに含まれるpeoplesをセットした新しい状態が作られます。

新しい状態が作られたので、mapStateToPropsにある定義によって、AppクラスのプロパティisFetchingがfalseになり、peoplesに https://iij.github.io/bootcamp//test.json が返してきたJSONオブジェクトがセットされます。

プロパティが変化したので、renderが呼ばれます。

最初の2つのif文がfalseなので、最後のreturnが評価されます。

ふう。ちょっと長いセクションでしたね。

少し休憩をとりましょう。

[Reduxの概念図](./redux.png "Reduxの概念図")

## Formを作る

最後にFormを作ります。

ここでは、Peoplesの作る表の下に、AddPeopleフォームを作ることにしましょう。

AddPeopleコンポーネントをsrc/AddPeople.jsに定義しましょう。

内容は以下のとおりです。

```javascript
import React from 'react';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

class AddPeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        if (!this.state.name) {
            alert('please input name.');
        } else {
            this.props.addPeople(this.state.name);
            this.setState({ name: ''});
        }
        event.preventDefault();
    }

    render() {
        return(
          <form onSubmit={this.handleSubmit}>
              <input type="text" onChange={this.handleChange} value={this.state.name} />
              <input type="submit" value="add" />
          </form>
        );
    }
}

const makeDispatchToProps = (dispatch) => {
  return {
      addPeople(name) {
          const action = actions.addPeople(name);
          dispatch(action);
      }
  }
};

export default connect(null, makeDispatchToProps)(AddPeople);
```

いくつか新しい概念が出てきています。

まずコンストラクタを定義しています。

その内容は以下のとおり。

1. super(props)を通じてスーパークラスの初期化処理を実行します。
2. this.stateを初期化
3. this.handleChangeとthis.handleSubmitにthisをbind

1はおまじないみたいなものですが、React.Componentのサブクラスにコンストラクタを定義するための常套句です。

2で、入力フォームに入力された新しい人物の名前を保持するstateを用意します。ここでいうstateはReduxストアにあるstateとは関係がなく、Reactの基本機能として用意されているもので、プロパティのように親コンポーネントから渡されるものではなく、このコンポーネントの中に閉じた状態を保持するための機構です。

3は...これも常套句なのですが、AddPeopleクラスのメソッドhandleChangeとhandleSubmitをthisとむすびつけます...これを宣言しないと、各メソッドは単なる関数として機能し、その関数の中でthisが使えないのです。

handleChangeメソッドは、renderの中にある`<input type="text" ... />`の中のonChangeから呼び出されます。つまり入力フォームに文字を入力すると、そのonChangeイベントがhandleChangeに渡ります。event.target.valueで入力フォームに入った文字列が取得できるので、これをthis.setStateで新しい状態としてセットしています。

handleSubmitメソッドは、renderの中にある`<form>`のonSubmitから呼び出されます。

ここでは、this.state.nameが空であったらダイアログを出して入力を促し、さもなければthis.state.nameを引数にしてthis.props.addPeopleを呼び出して、さらにthis.setStateを使って入力フィールドを空にしています。

handleSubmitの最後に`event.preventDefault()`があるのもJavaScriptの常套句で、この場合はformのsubmit時のデフォルトの挙動である、そのフォームを提供したURL自身へのGETリクエストを抑止します。

this.props.addPeopleはmakeDispatchToPropsを通じてthis.propsにセットされており、その関数オブジェクトは、actions.addPeopleに引数nameを渡してアクションんを作ってdispatchしています。

addPeopleはsrc/redux/actions.jsに新しく定義します。

```javascript
export function addPeople(name) {
    return {
        type: ADD_PEOPLE,
        name,
    }
}
```

定義というほどものもでもありませんが、`ADD_PEOPLE`をアクション種別とし、引数nameを合わせ持つJSONオブジェクトを作ってreturnするだけです。

`ADD_PEOPLE`は、例によってsrc/redux/actionTypes.jsに定義します。

```javascript
export const ADD_PEOPLE = 'ADD_PEOPLE';
```

そしてsrc/redux/reducers/peoples.jsに`ADD_PEOPLE`を処理するケースを加えます。

```javascript
        case ADD_PEOPLE:
            const peoples = [];
            let maxId = 0;
            state.peoples.forEach((p) => {
                const id = Number(p.id);
               if (maxId < id) {
                   maxId = id;
               }
               peoples.push(p);
            });
            const newPeople = {
                id: maxId + 1,
                name: action.name,
            };
            peoples.push(newPeople);
            return {
                inFetching: state.inFetching,
                peoples,
            };

```

そして最後に、src/App.jsのrenderの中にAddPeopleを埋め込みます。

```JavaScript
                    <Peoples peoples={this.props.peoples} />
                    <AddPeople />
```

さあ、どうでしょう。

期待どおりに動きましたか？

<credit-footer/>
