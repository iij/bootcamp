---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Go言語を使って簡単なWebアプリを作ります
time: 1.5h
prior_knowledge: golang
---

<header-table/>

# GoでWebアプリを作る

## 事前準備
[GoでWebアプリを作る(事前準備編)](./init)

## Goとは
Googleが開発しているプログラミング言語。 \
ググラビリティが低いのでGolangやGo言語と書かれることもあるが、言語としての正式名称はGoである。 \
参考: [開発者の一人(Rob Pike 氏)のツイート](https://twitter.com/rob_pike/status/886054143235719169)

### 特徴
参考: [今改めて読み直したい Go基礎情報 その1](https://budougumi0617.github.io/2019/06/20/golangtokyo25-read-again-awesome-go-article/) \
参考: [Go入門](https://www.slideshare.net/takuyaueda967/2016-go)

#### ポータビリティが高い
* Cの標準ライブラリに依存しないようにソースコードをコンパイルできる
* GoはGoで書かれている
  * つまりGoコンパイラ自身がGoで書かれている
  * 標準パッケージ群もGoで書かれている(例外はあります)

#### クロスコンパイル
* コンパイル時に環境変数を指定するだけで、例えばLinux端末上からWindows用のバイナリをコンパイルすることができる
  * ただし、ソースコード上もOSに依存しない記述にする必要がある
  * 標準パッケージは大抵OSに依存しないように記述されているので、積極的に利用するとよい

#### 文法がシンプル
* 設計思想としてSimplicityを是としている
  * 参考: [Simplicity is Complicated](https://talks.golang.org/2015/simplicity-is-complicated.slide#1)
* `go`と書くだけで並行処理(並列ではない)が可能だったり
* 言語仕様が小さい(個人の感想)
  * 参考: [The Go Programming Language Specification](https://golang.org/ref/spec)
* 暗黙的な仕様が少ない(個人の感想)

#### 並行プログラミングが文法レベルでサポートされている
* Goroutine : 軽量スレッドのようなもの
* 並列に動く、とは一言も言っていない点には注意が必要
  * 参考: [Go言語による並行処理](https://www.oreilly.co.jp/books/9784873118468/)

#### 周辺ツールが標準で提供されている
* go build: buildコマンド
* go test: test実行
* go fmt: コードフォーマッタ
* go vet: 静的解析
* go doc: ドキュメント生成
* go mod: モジュール管理
* ...
  * 参考: [コマンド一覧](https://golang.org/cmd/)

#### 標準パッケージが充実している
* net/http: HTTPサーバ/クライアントなど
* html/template: HTMLテンプレート
* database/sql: DB操作
* ...
  * 参考: [標準パッケージ一覧](https://golang.org/pkg/)

### どこで使われているの?
* [Kubernetes](https://github.com/kubernetes/kubernetes)
* [Docker](https://github.com/docker/docker-ce)
* [ghq](https://github.com/x-motemen/ghq)
* [peco](https://github.com/peco/peco)

コンテナ関連(Kubernetes 関連)やCLIツールでの採用が多い印象

## 1. Hello, 世界
[The Go Playground](https://play.golang.org/p/7vin2BK8_A6) \
チュートリアルリポジトリの`1_hello_world`ディレクトリにサンプルコードが入っています。

* `main.go`
```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

このファイルを`main.go`というファイル名で保存して、次のようにコマンドを実行します。

```bash
$ go run main.go
Hello, 世界
```

### 1-1. 解説
#### 1-1-0. The Go Playground
[The Go Playground](https://play.golang.org)はGoのプログラムを手軽に実行できる環境で、Go公式に用意されています。 \
後述しますが、一部のパッケージが動かないようにされていますが、簡単なコードを試しに動かすためには便利です。

念の為ですが、外部サイトになるため、業務で扱うプロダクトコードのセンシティブな情報をここで入力してはいけません。

#### 1-1-1. package文
```go
package main
```
Go のプログラムはパッケージ単位で構成されます。 \
そして、Go のプログラムは必ず`main`パッケージから実行されます。 \
例えば、先の例で package 名を`hoge`にするとエラーが返ってきます。 \
試しに先に作成した`main.go`を変更してみましょう。

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

#### 1-1-2. import文
```go
import "fmt"
```
他パッケージで定義された関数などを`import`文で取り込むことができます。

```go
  fmt.Println("Hello, 世界")
```
具体的には、ここで`fmt`パッケージで定義されている[`Println`](https://golang.org/pkg/fmt/#Println)関数を呼ぶために、`import`文で`fmt`パッケージを読み込んでいます。

#### 1-1-3. func
```go
func main() {
  fmt.Println("Hello, 世界")
}
```

Go の関数定義は`func`キーワードで行います。 \
ここで`main`という名前の関数を定義しています。 \
Goでコンパイルされた実行可能ファイルは`main`パッケージで定義された`main`関数から実行されます。 \
`fmt.Println()`は標準出力に引数の文字列(ここでは `Hello, 世界`)を最後に改行文字を付けて出力します。

## 2. パッケージ/モジュール

[The Go Playground](https://play.golang.org/p/74u0FTkyOvZ) \
チュートリアルリポジトリの`2_package`ディレクトリにサンプルコードが入っています。

* `go.mod`
```go
module test
```

* `calc/add.go`
  * `calc`という名前のディレクトリを作成するのを忘れないように

```go
package calc

func Add(a int, b int) int {
  c := a + b
  return c
}
```

* `main.go`
```go
package main

import (
  "fmt"
  "test/calc"
)

func main() {
  fmt.Println(calc.Add(1, 2))
}
```

```bash
$ go run main.go
3
```

### 2-1. 解説
#### 2-1-1. `go.mod`
このファイルはGoプログラムを外部から読み込むときの名前を定義したり、ソースコードで利用している他モジュールを管理するためのものです。

```go
module test
```
このように書くことで、このモジュールは`test`という名前で外部から読み込むことができます。

* `main.go`
```go
import (
  "fmt"
  "test/calc"
)
```

ここで`test/calc`というのは`test`モジュールの`calc`パッケージを読み込んでいる、と解釈されます。 \
また、`test/calc`でディレクトリ構造も指定されており、次のようなディレクトリ構造であることが期待されます。

```
- test/
  - main.go (`package main`と宣言されている)
  - calc/
    - add.go (`package calc`と宣言されている)
```

#### 2-1-2. 続・func
```go
func Add(a int, b int) int {
  c := a + b
  return c
}
```

今回定義した`Add()`関数は`main`パッケージから呼ばれます。 \
Go には外部に公開するためのキーワードは無く、大文字から始めるだけで外部に公開されます。 \
もしこの関数名が`add()`であれば、外部から見えないので`main`で呼び出しても関数が見付からないと言われます。

また、Goの型名は変数宣言の後ろに書くことに注意しましょう。 \
参考: [Go's Declaration Syntax](https://blog.golang.org/gos-declaration-syntax)

Go での変数宣言にはいくつか方法があり、一番単純なのは今回使用した、

```go
c := a + b
```

の形式です。 \
`c`の型名は`a`と`b`が`int`であることから自明なので、記載を省略できます。 \
当然省略せずに書くことも可能で、

```go
var c int = a + b
```

と書きます。 \
また、

```go
var c = a + b
```

のようにも書けます。 \
`:=`による宣言は関数定義の中でしか書けないので、状況に応じて使い分ける必要があります。

## 3. net/httpはじめの一歩
[The Go Playground](https://play.golang.org/p/5YXGZvJ73b_1)(動きません)
* The Go Playgroundでは`net/http`など一部のパッケージを利用したコードが動かないようになっています

* `main.go`
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

### 3-1. 動かし方
ターミナルを2つ用意します。
docker環境の方は2つ目のターミナルでコンテナ内に入るために、

```bash
$ docker exec -it go-tutor /bin/bash
```

を実行する必要があります。

片方で以下を実行します。

```bash
$ go run main.go
## プロンプトが返ってこなくなる
```

もう一方のターミナルから以下を実行します。

```bash
$ curl http://localhost:8080
hello, world!
```

HTTPサーバを起動している方のプロセスを終了するためにはCtrl-Cなどで終了を伝えましょう。

### 3-2. 解説
#### 3-2-1. 構造体と独自型とメソッド
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

例えば以下のようなコードも書けます。 \
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
  *スキーマ名: http
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
注意すべきはこの`server.ListenAndServe()`は即時では終了せず、明示的にプロセスに終了方法を伝えるまでは実行し続けることです。 \

##### 3-2-2-3. ハンドラ
```go
func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hello, world!")
}
```

HTTP通信が飛んでくると`helloHandler()`という関数がそのリクエストを受けて処理をします。 \
引数の`http.Request`型の値に実際のリクエストの内容が入っているので、それを利用して処理をすることも可能です。 \
引数の`http.ResponseWriter`は`Write()`というメソッドを持っている型で、クライアントに送信したいメッセージを作って、`Write()`が叩かれれば、メッセージが送信されます。 \
もう少し踏み込むと、Goではインターフェイス型と呼ばれるメソッド定義のみを持つ型が存在し、`http.ResponseWriter`型は`Write()`や`Header()`などのメソッドを持つインターフェイス型です。 \
参考: [ResponseWriter](https://golang.org/pkg/net/http/#ResponseWriter)

`fmt.Fprintln()`関数は第二引数の値を第一引数の`Write()`メソッドを使って書き込む、という関数で、今回はその挙動を利用してレスポンスを返しています。

#### 3-2-3. (おまけ)エラー処理
```go
	err := server.ListenAndServe()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
```

Goには他の言語にあるような強力な例外機構は存在しません(`panic()`/`recover()`という組み込み関数は存在する)。 \
これはGoがエラー処理の方法として、例外ではなく明示的なエラー値の返却という戦略を推奨しているからです。

Goは例えば以下のように複数の値を返す関数が記述できます。(タプル型が存在する訳ではなく、このような文法です)

```go
// SplitFrac は文字列で表された分数(ex. "1/2")の分母と分子をint型で返す
func SplitFrac(freq string) (int, int)
```

これを利用して、何かエラーが発生するかもしれない関数では返り値の最後に`error`型(標準で用意されたインターフェイス型)を返します。

例えば先の関数の例だと、分数の形をしていない文字列を引数に入れると処理に失敗する、と想定できます。 \
その場合は以下のような関数にします。

```go
// SplitFrac は文字列で表された分数(ex. "1/2")の分母と分子をint型で返す
// パースに失敗したらerrorを返す
func SplitFrac(freq string) (int, int, error)
```

そしてこの関数を利用するときには以下のようにエラーを受け取り適切に処理します。

```go
denom, num, err := SplitFrac("1/2")
if err != nil {
	// エラーを標準出力へ出力し、
	fmt.Println(err)
	// exit code 1 で終了する
	os.Exit(1)
}
```

またif文には以下のような宣言と条件文を同時に記述する記法が用意されており、

```go
	// <---    変数errの宣言     --->  <-条件文->
	if err := server.ListenAndServe(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
```

このように記述することも可能である。 \
このように記述すると`err`変数は`if`文のスコープ内でしか参照できず、`}`より後ろでは参照できなくなる。 \
この記法はコードの見た目をシンプルにできる一方、printデバッグするときに面倒になることが多いため、どちらを使うかをpros/consを比較して決めておくとよいでしょう。

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
// Goではインターフェイスは明示的に書かずともインターフェイス型で定義されたメソッドを全て定義した型は、
// そのインターフェイスを満たしている、と判断されます。
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
