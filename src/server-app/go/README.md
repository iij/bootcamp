---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Go言語を使って簡単なWebアプリケーションを作ります
time: 1.5h
prior_knowledge: golang
---

<header-table/>

# GoでWebアプリケーションを作る

## 0. この講義について
### 0.1. 目的
* あなたがプログラミングを行う際の選択肢として、Goを挙げられる為の第一歩となること
	* より、知らない方に知っていただくことを重要視しています

### 0.2. 対象者
想定レベルは以下の通りです。  
* ls, cd 程度のLinuxファイル操作が行える  
* curl (もしくは、wget) の操作が行える  
* 実行ファイル(.ext, elf)という存在を知っている  
* `if`, `for`, `select` などの、割と多くの言語で近い表現のある構文を知っている  
* 引数、戻り値 というキーワードを知っている  

出来ると理解が捗るスキルは以下の通りです。  
* どんな言語(COBOL, Javascript, bash, python, ...) でも良いので、簡単なコーディングを行ったことがある  


参加者の制限は特に設けておりませんが、  
Goを知らない方かつ、プログラミング技術をこれから身につけていきたい方へ伝える事に重点をおきコンテンツを作成しています。  
そのため、既にGo言語を実用レベルで活用されている方は、退屈かと思われます。  

### 0.3. 下準備

事前に、[GoでWebアプリケーションを作る(下準備編)](./var/md/init.md) を参考に準備をしてください。  
講義内では、下準備に対する質問は回答しません。受講年度の事前質問方法に合わせ、事前に確認ください。  

### 0.4. 本資料の表現
* :computer:
	* 受講者が操作する箇所を示します
* `<ほげほげ>`
	* 上記は、変数です。任意の値(適切な値)に書き換えていただきます
* `$ <command>`
	* 上記 `$` は、プロンプトを意味します。実際に入力は行いません

#### 解釈例

```shell
$ git clone <リモートリポジトリのアドレス>
```

上記のような記載であり、  
<リモートリポジトリのアドレス> に当てはまる値が、`git@github.com:iij/bootcamp.git` の場合、  
ターミナルへ入力する値は、以下のようになります。  

```shell
git clone git@github.com:iij/bootcamp.git
```

## 1. Goとは
Googleが主導して開発しているプログラミング言語です。  
正式名称は、`Go` ですが、ググラビリティが低いので、`Golang` `golang` `go言語` Go言語` `go-lang` 辺りで表記されていることが多いです。  
わざわざ、[開発者の一人(Rob Pike 氏) が、ツイート](https://twitter.com/rob_pike/status/886054143235719169) してくれてもいます。  

### 1.1. 特徴
参考: [今改めて読み直したい Go基礎情報 その1](https://budougumi0617.github.io/2019/06/20/golangtokyo25-read-again-awesome-go-article/) \
参考: [Go入門](https://www.slideshare.net/takuyaueda967/2016-go)

#### 1.1.1. シンプルである
設計思想としてSimplicityを是としています。  
参考: [Simplicity is Complicated](https://talks.golang.org/2015/simplicity-is-complicated.slide#1)  

例えば、言語仕様を見ると、使用されるキーワードは25個しかありません。  
[The Go Programming Language Specification#Keywords](https://golang.org/ref/spec#Keywords)  
表現や構造がシンプルであるため、学習コストが低いという側面があります。  

#### 1.1.2. 標準パッケージが充実している
Go言語の環境を用意するだけで、[標準パッケージ](https://golang.org/pkg/) を扱え、より多くの作業が行えます。  
* testing: テスト記述
* net/http: HTTPサーバ/クライアントなど
	* 本講義で扱うhttpパッケージ(zakohttp) は、net/httpの下位互換です。net/httpにインポート先を変更することで、作成したソースコードは動作します
* encoding: hexやテキスト表現
* crypto: 暗号関係
* ...

#### 1.1.3. クロスコンパイルが容易
コンパイル時に、環境変数`GOOS`や`GOARCH` を設定するだけで、Windowsの実行形式ファイルやLinuxの実行形式ファイル、macOSの実行形式ファイルを出力することができます。  
標準パッケージの多くが、クロスコンパイルされることを前提としているため、標準パッケージを活用することで、環境ごとに不具合の起きづらい開発を行うことが可能です。  
例えば、ファイルパスの文字列結合は、`"path1" + "\" + "path2"` といった表現はせず、`path/filepath` の関数`Join` を用い、`filepath.Join("path1", "path2")`というように表現することをお勧めします。  

ただし、一部パッケージはOS依存のケースがあります。例えばWindowsのレジストリのような、OSに依存する処理を行うソースコードの場合に他環境向けのコンパイル操作を行うと、失敗します。  

#### 1.1.5. 周辺ツールが標準で提供される
Go言語をインストールするだけで、パッケージの管理やダウンロード、コンパイル、テスト、字句解析、ドキュメント生成など、多くのことが実行できます。  
`go <subcommand>` 形式で、それらのツールを扱うことが可能です。  
参考: [コマンド一覧](https://golang.org/cmd/)  

#### 1.1.7. 並行プログラミングが文法レベルでサポートされている
とても簡単に並行プログラミングを記述することができます。  
並行プログラミングしない場合は、`func(){//<yourCode>}()` のような形で関数を呼び出せます。  
対して、並行プログラミングする場合は、`go func(){//<yourCode>}()` のような形で関数を呼び出します。  
わずか、3 byteほどの差分で並行プログラミングを表すことが可能です。  

興味のある方は、[Pthreads プログラミング](https://www.oreilly.co.jp/books/4900900664/) などで、他言語のマルチスレッド記法を学習されると、  
この容易さに感動できるのではないでしょうか。  

##### :rocket: Go言語の並列スレッドは、Goroutine(ごーるーちん)
並列スレッドは、Goroutineと呼ばれます。  
OSのカーネルスレッドとは異なり、ユーザ空間で動作する軽量なスレッドです。  
それぞれのGoroutineの管理（スケジューリングなど）も、1つのユーザ空間スレッドとして動作しています。  

#### 1.1.8. Gopher がかわいい
RFC1436 の [Gopher](https://ja.wikipedia.org/wiki/Gopher) ではありません。  
Go の [Gopher](https://golang.org/doc/gopher/gopherbw.png) がかわいいです。  

### 1.2. どこで使われているの?
本講義でも活用している、[Docker](https://github.com/docker/docker-ce) で扱われています。  
また、具体的なサービス名は見つけられませんが、[Go言語の日本ユーザ](https://github.com/golang/go/wiki/GoUsers#japan) にある通り、一度は聞いたことがありそうなサービスにGoが関わっているのかもしれませんね。  

他にも、軽量なGit Webサービスのプロジェクト [Gitea](https://gitea.io/en-us/) のような、Go言語の特徴を活かしたOSSはいくつもあります。  
ぜひ探してみてください  

## ハンズオンの開始

以降の章では、事前準備いただいたDockerを用い、ハンズオンを行います。  
ハンズオンでは、こちらから指示したpathに、ディレクトリやファイルを作成いただき、Go言語に触れてもらいます。  
基本的なフォルダ構成は、 `/go/src/go_tutorial/<セクション名>/<プログラム名>/***.go` のようになります。  

講師側が説明で用いるソースコード（答え）は、`/go/src/samples/<セクション名>/<プログラム名>/***.go` の形で格納してあります。  
講師側が想定している出力結果と、自身の書いたコードの出力を確認したい場合は、`/go/src/samples/`配下を実行することで、容易に確認できます。  
また、ハンズオンがうまく行かない際、`diff /go/src/go_tutorial/<セクション名>/<プログラム名>/***.go /go/src/samples/<セクション名>/<プログラム名>/***.go` のように確認することで、課題解決を助ける可能性があります。  

## 2. Hello, World

### 2.1. Goの実行と変数の扱い方
#### 2.1.1 Goを動かす
Go言語で作成されたソースコードの実行方法は2つあります。  
ソースコードをコンパイル（`go build`）し、実行形式ファイル（.exe等）を実行する方法と、  
ソースコードをスクリプト言語のように実行する`go run`コマンドを用いる方法です。  

:computer: 以下のコマンドを実行して、Goを動かしてみよう  

```shell
:# WORKPATH /go/src/samples/2_helloworld/hello/
$ <お好きなエディタ> main.go
$ go run main.go
```
* /go/src/samples/2_helloworld/hello/main.go
	```go
	package main

	import "fmt"

	func main() {
		fmt.Println("Hello, 世界")
	}
	```
:recycle:
```shell
$ go run main.go
Hello, W0rld!!
```

:computer: 以下のコマンドを実行して、Goをコンパイルしてみよう。  
```shell
:# WORKPATH /go/src/samples/2_helloworld/hello/
$ go build main.go
$ ls
$ file ./main
$ ./main
```
:recycle:
```shell
$ go build main.go
$ ls
main  main.go
$ file ./main
main: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, Go BuildID=h4I-IJqcIkOGZEY8aOXG/Oavgb_mM-7UzeuwNWOCx/iNm526Mrqo9Tb59n0e8A/SZ9SbxL4eRIc7JGiMfDO, not stripped
$ ./main
Hello, W0rld!!
```

おめでとうございます。これで、あなたもGopherの友達です。  
記念にぬいぐるみのGopherを机に飾っても良いでしょう。  

### 2.2. クロスコンパイルの体験
きっと便利ツールを作ってお手元のWindowsで動かしたくなることもあるでしょう。  
[1.1.3. クロスコンパイルが容易](#### 1.1.3. クロスコンパイルが容易) でも触れた通り、簡単に作成できることを確認してもらいます。  

:computer: 以下のコマンドを実行して、Goをコンパイルしてみよう。  
```shell
:# WORKPATH /go/src/samples/2_helloworld/hello/
$ GOOS=windows GOARCH=amd64 go build main.go
$ ls
$ file ./main.exe
```
:recycle:
```shell
$ GOOS=windows GOARCH=amd64 go build main.go
$ ls
main main.exe main.go
$ file ./main.exe
main.exe: PE32+ executable (console) x86-64 (stripped to external PDB), for MS Windows
```

### 2.3. 変数の定義方法確認
Go言語では、変数の定義記述が3つあります。  
* `var HENSU string`
	* 型指定有り。変数初期値の指定無し(stringなので、`""`になります。)
* `HENSU := "GreatValueeeeee"
	* 型指定無し。代入元の型を引き継ぐ
* `var HENSU string = "GreatValueeeee"
	* 型指定有り。変数初期値の指定有り
予期せぬ型が変数に定義されないよう、最初のうち（書いている型をイメージできるまで）は、冗長ですが、一番下の例の書き方をお薦めします。  

:rocket: Tips  
Go言語の名前空間は、`private`は先頭小文字。`Public`が先頭大文字と決まっています。  
packageの要素や、構造体の要素を外部から参照させたい場合は、先頭大文字の変数名となるようご注意ください。  

#### 2.3.1 最高の講師に教えてもらおう
Go言語では、書き方を間違えているととても丁寧に教えてくれる強い味方がいます。  
それは、コンパイラ（`go build`）です。  
「うーん、あ、この辺のソースみた？」とだけ返してくる先輩に比べ、「3行目、変数定義されていないよ！？」と場所まで指定して教えてくれます。  
ちょっと厳しい点があるとすれば、指摘が英語であることです。  
中学生レベルの英語と、単語を調べる力があれば解決できる文章しか出てこないので、ぜひ`go build`大先生に弟子入りしてみてください。  

:rocket: Tips  
`go vet <ソースコードファイルパス>`の方が、起こり得る問題や、より根本的な箇所まで教えてくれます。  
ただ、プログラマが意図した泥臭い書き方を問題として報告してくるケースもあるため、講師は、`go build`のエラーを見ることにしています。  

:rocket: Tips  
エラーが多いと、数個のエラーの後に`too many error....`と続き、全てのエラーを教えてくれないことがあります。  
しょうがないので、教えてもらっているエラーから対処していきましょう。  


:computer: 以下のコマンドを実行して、修正箇所を認識てみよう。  
```shell
:# WORKPATH /go/src/samples/2_helloworld/plzfixme/
$ go run main.go
```

:recycle:
```shell
:# WORKPATH /go/src/samples/2_helloworld/plzfixme/
$ go run main.go
# command-line-arguments
./main.go:6:2: undefined: value
./main.go:7:14: undefined: value
```

:computer: ソースコードを修正し、エラーを無くしてみよう。  
```shell
:# WORKPATH /go/src/samples/2_helloworld/plzfixme/
$ <お好きなエディタ> main.go
$ go run main.go
```
* /go/src/samples/2_helloworld/plzfixme/main.go
	```go
	package main

	import "fmt"

	func main() {
		value = "GYUDON"       //./main.go:6:2: undefined: value
		fmt.Println(value)     //./main.go:7:14: undefined: value
	}
	```
:recycle:
```shell
:# WORKPATH /go/src/samples/2_helloworld/plzfixme/
$ go run main.go
GYUDON
```

### 2.4. まとめ
* まとめぇ//TODO

## 3. 関数

### 注意事項
本章では、引数、戻り値、というキーワードを説明しません。  

### 3.1. 関数の実行される順番
Go言語では、`func main(){}` が、実行されます。  
そのため、仮に以下のようなソースコードを実行すると、`runtime.main_main·f: function main is undeclared in the main package` と、main関数が見つからないエラーが表示されます。  
```go
package main

import "fmt"

func MySuperFunction() {
	var value string = "GYUDON"
	fmt.Println(value)
}
```

:rocket: Tips
`func main(){}` よりも先に実行される、`func init(){}` という関数があります。  
後ほど触れるパッケージで、初期化処理を行いたいケースなどで活用できます。  

### 3.2. Goっぽい関数
Go言語の関数は、戻り値を複数返せる特徴を持っています。  
この特徴を活かし、Goでは、戻り値の最後に関数処理エラーの有無を識別できる値をつけるスタンダートな記法があります。  

```go
package main

import "fmt"

func Printer(name string) {
	if name == "" {
		return
	}
	fmt.Println(name)
}

func main() {
	var name string = "GYUDON"
	Printer(name)
}
```

```go
package main

import "fmt"

func Printer(name string) error {
	if name == "" {
		return fmt.Errorf("name is empty.")
	}
	fmt.Println(name)
}

func main() {
	var name string = "GYUDON"
	if err := Printer(name); err != nil {
		panic(err)
	}
}
```

`if err := Printer(name); err != nil {`
`err := Printer(name)`
`if err != nil {`


:rocket: tips
```go
func Printer(name string) bool, error { ...
...
func main() {
	var name string = "GYUDON"
	if ok, err := Printer(name); err != nil {
		panic(err)
	}
	// ここでは ok がスコープ外
}
```
```go
func Printer(name string) bool, error { ...
...
func main() {
	var name string = "GYUDON"
	ok, err := Printer(name)
	if err != nil {
		panic(err)
	}
	// ここでは ok がスコープ内になる
}
```



## 4. パッケージ

### 4.1. パッケージを使う
`import fmt`
```go
import (
	"fmt"
	"os"
)
```

### 4.2. パッケージを作る

:rocket: tips
env 11MODULE の話

## 5. 構造体

### 5.1. 構造体の定義
### 5.2. 変数の関連付け
:rocket: tips
`func (self Type) funcname` より、`func(self *Type) funcname` の方が使う


## 6. Webアプリケーション

### 6.1. net/http パッケージ
を、使わない互換あるけど、最小機能のzakohttpを使ってもらいます
### 6.2. curl
### 6.3. Goroutineに触れる
#### 6.3.1 ワンオペ牛丼屋は、大変そう
#### 6.3.2 バイト（goroutine）を雇おう


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
