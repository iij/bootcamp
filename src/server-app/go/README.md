---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
title: GoでWebアプリケーションを作る
description: Go言語を使って簡単なWebアプリケーションを作ります
time: 2.0h
prior_knowledge: golang
---

<header-table/>

GoでWebアプリケーションを作る
===

# 0. この講義について ( 5 min )
## 0.1. 目的
* あなたがプログラミングを行う際の選択肢として、Goを挙げられる為の第一歩となること
	* より、知らない人に知ってもらうことを重要視しています

## 0.2. 対象者
想定レベルは以下の通りです。  
* ls, cd 程度のLinuxファイル操作が行える  
* curl の操作が行える  
* 実行形式ファイル(.exeなど)という存在を知っている  
* `if`, `for`, `switch case` などの、割と多くの言語で近い表現のある構文を知っている  
* 関数、引数、戻り値 というキーワードを知っている  

出来ると理解が捗るスキルは以下の通りです。  
* クラス、メソッド というキーワードを知っている
* どんな言語(COBOL, Javascript, bash, python, ...) でも良いので、簡単なコーディングを行ったことがある  

参加者の制限は特に設けていませんが、  
Goを知らない方かつ、プログラミング技術をこれから身につけていきたい方へ伝える事に重点をおきコンテンツを作成しています。  
そのため、既にGo言語を実用レベルで活用されている方は、退屈かと思われます。  

## 0.3. 下準備

事前に、[GoでWebアプリケーションを作る(下準備編)](./var/md/init.md) を参考に準備をしてください。  
講義内では、下準備に対する質問は回答しません。受講年度の事前質問方法に合わせ、事前に確認してください。  

## 0.4. 本資料の表現
* :computer:
	* 受講者が操作する箇所を示します
* :recycle:
	* 受講者が操作した結果の想定を示します
* :rocket:
	* もっと知ってみようのコーナーです。コーディング知識がある方や、今の講義では物足りないと思った方向けの内容です
* `<ほげほげ>`
	* 任意の値を示します
	* 入力値に本表現が用いられる場合は、任意の値(適切な値)に書き換えてください
* `$ <コマンド>`
	* 上記 `$` は、プロンプトを意味します。実際に入力は行いません
* `[<要素>]`
	* 必須では無い要素を`[`と`]`で囲みます
* `#...省略`
	* 途中要素を省略しています。本来ソースコードなどが存在する予定の場所です
* `...`
	* 直前の要素をn回繰り返します
* Go言語ソースコード上の、`// <任意のコメント>`
	* コメントです。存在する状態でもソースコードが動作します
* :computer: の、`:# <任意の表現>`
	* ハンズオンに対するコメントです。執筆者の任意のコメントもしくは、決まった表現をします
	* 決まった表現は、以下です
		* `:# WORKPATH <ファイルパス>`
			* 動作させるカレントディレクトリを示します。`cd <ファイルパス>` すると、快適にハンズオンを楽しめます
			* 省略されている場合、pathの指定はありません。どのようなディレクトリから実行しても出力が同一となる想定です
		* `:# COPY <srcファイルパス> <dstファイルパス>`
			* 1つ以上前の演習で作成したソースコードを引き継げる演習の場合、コピーするパスを表示しています
				* 記載のファイルパスは、フルパスとしているため、どのようなディレクトリからであっても実行可能です
			* `cp <srcファイルパス> <dstファイルパス>` とすることで、引き継ぎができます
		* `:# TERMINAL <識別番号>`
			* ハンズオンで利用するターミナルを識別します
### 解釈例

```shell
:# TERMINAL 9999999
$ git clone <リモートリポジトリのアドレス>
```

上記のような記載であり、  
<リモートリポジトリのアドレス> に当てはまる値が、`git@github.com:iij/bootcamp.git` の場合、  
ターミナルへ入力する値は、以下のようになります。  

```shell
git clone git@github.com:iij/bootcamp.git
```

# 1. Goとは ( 8 min )
Googleが主導して開発しているプログラミング言語です。  
正式名称は、`Go` ですが、ググラビリティが低いので、`Golang` `golang` `go言語` `Go言語` `go-lang` 辺りで表記されていることが多いです。  
わざわざ、[開発者の一人(Rob Pike 氏) が、ツイート](https://twitter.com/rob_pike/status/886054143235719169) しています。  

## 1.1. 特徴

### 1.1.1. シンプルである
設計思想として単純さを是としています。  
[Simplicity is Complicated](https://talks.golang.org/2015/simplicity-is-complicated.slide#1)  

例えば、言語仕様。使用されるキーワードは25個しかありません。  
[The Go Programming Language Specification#Keywords](https://golang.org/ref/spec#Keywords)  
表現や構造がシンプルであるため、学習コストが低いという側面があります。  

### 1.1.2. 標準パッケージが充実している
Go言語の環境を用意するだけで、[標準パッケージ](https://golang.org/pkg/) を扱え、より多くの作業が行えます。  
* testing: テスト記述
* net/http: HTTPサーバ/クライアントなど
* encoding: hexやテキスト表現
* crypto: 暗号関係
* ...

### 1.1.3. クロスコンパイルが容易
コンパイル時に、環境変数`GOOS`や`GOARCH` を設定するだけで、Windowsの実行形式ファイルやLinuxの実行形式ファイル、macOSの実行形式ファイルを出力することができます。  
標準パッケージの多くが、クロスコンパイルされることを前提としているため、標準パッケージを活用することで、環境ごとに不具合の起きづらい開発を行うことが可能です。  
例えば、ファイルパスの文字列結合は、`"path1" + "\" + "path2"` といった表現はせず、`path/filepath` の関数`Join` を用い、`filepath.Join("path1", "path2")`というように表現することをお勧めします。  

注意しておかなければいけない点としては、一部パッケージには、OS依存のものがあるということです。  
例えば、Windowsのレジストリに対する処理のような、OSに依存するものがあります。  

### 1.1.4. 周辺ツールが標準で提供される
Go言語をインストールするだけで、パッケージの管理やダウンロード、コンパイル、テスト、字句解析、ドキュメント生成など、多くのことが実行できます。  
`go <subcommand>` 形式で、それらのツールを扱うことが可能です。  
参考: [コマンド一覧](https://golang.org/cmd/)  

### 1.1.5. 並行プログラミングが文法レベルでサポートされている
とても簡単に並行プログラミングを作成することができます。  
並行プログラミングしない場合は、`func(){//<yourCode>}()` のような形で関数を呼び出せます。  
対して、並行プログラミングする場合は、`go func(){//<yourCode>}()` のような形で関数を呼び出します。  
わずか、3 byteほどの差分で並行プログラミングを表すことが可能です。  

興味のある方は、[Pthreads プログラミング](https://www.oreilly.co.jp/books/4900900664/) などの、他言語のマルチスレッド記法を学習すると、  
この容易さに感動できるのではないでしょうか。  

なお、Go言語での並行プログラミングさせたスレッドは、Goroutine(ごーるーちん) と呼びます。

#### :rocket: Goroutineは、カーネルスレッドではありません。
OSのカーネルスレッドとは異なり、ユーザ空間で動作する軽量なスレッドです。  
それぞれのGoroutineの管理（スケジューリングなど）も、1つのユーザ空間スレッドとして動作しています。  

### 1.1.6. Gopher がかわいい
RFC1436 の [Gopher](https://ja.wikipedia.org/wiki/Gopher) ではありません。  
Go の [Gopher](https://golang.org/doc/gopher/gopherbw.png) がかわいいです。  

## 1.2. どこで使われているの?
本講義でも活用している、[Docker](https://github.com/docker/docker-ce) で扱われています。  
また、具体的なサービス名は見つけられませんが、[Go言語の日本ユーザ](https://github.com/golang/go/wiki/GoUsers#japan) にある通り、一度は聞いたことがありそうなサービスにGoが関わっているのかもしれませんね。  

他にも、軽量なGit Webサービスのプロジェクト [Gitea](https://gitea.io/en-us/) のような、Go言語の特徴を活かしたOSSはいくつもあります。  
ぜひ探してみてください。  

# ハンズオンの開始

以降の章では、事前準備したDockerを用い、ハンズオンを行います。  

特別な注釈がない限り、実施するプロンプトは、コンテナ上です。  
もしコンテナを実行していないようであれあば、以下のコマンドを実行してください。  
```shell
:# TERMINAL 0

:# vim,emacs,nano派の人はこちら
$ docker run --name go-tutor -p 5009:8888 -d --rm jo7oem/go-tutor-vscode:2025
$ docker exec -it go-tutor /bin/bash

:# VSCode派の人はこちら
$ docker run --name go-tutor -p 5009:8888 -d --rm jo7oem/go-tutor-vscode:2025
```

ハンズオンでは、こちらから指示したpathに、ディレクトリやファイルを作成してもらい、Go言語に触れてもらいます。  
基本的なフォルダ構成は、 `/root/go-tutor/go_tutorial/<セクション名>/<プログラム名>/***.go` のようになります。  

講師側が説明で用いるソースコード（答え）は、`/root/go-tutor/samples/<セクション名>/<プログラム名>/***.go` の形で格納してあります。  
講師側が想定している出力結果を確認したい際は、`/root/go-tutor/samples/`配下を実行することで、容易に確認できます。  
また、ハンズオンがうまく行かない際には、以下のように差分を確認することで、課題解決を助ける可能性があります。  
```shell
:# TERMINAL 0
$ diff /root/go-tutor/go_tutorial/<セクション名>/<プログラム名>/***.go /root/go-tutor/samples/<セクション名>/<プログラム名>/***.go
```

# 2. Hello, World ( 10 min )
本章では、Go言語の実行方法とコンパイル方法を確認します。  

## 2.1. Goの実行
### 2.1.1. Goを動かす
Go言語で作成されたソースコードの実行方法は2つあります。  
ソースコードをコンパイル（`go build`）し、実行形式ファイル（.exe等）を実行する方法と、  
ソースコードをスクリプト言語のように実行する`go run`コマンドを用いる方法です。  

#### :computer: 2.1.1.1. 以下のコマンドを実行して、Goを動かしてみよう  

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/2_helloworld/hello/

$ cd /root/go-tutor/go_tutorial/2_helloworld/hello/ 
$ <お好きなエディタ> main.go
$ go run main.go
```
* /root/go-tutor/go_tutorial/2_helloworld/hello/main.go
	```go
	package main

	import "fmt"

	func main() {
		fmt.Println("Hello, W0rld!!")
	}
	```
:recycle: 2.1.1.1. 結果
```shell
:# TERMINAL 0

$ go run main.go
Hello, W0rld!!
```

#### :computer: 2.1.1.2. 以下のコマンドを実行して、Goをコンパイルしてみよう。  
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/2_helloworld/hello/

$ go build main.go
$ ls
$ file ./main
$ ./main
```
:recycle: 2.1.1.2. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/2_helloworld/hello/

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

## 2.2. クロスコンパイルの体験
きっと便利ツールを作ってお手元のWindowsで動かしたくなることもあるでしょう。  
[1.1.3. クロスコンパイルが容易](#113-クロスコンパイルが容易) でも触れた通り、簡単に作成できることを確認してもらいます。  

### :computer: 2.2.1. 以下のコマンドを実行して、Goをコンパイルしてみましょう。  
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/2_helloworld/hello/

$ GOOS=windows GOARCH=amd64 go build main.go
$ ls
$ file ./main.exe
```
:recycle: 2.2.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/2_helloworld/hello/

$ GOOS=windows GOARCH=amd64 go build main.go
$ ls
main main.exe main.go
$ file ./main.exe
main.exe: PE32+ executable (console) x86-64 (stripped to external PDB), for MS Windows
```

##### Tips: クロスコンパイル先の対象一覧
クロスコンパイル時に指定する環境変数(`GOOS`, `GOARCH`)へ指定できる値は、`go tool dist list` というコマンドで確認できます。  
```shell
$ go tool dist list
aix/ppc64
android/386
android/amd64
android/arm
android/arm64
#...省略
```

# 3. 変数とその定義方法 ( 15 min )
本章では、変数とその定義方法についての確認と、変数定義に失敗しているソースコードを修正してもらいます。  

## 3.1. 変数の種類
Go言語は、静的型付け言語であるためコンパイル時に変数に紐付いた型の情報に整合性があるか検証されます。
この講義では深く触れませんが、下にGo言語における方の種類について簡単な説明を記載します。
興味のある方は[公式ドキュメント](https://go.dev/ref/spec#Types)を見てみてください。
* 組み込み型
  * 整数
    * `int`,`int8`,`int16`,`int32`,`int64`
    * `uint`,`uint8`,`uint16`,`uint32`,`uint64`
    * `uintptr`
    * `byte`
      * :rocket: uint8 のエイリアス(別名)です
	* `rune`
		* :rocket: int32 のエイリアス(別名)です
  * 浮動小数点
    * `float32`,`float64`
  * 複素数
    * `complex64`,`complex128`
  * 文字列
    * `string`
  
		:rocket: `string`を構成する文字は`rune`で構成されます
  * 真偽値
    * `bool`
  * エラー
    * `error`
* コンポジット型
	
	0個以上の変数をひとまとまりの集合として表した型です
  * 構造体 (`struct`)
  * 配列 (`array`) 
  * スライス (`slice`)
  * マップ (`map`)
  * チャンネル (`channel`)
* ユーザー定義型

	組み込み型やコンポジット型を元にユーザーが定義した型です
* `interface型`

	:rocket: これまで説明した型はデータがメモリ上にどのように表現されているかという観点から区別されていました。
	この`interface型`は方がどう振る舞うか(型にどんなメソッドが実装されているか)という観点で区別され、0個以上のメソッドから構成されます。
	また、[Go1.18からGenericsが追加](https://tip.golang.org/doc/go1.18#generics)されました。これにより、`interface`に型の情報を組み込むことができるようになりました。
	

## 3.2. 変数定義方法
Go言語では、変数の定義方法が3つあります。

1. `var <変数名> <型>`
	* 例: `var Hensu string`
	* 型指定有り。変数初期値の指定無し(stringなので、`""`になります。)
2. `<変数名> := <初期値>`
	* 例: `Hensu := "myValue"`
	* 型指定無し。代入元の型を引き継ぐ
3. `var <変数名> <型> = <初期値>`
	* 例: `var Hensu string = "myValue"`
	* 型指定有り。変数初期値の指定有り

予期せぬ型が変数に定義されないよう、最初のうち（書いている型をイメージできるまで）は、1か3の書き方をお勧めします。  
予期せぬ型が変数に定義されうる例として、`interface型` があります。  

##### :rocket: Tips: privateとPublicの指定方法
Go言語の名前空間は、`private`は先頭小文字。`Public`が先頭大文字と決まっています。  
packageに含める要素（変数や関数、構造体や構造体の要素など）をpackageの外部から参照させたい場合、先頭大文字の変数名とするようご注意ください。  

## 3.3. 不具合箇所は、最高の講師に教えてもらおう
Go言語では、書き方を間違えているととても丁寧に教えてくれる強い味方がいます。  
それは、コンパイラ（`go build`）です。  
「うーん、あ、この辺のソースみた？」とだけ返してくる先輩に比べ、「3行目、6文字目。変数定義されていないよ！？」と場所まで指定して教えてくれます。  
変数定義方法で、1や3を勧めた理由の1つとして、型が異なる場合にコンパイラに教えてもらえる可能性が高まるためというのもあります。  

ちょっと厳しい点があるとすれば、指摘が英語な点でしょうか。  
中学生レベルの英語と、単語を調べる力があれば解決できる文章しか出てこないので、ぜひ`go build`大先生に弟子入りしてみてください。  

##### Tips: 一度に教えてくれる量は限りがある  
エラーが多いと、数個のエラーの後に`too many error....`と続き、全てのエラーを教えてくれないことがあります。  
しょうがないので、教えてもらっているエラーから対処していきましょう。  

### :computer: 3.3.1. 以下のコマンドを実行して、修正箇所を認識してみよう。
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/3_var/plzfixme/

$ cd /root/go-tutor/go_tutorial/3_var/plzfixme/
$ go run main.go
```

:recycle: 3.3.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/3_var/plzfixme/

$ go run main.go
# command-line-arguments
./main.go:6:2: undefined: WatashiNoHensu
./main.go:7:14: undefined: WatashiNoHensu
```

## 3.4. 不具合の修正
### :computer: 3.3.1. ソースコードを修正し、エラーを無くしてみよう。  
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/3_var/plzfixme/

$ <お好きなエディタ> main.go
$ go run main.go
```
* `/root/go-tutor/go_tutorial/3_var/plzfixme/main.go`
	```go
	package main

	import "fmt"

	func main() {
		Watashi_no_Hensu = "GYUDON"       //./main.go:6:2: undefined: Watashi_no_Hensu
		fmt.Println(Watashi_no_Hensu)     //./main.go:7:14: undefined: Watashi_no_Hensu
	}
	```
:recycle: 3.4.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/3_var/plzfixme/

$ <お好きなエディタ> main.go
$ go run main.go
GYUDON
```
### :rocket: :computer: 3.4.2. 変数定義方法の3種類を全て試してみよう。

# 4. 関数 ( 10 min )
本章では、関数の定義方法と、Goっぽい関数の扱われ方について、確認してもらいます。  

## 4.1. 関数の定義
Go言語では、`func`から始まる形で、関数を定義できます。フォーマットは以下の通りです。

:rocket: 
```go
func <関数名>[[<型パラメータ1>,<型パラメータ2> ...]]([<引数1>, <引数2>...]) [(<戻り値1>, <戻り値2>...)] {
	<処理>
}
```
このフォーマットをみてわかる通り、Go言語では、複数の戻り値を指定できます。  

なお、引数、戻り値がない場合は、省略可能なため、最も短い関数の定義は、以下のようになります。  
```go
func myFunc() {
	<処理>
}
```
引数がいくつか存在し、戻り値が1つだけの場合は、以下のようになります。  
```go
func myFunc(name string, age uint) bool {
	var find bool
	<処理>
	return find
}
```
また、戻り値が複数になると、戻り値の型をかっこで囲む必要があります。  
```go
func myFunc(name string, age uint) (bool, error) {
	var find bool
	var result error
	<処理>
	return find, result
}
```
関数の基本的な定義方法は以上です。


##### :rocket: 変数名を戻り値の定義で、合わせて定義する方法もあります。  
変数の名前スコープが、関数内全体のスコープになり、認識すべき範囲が広がるため、執筆者は、あまり扱いません。  
```go
func myFunc(name string, age uint) (find bool, result error) {
	<処理>
	return find, result
}
```

##### :rocket: 型パラメータの使用 (Generics)
`interface型`を用いることで任意の型を受け付けられる関数を作成できます。
便利なようですが、実行時に型を解決するため意図しない挙動を取る可能性があります。
Go1.18でGenericsが導入されコンパイル時に型を解決することが可能になりました。
興味のあるひとは[Genericsのチュートリアル](https://go.dev/doc/tutorial/generics)をやってみてください。
```go
type Number interface {
	int64 | float64
}
func myFunc[T any,N Number](hoge []T, fuga N) []T {
	<処理>
	return res
}
```

## 4.2. 関数を書いてみる
第3章で、修正したソースコードを更新してもらいます。  
作成する関数は、渡された牛丼名を食べる関数です。  
本講義で行えることは限られるので、行為を以下のように定義します。  
* 空白以外の文字列を全て牛丼名とみなす
* 食べる行為は、標準出力とする
	* 本章では、`fmt.Println` を用いて、文字列を出力します
* 食べた場合は、`true`, 食べていない場合は、`false`を返す

## 4.2.0. if構文
本章のハンズオンでは、上述した定義を表すために、条件分岐が必要となります。  
条件分岐を表すための、Go言語によるif構文の書き方を先に紹介します。  

基本的なif構文は、以下の通りです。  
本講義では割愛しますが、`else if`や、`else`を続ける表現もあります。  
```go
if <条件> {
	<true処理>...
}
```
具体例は、以下のような表現となります。  
```go
func main() {
	var val1 string = "a"
	var val2 string = "a"
	if val1 == val2 {
		fmt.Println("True!")
	}
}
```
この例では、`val1 == val2` が条件式となり、bool値（`true` or `false`) を返却。それを元にifで条件分岐する流れを表しています。

この他に、Go言語では、ifの中で関数の戻り値を変数に代入し、変数を条件の要素とする書き方もあります。  
構文は以下のようになります。  
```go
if <判定要変数>... := <関数>(); <条件> {
	<判定式 true処理>...
}
```
具体例は、以下のような表現となります。  
```go
func myTest() bool {
#...省略

func main() {
	if res := myTest(); !res {
		fmt.Println("False")
	}
}
```
`myTest()`が、bool値(`true` or `false`) を返却し、resへ代入します。そして、`;`の後に続く条件式(`!res`)の結果に応じて条件分岐します。

## 4.2.1. :computer: 関数のコーディングを行う
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/4_funcy/monkey/

$ cd /root/go-tutor/go_tutorial/4_funcy/monkey/
$ <お好きなエディタ> eaters.go
$ go run eaters.go
```
* `/root/go-tutor/go_tutorial/4_funcy/monkey/eaters.go`
	```go
	package main

	import "fmt"

	func Eat(name string) bool {
		<nameが空白か比較する>
		<nameが空白ならば> {
 			<`return false`を行う>
		 }
		<nameが空白以外ならば、`fmt.Println(name)`を実行し、`return true`を行う>
	}

	func main() {
		var name1 string = "GYUDON"
		if ok := Eat(name1); !ok {
			fmt.Println("cannt eat: ", name1)
		}

		var name2 string = ""
		if ok := Eat(name2); !ok {
			fmt.Println("cannt eat: ", name2)
		}
	}
	```
:recycle: 4.2.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/4_funcy/monkey/

$ go run eaters.go
GYUDON
cannt eat: 
```

さて、既にお気づきの方もいると思いますが、`if ok := Eat(name1); !ok {` などの表現は、冗長です。  

変数に代入せず、`if !Eat(name1) {` というような表現であっても動作します。  
こちらの表現の方が、シンプルです。可読性や処理の観点からも良さそうです。  

しかし、Goっぽい関数を扱う場合に、シンプルな表現は、活用できないケースがあります。  

### 4.2.2. Goっぽい関数の書き方と、使い方
Go言語の関数は、戻り値を複数返せる特徴を持っています。  

この特徴を活用した、よく使われる表現として、関数の実行内容と、処理結果それぞれを戻り値で返却するというものが挙げられます。  
例えば、以下のような関数です。  
```go
func Writer() (int, bool) {
#...省略
```
この例では、第一戻り値に、書き込んだ文字数を返し、  
第二戻り値に、問題なく書き込めたかどうかを判定するbool値を返却しています。  

この関数`Writer()`は、複数の戻り値を持つため、ifに、bool値だけを渡すことができません。  
その為、この関数のbool値だけを用いて条件分岐を行う場合には、  
第一戻り値を捨て、第二戻り値だけを変数へ代入するというような記法が必要となります。  
```go
if _, ok := Writer(); !ok {
	fmt.Println("cannot write")
}
```
（任意の戻り値を捨てるには、`_`へ代入します。全て捨てる場合は、代入自体が不要です。）  

今回は、説明の例として、boolによる成功可否の判定を挙げましたが、  
Go言語では、エラー状態を格納できるerror型を用いることが多くあります。  

なお、error型は、ifがbool型を渡されたように判定することはできません。  
そのため、error型の空の状態（`nil`）をエラーではない状態として、それと比較することで条件分岐を行う書き方が多く扱われています。  
```go
func Writer() (string, error) {
#...省略
if _, err := Writer(); err != nil {
	fmt.Println("cannot write")
}
```

#### 4.2.2.1. :computer: Goっぽい関数を実行してみる
```shell
:# TERMINAL 0
:# COPY /root/go-tutor/go_tutorial/4_funcy/monkey/eaters.go /root/go-tutor/go_tutorial/4_funcy/likego/eaters.go
:# WORKPATH /root/go-tutor/go_tutorial/4_funcy/likego/

$ cp /root/go-tutor/go_tutorial/4_funcy/monkey/eaters.go /root/go-tutor/go_tutorial/4_funcy/likego/eaters.go
$ cd /root/go-tutor/go_tutorial/4_funcy/likego/
$ <お好きなエディタ> eaters.go
$ go run eaters.go
```
* `/root/go-tutor/go_tutorial/4_funcy/likego/eaters.go`
	```go
	package main

	import "fmt"

	func Eat(name string) (bool, error) {
		if name == "" {
			return false, fmt.Errorf("name is empty.")
		}
		fmt.Println(name)
		return true, nil
	}

	func main() {
		var name1 string = "GYUDON"
		if _, err := Eat(name1); err != nil {
			fmt.Println("cannot eat: ", err)
		}

		var name2 string = ""
		if _, err := Eat(name2); err != nil {
			fmt.Println("cannot eat: ", err)
		}
	}
	```
:recycle: 4.2.2.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/4_funcy/likego/

$ go run eaters.go
GYUDON
cannot eat: name is empty.
```

#### 4.2.2.2. :rocket: 変数スコープの注意事項
戻り値の変数を後ほど活用する場合は、スコープに注意してください。  
例えば、ファイル読み込みなどで、(`読み込んだ文字列`, `error`) のペアが戻り値となるケースです。  
例1では、第一戻り値が、ifのスコープ内となり、後続処理で活用できません。  
例2のように、ifの手前で一度変数を定義する必要があります。  
* 例1
	```go
	func FileReader(file_path string) (string, error) {
	#...省略

	func main() {
		var fpath string = "c:\mydata\data.txt"
		if body, err := FileReader(fpath); err != nil {
			panic(err)
		}
		// ここでは body がスコープ外
	}
	```
* 例2
	```go
	func FileReader(file_path string) (string, error) {
	#...省略

	func main() {
		var fpath string = "c:\mydata\data.txt"
		body, err := FileReader(fpath)
		if err != nil {
			panic(err)
		}
		// body がスコープ内（で、扱える）
	```

## 4.3. 関数の実行される順番
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

##### :rocket: `init`関数
`func main(){}` よりも先に実行される、`func init(){}` という関数があります。  
後ほど触れるパッケージで、初期化処理を行いたいケースなどで活用できます。  

# 5. パッケージ ( 10 min )
本章では、パッケージの参照方法と、実際にパッケージの作成を試してもらいます。  

## 5.1. パッケージを使う
実は既に、何度も登場している、`import fmt` が、パッケージ名fmtを使います。という表現です。  
`import <パッケージ名>` を増やすことで、他のパッケージを活用できます。  
複数のパッケージのimportでは、以下のように`()`でまとめることで、より文字数の少ない書き方もできます。  
```go
import (
	"fmt"
	"os"
)
```

## 5.1.1. :computer: 4章のソースコードを直す
4章で作成したソースコードには、修正すべき問題があります。  
それは、エラー時の出力先と、正常時の出力先が同じstdoutであることです。  

`fmt`に含まれる、`Print`関係の関数には、出力先を指定できるものが存在します。  
出力先を指定できる関数を用い、エラー出力をstderrに出力するよう修正してもらいます。  
実行時は、stdoutを捨てる(`> /dev/null`)すると、差分がわかることでしょう。  

なお、Go言語のstderr定数は、`os`パッケージの、`os.Stderr`として存在するため、追加で、`os`パッケージのインポートください。  

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/

$ cd /root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/
$ <お好きなエディタ> eaters.go
$ go run eaters.go
$ go run eaters.go > /dev/null
```
* `/root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/eaters.go`
	```go
	package main

	import (
		"fmt"
		"os" //追加
	)

	func Eat(name string) (bool, error) {
		if name == "" {
			return false, fmt.Errorf("name is empty.")
		}
		fmt.Println(name)
		return true, nil
	}

	func main() {
		var name1 string = "GYUDON"
		if _, err := Eat(name1); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err) //更新
		}

		var name2 string = ""
		if _, err := Eat(name2); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err) //更新
		}
	}
	```
:recycle: 5.1.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/

$ go run eaters.go
GYUDON
cannot eat: 'name is empty.'
$ go run eaters.go > /dev/null
cannot eat: 'name is empty.'
```

## 5.2. パッケージを作る
実は既に、mainパッケージを何度も作成しています。  
1行目に書いている`package main` です。  
`package <パッケージ名>`と、先頭に書くことで、パッケージ名を定義できます。  
`package main`は、それを起点として実行できる決められたパッケージ名です。  
今回は、main以外の任意の名前が指定可能な、起点から呼び出されるパッケージを作成してもらいます。  

### 5.2.1. :computer: 関数Eatのshopパッケージ化
```shell
:# TERMINAL 0
:# COPY /root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/eaters.go /root/go-tutor/go_tutorial/5_package/notKinkyuJi/eaters.go
:# WORKPATH /root/go-tutor/go_tutorial/5_package/notKinkyuJi/

$ cp /root/go-tutor/go_tutorial/5_package/fixFunckyMonkey/eaters.go /root/go-tutor/go_tutorial/5_package/notKinkyuJi/eaters.go
$ cd /root/go-tutor/go_tutorial/5_package/notKinkyuJi/ 
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
```
* `/root/go-tutor/go_tutorial/5_package/notKinkyuJi/shop/shop.go`
	```go
	package shop

	import (
		"fmt"
	)

	func Eat(name string) (bool, error) {
		if name == "" {
			return false, fmt.Errorf("name is empty.")
		}
		fmt.Println(name)
		return true, nil
	}
	```
* `/root/go-tutor/go_tutorial/5_package/notKinkyuJi/eaters.go`
	```go
	package main

	import (
		"os"
		"fmt"
		"./shop"
	)

	func main() {
		var name1 string = "GYUDON"
		if _, err := shop.Eat(name1); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err) //更新
		}

		var name2 string = ""
		if _, err := shop.Eat(name2); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err) //更新
		}
	}
	```
:recycle: 5.2.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/5_package/notKinkyuJi/

$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
GYUDON
cannot eat: 'name is empty.'
```

##### :rocket: 真のパッケージ化
本章の課題では、`import "./shop"`のような、相対Pathによるimportを行っています。  
相対Pathによるimportは推奨されず、コンパイルエラーとなります。  
本講義では、`go mod`の説明を割愛するため、対象エラーを無効化できる環境変数`GO111MODULE=off`を指定しています。  
使えるmoduleを作成する場合は、[Module作成方法](https://golang.org/doc/tutorial/create-module)や、[その他のModuleの呼び方](https://golang.org/doc/tutorial/call-module-code)を参考に、`go mod`に沿ったパッケージ化が推奨されます。  

# 6. 構造体 ( 15 min )
本章では、構造体の定義方法と、構造体に関係付ける関数（メソッド）の作成方法について、確認してもらいます。  

## 6.1.0. 構造体とは
構造体は、任意の定義ずみの型を0個以上まとめることが可能な型です。  
例えば、既存の型では収められる量が不足する際に扱います。  
int64では、最大約923京(`9,223,372,036,854,775,807`) の京の桁(10^16)まで表せますが、1那由多(10^60)は、表すことができません。  
int64をいくつか組み合わせ、このint64は、1の位から。このint64は、垓（がい）の位から。と役割を決めていくことで、1那由多以上を表せる型を定義できます。  

## 6.1. 構造体の定義
Go言語では、`type`から始まる形で、名前付きの型を定義できます。  
```go
type <名称> <型>
```
構造体の定義は、型部分に、予約された表現である、`struct {}`を用い定義します。  
(変数に直接代入する構造体の定義方法もありますが、本講義ではふれません。)  
```go
type <名称> struct {
	[<名前> <型>] //要素1
	[<名前> <型>] //要素2
	#...省略
}
```
例えば、[6.1.0 構造体とは]() で例に挙げたint64では桁数が不足する際の構造体をGo言語で記述すると、以下のようになります。  
```go
type FantasticInt struct {
	ichi_no_keta int64
	gai_no_keta int64
	#...省略
```

構造体を変数として定義する場合は、intなどの標準型と同様、以下のように定義できます。  
要素にアクセスする際は、`<変数>.<要素の名前>` と指定します。  
```go
func main() {
	var MyInt FantasticInt

	fmt.Println(MyInt.ichi_no_keta)
	fmt.Println(MyInt.gai_no_keta)
}
```

## 6.2. 構造体への関数の関連付け
先ほど例に挙げた`type FantasticInt`は、`+-*/` を用いて計算ができません。  
```go
package main

import "fmt"

type FantasticInt struct {
	ichi_no_keta int64
	gai_no_keta int64
	#...省略
}

func main() {
	var num1 FantasticInt = FantasticInt{ichi_no_keta: 0, gai_no_keta: 1 #...省略 }
	var num2 FantasticInt = FantasticInt{ichi_no_keta: 1, gai_no_keta: 1 #...省略 }

	fmt.Println(num1 + num2)
}
```
これは、コーダが独自に定義した型をどのように計算するかGo言語に定義されていない為におきます。  
残念ながら`+-*/`を活用した計算はできませんが、処理を定義することで計算は可能となります。  
独自の型へ独自の処理を定義する方法は、3つあります。  
### 6.2.1. 型を利用するスコープ上に、そのまま処理を書く
```go
func main() {
	var num1 FantasticInt
	var num2 FantasticInt

	var ichi_no_keta int64 = num1.ichi_no_keta + num2.ichi_no_keta
	var gai_no_keta int64 = num1.gai_no_keta + num2.gai_no_keta
	#...省略

	fmt.Println(ichi_no_keta)
	fmt.Println(gai_no_keta)
	#...省略
}
```
### 6.2.2. 型を引数として利用できる関数を定義する
```go
func Add(num1 FantasticInt, num2 FantasticInt) FantasticInt {
	var ichi_no_keta int64 = num1.ichi_no_keta + num2.ichi_no_keta
	var gai_no_keta int64 = num1.gai_no_keta + num2.gai_no_keta
	#...省略

	return FantasticInt{
		ichi_no_keta: ichi_no_keta,
		gai_no_keta: gai_no_keta,
		#...省略
	}
}

func main() {
	var num1 FantasticInt
	var num2 FantasticInt
	num3 := Add(num1, num2)
	#...省略
```
### 6.2.3. 型をレシーバ引数として関数と関連付けする
型に関数を紐付け、`変数.関数()`の形で呼び出す方法です。レシーバ引数で紐付けを行っている関数を、メソッドとも呼びます。  
```go
func (<レシーバ引数変数名 レシーバ引数型>) <関数名> ([<引数1>, <引数2>...]) [(<戻り値1>, <戻り値2>...)] {
```
`FantasticInt`へ、数字を追加する、足し算メソッドを用意する場合は、以下のようになります。  
```go
func (self *FantasticInt) Add(num FantasticInt) {
	self.ichi_no_keta = self.ichi_no_keta + num.ichi_no_keta
	self.gai_no_keta = self.gai_no_keta + num.gai_no_keta
	#...省略

func main() {
	var num1 FantasticInt
	var num2 FantasticInt

	num1.Add(num2)
	fmt.Println(num1)
}
```
先程紹介した2つでは、**AとBを足し、Cという新しい領域を作成**しています。  
今回の記法では、**AにBに加える** というような、レシーバ引数となった実体へ影響を与えるような書き方をしています。  
どちらの表現でも処理自体は行えますが、処理の効率や可読性の観点から、どちらを選ぶか判断が必要です。  

:rocket: レシーバ引数で、実体に影響を与えるためには。  
本講義で詳細は触れませんが、実体に影響を与えるためには、リファレンス参照（ポインタのようなもの）が必要です。  
引数を定義する際の`<変数> <型>` を、`<変数> *<型>` のようにアスタリスクをつけることでリファレンス参照となります。  

##### Tips: Go言語には、"math/big" があります
int64では扱えないサイズを例に挙げ、本資料では独自の方を定義していますが、  
Go言語標準パッケージに、int64よりも大きいサイズを扱える、[math/big](https://golang.org/pkg/math/big/)パッケージが存在します。  

## 6.3. 牛丼屋型と、注文する関数を定義する
先ほども紹介した通り、構造体(`struct`) は、`任意の定義ずみの型を0個以上まとめることが可能な型`なため、数字桁を扱うグルーピング以外にも活用できます。  
牛丼屋で考えてみます。  
```go
type GYUDONYA struct {
	reji_1  TypeOfCashRegister
	reji_2  TypeOfCashRegister

	seki_1  TypeOfChair
	seki_2  TypeOfChair
	seki_3  TypeOfChair

	chubo_1 TypeOfKitchen

	menu    string

	ZipCode int64
	#...省略
```
レジや席がいくつか存在し、厨房やメニューがあることでしょう。あとは、所在の郵便番号(ZipCode)。他にも、電話番号や社員の一覧など、構成要素はまだまだありそうです。  
牛丼屋を完璧にシミュレーションするコードを作成したければ、もっと沢山の構成要素を意識する必要がありますが、牛丼屋を考える講義でも無く、執筆者が牛丼屋で働いたこともないので、もう少しシンプルな実習コードとします。  

### 6.3.1. :computer: お店で食べられる牛丼屋型を実行する
```shell
:# TERMINAL 0
:# COPY /root/go-tutor/go_tutorial/5_package/notKinkyuJi/eaters.go /root/go-tutor/go_tutorial/6_struct/weakShop/eaters.go
:# COPY /root/go-tutor/go_tutorial/5_package/notKinkyuJi/shop/shop.go /root/go-tutor/go_tutorial/6_struct/weakShop/shop/shop.go
:# WORKPATH /root/go-tutor/go_tutorial/6_struct/weakShop/

$ cp /root/go-tutor/go_tutorial/5_package/notKinkyuJi/eaters.go /root/go-tutor/go_tutorial/6_struct/weakShop/eaters.go
$ cp /root/go-tutor/go_tutorial/5_package/notKinkyuJi/shop/shop.go /root/go-tutor/go_tutorial/6_struct/weakShop/shop/shop.go
$ cd /root/go-tutor/go_tutorial/6_struct/weakShop/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
:# 10秒程度待機する
```
* `/root/go-tutor/go_tutorial/6_struct/weakShop/shop/shop.go`
	```go
	package shop

	import (
		"fmt"
		"time"
	)

	type Gyudon struct {
		menu string
	}

	func NewGyudon() Gyudon { //変数定義用の関数
		return Gyudon{
			menu: "NegitamaGyudon",
		}
	}

	func (self *Gyudon) Eat() (bool, error) {
		if self.menu == "" {
			return false, fmt.Errorf("name is empty.")
		}

		time.Sleep(time.Second * 10) //擬似食べてる時間
		fmt.Println(self.menu)
		return true, nil
	}
	```
* `/root/go-tutor/go_tutorial/6_struct/weakShop/eaters.go`
	```go
	package main

	import (
		"os"
		"fmt"
		"./shop"
	)

	func main() {
		myshop := shop.NewGyudon()
		if _, err := myshop.Eat(); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err)
		}
	}
	```
:recycle: 6.3.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/6_struct/weakShop/

$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> gyudon-httpd.go
$ go run eaters.go
:# 10秒程度待機する
NegitamaGyudon
```

# 7. Webアプリケーション ( 15 min )
本章では、これまで順番に作り上げてきたGyudon型をWebアプリケーションサーバとして起動する方法を確認してもらいます。  
本章までを通して、Go言語の基本的な扱い方を学習した皆さんには、最も簡単な章かもしれません。  

## 7.0. 準備
本章以降、複数のターミナルを用い、ハンズオンいただきます。  
既存のコンテナに接続し利用するため、それぞれターミナルを起動し、以下コマンドを実行ください。  
VSCodeをお使いの方はターミナルを追加で起動してください。
```shell
:# TERMINAL 1
$ docker exec -it go-tutor /bin/bash

:# TERMINAL 2
$ docker exec -it go-tutor /bin/bash
```


## 7.1. httpを起動する方法
Go言語の標準パッケージ [net/http](https://golang.org/pkg/net/http/) を活用するだけで起動します。  
特に細かい処理に拘らず、デフォルト動作でWebアプリケーションサーバをコーディングするのであれば、呼び出す側は以下の2行だけですみます。  
```go
func httphandler(w http.ResponseWriter, r *http.Request) {
	#...省略
}

func main() {
	http.HandleFunc("/", httphandler)   //どこのPathで、どんな処理をするか
	http.ListenAndServe("localhost:8080", nil) //どの接続元(ホスト名:ポート)で、サーバを起動するか
	if err != nil {
		panic(err)
	}
}
```

## 7.2. はじめてのGo言語Webアプリケーション起動
では、Webアプリケーションサーバの書き方も知ってもらったので、実際にコーディングしてもらいましょう。  
理由は後ほど説明しますが、本講義では、[net/http](https://golang.org/pkg/net/http/)パッケージではなく、講義用の下位互換httpパッケージ(zakohttp) を参照してもらいます。  

```shell
:# TERMINAL 0
:# COPY /root/go-tutor/go_tutorial/6_struct/weakShop/shop/shop.go /root/go-tutor/go_tutorial/7_webapp/weakShop/shop/shop.go
:# COPY /root/go-tutor/go_tutorial/6_struct/weakShop/eaters.go /root/go-tutor/go_tutorial/7_webapp/weakShop/gyudon-httpd.go
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ cp /root/go-tutor/go_tutorial/6_struct/weakShop/shop/shop.go /root/go-tutor/go_tutorial/7_webapp/weakShop/shop/shop.go
$ cp /root/go-tutor/go_tutorial/6_struct/weakShop/eaters.go /root/go-tutor/go_tutorial/7_webapp/weakShop/gyudon-httpd.go
$ cd /root/go-tutor/go_tutorial/7_webapp/weakShop/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> gyudon-httpd.go
$ go run gyudon-httpd.go


:# TERMINAL 1
$ curl http://localhost:8080/
:# 10秒程度待機する
```
* `/root/go-tutor/go_tutorial/7_webapp/weakShop/shop/shop.go`
	```go
	package shop

	import (
		"fmt"
		"time"
		"../http"
	)

	type Gyudon struct {
		menu string
	}

	func NewGyudon() Gyudon {
		return Gyudon{
			menu: "NegitamaGyudon",
		}
	}

	func (self *Gyudon) Eat(w http.ResponseWriter, r *http.Request) { //引数をhttpdのセッション状態を受け取れるように追加
		if self.menu == "" {
			return
		}

		time.Sleep(time.Second * 10) //擬似食べてる時間
		fmt.Fprintf(w, "'%s'\n", self.menu) //食べた事を報告
		return
	}
	```
* `/root/go-tutor/go_tutorial/7_webapp/weakShop/gyudon-httpd.go`
	```go
	package main

	import (
		"./shop"
		"./http"
	)

	func main() {
		myshop := shop.NewGyudon()
		http.HandleFunc("/", myshop.Eat)
		err := http.ListenAndServe("localhost:8080", nil)
		if err != nil {
			panic(err)
		}
	}
	```
:recycle: 7.2. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> gyudon-httpd.go
$ go run gyudon-httpd.go


:# TERMINAL 1
$ curl http://localhost:8080/
:# 10秒程度待機する
'NegitamaGyudon'
```
:computer: 7.2. 後処理
```shell
:# TERMINAL 0
:# Ctrl + C で、gyudon-httpd.goをKillしてください
```

## 7.3. Goroutineに触れる
Go言語の特徴でも述べた([1.1.7. 並行プログラミングが文法レベルでサポートされている]())通り、Go言語では並行処理が簡単にかけます。  
最後に、本講義で書いたWebアプリケーションサーバを用い、並行処理を体験してもらおうと思います。  

突然ですが、座席が1つしかない牛丼屋に行かれたことはありますか？  
執筆者は、大手牛丼チェーンの各社それなりに行きますが、今のところ座席が1つの店舗に巡り合ったことはありません。  
平時の店舗で、1つの座席しか無いようでは、Aさんが食べ終わるまでBさんが牛丼を食べることができず、採算取れないからでしょうか。  

ご存知の方も多いでしょうが、プログラムは、指定しない限り、処理を1つずつ順番に実行します。  
そのため、1つの座席しか無い牛丼屋と同じ状況が起きます。  
何も考えずに、HTTPサーバを開発すると、Aさんの画面が表示されるまで、Bさんの画面はずっと読み込み中でくるくる(待ち)になってしまいます。  

めちゃくちゃ美味しい隠れた名店で、1席しか無いような状況であれば、執筆者は我慢できますが、  
HTTPサーバで、他者の処理が終わらないと利用できないなんて、使えたものではありません。  

### 7.3.1. :computer: 1座席なWebアプリケーションサーバ体験
試しに、2つのリクエストを送ると、1つ目のリクエストが10秒、2つ目のリクエストが約20秒かかることがわかると思います。  

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ go run gyudon-httpd.go


:# TERMINAL 1
$ time curl http://localhost:8080/
:# 10秒程度待機する


:# TERMINAL 2
$ time curl http://localhost:8080/
:# 10秒程度待機する
```
:recycle: 7.3.1. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ go run gyudon-httpd.go
:# 何も出力されない場合、実行中です。続くハンズオンを実施ください


:# TERMINAL 1
$ time curl http://localhost:8080/
'NegitamaGyudon'
:# 10秒程度待機する

real    0m10.036s
user    0m0.014s
sys     0m0.013s

:# TERMINAL 2
$ time curl http://localhost:8080/
'NegitamaGyudon'
:# 10秒程度待機する

real    0m18.991s
user    0m0.004s
sys     0m0.010s

```
これは、2つ目のリクエストが、1つ目のリクエストが終わるまでの待ち時間＋自身の実行時間となるためです。  

:computer: 7.3.1. 後処理
```shell
:# TERMINAL 0
:# Ctrl + C で、gyudon-httpd.goをKillください
```


### 7.3.2. 並行プログラミング
AさんとBさんに、同時に牛丼を食べてもらう方法は、簡単です。  
座席を2つ用意すれば良いのです。Cさん、Dさん.....と1000000人来店したら、来店と同時に座席を増やしてしまえば、誰も待たなくて良くなります。  
これによりDさんは、AさんBさんCさんが食べ終わるのを待つことなく、食べ始めることができます。  
(現実では難しいでしょうが、不思議なポッケで叶えてもらったと思ってください。)  

プログラムでも、複数の処理をおおむね同時に実行する(厳密には、したように見せる。が正しい) 並行プログラミングがあります。  
並行プログラミングなコードを自身で作成するためには、領域の管理を考えた数十行のコードを作成する必要があります。  
牛丼屋の例で考えると、座席をどう確保すべきか、どういった要素が必要か。客が離れたら座席をどのように撤去するべきか。1つしかない厨房から牛丼をどのような形で提供するか。辺りです。  

既に特徴で紹介していますが、Go言語では、Goroutine を用いることで、とても低コストに並行プログラミングを行えます。  
:rocket: Goroutineだけではなく、本講義では触れないChannelや、GCによって、低コストに並行プログラミングができます。  

実際に、食べる処理(Eat関数) を、並行プログラミングにして、2つ目のリクエストが、1つ目のリクエストを待たなくても良いように、アップグレードしましょう  

### 7.3.3. :computer: 並行動作するWebアプリケーションサーバ体験
`/root/go-tutor/go_tutorial/7_webapp/weakShop/http/zakohttp.go` の、`c.serve(self.ctx)` が、Eat関数を呼び出しています。  
ここをGoroutine化し、その先にあるEat関数を新しく誕生させた座席(Goroutine)で動作させるようにしましょう。  

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ <お好きなエディタ> http/zakohttp.go
$ go run gyudon-httpd.go
:# 何も出力されない場合、実行中です。続くハンズオンを実施ください


:# TERMINAL 1
$ time curl http://localhost:8080/
:# 10秒程度待機する

:# TERMINAL 2
$ time curl http://localhost:8080/
:# 10秒程度待機する
```
* /root/go-tutor/go_tutorial/7_webapp/weakShop/http/zakohttp.go
	```go
	c.serve(self.ctx)    //Line56 もともとの書かれ方
	go c.serve(self.ctx) //Line56 変更後。go と、加筆する
	```
:recycle: 7.3.3. 結果
```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/7_webapp/weakShop/

$ <お好きなエディタ> http/zakohttp.go
$ go run gyudon-httpd.go
:# 何も出力されない場合、実行中です。続くハンズオンを実施ください


:# TERMINAL 1
$ docker exec -it go-tutor /bin/bash
$ time curl http://localhost:8080/
:# 10秒程度待機する
'NegitamaGyudon'


real    0m10.033s
user    0m0.019s
sys     0m0.009s

:# TERMINAL 2
$ docker exec -it go-tutor /bin/bash
$ time curl http://localhost:8080/
:# 10秒程度待機する
'NegitamaGyudon'


real    0m10.012s
user    0m0.019s
sys     0m0.009s
```
:computer: 7.3.3. 後処理
```shell
:# TERMINAL 0
:# Ctrl + C で、gyudon-httpd.goをKillください
```

##### Tips: Goroutineは、注意して使いましょう
お手軽な`go func(){}()` ですが、注意が必要です。  
並行動作を簡単に行えますが、並行動作に対応した処理やデータの安全性は、プログラマ自身が考え、コード化しておく必要があります。  
Goroutineが迷子になったり、データが壊れたり、リソースの奪い合いになったりと、危険なことが多くあります。  
本番サービスとして、きちんと提供する場合は、並行プログラミングを学習してから利用することをお勧めします。  

### 7.4. zakohttpパッケージについて
第7章は、Go言語標準パッケージ [net/http](https://golang.org/src/net/http) の以下の処理を参考に作成しています。(執筆時点最新のHEAD)  

[https://github.com/golang/go/blob/cb4cd9e17753b5cd8ee4cd5b1f23d46241b485f1/src/net/http/server.go#L2993](https://github.com/golang/go/blob/cb4cd9e17753b5cd8ee4cd5b1f23d46241b485f1/src/net/http/server.go#L2993)

実は、本講義を通して、Go標準パッケージの劣化版を、Go標準パッケージに近づけるコーディングをしてもらいました。  
[net/http](https://golang.org/src/net/http) パッケージは、通信に関する処理や、同期処理、書き込み処理やハンドラの登録など、Goで触っておくと良さそうな表現が色々と存在します。  
腕試しをされるのであれば、zakohttpの問題を考え、アップグレードし続けてみてください。  

# 8. テスト ( 10 min )
本章では、これまで作り上げてきたGyudon型にテストを追加してもらいます。

## 8.1. Go言語でのテストのやり方
Go言語にはテストをサポートする標準パッケージ [testing](https://pkg.go.dev/testing) があります。
そのためなにかテストフレームワークを使うのではなく、標準のライブラリを使用してテストを行うケースが多いです。

テストは以下のコマンドだけで実行できます。
`./...`でカレントディレクトリ以下のすべてのファイルが対象となります。
```shell
$ go test ./...
```

`<機能>.go`というファイルがある時、テストは`<機能>_test.go`という名前のファイルに記述していきます。

テストの関数は下のような書き出しで始めます。

```go
func Test<テスト名>(*testing.T)
```

このような関数のテストを書くときを考えます。

```go
func IsTopping(food string)bool{
	switch food {
	    case "BeniShoga":
		    return true
		
	    case "Egg":
			retuen true
			
    }
	return false
}
```

簡単なテストを書くとこのようになります。
panicしたり、Errorに書き込まれなければテストは成功です。

```go
func TestIsTopping(t *testing){
	food := "BeniShoga"
	
	if got:=IsTopping(food); !got{
		t.Errorf("food = %s , want",got)
    }
}
```

## 8.2. :computer: テストの実行と修正
では、基本的なテストのやり方を知ってもらったので、実際に試してみましょう。  
本講義では5章で作った関数Eatにテストを追加する形で進めます。

手始めに関数TestGyudon_EatSimpleをいじってテストの挙動を確認してみましょう。

### 試してみてほしいこと
1. `want`と`got`を比較して、違っていたら`t.Errorf()`にメッセージを表示するように修正する
2. テストを実行する
3. 文字が一致してテストが成功するパターンを試す
4. 文字が一致せずテストが失敗するパターンを試す

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/8_test/test/

$ cd /root/go-tutor/go_tutorial/8_test/test/
$ <お好きなエディタ> shop/shop_test.go
$ go test ./...
```

* `/root/go-tutor/go_tutorial/8_test/test/shop/shop_test.go`
    ```go
    func TestGyudon_EatSimple(t *testing.T) {
    w := bytes.Buffer{}
    r := http.Request{}

	gd := NewGyudon()
	gd.menu="<入れたい文字列>"
	gd.Eat(&w, &r)
	/// 関数の結果を格納
	got := w.String()

	/// 判定処理を書く
    }
  ```
  
:recycle: 8.2. 結果

```shell
:# TERMINAL 0
:# WORKPATH /root/go-tutor/go_tutorial/8_test/test/

$ cd /root/go-tutor/go_tutorial/8_test/test/
$ <お好きなエディタ> shop/shop_test.go
$ go test ./...
```

* `/root/go-tutor/go_tutorial/8_test/test/shop/shop_test.go`
    ```go
    if want != got {
        t.Errorf("want = %s, got = %s\n", want, got)
    }   
    ```

## 8.3. :rocket: その他のテストの書き方

8.2.で試したテスト関数 TestGyudon_EatSimple のやり方の場合、引きすうごとにテストの関数を追加せねばならず不便です。
そのため、テスト関数 TestGyudon_Eat のように一つの関数内で複数のパターンのテストを記述することもよくあります。
時間に余裕があったり、興味があるひとはテスト関数 TestGyudon_Eat にあるテストパターンの間違いを修正したり、関数 Eat が参照する変数が空の場合のテストケースを追加してみてください。


# 9. 最後に ( 2 min )
今回は、Goを知ってもらうために、Goの概要説明、実行やコンパイル、関数や構造体、そして、Goroutineをサクッと追っていきました。  
今回紹介しきれていない`interface`や`channel`、`context` 辺りを学習するとよりGo言語が、選択肢としての幅が広がっていくと思います。  
もしGo言語をもっと知ってみたいと思っているのであれば、Goが学習できる [go tour(日本語)](https://go-tour-jp.appspot.com/list) を、まずは一周してみることをお勧めします。  
基本的な構文や、Go言語の構造体の説明、先程あげた`interface`, `channel` の説明があります。(執筆時点、`context`の説明はありませんでした)  

なお、本講義外で、本講義で用いたソースコードを編集/検証することは、自由とします。  
いじくり回し、色々学習することも問題ありません。  
より素晴らしい例を見つけたら、本リポジトリにPRしていただいても大丈夫です。  

また、Go言語の構造から迫るアプローチ以外として、その他外部のコミュニティから情報を得るのも良いでしょう。
* Gophers Slackの`#japan`チャンネル
	* 世界中のGopherが集うSlack、その中の`#japan`に日本人Gopherが住んでいます
* [vim-jp slackの#lang-goチャンネル](https://vim-jp.org/docs/chat.html)
  * Vimコミュニティのslackですが、何故かGopher Slackの`#japan`より活発
  * 普通にEmacs使いの人もいるので、お使いのエディタに依らずどうぞ
  * [こういう人](https://mattn.kaoriya.net/etc/gde.htm)がいたりします
* [Go Conference](https://gocon.jp/)
  * 今年はこんな状態なので開催されてませんが、例年は半年毎に開催されるGoコミュニティによるカンファレンス

もちろん、本講義開催の講師陣に質問くださっても問題ありません。  
情報源はたくさんあるので、貪欲にGoを知ってみてください。  
ではみなさん、Let's Go!!  

<credit-footer/>
