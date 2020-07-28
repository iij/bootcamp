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

## 5. net/httpはじめの一歩
[The Go Playground](https://play.golang.org/p/5YXGZvJ73b_1)

* 実行してもしばらく経って`timeout running program`というエラーが返ってきます
* チュートリアルリポジトリの`http_hello`ディレクトリにサンプルコードが入っています

### 4.1 HTTPサーバを実行してみる
#### 4.1.1. 作業ディレクトリの作成
:computer: 以下のコマンドを実行して、作業ディレクトリを作成しましょう。

```shell
$ cd .. # go_tutorial/calc ディレクトリにいることを想定
$ mkdir http_hello
$ cd http_hello
```

#### 4.1.2. ソースコードの記述
:computer: 好きなエディタで以下のファイルを作成しましょう。

* `go_tutorial/http_hello/main.go`
```go
package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/hello", helloHandler)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	err := server.ListenAndServe()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hello, world!")
}
```

```shell
$ vim main.go
```

#### 4.1.3. 別ターミナルの準備
今回のコードはサーバアプリケーションなので素朴に`go run main.go`で実行してしまうとプロンプトが返ってこず、動作確認が面倒です。 \
そのため今回はターミナルを2つ用意する方針で実行します。

:computer: これまで使用していたターミナルとは別のターミナルを用意し、以下のコマンドを実行しましょう。

```bash
$ docker exec -it go-tutor /bin/bash
```

:::tip
`go-tutor`コンテナで`/bin/bash`を実行するコマンドです。
:::

#### 4.1.4. HTTPサーバの起動
:computer: 以下のコマンドでHTTPサーバを起動しましょう。

```bash
$ go run main.go
```

::: tip チェックポイント3 🏁
HTTPサーバを起動したのとは別のターミナル上で以下のコマンドを実行しましょう。 \
出力が同じであればクリア!

```shell
$ curl http://localhost:8080/hello
Hello, world!
```
:::

HTTPサーバを起動しているほうのプロセスを終了するためにはCtrl-Cなどで終了を伝えましょう。

### 4.2. 解説
#### 4.2.1. 構造体と独自型とメソッド
```go
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", helloHandler)
```

や

```go
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	err := server.ListenAndServe()
```

に注目します。 \
これは他のプログラム言語を書いたことがあればお馴染みのメソッド記法です。

:::tip Goはオブジェクト指向言語なの?
これについては公式で明確に(`Yes and no.`)回答されています。[Is Go an object-oriented language?](https://golang.org/doc/faq#Is_Go_an_object-oriented_language)を参照してください。 \
この回答をよく読むと`Yes and no.`と回答しておきながら、何故そうであるのかについては直接語られていません。 \
ただただGoにおける言語機能を他の言語と比較しているだけです。 \
アラン・ケイによる定義から様々な派生的な定義が発生してしまっている(要出典)オブジェクト指向という言葉に触れてしまうと、その定義を明確にすることだけで精一杯になってしまいます。 \
Goで何ができるのかだけを列挙することで、`Yes and no.`である理由については読者が自身の定義と関連付けて考えよ、ということだと私は解釈しています。 \
実際、大半のプログラム言語のユーザとしては、それがオブジェクト指向言語であるかどうかやオブジェクト指向言語とは何であるかというのは重要な情報ではなく、その言語には何が出来るのかが重要なのです。 \
ここではGoには型を定義するための機能があり、その型にメソッドが定義できるということのみが重要です。
:::

```go
	mux := http.NewServeMux()  // <- これは`http`パッケージの`NewServeMux()`関数の実行
	mux.HandleFunc("/hello", helloHandler) // <- これは`mux`変数の型である`ServeMux`型に定義された`HandleFunc()`メソッドの実行
```


Go は構造体型を持ちます。
[The Go Playground](https://play.golang.org/p/ebEr372GDdp)

```go
// 構造体型を基にしてAという型を宣言する。
type A struct {
  X int
  Y int
}

// 型AのメソッドHoge()を宣言する。
func (a A) Hoge() {
  fmt.Println("X:", a.X)
  fmt.Println("Y:", a.Y)
}

// aにA型の値を代入する。
var a = A{
  X: 1,
  Y: 2,
}

// aの型AのメソッドHoge()を実行する。
a.Hoge()
// X: 1
// Y: 2
```
このようにすることで、オブジェクト指向言語におけるクラスとメソッドのようなことができます。 \

たとえば以下のようなコードも書けます。 \
[The Go Playground](https://play.golang.org/p/nb76TxzaYMb)

```go
type Age int

func (age Age) BirthYear() int {
  // 返り値はint型なのでint(age)でAge型からint型にキャスト(変換)している。
  return 2019 - int(age)
}
```
ここでは`int`型に`Age`という別名を付けて、そのメソッドとして`BirthYear()`を定義しています。

#### 3-2-2. `net/http`パッケージ
`net/http`パッケージはその名の通り、HTTP通信に関連する関数、定数などが定義されたパッケージです。 \
このパッケージ一つでHTTPクライアントもHTTPサーバも書くことができます。

##### 3-2-2-1. `ServeMux`
```go
	mux := http.NewServeMux()

	mux.HandleFunc("/hello", helloHandler)
```

URLは`スキーマ名://ホスト名:ポート番号/パス名`という構造をしています。(他にもURLで表される項目はありますが、今回は使用しないため省略します。) \
`http://localhost:8080/hello`というURLであれば、
  * スキーマ名: http
  * ホスト名: localhost
  * ポート番号: 8080
  * パス名: /hello
と解釈されます。

`http.ServeMux`は特定のパスへのリクエストを特定の関数へ飛ばすためのものです。 \
今回は`http://localhost:8080/hello`へのアクセスを`helloHandler()`という関数(ハンドラ)に引き渡す設定をします。 \

`http.NewServeMux()`で`http.ServeMux`型の値を用意して、`mux.HandleFunc()`でハンドラの設定をしています。

##### 3-2-2-2. `Server`
```go
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	err := server.ListenAndServe()
```

`http.Server`はHTTPサーバそのものを表す型です。 \
`Addr`フィールドにHTTP通信を待ち受けるアドレスを設定し、`Handler`フィールドに先程説明した`ServeMux`を設定します。

そしてその`http.Server`型の値のメソッドである`server.ListenAndServe()`関数で実際にサーバを起動してHTTP通信を待ち受け始めます。 \
注意すべきはこの`server.ListenAndServe()`が即時では終了せず、明示的にプロセスに終了方法を伝えるまで実行し続けることです。

##### 3-2-2-3. ハンドラ
```go
func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hello, world!")
}
```

HTTP通信が飛んでくると`helloHandler()`という関数がそのリクエストを受けて処理をします。 \
引数の`http.Request`型の値に実際のリクエストの内容が入っているので、それを利用して処理をすることも可能です。 \
引数の`http.ResponseWriter`は`Write()`というメソッドを持っている型で、クライアントに送信したいメッセージを作って、`Write()`が叩かれれば、メッセージが送信されます。 \
もう少し踏み込むと、Goではインタフェース型と呼ばれるメソッド定義のみを持つ型が存在し、`http.ResponseWriter`型は`Write()`や`Header()`などのメソッドを持つインタフェース型です。 \
参考: [ResponseWriter](https://golang.org/pkg/net/http/#ResponseWriter)

`fmt.Fprintln()`関数は第二引数の値を第一引数の`Write()`メソッドを使って書き込む、という関数で、今回はその挙動を利用してレスポンスを返しています。

## 4. RDBをGoから触る
[The Go Playground](https://play.golang.org/p/B0_HD0U241F)(動きません)

* `go.mod`
```
module test
```

* `main.go`
```go
package main

import (
	"log"
	"net/http"
	"os"

	"test/handler"
)

func main() {
	mux := http.NewServeMux()

	// handlerパッケージのUserRead()関数を"/user/"というパスで登録している。
	mux.HandleFunc("/user/", handler.UserRead)

	// HTTPサーバは"localhost:8080"で起動する。
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	// Goの特徴的なエラー処理。
	if err := server.ListenAndServe(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
	/*
	  err := server.ListenAndServe()
	  if err != nil {
	    log.Println(err)
	    os.Exit(1)
	  }
	  と同等。
	*/
}
```

* `handler/user.go`
```go
package handler

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"test/model"
)

func UserRead(w http.ResponseWriter, r *http.Request) {
	// HTTPのリクエストがGETであることを確認している。
	if r.Method != http.MethodGet {
		// GETでなければ404を返す。
		http.NotFound(w, r)
		// 関数を終了する。
		// Goではこのようなearly returnというパターンが頻出で、else 文はほぼ書かない。
		return
	}

	// http://localhost:8080/user/1などでアクセスが来る。
	// r.URL.Pathには"/user/1"が入っているのでそれを"/"で分割した配列を作る。
	// 作られた配列は["", "user", "1"]となっており、User IDは[2]に入っている。
	//
	// strings.SplitN()関数は第3引数の数だけ分割する。
	// 例えば、"/user/1/2/3"というパスを指定されていた場合はuserIDStrには"1/2/3"が入る。
	userIDStr := strings.SplitN(r.URL.Path, "/", 3)[2]

	// userIDStrは文字列なのでuint64型に変換する。
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		// 先の"/user/1/2/3"みたいなパスの場合はこのパースに失敗してこの分岐に入る。
		log.Println(err)
		// この場合は400を返す。
		renderError(w, err, http.StatusBadRequest)
		return
	}

	// model packageの関数に処理を持って行き、エラーの判定をする。
	user, err := model.FindUserByID(userID)
	if err != nil {
		log.Println(err)
		// ここに入るということはサーバ側の処理で失敗しているので500を返す。
		renderError(w, err, http.StatusInternalServerError)
		return
	}

	// 全ての処理が成功していれば、200とともにuserを返す。
	renderResponse(w, user, http.StatusOK)
}
```

* `handler/handler.go`
  * このファイルは頑張って JSON を返すための細かい設定をしてくれる便利関数を定義しています
```go
package handler

import (
	"encoding/json"
	"log"
	"net/http"
)

func renderError(w http.ResponseWriter, err error, code int) {
	// JSONで返すので"Content-Type"ヘッダに"application/json"を指定します。
	w.Header().Set("Content-Type", "application/json")
	// 引数で指定されたレスポンスコードを登録します。
	w.WriteHeader(code)

	ret := struct {
		// `json:"error"`というのは構造体型のアノテーションと呼ばれるもので、特定の関数に構造体の情報を伝えるために使います。
		// この場合はJSONに変換されるとき`error`というフィールド名にすることを指示しています。
		Error string `json:"error"`
		// ここまで構造体の定義。
	}{
		// ここが実際の構造体型の値の定義。
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

// interface{}型というのは、メソッドが一つも定義されていないメソッドを意味します。
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

* `model/user.go`
```go
package model

import (
	"database/sql"
	// これはSQLite3を使うためのおまじない、として記述してください。
	// 詳細知りたければteamsやハンズオン終了後に質問をください。
	_ "github.com/mattn/go-sqlite3"
)

// SQLite3を使ってdb/chat.dbというファイル名でDBを開き、その操作のための構造体をdbという変数に代入しています。
// sql.Open()関数は2つの値を返す関数で、もう一つの返り値はerror型の値ですが、今回エラー処理をさぼるために値を無視します。
// _を記載することで、そこに返るはずだった値を無視することができます。
// エラーを握り潰すことはよいこはやってはいけません。
var db, _ = sql.Open("sqlite3", "db/chat.db")

type User struct {
	ID   uint64
	Name string
}

func FindUserByID(id uint64) (*User, error) {
	// SQL文を作っています。
	// $1はプレースホルダで、後のstmt.QueryRow()の引数に設定した値が入ります。
	sql := "SELECT id, name FROM users WHERE id = $1;"
	// 先に作成したのはただの文字列なので、正しいSQL文になっているかを検証しつつ、操作のための構造体を返します。
	stmt, err := db.Prepare(sql)
	if err != nil {
		// SQL文が間違っているとここで教えてくれます。
		return nil, err
	}
	// deferというのはGoの特徴的な機能の一つで、ここではstmt.Close()関数は実行されず、FindUserByID()関数の実行完了時に必ず(例外はあります)実行されます。
	// ファイルを開いた際のClose処理などにも使われて、後処理を忘れないためによく使われます。
	defer stmt.Close()

	user := User{}
	// 先のSQL文は"SELECT id, name FROM users WHERE id = $1"となっており、`id`の中身が$1に収められstmt.QueryRow()メソッドで実行されます。
	// その結果は id と name カラムが埋まっているので、その値を Scan()メソッドで user.ID と user.Name に放り込んでいます。
	// &は後ろにくる値のポインタを取得する演算子ですが、詳細には触れません。
	// こうしておかないと、Scan()メソッドには値のコピーが渡され、Scan()の中の操作が元の値に反映されなくなってしまいます。
	if err := stmt.QueryRow(id).Scan(&user.ID, &user.Name); err != nil {
		return nil, err
	}
	return &user, nil
}
```

* `db/setup.sql`
  * 少しMySQLとは文法が異なりますが、ここは主題ではないので触れません
```sql
DROP TABLE users;

CREATE TABLE users (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text
);

INSERT INTO users (name) VALUES ("hogehoge");
INSERT INTO users (name) VALUES ("fugafuga");
```

### 4-1. ディレクトリ構造
```
- go.mod # パッケージ管理用ファイル
- main.go # サーバを準備したり、起動したりする。最初に実行される。
- handler/
  - handler.go # JSON形式でレスポンスを返すためにごにょごにょしてくれる関数を定義。
  - user.go # HTTPリクエストを受けると実行される関数を定義。
- model/
  - user.go # User構造体を定義し、DBからUserデータを取得するための関数を定義。
- db/
  - setup.sql # DBの初期化用SQLファイル。
```

### 4-2. 使い方
ターミナルを2つ用意します。
docker環境の方は2つ目のターミナルでコンテナ内に入るために、

```bash
$ docker exec -it go-tutor /bin/bash
```

を実行する必要があります。 \
まず、一方のターミナルで以下を実行します。
```bash
# まず、DBを用意します。
# エラーが発生しますが、
#   Error: near line 1: no such table: users
# であれば想定通りなので無視します。
$ sqlite3 db/chat.db -init "db/setup.sql"
-- Loading resources from db/setup.sql
Error: near line 1: no such table: users
SQLite version 3.16.2 2017-01-06 16:32:41
Enter ".help" for usage hints.
sqlite>

# sqlite を終了します。
sqlite> .exit

# サーバを起動します。
$ go run main.go
go: finding github.com/mattn/go-sqlite3 v1.11.0
go: downloading github.com/mattn/go-sqlite3 v1.11.0
go: extracting github.com/mattn/go-sqlite3 v1.11.0
# プロンプトが返ってこなくなる
```

その後、もう一方のターミナルで以下を叩きます。
```bash
$ curl http://localhost:8080/user/1
{"ID":1,"Name":"hogehoge"}
```

<credit-footer/>
