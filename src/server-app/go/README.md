---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Go言語を使って簡単なWebアプリケーションを作ります
time: 1.5h
prior_knowledge: golang
---

<header-table/>

GoでWebアプリケーションを作る
===

# 0. この講義について (5min)
## 0.1. 目的
* あなたがプログラミングを行う際の選択肢として、Goを挙げられる為の第一歩となること
	* より、知らない方に知っていただくことを重要視しています

## 0.2. 対象者
想定レベルは以下の通りです。  
* ls, cd 程度のLinuxファイル操作が行える  
* curl (もしくは、wget) の操作が行える  
* 実行形式ファイル(.exeなど)という存在を知っている  
* `if`, `for`, `switch case` などの、割と多くの言語で近い表現のある構文を知っている  
* 関数、引数、戻り値 というキーワードを知っている  

出来ると理解が捗るスキルは以下の通りです。  
* どんな言語(COBOL, Javascript, bash, python, ...) でも良いので、簡単なコーディングを行ったことがある  


参加者の制限は特に設けておりませんが、  
Goを知らない方かつ、プログラミング技術をこれから身につけていきたい方へ伝える事に重点をおきコンテンツを作成しています。  
そのため、既にGo言語を実用レベルで活用されている方は、退屈かと思われます。  

## 0.3. 下準備

事前に、[GoでWebアプリケーションを作る(下準備編)](./var/md/init.md) を参考に準備をしてください。  
講義内では、下準備に対する質問は回答しません。受講年度の事前質問方法に合わせ、事前に確認ください。  

## 0.4. 本資料の表現
* :computer:
	* 受講者が操作する箇所を示します
* :recycle:
	* 受講者が操作した結果の想定を示します
* :rocket:
	* もっと知ってみようのコーナーです。コーディング知識がある方や、今の講義では物足りないと思った方向けの内容です
* `<ほげほげ>`
	* 上記は、変数です。任意の値(適切な値)に書き換えていただきます
* `$ <command>`
	* 上記 `$` は、プロンプトを意味します。実際に入力は行いません

### 解釈例

```shell
$ git clone <リモートリポジトリのアドレス>
```

上記のような記載であり、  
<リモートリポジトリのアドレス> に当てはまる値が、`git@github.com:iij/bootcamp.git` の場合、  
ターミナルへ入力する値は、以下のようになります。  

```shell
git clone git@github.com:iij/bootcamp.git
```

# 1. Goとは (5min)
Googleが主導して開発しているプログラミング言語です。  
正式名称は、`Go` ですが、ググラビリティが低いので、`Golang` `golang` `go言語` `Go言語` `go-lang` 辺りで表記されていることが多いです。  
わざわざ、[開発者の一人(Rob Pike 氏) が、ツイート](https://twitter.com/rob_pike/status/886054143235719169) してくれてもいます。  

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
	* 本講義で扱うhttpパッケージ(zakohttp) は、net/httpの下位互換です。net/httpにインポート先を変更することで、作成したソースコードは動作します
* encoding: hexやテキスト表現
* crypto: 暗号関係
* ...

### 1.1.3. クロスコンパイルが容易
コンパイル時に、環境変数`GOOS`や`GOARCH` を設定するだけで、Windowsの実行形式ファイルやLinuxの実行形式ファイル、macOSの実行形式ファイルを出力することができます。  
標準パッケージの多くが、クロスコンパイルされることを前提としているため、標準パッケージを活用することで、環境ごとに不具合の起きづらい開発を行うことが可能です。  
例えば、ファイルパスの文字列結合は、`"path1" + "\" + "path2"` といった表現はせず、`path/filepath` の関数`Join` を用い、`filepath.Join("path1", "path2")`というように表現することをお勧めします。  

注意しておかなければいけない点としては、一部パッケージには、OS依存のものがあるということです。  
例えば、Windowsのレジストリに対する処理のような、OSに依存するものがあります。  

### 1.1.5. 周辺ツールが標準で提供される
Go言語をインストールするだけで、パッケージの管理やダウンロード、コンパイル、テスト、字句解析、ドキュメント生成など、多くのことが実行できます。  
`go <subcommand>` 形式で、それらのツールを扱うことが可能です。  
参考: [コマンド一覧](https://golang.org/cmd/)  

### 1.1.7. 並行プログラミングが文法レベルでサポートされている
とても簡単に並行プログラミングを記述することができます。  
並行プログラミングしない場合は、`func(){//<yourCode>}()` のような形で関数を呼び出せます。  
対して、並行プログラミングする場合は、`go func(){//<yourCode>}()` のような形で関数を呼び出します。  
わずか、3 byteほどの差分で並行プログラミングを表すことが可能です。  

興味のある方は、[Pthreads プログラミング](https://www.oreilly.co.jp/books/4900900664/) などの、他言語のマルチスレッド記法を学習すると、  
この容易さに感動できるのではないでしょうか。  


なお、Go言語で並列動作させた関数等は、Goroutine(ごーるーちん) と呼びます。

#### :rocket: Goroutineは、カーネルスレッドではありません。
OSのカーネルスレッドとは異なり、ユーザ空間で動作する軽量なスレッドです。  
それぞれのGoroutineの管理（スケジューリングなど）も、1つのユーザ空間スレッドとして動作しています。  

### 1.1.8. Gopher がかわいい
RFC1436 の [Gopher](https://ja.wikipedia.org/wiki/Gopher) ではありません。  
Go の [Gopher](https://golang.org/doc/gopher/gopherbw.png) がかわいいです。  

## 1.2. どこで使われているの?
本講義でも活用している、[Docker](https://github.com/docker/docker-ce) で扱われています。  
また、具体的なサービス名は見つけられませんが、[Go言語の日本ユーザ](https://github.com/golang/go/wiki/GoUsers#japan) にある通り、一度は聞いたことがありそうなサービスにGoが関わっているのかもしれませんね。  

他にも、軽量なGit Webサービスのプロジェクト [Gitea](https://gitea.io/en-us/) のような、Go言語の特徴を活かしたOSSはいくつもあります。  
ぜひ探してみてください  

# ハンズオンの開始

以降の章では、事前準備いただいたDockerを用い、ハンズオンを行います。  
ハンズオンでは、こちらから指示したpathに、ディレクトリやファイルを作成いただき、Go言語に触れてもらいます。  
基本的なフォルダ構成は、 `/go/src/go_tutorial/<セクション名>/<プログラム名>/***.go` のようになります。  

講師側が説明で用いるソースコード（答え）は、`/go/src/samples/<セクション名>/<プログラム名>/***.go` の形で格納してあります。  
講師側が想定している出力結果を確認したい際は、`/go/src/samples/`配下を実行することで、容易に確認できます。  
また、ハンズオンがうまく行かない際には、以下のように差分を確認することで、課題解決を助ける可能性があります。  
```shell
diff /go/src/go_tutorial/<セクション名>/<プログラム名>/***.go /go/src/samples/<セクション名>/<プログラム名>/***.go
```

# 2. Hello, World (10min)
本章では、Go言語の実行方法とコンパイル方法を確認いただきます。  

## 2.1. Goの実行
### 2.1.1. Goを動かす
Go言語で作成されたソースコードの実行方法は2つあります。  
ソースコードをコンパイル（`go build`）し、実行形式ファイル（.exe等）を実行する方法と、  
ソースコードをスクリプト言語のように実行する`go run`コマンドを用いる方法です。  

#### :computer: 2.1.1.1. 以下のコマンドを実行して、Goを動かしてみよう  

```shell
:# WORKPATH /go/src/go_tutorial/2_helloworld/hello/
$ <お好きなエディタ> main.go
$ go run main.go
```
* /go/src/go_tutorial/2_helloworld/hello/main.go
	```go
	package main

	import "fmt"

	func main() {
		fmt.Println("Hello, W0rld!!")
	}
	```
:recycle: 2.1.1.1. 結果
```shell
$ go run main.go
Hello, W0rld!!
```

#### :computer: 2.1.1.2. 以下のコマンドを実行して、Goをコンパイルしてみよう。  
```shell
:# WORKPATH /go/src/go_tutorial/2_helloworld/hello/
$ go build main.go
$ ls
$ file ./main
$ ./main
```
:recycle: 2.1.1.2. 結果
```shell
:# WORKPATH /go/src/go_tutorial/2_helloworld/hello/
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
[1.1.3. クロスコンパイルが容易](#### 1.1.3. クロスコンパイルが容易) でも触れた通り、簡単に作成できることを確認してもらいます。  

### :computer: 2.2.1. 以下のコマンドを実行して、Goをコンパイルしてみよう。  
```shell
:# WORKPATH /go/src/go_tutorial/2_helloworld/hello/
$ GOOS=windows GOARCH=amd64 go build main.go
$ ls
$ file ./main.exe
```
:recycle: 2.2.1. 結果
```shell
:# WORKPATH /go/src/go_tutorial/2_helloworld/hello/
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
....
```

## 2.3. まとめ//TODO:いる？

# 3. 変数の定義方法確認 (10min)
本章では、変数の定義方法の確認と、変数定義に失敗しているソースコードを修正いただきます。  

## 3.1. 変数定義方法
Go言語では、変数の定義記法が3つあります。  

1. `var HENSU string`
	* 型指定有り。変数初期値の指定無し(stringなので、`""`になります。)
2. `HENSU := "GreatValueeeeee"`
	* 型指定無し。代入元の型を引き継ぐ
3. `var HENSU string = "GreatValueeeee"`
	* 型指定有り。変数初期値の指定有り

予期せぬ型が変数に定義されないよう、最初のうち（書いている型をイメージできるまで）は、冗長ですが、一番下の例の書き方をお薦めします。  
予期せぬ型が変数に定義されうる例として、`interface型` というものが存在します。  
本講義では、`interface型` は扱わない為、説明は割愛しますが、使い方として、`なんでも型` のような使い方ができます。  
:rocket: 同一PublicMethodのようなものを保有する異なる型のポインタを同じ変数として扱う型です。同一PublicMethodをAny指定することで、なんでも渡せるポインタ領域を作成できます。  
変数`なんでも型`が示しているのは、int型だと思っていたらstring型だった。というようなケースもおきえてしまいます。意図しない挙動を防ぐためにも、最初のうちは、一番下の書き方をお勧めします。  

##### :rocket: Tips: privateとPublicの指定方法
Go言語の名前空間は、`private`は先頭小文字。`Public`が先頭大文字と決まっています。  
packageの要素や、構造体の要素を外部から参照させたい場合は、先頭大文字の変数名となるようご注意ください。  

## 3.2. 不具合箇所は、最高の講師に教えてもらおう
Go言語では、書き方を間違えているととても丁寧に教えてくれる強い味方がいます。  
それは、コンパイラ（`go build`）です。  
「うーん、あ、この辺のソースみた？」とだけ返してくる先輩に比べ、「3行目、変数定義されていないよ！？」と場所まで指定して教えてくれます。  
変数定義方法で、3番目をお勧めする理由の1つも、型が異なる場合に教えてもらえる可能性が高まるためです。  
ちょっと厳しい点があるとすれば、指摘が英語であることです。  
中学生レベルの英語と、単語を調べる力があれば解決できる文章しか出てこないので、ぜひ`go build`大先生に弟子入りしてみてください。  

##### Tips: `go build`と、`go vet`  
`go vet <ソースコードファイルパス>`の方が、起こり得る問題や、より根本的な箇所まで教えてくれます。  
ただ、プログラマが意図した泥臭い書き方を問題として報告してくるケースもあるため、執筆者は`go build`のエラーを見ることが多いです。  

##### Tips: 一度に教えてくれる量は限りがある  
エラーが多いと、数個のエラーの後に`too many error....`と続き、全てのエラーを教えてくれないことがあります。  
しょうがないので、教えてもらっているエラーから対処していきましょう。  


### :computer: 3.2.1. 以下のコマンドを実行して、修正箇所を認識てみよう。  
```shell
:# WORKPATH /go/src/go_tutorial/3_var/plzfixme/
$ go run main.go
```

:recycle:
```shell
:# WORKPATH /go/src/go_tutorial/3_var/plzfixme/
$ go run main.go
# command-line-arguments
./main.go:6:2: undefined: value
./main.go:7:14: undefined: value
```

## 3.3. 不具合の修正
### :computer: 3.3.1. ソースコードを修正し、エラーを無くしてみよう。  
```shell
:# WORKPATH /go/src/go_tutorial/3_var/plzfixme/
$ <お好きなエディタ> main.go
$ go run main.go
```
* `/go/src/go_tutorial/3_var/plzfixme/main.go`
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
:# WORKPATH /go/src/go_tutorial/3_var/plzfixme/
$ go run main.go
GYUDON
```
### :rocket: :computer: 3.3.2. 変数定義方法が3種類を全て試してみよう。

## 3.3. まとめ //:WIP:TODOいる？

# 4. 関数 (15min)
本章では、関数の定義方法と、Goっぽい関数の扱われ方について、確認いただきます。  

## 4.1. 関数の定義
Go言語では、`func`から始まる形で、関数を定義できます。フォーマットは以下の通りです  
```go
func <関数名>([<引数1>, <引数2>...]) [(<戻り値1>, <戻り値2>)] {
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

## 4.2. 関数を書いてみる
第3章で、修正したソースコードを更新してもらいます。  
作成いただく関数は、渡された牛丼名を食べる関数です。  
本講義で行えることは限られるので、行為を以下のように定義します。  
* 空白以外の文字列を全て牛丼名とみなす
* 食べる行為は、`fmt.Println`することとする
* 食べた場合は、`true`, 食べたい無い場合は、`false`を返す  

## 4.2.1. :computer: 関数を書く
```shell
:# WORKPATH /go/src/go_tutorial/4_funcy/monkey/
$ <お好きなエディタ> eaters.go
$ go run main.go
```
* `/go/src/go_tutorial/4_funcy/monkey/eaters.go`
	```go
	package main

	import "fmt"

	func Eat(name string) bool {
		<nameが空白か比較する>
		<nameが空白以外ならば、`fmt.Println(name)`を実行し、`return true`を行う>
		<nameが空白ならば、`return false`を行う>
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
:recycle:
```shell
:# WORKPATH /go/src/go_tutorial/4_funcy/monkey/
$ go run main.go
GYUDON
cannt eat: 
```
##### Tips: 判定処理用の変数は、`if ok := function(var); !ok{` といった、ifのワンライナーで扱われる形式をよく目にします。  

### 4.2.2. Goっぽい関数
Go言語の関数は、戻り値を複数返せる特徴を持っています。  
この特徴を活かし、Goでは、戻り値の最後に関数処理エラーの有無を識別できる値をつける形がよく使われます。  
なお、エラーが無い場合は、`nil`を渡してあげます。  

#### 4.2.2.1. :computer: Goっぽい関数を実行してみる
```shell
:# WORKPATH /go/src/go_tutorial/4_funcy/likego/
$ <お好きなエディタ> eaters.go
$ go run main.go
```
* `/go/src/go_tutorial/4_funcy/monkey/eaters.go`
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
			fmt.Println("cannt eat: ", name1)
		}

		var name2 string = ""
		if _, err := Eat(name2); err != nil {
			fmt.Println("cannt eat: ", name2)
		}
	}
	```
```shell
:# WORKPATH /go/src/go_tutorial/4_funcy/likego/
$ go run eaters.go
GYUDON
cannot eat: 
```

##### Tips: 戻り値に、使わない変数が含まれる場合、`_` に代入することで捨てることができます。

#### 4.2.2.2. :rocket: 変数スコープの注意事項
戻り値の変数を後ほど活用する場合は、スコープに注意してください。  
例えば、ファイル読み込みなどで、(`読み込んだ文字列`, `error`) のペアが戻り値となるケースです。  
例1では、第一戻り値が、ifのスコープ内となり、後続処理で活用できません。  
例2のように、ifの手前で一度変数を定義する必要があります。  
* 例1
	```go
	func Printer(name string) (bool, error) { ...
	...
	func main() {
		var name string = "GYUDON"
		if ok, err := Printer(name); err != nil {
			panic(err)
		}
		// ここでは ok がスコープ外
	}
	```
* 例2
	```go
	func Printer(name string) (bool, error) { ...
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


# 5. パッケージ
本章では、パッケージの参照方法と、実際にパッケージの作成を試していただきます。  

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
4章で作成いただいたソースコードには、修正すべき問題があります。  
それは、エラー時の出力先と、正常時の出力先が同じstdoutであることです。  
`fmt`に含まれる、`Print`関係の関数には、出力先を指定できるものが存在します。  
出力先を指定できる関数を用い、エラー出力をstderrに出力するよう修正いただきます。  
なお、Go言語のstderr定数は、`os`パッケージの、`os.Stderr`として存在するため、追加で、`os`パッケージのインポートをいただきます。  

実行時は、stdoutを捨てる(`> /dev/null`)すると、差分がわかることでしょう。  

```shell
:# WORKPATH /go/src/go_tutorial/5_package/fixFunckyMonkey/
$ <お好きなエディタ> eaters.go
$ go run eaters.go
$ go run eaters.go > /dev/null
```
* `/go/src/go_tutorial/5_package/fixFunckyMonkey/eaters.go
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
```shell
:# WORKPATH /go/src/go_tutorial/5_package/fixFunckyMonkey/
$ go run eaters.go
GYUDON
cannot eat: ''
$ go run eaters.go > /dev/null
cannot eat: ''
```

## 5.2. パッケージを作る
実は既に、mainパッケージを何度も作成いただいています。  
1行目に書いている`package main` がそうです。  
`package main`は、それを起点として実行できる決められたパッケージ名です。  
今回は、main以外の任意の名前が指定可能な、起点から呼び出されるパッケージを作成いただきます。  

### 5.2.1. :computer: 関数Eatのshopパッケージ化
```shell
:# WORKPATH /go/src/go_tutorial/5_package/notKinkyuJi/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
```
* `/go/src/go_tutorial/5_package/notKinkyuJi/shop/shop.go`
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
* `/go/src/go_tutorial/5_package/notKinkyuJi/eaters.go`
	```go
	package main

	import (
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
:recycle:
```shell
:# WORKPATH /go/src/go_tutorial/5_package/notKinkyuJi/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
GYUDON
cannot eat: ''
```

##### :rocket: 真のパッケージ化
本章の課題では、`import "./shop"`のような、相対Pathによるimportを行っています。  
相対Pathによるimportは推奨されず、コンパイルエラーとなります。  
本講義では、`go mod`の説明を割愛するため、対象エラーを無効化できる環境変数`GO111MODULE=off`を指定しています。  
使えるmoduleを作成する場合は、[Module作成方法](https://golang.org/doc/tutorial/create-module)や、[その他のModuleの呼び方](https://golang.org/doc/tutorial/call-module-code)を参考に、`go mod`に沿ったパッケージ化が推奨されます。  

# 6. 構造体 (15min)
本章では、構造体の定義方法と、構造体に関係付ける関数（メソッド）の作成方法について、確認いただきます。  

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
	[<名前> <型>]
	[<名前> <型>]
	...
}
```
例えば、[6.1.0 構造体とは]() で例に挙げたint64では桁数が不足する際の構造体をGo言語で記述すると、以下のようになります。  
```go
type FantasticInt struct {
	ichi_no_keta int64
	kgai_no_keta int64
	//続く
```

## 6.2. 構造体への関数の関連付け
先ほど例に挙げた`type FantasticInt`は、`+-/` を用いて計算ができません。  
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
残念ながら`+-/`を活用した計算はできませんが、処理を定義することで計算は可能となります。  
独自の型へ独自の処理を定義する方法は、3つあります。  
### 6.2.1. 型を利用するスコープ上に、そのまま処理を書く
```
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
```
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
```
### 6.2.3. 型をレシーバ引数として関数と関連付けする
型に関数を紐付け、`変数.関数()`の形で呼び出す方法です。レシーバ引数で紐付けを行っている関数を、メソッドとも呼びます。  
```go
func (<レシーバ引数>) <関数名> ([<引数1>, <引数2>...]) [(<戻り値1>, <戻り値2>)] {
```
`FantasticInt`へ、数字を追加する、足し算メソッドを用意する場合は、以下のようになります。  
```go
func (self *FantasticInt) Add(num FantasticInt) {
	#...省略

func main() {
	var num1 FantasticInt
	var num2 FantasticInt

	num1.Add(num2)
	fmt.Println(num1)
}
```
先程紹介した2つでは、**AとBを足し、Cという新しい領域を作成**しています。  
今回の記法では、**AにBに加える** というような、レシーバ引数となった実体へ影響を与えるような書き方も行えます。  
どちらの表現でも処理自体は行えますが、処理の効率や可読性の観点から、どちらを選ぶか判断が必要です。  

なお、本講義で詳細は触れませんが、実体に影響を与えるためには、リファレンス参照（ポインタのようなもの）が必要です。  
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
:# WORKPATH /go/src/go_tutorial/6_struct/weakShop/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
```
* `/go/src/go_tutorial/6_struct/weakShop/shop/shop.go`
	```go
	package shop

	import (
		"fmt"
	)

	type Gyudon struct {
		menu string
	}

	func NewGyudon() Gydon { //変数定義用の関数
		return Gyudon{
			menu: "NegitamaGyudon",
		}
	}

	func (self *Gyudon) Eat() (bool, error) {
		if self.menu == "" {
			return false, fmt.Errorf("name is empty.")
		}
		fmt.Println(name)
		return true, nil
	}
	```
* `/go/src/go_tutorial/6_struct/weakShop/eaters.go`
	```go
	package main

	import (
		"fmt"
		"./shop"
	)

	func main() {
		myshop := NewGyudon()
		if _, err := myshop.Eat(); err != nil {
			fmt.Fprintf(os.Stderr, "cannot eat: '%s'\n" , err)
		}
	}
	```
:recycle:
```shell
:# WORKPATH /go/src/go_tutorial/6_struct/weakShop/
$ <お好きなエディタ> shop/shop.go
$ <お好きなエディタ> eaters.go
$ go run eaters.go
NegitamaGyudon
```

# 7. Webアプリケーション//WIP:TODO:

## 7.1. ベースのCLIツール
## 7.1. net/http パッケージ
を、使わない互換あるけど、最小機能のzakohttpを使ってもらいます
## 7.3. curl
## 7.4. Goroutineに触れる
### 7.4.1 ワンオペ牛丼屋は、大変そう
### 7.4.2 バイト（goroutine）を雇おう

## 7.5. まとめ //WIP:TODO:update
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

# 8. 最後に
今回は、Goを知ってもらうために、Goの概要説明、実行やコンパイル、関数や構造体、そして、Goroutineをサクッと追っていきました。  
今回紹介しきれていない`interface`や`channel`、`context` 辺りを学習するとよりGo言語が、選択肢としての幅が広がっていくと思います。  
もしGo言語をもっと知ってみたいと思っているのであれば、Goが学習できる [go tour(日本語)](https://go-tour-jp.appspot.com/list) を、まずは一周してみることをお勧めします。  
基本的な構文や、Go言語の構造体の説明、先程あげた`interface`, `channel` の説明があります。(執筆時点、`context`の説明はありませんでした)  

なお、本講義外で、本講義で用いたソースコードを編集/検証することは、自由とします。  
いじくり回していただき、色々学習いただくことも問題ありません。より素晴らしい例を見つけたら、本リポジトリにPRしていただいても大丈夫です。  

また、Go言語の構造から迫るアプローチ以外として、その他外部のコミュニティから情報を得るのも良いでしょう。
* Gophers Slackの`#japan`チャンネル
	* 世界中のGopherが集うSlack、その中の`#japan`に日本人Gopherが住んでいます
* [vim-jp slackの#lang-goチャンネル](https://vim-jp.org/docs/chat.html)
  * Vimコミュニティのslackですが、何故かGopher Slackの`#japan`より活発
  * 普通にEmacs使いの人もいるので、お使いのエディタに依らずどうぞ
  * [こういう人](https://mattn.kaoriya.net/etc/gde.htm)がいたりします
* [Go Conference](https://gocon.jp/)
  * 今年はこんな状態なので開催されてませんが、例年は半年毎に開催されるGoコミュニティによるカンファレンス

もちろん、本講義開催の講師陣に質問いただいても問題ありません。  
情報源はたくさんあるので、貪欲にGoを知ってみてください。  
ではみなさん、Let's Go!!  
---

## 参考
* [今改めて読み直したい Go基礎情報 その1](https://budougumi0617.github.io/2019/06/20/golangtokyo25-read-again-awesome-go-article/) \
* [Go入門](https://www.slideshare.net/takuyaueda967/2016-go)

<credit-footer/>
