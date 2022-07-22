---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
title: Reactでシングルページアプリケーションを書こう
description: Reactでシングルページアプリケーションを書こう
time: 2h
prior_knowledge: 特になし
---

<header-table/>

# {{$page.frontmatter.title}}

## 下準備
講義を受講する前にコンテナイメージのpullと起動をしておくことをお勧めしています。
また、Dockerの実行環境があることを前提として本講義を進めます。

### 手順

1. ハンズオン用のDockerイメージをpullしてくる

```bash
# やや重たいので注意してください
$ docker pull ryusa/bootcamp-react:2021
```

2. コンテナを起動する

```bash
# コンテナを起動する
$ docker run --name bootcamp-react -itd -p 3000:3000 ryusa/bootcamp-react:2021
```

3. アプリケーションの起動チェック

```bash
# コンテナの中にアタッチする
$ docker exec -it bootcamp-react bash
# Reactの開発用サーバーを起動する
❯ npm start
# ...
# いろんなログが流れる
```

4. 動作チェック

ホストマシンから適当なブラウザ(※IEを除く)から[localhost:3000](http://localhost:3000)にアクセスし、Welcomeページが表示されることを確認してください。

![welcome](./images/welcome.png)

## 始めに

本講義ではReactの動作原理を学びながら簡単なシングルページアプリケーションの作成を通して、今後の技術的な選択肢を増やすことを目的としています。

### 達成目標

- フロントエンド開発を経験する
- コンポーネントベース開発を経験する
- React開発の流れを理解する

### 本講義の前提

本講義ではプログラム言語共通の制御構文や概念、たとえばif文や型など、の解説は行いません。そのため、受講者は何らかのプログラミング言語で簡単な制御構文が書けることを前提とさせてください。

### この資料のお約束
:computer: は自分で操作する箇所を示しています。 また`$`はホストマシンのプロンプトを意味し、`❯`はコンテナ内部でのプロンプトを意味します。

たとえば下記の通りです。

```shell
# ホストマシン上で git clone git@github.com:iij/bootcamp.git を実行する
$ git clone git@github.com:iij/bootcamp.git

# コンテナ上で curl localhost:3000 を実行する
❯ curl localhost:3000
```

## Reactとは

Reactは、もともとFacebook社が開発しているWebユーザーインタフェースのためのフレームワークです。2021年6月現在のGoogleトレンドをみる限りフロントエンドフレームワークとしてのシェアは世界一位となっており、多種多様な場所で利用されています。\
IIJでもいくつかの製品のフロントエンドとしてReactが採用されています。

公式サイト：[React - ユーザインターフェース構築のためのJavaScriptライブラリ](https://ja.reactjs.org/)

ReactはVueやAngularと同じくコンポーネントベースでWebUIを実装していくフレームワークです。細かくコンポーネントを分離することでアトミックデザインなUIを実装しやすくなります。
また型を持つTypeScriptとの相性も非常に良いため、開発者からの評価も高いです。

:::tip Create React App

Reactを始めるための方法としては、いくつかの方法があります。

- Reactの基礎を体験したい = オンラインサービスを使う
  - [CodePen](https://reactjs.org/redirect-to-codepen/hello-world)
  - [CodeSandbox](https://codesandbox.io/s/new)
  - [Glitch](https://glitch.com/edit/#!/remix/starter-react-template)
- 既存のHTMLページの中にReact埋め込みたい = 下記のチュートリアル
  - [Add React to a WebSite](https://reactjs.org/docs/add-react-to-a-website.html)
- フルにReactを使ってアプリケーションを作りたい = Create React App
  - [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)

このハンズオンでは、最初からReactを使うことを想定してCreate React App を使ったプロジェクトひな型を作成しています。詳細は[Dockerfile](https://github.com/iij/bootcamp/blob/master/src/frontend/react/Dockerfile)を参考にしてください。

:::

### シングルページアプリケーションとは
シングルページアプリケーション(以下SPA)とはフロントエンドアプリケーションの構成のひとつです。

[シングルページアプリケーション | Wikipedia](https://ja.wikipedia.org/wiki/シングルページアプリケーション)

特徴として
- HTMLとCSS、そしてJavaScriptのファイルのみで構成
  - HTMLは単一
  - サーバーとの通信は原則API経由
- DOMの操作や変更はJavaScriptで実施
  - 物理DOMの操作と比べて軽量
  - 滑らかな画面遷移によるユーザー体験

といったものが挙げられます。`create-react-app`で構成したReactプロジェクトはデフォルトでSPAがビルドできるようになっています。Reactプロジェクトをビルドすることで最終成果物である「HTML」「CSS」「JavaScript」が生成され、それらをNGINXなどのWebサーバーで配信することができます。

なおすべてのフロントエンドアプリケーションがSPAであるわけではなく、SPAでないものとしてSSR(=サーバサイドレンダリング)が挙げられます。これはサーバー側でユーザーのリクエストに合わせてDOMを動的に構築し、HTMLとしてユーザーに配信する構成です。Angular Universalなどではこの方式でアプリケーションを配信します。

## Reactハンズオン
実際にReactに触れてみましょう。本講義ではTypeScriptを使ってReactを書いていきます。

### Hello World

Reactの開発サーバは、ソースコードの変更を検知してその変更をブラウザに伝えてくれます。
さっそくひとつやってみましょう。

これから先、ファイルを編集することになるので別のシェルを取得して進めてください。

```bash
# 別のターミナルでシェルを取得しておく
$ docker exec -it bootcamp-react bash
❯ 
```

:computer: src/App.tsxを開き下記の通りに編集してください。

```tsx{7}
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello World!!</p>
      </header>
    </div>
  );
}

export default App;
```

編集して保存するとブラウザが自動的にリロードされ、下記のような画面に変わります。

![helloworld](./images/helloworld.png)

::: warning 自動的にリロードされない場合
リロードがうまくいかない場合、開発用サーバーでエラーが起きてしまっている可能性があります。その場合は開発用サーバーを一度止め、再起動してあげてください。

```bash
❯ npm start
```
:::

#### チェックポイント
- ReactでHello Worldを実施した

### コンポーネントを作成してみる

ReactはUIの部品をコンポーネントという単位に分割することで、ロジックやスタイルなどの再利用性を高めて実装を行います。

:::tip なぜコンポーネントを使うのか

ReactではなくVueですが、こちらの記事が非常にわかりやすい例です。VueとReactともにコンポーネントベースのフレームワークですので、根幹は一緒です。

気になる人は読んでみてください。

[ワイ「何でそんな小っさいコンポーネント作ってるん？ｗ」 | Qiita](https://qiita.com/Yametaro/items/e8cb39b1a20b762bfafa)

:::

まず小さなコンポーネントを作ってみましょう。コンポーネントを記述する方法はいくつかありますが、まずクラスベースのコンポーネントを作成してみます。

:computer: src/Note.tsxを作成し、下記の通り編集してください。

```tsx
import React from "react";

// interface: TypeScriptにおけるインタフェース(抽象型)
interface NoteState {}
interface NoteProps {}

export default class Note extends React.Component<NoteProps, NoteState> {
  render() {
    return <p>Component! Component!! Component!!!</p>;
  }
}
```

:computer: さらにsrc/App.tsxがNote.tsxを使うように修正してください。

```tsx{2,8-9}
import './App.css';
import Note from './Note';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Note />
        <Note />
      </header>
    </div>
  );
}

export default App;
```

さあ、[localhost:3000](http://localhost:3000)にアクセスするとブラウザに表示されている内容が変化したと思います。

![componentcomponentcomponent](./images/componentcomponentcomponent.png)

このようにReactではコンポーネントというUI部品を組み合わせることでデザイン、UIを作成していきます。

#### チェックポイント

- クラスベースコンポーネントの書き方を学んだ
- コンポーネントの使い方を学んだ

### コンポーネントの機能 - 小要素へのデータの共有 : Props

`Note` コンポーネントを作成しましたが、今のままでは"Component! Component!! Component!!!"と叫ぶだけのコンポーネントで再利用性が悪いです。

他も文字を叫ぶことができるように、叫ぶ文字を外から渡してあげることができるようにしましょう。

:computer: src/Note.tsxを下記のように修正してみましょう。

```tsx{5-6,11-18,21}
import React from "react";

interface NoteState {}
interface NoteProps {
  counter: number
  word: string
}

export default class Note extends React.Component<NoteProps, NoteState> {

  // ES6から導入されたアロー関数
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  // (3, "Component") => "Component! Component!! Component!!!"
  constructWord = (counter: number, word: string) => {
    let words = "";
    [...Array(counter)].map((_: number, i: number) => words += word + "!".repeat(i + 1) + " ")
    return words.trimEnd()
  };

  render() {
    return <p>{this.constructWord(this.props.counter, this.props.word)}</p>;
  }
}
```

:computer: src/App.tsxを修正してください。

```tsx{8-10}
import './App.css';
import Note from './Note';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Note counter={1} word={"Component"} />
        <Note counter={2} word={"Hoge"} />
        <Note counter={3} word={"Huga"} />
      </header>
    </div>
  );
}

export default App;
```

ここまで修正すると、下記の通りにブラウザの表示が変わります。

![props](./images/props.png)

親コンポーネントからデータを注入できるように`props`を適切に定義することで、コンポーネントの再利用性をあげることができます。
注意が必要なこととして`props`はReadonlyなため、`props`の中身を書き換えたりすることはできません。

#### チェックポイント

- コンポーネントにおける`Props`について学んだ
- コンポーネントの親子間のパラメータの受け渡し方を学んだ

### コンポーネントの機能 - 内部データストア : State

`props`フィールドを通じてコンポーネント間のデータの受け渡しはできましたが、ユーザーからの入力や外部から取得した情報はどのように保存するべきでしょうか？
コンポーネントにはStateというデータの保存する機構が付属されています。試しに、ユーザーがボタンを押した数だけ叫ぶ回数を増やすように実装してみましょう。

:computer: src/Note.tsxを下記の通りに修正してください。

```tsx{4,8,13-19,21-28,39-46}
import React from "react";

interface NoteState {
  counter: number
}

interface NoteProps {
  word: string
}

export default class Note extends React.Component<NoteProps, NoteState> {

  constructor(props: NoteProps) {
    super(props)
    // Stateの初期化
    this.state = {
      counter: 1
    }
  }

  // クリック時のハンドラー
  onClickHandler = () => {
    // StateをsetStateメソッド経由で更新
    // setStateでStateを更新するとDOMの再レンダリングが行われます
    this.setState({
      counter: this.state.counter + 1
    })
  }

  // (3, "Component") => "Component! Component!! Component!!!"
  constructWord = (counter: number, word: string) => {
    let words = "";
    [...Array(counter)].map((_: number, i: number) => words += word + "!".repeat(i + 1) + " ")
    return words.trimEnd()
  };

  render() {
    return (
      <>
        {/* ボタンをクリックされたらclick()メソッドが発火し、Stateが更新される */}
        <button onClick={this.onClickHandler}>
          Click me!!
        </button>
        {/* Stateのカウンタの数だけ叫ぶ */}
        <p>{this.constructWord(this.state.counter, this.props.word)}</p>
      </>
    )
  }
}
```

:computer: さらに下記の通りにsrc/App.tsxを修正してください。

```tsx{8-10}
import './App.css';
import Note from './Note';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Note word={"Component"} />
        <Note word={"Hoge"} />
        <Note word={"Huga"} />
      </header>
    </div>
  );
}

export default App;
```

ここまで修正すると下記の通りになります。

![state](./images/state.png)

Stateはコンポーネントの内部でのみ生きているデータベースのようなものです。Stateを`setState`メソッド経由で更新を行うと、関連するコンポーネントやDOMが自動で更新されます。

実際に"Click me!!"のボタンをクリックしてみてください。

#### チェックポイント

- Stateを利用してコンポーネント内部で使えるローカルストアを作成できる
- `setState` メソッドでStateを更新するとコンポーネントが自動でリロードされる

:::tip Redux

Stateを利用することで、単一のコンポーネントでデータを保存できることがわかりました。しかし認証やフォームデータなど複数のコンポーネントを跨ってグローバルに書き込みを行いたい場合もあります。またStateをもっと複雑に利用したいケースもでてきます。

その場合はReduxというモジュールを使うと良いでしょう。Reduxはアプリケーションの状態を管理するためのモジュールでReactと親和性が非常に高いためよく利用されます。

ただしReduxは扱いに癖があり、ハンズオンなどの短い時間での導入が難しいためこのハンズオンでは紹介にとどめておきます。

詳しくはこちら > [React Redux](https://react-redux.js.org/introduction/quick-start)

:::

### コンポーネントの機能 - ライフサイクル管理: LifeCycle

少しコンポーネントの複雑な機能について触れてみましょう。今まではコンポーネントそのものに注力しましたが、ここではコンポーネントの作成の方法に注視してみましょう。

コンポーネントの中には[WebSocket](https://developer.mozilla.org/ja/docs/Web/API/WebSockets_API)や[HTTP SSE](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)を利用した購読を行うものも多々あると思います。\
多くのWebサイトで「画面の初期表示のタイミングで外部からデータを取得して画面に表示する」というケースを見かけます。この機能はコンポーネントのライフサイクルを利用することで実現できます。実装してみましょう！

:computer: src/Note.tsxを下記のように修正します。

```tsx{5,12-19,27,31-39,54-65}
import React from "react";

interface NoteState {
  counter: number
  isLoaded: boolean // コンポーネントのロードステータス
}

interface NoteProps {
  word: string
}

// ただ時間待ちするだけのタスク
const someHeavyTask = (handler: () => void) => {
  // 2秒後に引数として渡された関数`handler`がキックされます
  // 処理時に外から渡されたサブルーチンを実行することをコールバックと呼びます
  setTimeout(() => {
    handler()
  }, 2000)
}

export default class Note extends React.Component<NoteProps, NoteState> {

  constructor(props: NoteProps) {
    super(props)
    this.state = {
      counter: 1,
      isLoaded: false // 初期ではロード中扱い
    }
  }

  // DOMツリーにコンポーネントが追加された直後に呼び出されるメソッド
  // React.Componentに定義されているメソッドです
  componentDidMount = () => {
    someHeavyTask(
      () => this.setState({
        isLoaded: true
      })
    )
  }

  onClickHandler = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  constructWord = (counter: number, word: string) => {
    let words = "";
    [...Array(counter)].map((_: number, i: number) => words += word + "!".repeat(i + 1) + " ")
    return words.trimEnd()
  };

  render() {
    const loading = <p>Loading...</p>
    const component =
      <>
        <button onClick={this.onClickHandler}>
          Click me!!
        </button>
        <p>{this.constructWord(this.state.counter, this.props.word)}</p>
      </>

    // StateのisLoadedがfalseの場合、"Loading..."が表示されます
    const note = this.state.isLoaded ? component : loading
    return note
  }
}
```

一瞬"Loading..."という文字列が見えた瞬間、画面表示されるようになったと思います。

![componentdidmount](./images/componentdidmount.gif)

初めて出てきた`componentDidMount`メソッドは`React.Component`で定義されているメソッドで、ブラウザ上にコンポーネントが描画された直後に走るメソッドです。

Reactのコンポーネントは`componentDidMount`のようにいくつかのライフサイクル用のメソッドが用意されています。
これらのライフサイクルメソッドを利用することでコンポーネントの初期化や後処理を定義できます。

[React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

それぞれのタイミングで実施したい処理があれば、それぞれのメソッドの中に実装してあげると良いでしょう。

詳しくはこちら > [state とライフサイクル | React Docs](https://ja.reactjs.org/docs/state-and-lifecycle.html)

#### チェックポイント
- コンポーネントにライフサイクルがあることを理解した
- ライフサイクルに合わせてフックを作成することができた

### Hooksを導入する
Reactのコンポーネントを表現する方法としてクラスベースなやり方を見てきました。\
クラスベースなコンポーネントは便利な一方でライフサイクルが読み取りにくくなる傾向にあり、複雑なコンポーネントになるほどメンテナンス性が悪くなりがちです。

元に、最初はシンプルだった`Note`コンポーネントもだいぶ大きくなりライフサイクルが入り乱れわかりにくくなってしまいました。(そうなるように書いてもらった、のですが……) `Note`コンポーネントのライフサイクルの全体像を眺めるには、コンストラクタと`componentDidMount`、そして`render`とを行ったり来たりする必要があります。スマートではないですね。

ReactにはReact Hooksという機能が存在しており、これは最初に紹介した関数型コンポーネントに簡単なライフサイクルの管理とステートの保持の機能を接続することができるものです。

詳細：https://ja.reactjs.org/docs/hooks-intro.html

実際にReact Hooksで今までの実装を再実装してみましょう！

:computer: 新たにsrc/NewNote.tsxを作成し、下記の通り記述してください。

```tsx
import { useEffect, useState } from "react";

interface NoteProps {
  word: string
}

const someHeavyTask = (handler: () => void) => {
  setTimeout(() => {
    handler()
  }, 2000)
}

// 関数型コンポーネントとして定義します
// ライフサイクルは基本的に「上から下」に流れていきます
export default function Note(props: NoteProps) {

  // Stateはシンプルに`useState`で定義します
  // 第一返値にStateそのもの、第二返値にStateの更新トリガーが入ります
  // 更新トリガーを経由してStateを更新することで後述の`useEffect`を呼び出すことになります
  const [counter, setCounter] = useState<number>(1)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // 副作用フック
  // componentDidMountなどに相当している挙動をするものです
  useEffect(() => {
    someHeavyTask(() => {
      setIsLoaded(true)
    })
    // 返り値にコールバック関数を指定することで、componentWillUnMountに相当する挙動を行うことができます
    // たとえば、WebSocketの破棄などを指定することが多いです
    // return () => FooBar
  })

  const onClickHandler = () => {
    setCounter(counter + 1)
  }

  const constructWord = (counter: number, word: string) => {
    let words = "";
    [...Array(counter)].map((_: number, i: number) => words += word + "!".repeat(i + 1) + " ")
    return words.trimEnd()
  }

  const loading = <p>Loading</p>
  const component =
    <>
      <button onClick={onClickHandler}>
        Click me!!
      </button>
      <p>{constructWord(counter, props.word)}</p>
    </>

  // 関数型コンポーネントなのでDOMを返却するだけ
  return isLoaded ? component : loading  
}
```

:computer: src/App.tsxでNoteのimport元を差し替えてください。

```tsx{2}
import './App.css';
import Note from './NewNote';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Note word={"Component"} />
        <Note word={"Hoge"} />
        <Note word={"Huga"} />
      </header>
    </div>
  );
}

export default App;
```

今回はあくまでもUIコンポーネントの構造をクラスベースなものから関数ベースなものに差し替えただけなので、見た目上UIが変わっていないはずです。しかし関数型コンポーネントはクラスベースなコンポーネントの時と比べ、ライフサイクルが常に上から下に流れるようになったためコンポーネントとしてのライフサイクルが読みやすくなりました。

#### チェックポイント
- React Hooksを利用してコンポーネントを実装した

### Reactアプリケーションをデプロイする
さてこれまでは開発サーバーでReactを動かしてきました。実際にReactプロジェクトをビルドし、SPAをNGINXで配信してみましょう。

:computer: Reactプロジェクトをビルドします。

```bash
# プロジェクトルート上でビルドします
❯ npm run build
# 成果物があることを確認します
❯ ls build/
asset-manifest.json  index.html   logo512.png    robots.txt
favicon.ico          logo192.png  manifest.json  static
```

:computer: 成果物をホストマシンにコピーしてきます

```bash
# 成果物を適当なディレクトリにコピーしてきます
$ docker cp bootcamp-react:/app/build ./
```

:computer: nginx上にSPAをデプロイ

```bash
# buildディレクトリをそのままマウント
$ docker run --rm -d -p 9000:80 --name react-prod -v ${PWD}/build/:/usr/share/nginx/html/ nginx:latest
```

以降ホストマシン側の[localhost:9000](http://localhost:9000)へアクセスすると、先ほど作成したSPAが画面に表示されているはずです。


# 最後に

以上でReactのハンズオンは終了です。

昨今のフロントエンド界隈は比較的落ち着いてきた(=デファクトが固まりつつある)印象がありますが、それでも変化の早い世界です。この文書も、いつ時代遅れになるかもわかりません。

ですが、フロントエンドはアプリケーションの花形です。ぜひフロントエンドの知見を日々広げ、花形の開発者として活躍してもらえればうれしいです。

<credit-footer/>
