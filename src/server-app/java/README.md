---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
title: Java; Spring Boot
description: Spring Bootを使ったアプリ開発を体験するハンズオンです
time: 2h
prior_knowledge: Java
---

<header-table/>

# {{$page.frontmatter.title}}

## 始めに

- Javaの基本
- Spring Bootの基本
- Spring Bootハンズオン

本講義では上記について紹介し、Javaというプログラミング言語とそのWebフレームワークであるSpring Bootといった技術的な選択肢を増やすことを目的としています。


### 本講義の前提
本講義ではプログラム言語共通の制御構文や概念、たとえばif文や型など、の解説は行いません。そのため、受講者は何らかのプログラミング言語で簡単な制御構文が書けることを前提とさせてください。

### この資料のお約束
:computer: は自分で操作する箇所を示しています。 また`$`はホストマシンのプロンプトを意味し、`❯`はコンテナ内部でのプロンプトを意味します。

たとえば下記の通りです。

```shell
# ホストマシン上で git clone git@github.com:iij/bootcamp.git を実行する
$ git clone git@github.com:iij/bootcamp.git

# コンテナ上で curl localhost:8080 を実行する
❯ curl localhost:8080
```


### 下準備
講義を受講する前にコンテナイメージのpullと起動をしておくことをお勧めしています。
また、Dockerの実行環境があることを前提として本講義を進めます。

#### 手順

1. ハンズオン用のDockerイメージをpullしてくる

```bash
# やや重たいので注意してください
$ docker pull tamago0224/bootcamp-springboot:2023
```

2. コンテナを起動する

```bash
# プロキシ環境下にいる人はプロキシの設定をする
$ PROXY_HOST=YOUR.PROXY.HOST
$ PROXY_PORT=YOUR_PROXY_PORT
$ JAVA_OPT="-Dhttp.proxyHost=${PROXY_HOST} -Dhttp.proxyPort=${PROXY_PORT} -Dhttps.proxyHost=${PROXY_HOST} -Dhttps.proxyPort=${PROXY_PORT}"
# プロキシ設定ここまで
# コンテナを起動する
$ docker run --name bootcamp-springboot -it -p 8080:8080 -e JAVA_OPT="${JAVA_OPT}" tamago0224/bootcamp-springboot:2023
```

3. アプリケーションの起動チェック

```bash
# Spring Bootを起動する
❯ ./gradlew bootrun
# ...
# いろんなログが流れる
```

4. 動作チェック

ホストマシンの適当なブラウザから[localhost:8080](http://localhost:8080)にアクセスし、下記のようなエラーページが表示されることを確認してください。

![初回起動 - WhitelabelErrorPage](./images/white-label-error.png)


## Javaの基本

JavaはOpenJDKコミュニティによって開発され、各ベンダからリリースされているプログラミング言語です。
古くから利用されているプログラミング言語/プラットフォームである一方、2022年現在でもSIや大規模開発の現場などでよく利用されています。

### 言語としての特徴

JavaはC言語やRustと同じ静的型付き言語です。そのため文法や記法はC言語を踏襲した書き方となっています。\
Javaの言語のパラダイムとしては、クラスの継承の概念やインタフェースなどの言語仕様を持つためオブジェクト指向プログラミングであります。その一方、Javaのバージョン8以降は関数型インタフェースやパターンマッチなど、関数型プログラミングを楽しめるような仕様も導入されています。

:::details Javaのサンプルコード

```java
package com.github.iij.bootcamp.serverapp; // パッケージ名(世界でユニークであると良い)

// 自社ドメインを持つ企業での製造物には自社ドメインをそのまま利用することが多い

import java.util.List; // 外部モジュールの利用(JavaではIDEに任せてしまうのが一般的)

/**
 * 複数行に渡るコメント文
 *
 * - 一般的にはJavaのクラス名の命名はパスカルケース - クラス名とjavaファイルの名前は一致させる方が良い(1クラス1ファイル)
 */
public class SampleClass extends Object {

  // アクセス修飾子はprivate/protected/public
  private String iamPrivate;

  // Javaの変数・メソッドの命名は(ローワー)キャメルケース
  protected String iamProtected;
  public String iamPublic;

  // アノテーション。そのものに効果があるものではなく、横断的に処理したりする際の目印として使うことが多い
  @SuppressWarnings("unused")
  private String sampleMethod(String a) {
    String b = null;
    if ("hello".equals(a)) {
      b = "world";
    }
    return b.toString(); // 残念ながらJavaはnull安全な言語ではない(NullPointerExceptionの危機)
  }

  public class MyInnerClass { // クラスの中にクラスを定義することもできる(インナークラス)
    private final String finalizedString; // final化(不変化)ができる

    public MyInnerClass(String arg) { // コンストラクタはクラス名を同一にすることで表現
      this.finalizedString = arg;
    }

    public String getFinalizedString() {
      return this.finalizedString;
    }
  }

  public void makeInstance() {
    // クラスの具体的な値(オブジェクト)のことを"インスタンス"と言います
    var ins = new MyInnerClass("hello"); // Java11から型推論が使える
    ins.getFinalizedString(); // → hello
  }
}
```

:::

### プロジェクト構成

Javaのプロジェクトのディレクトリ構成は、ほかのプログラミング言語と異なり言語として定められています。名前空間として定義できる"パッケージ"がそのままディレクトリに反映されるようにディレクトリを構成する必要があります。

参考: https://docs.oracle.com/javase/tutorial/java/package/managingfiles.html

たとえば`com.github.iij.bootcamp`パッケージ(=名前空間)配下に`Hoge`と`Huga`というクラスを作成する場合、下記のようなディレクトリ構造/ファイル構造になります。

```
.
├── build.gradle
└── src
    └── main
        └── java
            └── com
                └── github
                    └── iij
                        └── bootcamp
                            └── Hoge.java
                            │   └── class Hoge { ... }
                            └── Huga.java
                                └── class Huga { ... }
```

:::tip パッケージ
Javaにおけるパッケージとは、DNS形式で定義できる名前空間のような概念です。`.`で区切ることでパッケージ間の親子関係を定義できます。たとえば`com.example.iij`パッケージと`com.example.iij.bootcamp`パッケージでは前者が親で後者が子といった関係があります。

:::

### Gradle
Pythonであればpip、Rustであればcargo、Node.jsであればnpmのようにプログラミング言語にはそれぞれ依存関係を解決しビルドを自動化する自動化システムツールが用意されています。

JavaではMavenとGradleという2つの種類の自動化システムツールがよく利用されています。本講義ではGradleを利用して話を進めていきます。

:::warning

Mavenを使わずにGradleを利用する理由は、Gradleの方が優れている/イケているからではなく、単に筆者がXMLが嫌いであるためである。

:::


## Spring Bootの基本
Spring BootはJavaのWebフレームワークのひとつです。Spring Bootの規約に従ってアプリケーションロジックを実装することで簡単にWebアプリケーションを構築できます。

このフレームワークは大規模な主幹システムやWebアプリケーションを実装/構築する際によく利用されており、IIJがホストしているいくつかのサービスもSpring Bootを利用して実装されています。

### 特徴
Spring Bootは複雑な業務要件や非機能要件をクリアするためのさまざまな機能を有しています。依存関係を宣言して注入してくれるDIコンテナや横断的な関心事を解決するAOPのサポート、数多く公開されているstarterパッケージなどはその最たる例です。

残念ながらこのBootcampですべての要素に触れることはできないため、興味のあるほうはドキュメントを読んでみることをお勧めします。

## Spring Bootハンズオン
本ハンズオンではブラウザで閲覧できるWeb UIの機能を持たない、HTTP API(Application Programming Interface)だけを持つAPIサーバを構築していきます。

それでは始めましょう。

### 簡単なクラスを作ってみる
まず始めに、Java言語のウォーミングアップとして純粋なJavaのクラスを作ってみましょう。

:computer: `User`クラスを作成します。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/User.java
```

```java
package com.github.iij.bootcamp.serverapp;

public class User {

  private String name;
  private String id;

  public User(String name, String id) {
    this.name = name;
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public String getId() {
    return this.id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String toString() {
    return "name: " + this.name + "," + "id: " + this.id;
  }
}
```

これで`User`クラスを作成できました。次にこのクラスを実際にインスタンス化してみます。\
Spring Bootアプリケーションのmain関数は`com.github.iij.bootcamp.serverapp.ServerAppApplication`にあります。ためしにこのmain関数の中で`User`クラスをインスタンス化してみます。

:computer: ServerAppApplication.javaを修正してください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/ServerAppApplication.java 
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java{10-13}
package com.github.iij.bootcamp.serverapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerAppApplication {

	public static void main(String[] args) {
		// 追記BEGIN
		User user = new User("アリス", "alice");
		System.out.println(user.toString());
		// 追記END
		SpringApplication.run(ServerAppApplication.class, args);
	}
}
```

再起動時にログに"name: アリス,id: alice"と表示されていればOKです。

#### チェックポイント
- Javaのクラスを作成した
- クラスをインスタンス化し、標準出力に文字列を表示した

#### 解説
純粋なJavaのクラスを作成し、インスタンス化とメソッドの呼び出しを行いました。`User`クラスを眺めてもらうとわかるとおり、`getName`や`getId`などJavaにはかなり冗長なコードが多いです。これらのコードはよく「ボイラープレート」と呼ばれ、開発者が嫌うコードです。

JavaにはLombokなどのボイラープレートを解消するツールなどありますが、本講義はあえて紹介しません。興味がある人は調べてみてください。

### 簡単なHTTPのインタフェースを作成してみる
それではSpring Bootを使ってみましょう。\
簡単なHTTPのインタフェースを作成し、実際にSpring Bootがどのように動作しているのかを見てみます。

:computer: ServerAppApplication.javaを修正し、サーバを再起動してみてください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/ServerAppApplication.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java{5-8,19-27}
package com.github.iij.bootcamp.serverapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// 追記BEGIN
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
// 追記END

@SpringBootApplication
public class ServerAppApplication {

  public static void main(String[] args) {
    User user = new User("アリス", "alice");
    System.out.println(user.toString());
    SpringApplication.run(ServerAppApplication.class, args);
  }

  // 追記BEGIN
  @RestController
  public class HelloController {
    @GetMapping(path = "/")
    public String helloWorld() {
      return "hello world";
    }
  }
  // 追記END
}
```

```bash
# 動作確認
$ curl localhost:8080 -X GET
hello world
```

"hello world"が返ってきたら成功です。

#### チェックポイント
- `@RestController`アノテーションをクラスに付与してHTTPのインタフェースを作成した

#### 解説
`bootRun`コマンドによりSpring Bootが起動します。すると、Spring Bootの機能により `@RestController`アノテーションが付いている`ServerAppApplication.HelloController`がHTTPのインタフェースとして登録されます。

![handler](./images/http-handler.png)

その結果、このSpring Bootが動いている8080番ポート宛のHTTPリクエストと`ServerAppApplication.HelloController#helloWorld`が紐づけられることになり、`GET /`へのリクエストのレスポンスとして"hello world"が返ってきました。

:::details Spring BootとDIコンテナ

Spring Bootは起動時に起動クラスのパッケージ配下のJavaファイルから特殊なアノテーション(`@Contoroller` / `@Component` / etc...)がついたクラスを探し出します。そしてSpring Bootはそのクラスを適当な方法でインスタンス化し、自身の管理下(=DI コンテナ)に置きます。

(「適当な方法」を指定することもできます > [Bean Annotation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html))

DIコンテナに格納されたインスタンスは、後述する`@Autowired`アノテーションを使って引き出すことができます。

特に、`@Controller` `@RestController`アノテーションが付与されたクラスから生成されたインスタンスはHTTPのインタフェースとして働くことになります。

今回の例では、 `ServerAppApplication`クラスに`@SpringBootApplication`アノテーションが付与されているので`ServerAppApplication`クラスのパッケージ`com.github.iij.bootcamp.serverapp`配下のクラスから上述の特殊なアノテーションがついているクラスを探索します。

`HelloController`クラスは`@RestController`アノテーションが付与されているため、Spring Boot起動時に`HelloController`がSpring Bootによってインスタンス化されDIコンテナに登録されました。
その結果、`GET /`のリクエストをSpring Bootが受け取ると`HelloController#helloWorld` が実行されるようになっていたというわけです。

:::


### 簡単なリクエストを受け取ってみる
次にクエリパラメータから情報を取得してみましょう。

:computer: UserController.javaを作成し、サーバを再起動してみてください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java
package com.github.iij.bootcamp.serverapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

  private User secretUser = new User("ボブ", "bob");

  @GetMapping(path = "/user")
  public User find(@RequestParam String id) {
    if ("bob".equals(id)) {
      return this.secretUser;
    } else {
      return null;
    }
  }
}
```

```bash
# 動作確認
$ curl 'localhost:8080/user?id=bob'
{"name":"ボブ","id":"bob"}
```

#### チェックポイント
- `@GetMapping`アノテーションを持つメソッドを作成し、HTTPのハンドラとして登録した
- HTTPのハンドラとして登録されたメソッドの引数に`@RequestParam`アノテーションを付与することでクエリパラメータを実装した

#### 解説
新しいクラス`UserController`を作成しました。このクラスにも`@RestController`アノテーションが付いているためHTTPのインタフェースとして振る舞います。

`UserController`クラスの持つメソッド`find`には`@GetMapping`アノテーションがついているため、`GET /user`宛のリクエストのハンドラとして登録されることになります。そのため、Spring Bootアプリケーションの`/user`へGETリクエストを送ることでこの`find`メソッドがコールされます。

さらに`find`メソッドの引数`id`に`@RequestParam`アノテーションが付与されています。これにより、HTTPリクエストのクエリパラメータの値がこの変数に注入されます。つまり`GET /user?id=bob`へのリクエストをSpring Bootアプリケーションへ送ることで`find`メソッドがコールされ引数`id=bob`が引き渡されます。


### 責任を分離する
さて、前章まで基本的なHTTPのインタフェースの作り方と使い方について解説してきました。もう少し実装を深めていきましょう。\
現在`UserController`クラスはHTTPのインタフェースとデータソースの管理の2つの責務を持っています。これは単一責務の原理から外れているためリファクタリングする対象です。

今回はシンプルに`UserController#find`の処理を抽出して別のクラスに分離、処理そのものを`UserController`クラスの外から与えてあげるようにしましょう。

:computer: UserService.javaを作成、UserController.javaを修正し、サーバを再起動してください。

```bash
# 新しいクラスUserServiceを作成する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/UserService.java
# UserControllerクラスを修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java
package com.github.iij.bootcamp.serverapp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class UserService {

  // データソースに該当する部分
  private List<User> userPool = new ArrayList<User>(Arrays.asList(new User("ボブ", "bob")));
  
  /**
   * ユーザープールからid値で検索し、その結果を返却します idと一致するユーザーが見つからない場合nullを返却します
   * TODO 本当にこの実装で問題ないか、考えてみましょう
   *   - 同一のidをもつインスタンスがいる場合は？データ構造はこれで良いか？
   *   - nullは`User`インスタンスではない、では見つからない場合は何を返すべき？
   */
  public User findById(String id) {
    // Java8から導入されたStreamAPI
    User user = this.userPool
      .stream() // Streamを作成
      .filter(u -> id.equals(u.getId())) // idと一致する`User`インスタンスのみを抽出
      .findFirst() // 抽出結果の先頭1つだけを取り出す
      .orElse(null); // もし抽出した結果何も残らなかった場合、nullを返却する
    return user;
  }
}

```

```java{6-8,13-21}
package com.github.iij.bootcamp.serverapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
// 追記BEGIN
import org.springframework.beans.factory.annotation.Autowired;
// 追記END

@RestController
public class UserController {

  // 修正BEGIN
  @Autowired
  private UserService userService;

  @GetMapping(path = "/user")
  public User find(@RequestParam String id) {
    return this.userService.findById(id);
  }
  // 修正END
}
```

```bash
# 動作確認
$ curl 'localhost:8080/user?id=bob'
{"name":"ボブ","id":"bob"}
```

#### チェックポイント
- `@Component`アノテーションをクラスに付与し、Spring Boot起動時に自動的にインスタンス化した
- `@Autowired`アノテーションをフィールドに付与し、そのフィールドにSpring Bootがインスタンス化したインスタンスの中から適切なインスタンスを注入した

#### 解説
新しいクラス`UserService`を作成しました。このクラスには`@Component`アノテーションが付与されているため、Spring Boot起動時にSpring Bootによって自動的にインスタンス化されSpring Bootの管理下に入ります。このようにSpring Bootに管理されるようになったインスタンスはほかのクラスから`@Autowired`を利用することで利用されます。

今回の例では`UserController`クラスが`userService`フィールドに`@Autowired`アノテーションを付与しているため自動的に作成された`UserService`クラスのインスタンスが`UserController.userService`に代入されることになりました。このように依存関係を分離、外から依存関係を持ち込む構成のことをDI(Dependency Injection)と呼びます。

注意点として、デフォルトの挙動ではSpring Bootが管理するインスタンスは各クラス"1つ"となっています。つまり`UserController`クラスが引っ張ってきている`userService`とほかのクラスが引っ張ってこれる`UserService`インスタンスは完全に一致しています。このようにひとつのインスタンスを使い回す構成のことを"シングルトン"と呼びます。


### 少し複雑なリクエストを受け取ってみる
最後に、POSTリクエストとリクエストボディを指定して`User`インスタンスを登録してみましょう。\
`User`インスタンスには`id`と`name`の値を指定する必要があるので、これらを与えられるエンドポイントを用意します。

:computer: UserService.javaとUserController.javaを修正し、サーバを再起動してください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/UserService.java
❯ vim src/main/java/com/github/iij/bootcamp/serverapp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java{27-35}
package com.github.iij.bootcamp.serverapp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class UserService {

  // データソースに該当する部分
  private List<User> userPool = new ArrayList<User>(Arrays.asList(new User("ボブ", "bob")));
  
  /**
   * ユーザープールからid値で検索し、その結果を返却します idと一致するユーザーが見つからない場合nullを返却します
   */
  public User findById(String id) {
    User user = this.userPool
      .stream()
      .filter(u -> id.equals(u.getId()))
      .findFirst()
      .orElse(null);
    return user;
  }

  // 追記BEGIN
  /**
   * ユーザープールにUserを追加します
   */
  public User save(User user) {
    this.userPool.add(user);
    return user;
  }
  // 追記END
}
```

```java{7-10,23-52}
package com.github.iij.bootcamp.serverapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
// 追記BEGIN
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// 追記END

@RestController
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping(path = "/user")
  public User find(@RequestParam String id) {
    return this.userService.findById(id);
  }

  // 追記BEGIN

  // POST /user 宛のリクエストボディスキーマ
  public static class UserCreateRequest {
    private String name;
    private String id;

    public String getName() {
      return name;
    }

    public String getId() {
      return id;
    }

    public void setName(String name) {
      this.name = name;
    }

    public void setId(String id) {
      this.id = id;
    }
  }

  @PostMapping(path = "/user")
  public User create(@RequestBody UserCreateRequest request) {
    User newUser = new User(request.getName(), request.getId());
    return this.userService.save(newUser);
  }
  // 追記END

}
```

```bash
# 動作確認
$ curl localhost:8080/user -X POST -H 'Content-Type: application/json' -d '{"name": "アリス", "id": "alice"}'
{"name": "アリス", "id": "alice"}

$ curl 'localhost:8080/user?id=alice'
{"name": "アリス", "id": "alice"}
```

#### チェックポイント
- `@PostMapping`アノテーションをメソッドに付与し、POSTリクエストのHTTPハンドラとして登録した
- JavaのPOJOを用いてPOSTリクエストのリクエストボディのスキーマを表現した

## まとめ
以上でSpring Bootのハンズオンは終了です。

本講義ではJavaの基本的な知識や書き方、Spring Bootの使い方など、基本的な機能や文法に触れてもらいました。しかしSpring Bootには多様な機能がまだまだ存在しており、データベースとの接続や非同期処理などさまざまなプロダクション環境で活躍できるポテンシャルを持っているフレームワークです。

本講義が、受講者のみなさまの今後の技術選定の手助けになれれば幸いです。

### 追加の資料

- [Spring Bootリファレンスドキュメント](https://spring.pleiades.io/spring-boot/docs/current/reference/html)
  - 多くのSpring Boot開発者がお世話になる公式ドキュメントです。アプリケーションの開発からデプロイ方法まで、幅広く情報が提供されています。
- [Spring Boot Guides](https://spring.pleiades.io/guides)
  - Spring Bootの各種機能を試してみるチュートリアルが公開されています。Pub/SubやMongoDB、Dockerとの連携などSpring Bootの拡張が多種公開されています。興味のある項目に触ってみてください。

<credit-footer/>
