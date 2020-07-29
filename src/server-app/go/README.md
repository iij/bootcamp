---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Go言語を使って簡単なWebアプリを作ります
time: 1.5h
prior_knowledge: golang
---

<header-table/>

# GoでWebアプリを作る

## 0. この講義について
### 0.1. この講義の目的
Goについての概要の解説とGoでWebアプリケーションを作ることを通して特徴を知り、サービスや手元ツールなどの実装言語を選択する際の候補に挙げられるようになることを目的としています。

### 0.2. ハンズオンの対象者
開発部署だけでなく、今後は運用等の部署でもプログラミングの能力を求められることが多くなると予想されます。 \
GoはWebサービスだけでなく、配布が楽という面もあり、部署内で使う小さな便利ツールを作る際にも有効な選択肢となり得ます。 \
そのため対象の部署に制限はありません。 \
また、`if`や`for`はGoではどのような文法なのかは解説しますが、`if`/`for`とはどのような意味の制御構文であるのか、という説明は基本的にありませんので、可能であれば何かしらのプログラミング言語を入門書を写経したレベルでよいので経験しておくとより楽しめるかと思います。 \
// これは何も質問が無ければ通常のプログラミング言語で使われる表現は知っているものという前提で講師が話します、という宣言であって、"`if`とはどういう意味でしょうか"といった質問をいただければ喜んで答えますので安心してください(?)。

### 0.3. 事前準備
[GoでWebアプリを作る(事前準備編)](./init.md)を参考に準備をおねがいします。
本ハンズオンではdockerコンテナ内でファイルを編集し、コードをコンパイルし、実行する想定です。 \
用意したdockerコンテナにはVim/Emacs/nanoといったエディタを用意しているため、好きなエディタを利用してください。 \
// 筆者はVimmerであるため例はVimで書きます。 \
それ以外のエディタを利用したい場合はGo言語の実行環境を自分で用意していただき、好きなエディタでファイルを編集するなり、用意したdockerコンテナにホストのディレクトリをマウントしてファイルを共有するなどすれば可能です。 \
ハンズオン自体は用意したdockerコンテナ内で作業をする前提なので環境面で十分なサポートを受けられない可能性があることはご承知ください。 \
// もちろん可能な限りサポートはします。

### 0.4. この資料のお約束
:computer: は自分で操作する箇所を示しています。 \
<ほげほげ> で囲まれている部分は自分の設定値で置き換えてください。 \
また、`$`はプロンプトを意味し、実行の際に入力しません。たとえば

```shell
$ git clone <リモートリポジトリのアドレス>
```

と記載されており、リモートリポジトリのアドレスが`git@github.com:iij/bootcamp.git`の場合は

```shell
git clone git@github.com:iij/bootcamp.git
```

をターミナル上で入力してください。

## 1. Goとは
Googleが主導して開発しているプログラミング言語です。 \
ググラビリティが低いのでGolangやGo言語と書かれることもありますが、言語としての正式名称はGoです。 \
参考: [開発者の一人(Rob Pike 氏)のツイート](https://twitter.com/rob_pike/status/886054143235719169)

### 1.1. 特徴
参考: [今改めて読み直したい Go基礎情報 その1](https://budougumi0617.github.io/2019/06/20/golangtokyo25-read-again-awesome-go-article/) \
参考: [Go入門](https://www.slideshare.net/takuyaueda967/2016-go)

#### 1.1.1. クロスコンパイルが簡単
* 標準パッケージ(ライブラリ)が、クロスコンパイルされることを前提としてOS毎の違いを吸収するように記述されています
  * もちろんLinuxにしか無い機能、Windowsにしか無い機能というのがあるので、そういう機能を直で触るようなアプリケーションを書く場合は、他の言語と同様に自分で異なるOSで実行できるように書かなければなりません
  * その他実行効率が良くなるように実装の最適化が行われていたりするので、標準パッケージ(ライブラリ)は積極的に利用しましょう

#### 1.1.2. 学習コストが低い
* 設計思想としてSimplicityを是としています
  * 参考: [Simplicity is Complicated](https://talks.golang.org/2015/simplicity-is-complicated.slide#1)
* 言語仕様が小さくまとまっています
  * 例えば、使用されるキーワードは25個しかありません
    * [The Go Programming Language Specification#Keywords](https://golang.org/ref/spec#Keywords)
  * 参考: [The Go Programming Language Specification](https://golang.org/ref/spec)
  * 最近大きな言語仕様追加の提案(型パラメータの実現)が出ていますが、現行有力なドラフト版の最新ではキーワードを追加せずに実現できるようになる予定です
    * もう少し具体的には後述するinterfaceという機能を少し拡張することで対応されます
* 抽象化のための言語機能が少ないため、愚直に実装する場面が多く、読み書きで迷うことがあまりありません

#### 1.1.3. 並行プログラミングが文法レベルでサポートされている
* Goroutine: 軽量スレッドのようなもの
  * 一つのOSスレッド内に複数のGoroutineがスケジューリングされます
* 並列に動く、とは一言も言っていない点には注意が必要です
  * つまり、例えばシングルコアのCPU上で動かすと並列には実行されないがコード上の記述は変わりません
  * 並列処理とは実際に処理が同時に行なわれることだが、並行処理とはプログラマがコードに対して同時に動作するように命令することです
    * 並列処理/並行処理の定義については諸説あるようなので、Goの文脈で語られることの多い定義は上記であると認識しておく必要があります
    * 参考: [Go言語による並行処理](https://www.oreilly.co.jp/books/9784873118468/)
* もちろん他言語の並行処理機能と同様に上手く使わないと性能が出ないのでその点での優位性はほとんど無いといっていいかもしれません
  * それはGoroutineが難しいのではなく、並行処理が難しいのです

#### 1.1.4. 周辺ツールが標準で提供されている
* go build: ソースコードのビルド
* go test: テスト実行
* go fmt: コードフォーマッタ
* go vet: 静的解析
* go doc: ドキュメント生成
* go mod: モジュール管理
* ...
  * 参考: [コマンド一覧](https://golang.org/cmd/)

#### 1.1.5. 標準パッケージが充実している
* testing: テスト記述
* net/http: HTTPサーバ/クライアントなど
* html/template: HTMLテンプレート(Pythonで言うjinja2みたいなもの)
* database/sql: DB操作
* ...
  * 参考: [標準パッケージ一覧](https://golang.org/pkg/)

### 1.2. どこで使われているの?
* [Kubernetes](https://github.com/kubernetes/kubernetes)
* [Docker](https://github.com/docker/docker-ce)
* [ghq](https://github.com/x-motemen/ghq)
* [peco](https://github.com/peco/peco)

コンテナ関連(Kubernetes 関連)やCLIツールでの採用が多い印象があります。

## 2. Hello, 世界
[The Go Playground](https://play.golang.org/p/7vin2BK8_A6) \
チュートリアルリポジトリの`hello_world`ディレクトリにサンプルコードが入っています。

### 2.1. Goの基本的なコードの書き方を知る
#### 2.1.1. 作業ディレクトリの作成
:computer: 以下のコマンドを実行して、作業ディレクトリを作成しましょう。

```shell
$ mkdir -p go_tutorial/hello_world
$ cd go_tutorial/hello_world
```

#### 2.1.2. ソースコードの記述
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/hello_world/main.go`
```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

```shell
$ vim main.go
```

#### 2.1.3. コンパイルと実行
:computer: 以下のコマンドで書いたコードを実行しましょう。

```bash
$ go run main.go
```

::: tip チェックポイント1 🏁
2.1.3. を実行して以下の出力が得られたらクリア
```
Hello, 世界
```
:::

#### 2.1.4. どこまでが言語仕様?(追加課題)
余裕がある人は以下の課題をやってみましょう。

実行ファイルには`main`という文字列が3箇所表れます。これらのうち、一言一句`main`という文字列でなければならないところはどこでしょうか。

`main`が表れる3箇所とは以下のことです。

* ファイル名: `main.go`
* `package`の直後: `package main`
* `func`の直後: `func main() {`

:computer: 上記を一つずつ`main`から適当な文字列に変えながら2.1.3.と同様に`go run`を実行し、実行できるかどうか、実行できなかった場合はどのようなエラーが出力されるのかを確認しましょう。

:computer: さらに余裕がある人は実行できなかった部分について、その根拠となる文言を以下の仕様書から探してみましょう。

* [The Go Programming Language Specification#Program_initialization_and_execution](https://golang.org/ref/spec#Program_initialization_and_execution)

### 2.2. 解説
#### 2.2.0. The Go Playground
[The Go Playground](https://play.golang.org)はGoのプログラムを手軽に実行できる環境で、Go公式によって用意されています。

HTTPサーバなどは実行してもアクセスできないので意味はないですが、簡単なコードを試しに動かしたり、コード片を共有するときに非常に便利です。

念の為ですが、センシティブな情報(実際の顧客情報やパスワードなど)をここで入力してはいけません。

#### 2.2.1. パッケージの宣言
```go
package main
```

Goのプログラムはパッケージ単位で構成されます。 \
そして、Goのプログラムは必ず`main`パッケージから実行されます。 \
例えば、先の例でpackage名を`hoge`にするとエラーが返ってきます。 \

* `main.go`
[The Go Playground](https://play.golang.org/p/rlUktSgVozz)

```go
package hoge

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

```bash
$ go run test.go
go run: cannot run non-main package
```

`main`ではないpackageから実行することはできません。という内容のエラーが返ってきます。

#### 2.2.2. 外部パッケージの読み込み
```go
import "fmt"
```

他パッケージで定義された関数などを`import`文で読み込むことができます。 \
ここでは[`fmt`](https://golang.org/pkg/fmt)という標準パッケージで定義された関数([`Println`](https://golang.org/pkg/fmt/#Println))を実行したいので、事前にここで読み込む必要があります。

```go
  fmt.Println("Hello, 世界")
```

#### 2.2.3. 関数の定義
```go
func main() {
  fmt.Println("Hello, 世界")
}
```

Go の関数定義は`func`キーワードで行います。 \
ここで`main`という名前の引数も戻り値もない関数を定義しています。

```go
func main() {
```

Goでコンパイルされた実行可能ファイルは`main`パッケージで定義された`main`関数から実行されます。 \
`fmt.Println()`は標準出力に引数の文字列(ここでは`Hello, 世界`)を出力します。

### 2.3. まとめ
* Goのコードは`main`パッケージの`main`関数(引数返り値なし)から実行されます
* 標準出力に文字列を出力させる関数(のうちの一つ)は`fmt.Println()`です
* 外部パッケージの関数を呼び出すためには事前に`import`文を用いてパッケージを読み込む必要があります

## 3. パッケージ/モジュール
[The Go Playground](https://play.golang.org/p/gRneR3EcYRB)

* チュートリアルリポジトリの`calc`ディレクトリにサンプルコードが入っています。

## 3.1 パッケージを分けて、モジュールを宣言する
### 3.1.1. 作業ディレクトリの作成
:computer: 以下のコマンドを実行して、作業ディレクトリを作成しましょう。

```shell
$ cd .. # go_tutorial/hello_world ディレクトリにいることを想定
$ mkdir calc
$ cd calc
```

### 3.1.2. モジュール宣言ファイルの作成
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/calc/go.mod`
```go
module calc
```

```shell
$ vim go.mod
```

### 3.1.3. `arithmetic`パッケージディレクトリの作成
:computer: 以下のコマンドを実行して、後に定義する`arithmetic`パッケージ用のディレクトリを作成しましょう。

```shell
$ mkdir arithmetic
```

### 3.1.4. `arithmetic`パッケージの定義
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/calc/arithmetic/add.go`
```go
package arithmetic

func Add(a int, b int) int {
  c := a + b
  return c
}
```

```shell
$ vim arithmetic/add.go
```

### 3.1.5. `main`関数の定義
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/calc/main.go`
```go
package main

import (
  "fmt"
  "calc/arithmetic"
)

func main() {
  fmt.Println(arithmetic.Add(1, 2))
}
```

```shell
$ vim main.go
```

### 3.1.6. コンパイルと実行
:computer: 以下のコマンドで書いたコードを実行しましょう。

```bash
$ go run main.go
```

::: tip チェックポイント2 🏁
3.1.6. を実行して以下の出力が得られたらクリア

```
3
```
:::

### 3.1.7. なんでパッケージを切るの?(追加課題)
余裕がある人は以下の課題をやってみましょう。

:computer: `calc`モジュールに引き算処理を追加するならばどのファイルに追加するのが良いか考えてみましょう。

::: tip ヒント
`go_tutorial/calc/add.go`に置くもよし、`go_tutorial/calc/` 内に別ファイルとして置くもよし。 \
もちろんその他の置き方もあるでしょう。 \
自分が自然だと思う方法で配置して、なぜそれを自分が自然と思えたか/その他を自然と思えなかったのかを考えてみましょう。
:::

:computer: `calc`モジュールにsin関数による計算処理を追加するならばどのファイルに追加するのが良いか考えてみましょう。

### 3.2. 解説
#### 3.2.1. `go.mod`
このファイルはGoのコードを外部から読み込むときの名前を定義したり、ソースコードで利用している外部モジュールは何か、そのバージョンは何かなどの情報を記述するためのファイルです。 \
RubyだとGemfileに相当します。

```go
module test
```

このように書くことで、このモジュールは`test`という名前であると宣言し、その名前で外部から呼べるようになります。 \
TODO: この`test`モジュールを外から呼ぶのは難しいこととその理由を簡単に書く

`main.go`ファイルの中には以下のような記述があります。

```go
import (
  "fmt"
  "calc/arithmetic"
)
```

ここで`calc/arithmetic`というのは`calc`モジュールの`arithmetic`パッケージを読み込んでいると解釈されます。 \
また、`calc/arithmetic`ではディレクトリ構造も指定されており、Goコンパイラは`arithmetic`パッケージを探す際に以下のようなディレクトリに配置されていることを前提とします。

```
- calc/
  - main.go (`package main`と宣言されている)
  - arithmetic/
    - add.go (`package arithmetic`と宣言されている)
```

Goでいうパッケージのような、ソースコードを分類するための機構(名前空間とも言う)は様々な言語に存在します。 \
// Rubyでいうmodule、Javaのpackageなどなど...

名前空間を切る理由は様々あるかと思いますが、一つは同じ役割の処理を同じ名前空間内に入れることで、ソースコードを読みやすく、機能追加しやすくするという目的があります。 \
今回のサンプルに引き算をする処理を追加するとしたらどこに配置するのが自然かを考えてみてください。 \
またsin関数の計算処理を追加するとしたらどこが良いでしょうか。

一つの回答例は以下のようになるかと思います。

```
- calc/
  - main.go
  - trigonometric/
    - sin.go (sin関数の計算処理が記述される)
  - arithmetic/
    - add.go
    - del.go (引き算の処理が記述される)
```

パッケージをどのように切るのかについては様々な議論があります。それぞれメリットデメリットがあり、銀の弾丸は存在しません。もちろん私も試行錯誤を繰り返しています。 \
みなさんも自分のツールを書く際はいろいろ試してみると良いかと思います。 \

#### 3.2.2. 続・func
```go
func Add(a int, b int) int {
  c := a + b
  return c
}
```

今回定義した`Add()`関数を読んでいきましょう。

まず最初の行では`Add()`関数はどういう型の引数を取り、どういう型の返り値を返すのかを定義します。 \
今回は`int`型の`a`、`b`二つの引数を取り、`int`型の値を返すという定義になっています。 \

また、Goの型名は変数宣言の後ろに書くことに注意しましょう。 \
参考: [Go's Declaration Syntax](https://blog.golang.org/gos-declaration-syntax)

`Add()`関数の最初の文字が大文字になっていることを疑問に思った方がおられるかもしれません。 \
これはパッケージの外からその関数が呼び出せるかどうかを制御するための仕組みです。 \
// Javaでいう`private`/`protected`/`public`のようなものですが、Goにはパッケージ単位でしか公開非公開を制御することはできません。

他の言語では公開すると宣言するための特別な文字列(`public`のような)がありますが、Goではただ大文字から始めるだけで外部から呼び出せるようになります。 \
ここまで使ってきた関数に`fmt.Println()`がありますが、これも同じルールに従っていることが分かります。 \
つまり`main`パッケージから見て外部パッケージである`fmt`パッケージの関数を呼び出しているので関数名は大文字から始まっている必要があります。

Go での変数宣言にはいくつか方法があり、一番単純なのは今回使用した、

```go
c := a + b
```

の形式です。 \
ここで他の(一部の)静的型付言語を利用したことのある方は`c`の型を指定していないじゃないか、と思われるかもしれません。 \
ここでは`+`という演算子が左被演算子、右被演算子、返り値の型が全て同一であるということと`a`、`b`の型が`int`であることからGoコンパイラがよしなに`c`は`int`型であると判断してくれるので記述する必要がありません。 \
これはHaskell等の言語にも採用されている型推論という機能によるものです。
// もちろんHaskellのような強力な型推論をしてくれる訳ではありませんので、このような自明な場合のみ補助してくれる程度です。

以下のように明示的に型名を書くことも出来ます。

```go
var c int = a + b
```

また、

```go
var c = a + b
```

という宣言方法もあります。 \
`:=`による宣言は関数定義の中でしか書けないという制約があります。 \
そのため、グローバル変数の宣言など関数の外部で変数を宣言したい場合は`:=`による宣言を使用できず、`var`による宣言をする必要があります。

最後に`Add()`関数を呼び出している部分を見てみましょう。

```go
func main() {
  fmt.Println(arithmetic.Add(1, 2))
}
```

外部パッケージで公開されたものを使う際は`fmt.Println()`のように`<パッケージ名>.<関数名>`という形式を取ります。 \
// ここで"もの"としたのは関数だけではなく変数や型も同様の方法で公開することができるからです。

`arithmetic`パッケージの`Add()`関数を呼び出したいので`arithmetic.Add()`のように呼び出します。

ここでは更に`arithmetic.Add()`の返り値をそのまま`fmt.Println()`で標準出力に出力させています。

## 4. 型定義とメソッド
[The Go Playground](https://play.golang.org/p/Ne2xRnC0Ggl)

* チュートリアルリポジトリの`pokemon`ディレクトリにサンプルコードが入っています

### 4.1. ポケモンのダイマックスわざを出力したい
[なんでもかんでもポケモンで例えれば分かりやすいってみんな言ってる!](https://tepppei.hatenablog.com/entry/2020/07/25/230828)

#### 4.1.1. 作業ディレクトリの作成
:computer: 以下のコマンドを実行して、作業ディレクトリを作成しましょう。

```shell
$ cd .. # go_tutorial/calc ディレクトリにいることを想定
$ mkdir pokemon
$ cd pokemon
```

#### 4.1.2. ソースコードの記述
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/pokemon/main.go`
```go
package main

import (
	"errors"
	"fmt"
	"os"
)

type Pokemon struct {
	ID    int
	Name  string
	moves []Move
}

func (p Pokemon) Moves(isDynamax bool) ([]Move, error) {
	if isDynamax {
		dynamaxMoves := []Move{}

		for _, move := range p.moves {
			dynMove, err := move.dynamax()
			if err != nil {
				return nil, err
			}

			dynamaxMoves = append(dynamaxMoves, dynMove)
		}

		return dynamaxMoves, nil
	}

	return p.moves, nil
}

type Move struct {
	Name string
	Type string
}

func (m Move) dynamax() (Move, error) {
	switch m.Type {
	case "くさ":
		return Move{
			Name: "ダイソウゲン",
			Type: m.Type,
		}, nil
	case "ほのお":
		return Move{
			Name: "ダイバーン",
			Type: m.Type,
		}, nil
	case "みず":
		return Move{
			Name: "ダイストリーム",
			Type: m.Type,
		}, nil
	default:
		return Move{}, errors.New("unknown type")
	}
}

var party = []Pokemon{
	{ID: 3, Name: "フシギバナ", moves: []Move{{Name: "つるのむち", Type: "くさ"}}},
	{ID: 6, Name: "リザードン", moves: []Move{{Name: "かえんほうしゃ", Type: "ほのお"}}},
	{ID: 9, Name: "カメックス", moves: []Move{{Name: "みずでっぽう", Type: "みず"}}},
}

func main() {
	venusaur := party[0]
	fmt.Println("ポケモン:", venusaur.Name)

	moves, err := venusaur.Moves(false)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println("通常わざ:", moves[0].Name)

	dynMoves, err := venusaur.Moves(true)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println("ダイマックスわざ:", dynMoves[0].Name)
}

```

#### 4.1.3. コンパイルと実行
:computer: 以下のコマンドで書いたコードを実行しましょう。

```bash
$ go run main.go
```

::: tip チェックポイント1 🏁
4.1.3. を実行して以下の出力が得られたらクリア
```
ポケモン: フシギバナ
通常わざ: つるのむち
ダイマックスわざ: ダイソウゲン
```
:::

### 4.2. 解説
#### 4.2.1. 型定義といくつかの型
```go
type Pokemon struct {
	ID    int
	Name  string
	moves []Move
}

type Move struct {
	Name string
	Type string
}
```

他の言語と同じようにGoには型を定義する機能があります。 \
ここでは`Pokemon`(ポケモン)と`Move`(わざ)という型を定義しています。

:::tip なんのために型を定義するのか
型システムとは何であるかについては[TaPL](https://www.ohmsha.co.jp/book/9784274069116/)の1章を読むとよいでしょう。 \
いくつかの観点がありますが、以下のようなものがあるでしょう。

* その型が行なえる処理を制限できる
* 関連するふるまいに名前を付けれる
* 代入する値のある程度の正しさをプログラムを実行することなく(静的に)検証できる

これらが真にメリットであると感じるためにはいくつかのプログラム言語を触るのがてっとり早いでしょう。
:::

型を定義するときにはその基となる型を指定する必要があります。 \
ここでは`struct`型(構造体型)を基としています。

もちろん別な型を基にすることも可能です。

```go
type URL string
```

このように`URL`という型を`string`型を基として定義しました。

では`struct`型とは何でしょうか。

`struct`型は関連するデータをまとめて保持するための型です。 \
Cなどの言語でも同様な構造体型が存在します。

その他にも`[]Move`のような`[]`を型名の前に付けることで定義されるスライス(可変長のリストみたいなもの)も使用しています。

詳細な文法は置いておいて、実際今回はどのように使っているかだけに注目します。

```go
var party = []Pokemon{
	{ID: 3, Name: "フシギバナ", moves: []Move{{Name: "つるのむち", Type: "くさ"}}},
	{ID: 6, Name: "リザードン", moves: []Move{{Name: "かえんほうしゃ", Type: "ほのお"}}},
	{ID: 9, Name: "カメックス", moves: []Move{{Name: "みずでっぽう", Type: "みず"}}},
}
```

`[]Pokemon`型の変数`party`を宣言しています。 \
ここでは`フシキバナ`、`リザードン`、`カメックス`の3匹のポケモンをパーティに加えています。

```go
	{ID: 3, Name: "フシギバナ", moves: []Move{{Name: "つるのむち", Type: "くさ"}}},
```

`フシギバナ`の定義を追っていきます。 \
これは`Pokemon`型の値を書いています。

* `ID`という`int`型のフィールドには`3`
* `Name`という`string`型のフィールドには`フシギバナ`
* `moves`という`[]Move`型のフィールドには`[]Move{{Name: "つるのむち", Type: "くさ"}}`
  * これはさらに...

という形で定義しています。
つまりIDが`3`で名前が`フシギバナ`であるポケモンは`つるのむち`という`くさ`タイプのわざを覚えているということが表現されています。

この`party`に保持された最初の要素を取得する部分を見ます。

```go
	venusaur := party[0]
```

// `venusaur`はフシギバナの英語名

同様に`party[1]`でリザードンが取得できます。

更に`venusaur`変数の`Name`フィールドを取得するには`venusaur.Name`とします。

```go
	fmt.Println("ポケモン:", venusaur.Name)
```

:::tip
Goの`fmt.Println()`関数は`,`で区切られた値を半角スペースで繋いで表示します。
:::

#### 4.2.2 メソッド定義
まずは! \
ポケモン的前提知識について書きます。

ポケモン最新作ソード&シールドではダイマックス(英語では`dynamax`)という要素が追加されました。 \
これをすると戦闘中にいきなり巨大化し、わざもタイプに応じて強力なものに変化します。

これをプログラムで表現したいというのが今回のサンプルです。

ある型についてその型に関連する関数(メソッドと呼ぶ)を定義できます。

```go
func (p Pokemon) Moves(isDynamax bool) ([]Move, error) {
	if isDynamax {
		dynamaxMoves := []Move{}

		for _, move := range p.moves {
			dynMove, err := move.dynamax()
			if err != nil {
				return nil, err
			}

			dynamaxMoves = append(dynamaxMoves, dynMove)
		}

		return dynamaxMoves, nil
	}

	return p.moves, nil
}

func (m Move) dynamax() (Move, error) {
	switch m.Type {
	case "くさ":
		return Move{
			Name: "ダイソウゲン",
			Type: m.Type,
		}, nil
	case "ほのお":
		return Move{
			Name: "ダイバーン",
			Type: m.Type,
		}, nil
	case "みず":
		return Move{
			Name: "ダイストリーム",
			Type: m.Type,
		}, nil
	default:
		return Move{}, errors.New("unknown type")
	}
}
```

ここで`Pokemon`型には`Moves()`メソッドを、`Move`型には`dynamax()`メソッドを定義しました。 \
定義方法はほとんど関数定義と同じですが、関数名の前にそのメソッドを定義する型を記述することに注意しましょう。 \
ここで型名の前に変数名を書くことでメソッドの本体でその変数を利用できます。

:::tip Goはオブジェクト指向言語なの?
これについては公式で明確に(`Yes and no.`)回答されています。[Is Go an object-oriented language?](https://golang.org/doc/faq#Is_Go_an_object-oriented_language)を参照してください。 \
この回答をよく読むと`Yes and no.`と回答しておきながら、何故そうであるのかについては直接語られていません。 \
ただただGoにおける言語機能を他の言語と比較しているだけです。 \
アラン・ケイによる定義から様々な派生的な定義が発生してしまっている(要出典)オブジェクト指向という言葉に触れてしまうと、その定義を明確にすることだけで精一杯になってしまいます。 \
Goで何ができるのかだけを列挙することで、`Yes and no.`である理由については読者が自身の定義と関連付けて考えよ、ということだと私は解釈しています。 \
実際、大半のプログラム言語のユーザとしては、それがオブジェクト指向言語であるかどうかやオブジェクト指向言語とは何であるかというのは重要な情報ではなく、その言語には何が出来るのかが重要なのです。 \
ここではGoには型を定義するための機能があり、その型にメソッドが定義できるということのみが重要です。
:::

よく使う制御構文である`if`/`for`/`switch`についても使い方はなんとなく分かるでしょうか。

`(Pokemon).Moves()`は`isDynamax`でダイマックス状態かどうかのbool値を引数に取り、`false`であればそのまま`moves`フィールドの値を返し、`true`なら`moves`の中身を全てダイマックスわざに変換したスライスを新たに作って返します。

`(Move).dynamax()`は`Type`フィールドの値に応じて、対応するダイマックスわざを返します。

```go
		for _, move := range p.moves {
			dynMove, err := move.dynamax()
			if err != nil {
				return nil, err
			}

			dynamaxMoves = append(dynamaxMoves, dynMove)
		}
```

`for`は少し特徴的です。 \
`range`の後に配列またはスライスを配置することで、その要素のインデックスを1つ目の変数に、その値を2つ目の変数に入れることができます。 \
今回のようにインデックスを使わない場合には`_`と書くことで使わないことを明記します。

:::tip
```go
for i, move := range p.moves {
```

と記述するとコンパイルエラーとなります。 \
Goでは使ってない変数はバグの元なのでそもそもコンパイル時点排除するという言語仕様になっています。

また、

```go
for move := range p.moves {
```

とすると想定とは違う挙動になります。 \
`range`は変数定義は1つだけの場合はインデックスだけを代入します。
:::

メソッドを実際に呼び出している部分は以下です。

```go
	moves, err := venusaur.Moves(false)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
```

#### 4.2.3. エラー処理
```go
	moves, err := venusaur.Moves(false)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
```

や

```go
	dynMove, err := move.dynamax()
	if err != nil {
		return nil, err
	}
```

といった部分で触れませんでしたが、この記述もGoの特徴的な記述です。

Goにはほかの言語にあるような強力な例外機構は存在しません(`panic()`/`recover()`という組込み関数は存在します)。 \
これはGoがエラー処理の方法として、例外ではなく明示的なエラー値の返却という戦略を採用しているからです。

Goは今回のサンプルのように複数の値を返す関数が記述できます。

```go
func (m Move) dynamax() (Move, error) {
	switch m.Type {
		/* ... */
	default:
		return Move{}, errors.New("unknown type")
	}
}
```

これを利用して、何かエラーが発生するかもしれない関数では戻り値の最後に`error`型(標準で用意された型)を返します。

この関数/メソッドを実行する側では、以下のように`error`型返り値の内容によって処理を分岐します。

```go
	dynMove, err := move.dynamax()
	// errに何か値が入っていた場合は
	if err != nil {
		// そのままエラーを返す
		return nil, err
	}
```

```go
	moves, err := venusaur.Moves(false)
	// errに何か値が入っていた場合は
	if err != nil {
		// そのエラーを標準出力に表示して
		fmt.Println(err)
		// Exit code 1 でプログラムを終了する
		os.Exit(1)
	}
```

大抵は受けとったエラーをそのまま実行元に返して、`main()`関数のような最上位でログに出力したり、APIサーバであればクライアントにエラーコードとともにエラーレスポンスとして返したりします。

私は例外機構を持つ言語の経験がほとんどないので比較については当日TAの人に伺いますね。

## 5. REST API化
[The Go Playground](https://play.golang.org/p/DPtuK29Q1nt)

* 実行してもしばらく経って`timeout running program`というエラーが返ってきます
* チュートリアルリポジトリの`poke_api`ディレクトリにサンプルコードが入っています

### 5.1. APIサーバからダイマックスわざを取得したい
#### 5.1.1. 作業ディレクトリの作成
:computer: 以下のコマンドを実行して、作業ディレクトリを作成しましょう。

```shell
$ cd .. # go_tutorial/pokemon ディレクトリにいることを想定
$ mkdir poke_api
$ cd poke_api
```

#### 5.1.2. ソースコードの記述
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/http_hello/main.go`
```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
)

type Pokemon struct {
	ID    int
	Name  string
	moves []Move
}

func (p Pokemon) Moves(isDynamax bool) ([]Move, error) {
	if isDynamax {
		dynamaxMoves := []Move{}

		for _, move := range p.moves {
			dynMove, err := move.dynamax()
			if err != nil {
				return nil, err
			}

			dynamaxMoves = append(dynamaxMoves, dynMove)
		}

		return dynamaxMoves, nil
	}

	return p.moves, nil
}

type Move struct {
	Name string
	Type string
}

func (m Move) dynamax() (Move, error) {
	switch m.Type {
	case "くさ":
		return Move{
			Name: "ダイソウゲン",
			Type: m.Type,
		}, nil
	case "ほのお":
		return Move{
			Name: "ダイバーン",
			Type: m.Type,
		}, nil
	case "みず":
		return Move{
			Name: "ダイストリーム",
			Type: m.Type,
		}, nil
	default:
		return Move{}, errors.New("unknown type")
	}
}

var party = []Pokemon{
	{ID: 3, Name: "フシギバナ", moves: []Move{{Name: "つるのむち", Type: "くさ"}}},
	{ID: 6, Name: "リザードン", moves: []Move{{Name: "かえんほうしゃ", Type: "ほのお"}}},
	{ID: 9, Name: "カメックス", moves: []Move{{Name: "みずでっぽう", Type: "みず"}}},
}

func getParty(w http.ResponseWriter, r *http.Request) {
	renderResponse(w, party, http.StatusOK)
}

func getPokemon(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 3 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	renderResponse(w, party[index], http.StatusOK)
}

func getMove(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 4 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	poke := party[index]

	moves, err := poke.Moves(false)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}

	renderResponse(w, moves, http.StatusOK)
}

func router(w http.ResponseWriter, r *http.Request) {
	p := path.Clean(r.URL.Path)

	ok, err := path.Match("/party", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getParty(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getPokemon(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]/move", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getMove(w, r)
		return
	}
}

func main() {
	http.HandleFunc("/", router)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// === 以下は JSON をクライアントに返すための細かい制御をするための関数 ===

func renderError(w http.ResponseWriter, err error, code int) {
	// JSONで返すので"Content-Type"ヘッダに"application/json"を指定します。
	w.Header().Set("Content-Type", "application/json")
	// 引数で指定されたレスポンスコードを登録します。
	w.WriteHeader(code)

	ret := struct {
		// `json:"error"`というのは構造体型のアノテーションと呼ばれるもので、特定の関数に構造体の情報を伝えるために使います。
		// この場合はJSONに変換されるとき`error`というフィールド名にすることを指示しています。
		Error string `json:"error"`
	}{
		Error: err.Error(),
	}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Println("render error", err)
	}
	/*
	   enc := json.NewEncoder(w)
	   err := enc.Encode(ret)
	   if err != nil {
	     log.Println("render error", err)
	   }
	   と同等
	*/
}

// interface{}型というのは、メソッドが一つも定義されていないインターフェイスを意味します。
// つまり任意の型はinterface{}型を満たします。
// Goではインタフェースは明示的に書かずともインタフェース型で定義されたメソッドを全て定義した型は、
// そのインタフェースを満たしている、と判断されます。
// このような値を引数にとることで、静的型付言語でありながら、任意の型を引数に取る関数を簡単に作ることができます。
func renderResponse(w http.ResponseWriter, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Println("render error", err)
	}
}
```

```shell
$ vim main.go
```

#### 5.1.3. 別ターミナルの準備
今回のコードはサーバアプリケーションなので素朴に`go run main.go`で実行してしまうとプロンプトが返ってこず、動作確認が面倒です。 \
そのため今回はターミナルを2つ用意する方針で実行します。

:computer: これまで使用していたターミナルとは別のターミナルを用意し、以下のコマンドを実行しましょう。

```bash
$ docker exec -it go-tutor /bin/bash
```

:::tip
`go-tutor`コンテナで`/bin/bash`を実行するコマンドです。
:::

#### 5.1.4. HTTPサーバの起動
:computer: 以下のコマンドでHTTPサーバを起動しましょう。

```bash
$ go run main.go
```

::: tip チェックポイント3 🏁
HTTPサーバを起動したのとは別のターミナル上で以下のコマンドを実行しましょう。 \
出力が同じであればクリア!

```shell
$ curl --no-proxy http://localhost:8080/party
[{"ID":3,"Name":"フシギバナ"},{"ID":6,"Name":"リザードン"},{"ID":9,"Name":"カメックス"}]
$ curl --no-proxy http://localhost:8080/party/0
{"ID":3,"Name":"フシギバナ"}
$ curl --no-proxy http://localhost:8080/party/0/move
[{"Name":"つるのむち","Type":"くさ"}]
```
:::

HTTPサーバを起動しているほうのプロセスを終了するためにはCtrl-Cなどで終了を伝えましょう。

### 5.2. 解説
#### 5.2.1. HTTPハンドラの登録
```go
	http.HandleFunc("/", router)
```

[`http.HandleFunc()`](https://golang.org/pkg/net/http/#HandleFunc)は第1引数のURLパスへのアクセスされたときに第2引数の関数に処理を受け渡すように登録するための関数です。

今回は`/`を登録しているので、全てのアクセスが`router()`関数に飛ぶことになります。

:::tip ハンドラ? ルータ? コントローラ?
特定のURLパスへのアクセスに対して実際に処理をするための関数の呼び方は様々あります。 \
例に挙げた単語は微妙にニュアンスが違うことがあります。

HTTPリクエストをそのまま扱う処理のことをハンドラとかコントローラとか呼びます。 \
RailsのようなMVCフレームワークではコントローラと呼ぶことが多いです。 \

URLパス毎にハンドラに処理を渡すためのハンドラを特にルータと呼ぶことが多いです。 \
Railsだと`routes.rb`、Djangoだと`urls.py`に対応するものです。 \
Goではマルチプレクサとも呼びます。
:::

#### 5.2.2. HTTPサーバの起動
ハンドラの処理内容を見る前にHTTPサーバの起動部分を見てみましょう。

```go
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
```

[`http.ListenAndServe()`](https://golang.org/pkg/net/http/#ListenAndServe)は第1引数のURLでHTTPリクエストを待ち受ける関数です。 \
この関数はCtrl-Cなりで強制終了するまで実行され続けます。

何かしらの理由で終了すると`error`型の値が返ってくるので、4章で説明した通りにエラー処理しています。

Goはこれを書くために生まれた言語と言っても過言ではなく、実際何もしなくていいHTTPサーバであればハンドラの登録も不要であり、本質的に必要な行はこの1行だけとなります。

`ListenAndServe()`の第2引数も実はハンドラを登録するために用意されているのですが、`nil`を指定するとデフォルトで用意されているハンドラ(マルチプレクサ)を勝手に使ってくれます。 \
さらに実はですが、このデフォルトのマルチプレクサに対してハンドラを登録するための関数が`http.HandleFunc()`だったりします。

#### 5.2.3. ルータの処理
`router()`関数の処理を見ていきましょう。

```go
func router(w http.ResponseWriter, r *http.Request) {
	p := path.Clean(r.URL.Path)

	ok, err := path.Match("/party", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getParty(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getPokemon(w, r)
		return
	}

	ok, err = path.Match("/party/[0-5]/move", p)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}
	if ok {
		getMove(w, r)
		return
	}
}
```

[`path.Clean()`](https://golang.org/pkg/path/#Clean)は変なURLパス(`//party/../party`とか)が指定されていた場合を想定して、冗長な表現を消すための関数です。 \
この後の処理でURLパスを扱いやすくするために使っています。

[`path.Match()`](https://golang.org/pkg/path/#Match)は指定したパターンに文字列がマッチしていれば`true`を返してくれる関数です。 \
今回のサーバはURLパスに応じて処理を変更したいので、URLパスを判断するために使っています。

今回は以下のAPIを作成しています。

* `/party`: パーティ一覧(`getParty()`) 
* `/party/<index>`: パーティ内のポケモンの取得(`getPokemon()`)
* `/party/<index>/move`: パーティ内のポケモンのわざ一覧(`getMove()`)

なお`renderError()`関数は第3引数のステータスコードでユーザにエラーを返す処理です。 \
ただステータスコードを返すだけであれば関数に分けるほどもないのですが、今回はREST APIサーバなのでエラーもJSONで返したかったため、そのための処理を分離しています。 \
今回は解説しませんが、興味があれば中を読んでみてください。

#### 5.2.4. ハンドラ内の処理
##### 5.2.4.1. `getParty()`
```go
func getParty(w http.ResponseWriter, r *http.Request) {
	renderResponse(w, party, http.StatusOK)
}
```

`renderResponse()`関数は第2引数の値をJSON形式でユーザに返すための関数です。 \
JSONへの変換やヘッダの設定など雑多な処理を意識しないために別関数に括り出しています。 \
今回は解説しませんが、興味があれば中を読んでみてください。

##### 5.2.4.2. `getPokemon()`
```go
func getPokemon(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 3 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	renderResponse(w, party[index], http.StatusOK)
}
```

URLパスは`/party/0`のような形をしているはずなので、そこからまず`0`という数値を取り出す必要があります。 \
そのため[`strings.Split()`](https://golang.org/pkg/strings/#Split)で`/`区切りで文字列を分割しています。

先の例では`p`は`["", "party", "0"]`という形に分割(最初の`/`も分割されることに注意)されているはずなので、その長さをチェックしてから`p[2]`を取り出せば`"0"`という文字列(まだ数値ではない)が取得できます。

あとは[`strconv.Atoi()`](https://golang.org/pkg/strconv/#Atoi)で`int`型に変換してやればURLパスの解釈は完了です。

細かいチェックとして、`party`変数の長さを越えた値を指定された場合は`party`変数の長さで頭打ちさせておいて、`party[index]`を返してやれば終わりです。

##### 5.2.4.3. `getMove()`
```go
func getMove(w http.ResponseWriter, r *http.Request) {
	p := strings.Split(r.URL.Path, "/")
	if len(p) < 4 {
		renderError(w, errors.New("invalid path"), http.StatusBadRequest)
	}

	indexParam := p[2]
	index, err := strconv.Atoi(indexParam)
	if err != nil {
		renderError(w, err, http.StatusBadRequest)
	}

	if index > len(party) {
		index = len(party)
	}

	poke := party[index]

	moves, err := poke.Moves(false)
	if err != nil {
		renderError(w, err, http.StatusInternalServerError)
	}

	renderResponse(w, moves, http.StatusOK)
}
```

前半のURLパスの解釈は`getPokemon()`の処理とほとんど同じです。

あとは`Pokemon.Moves()`の実行結果を返してやれば終わりです。

## 6. まとめ
Goの概説からhello world、package分割、基本的な文法、Web APIサーバの作成までさっくり追っていきました。 \
今回のサンプルコードはちゃんとエラー処理まで書いており、量はさておき質としてはほぼ業務で書くコードと遜色ないものだと思います。

とはいえ最後のサンプルについてはプロダクションとしてリリースするためには足りていない部分もあります。 \
具体的には

* テストが無い
  * [`testing`](https://golang.org/pkg/testing/)パッケージを使ったテストを書く
  * GoではTDT(Table Driven Test)が好まれる
* HTTPメソッドを判断していないので、実はPOSTでも同じ応答が返ってくる
  * 小規模なままであればシンプルに`router()`でちゃんと`r.Method`に応じた分岐を書くとよい
  * [go-chi/chi](https://github.com/go-chi/chi)のようなルータを担うパッケージもあるので利用するのもよい
* もし更新APIを実装したとしても、データがメモリ上にしかないので再起動の度にデータが初期状態に戻ってしまう
  * データベースを使い永続化したい
  * [`database/sql`](https://golang.org/pkg/database/sql/)パッケージを使えばデータベースと接続できる
* ログを出力したい
  * [`log`](https://golang.org/pkg/log/)パッケージを使えばログが出せる

のようなことを解決してみるのはよい経験になるでしょう。

もちろん、やっている内に発生するであろう疑問などは私に聞いていただければ答えます。

その他外部のコミュニティから情報を得るのも良いでしょう。

* Gophers slackの#japanチャンネル
  * 世界中のGopherが集うslack、その中の#japanに日本人Gopherが住んでいます
* [vim-jp slackの#lang-goチャンネル](https://vim-jp.org/docs/chat.html)
  * Vimコミュニティのslackですが、何故かGopher slackの#japanより活発
  * 普通にEmacs使いの人もいるので、お使いのエディタに依らずどうぞ
  * [こういう人](https://mattn.kaoriya.net/etc/gde.htm)がいたりします
* [Go Conference](https://gocon.jp/)
  * 今年はこんな状態なので開催されてませんが、例年は半年毎に開催されるGoコミュニティによるカンファレンス

というわけで、Goやっていきましょう

<credit-footer/>
