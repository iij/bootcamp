---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Spring Bootを使ったアプリ開発を体験するハンズオンです
time: 2h
prior_knowledge: Java
---

<header-table/>

# Java; Spring Boot

## 始めに

- Javaの基本
- Spring Bootの基本
- Spring Bootハンズオン

本講義では上記について紹介し、Javaというプログラミング言語とそのWebフレームワークであるSpring Bootといった技術的な選択肢を増やすことを目的としています。


### 本講義の前提
本講義ではプログラム言語共通の制御構文や概念、たとえばif文や型など、の解説は行いません。そのため、受講者はなんらかのプログラミング言語で簡単な制御構文が書けることを前提とさせてください。

### この資料のお約束
:computer: は自分で操作する箇所を示しています。 また`$`はホストマシンのプロンプトを意味し、`❯`はコンテナ内部でのプロンプトを意味します。

例えば下記の通りです。

```shell
# ホストマシン上で git clone git@github.com:iij/bootcamp.git を実行する
$ git clone git@github.com:iij/bootcamp.git

# コンテナ上で curl localhost:8080 を実行する
❯ curl localhost:8080
```


### 事前準備
講義を受講する前にコンテナイメージのpullと起動をしておくことをオススメしています。
また、Dockerの実行環境があることを前提として本講義を進めます。

#### 手順

1. ハンズオン用のDockerイメージをpullしてくる

```bash
# やや重たいので注意してください
$ docker pull ryusa/bootcamp-springboot:2021
```

2. コンテナを起動する

```bash
# プロキシ環境下にいる人はプロキシの設定をする
$ PROXY_HOST=YOUR.PROXY.HOST
$ PROXY_PORT=YOUR_PROXY_PORT
$ JAVA_OPT="-Dhttp.proxyHost=${PROXY_HOST} -Dhttp.proxyPort=${PROXY_PORT} -Dhttps.proxyHost=${PROXY_HOST} -Dhttps.proxyPort=${PROXY_PORT}"
# プロキシ設定ここまで
# コンテナを起動する
$ docker run --name bootcamp-springboot -itd -p 8080:8080 -e JAVA_OPT=${JAVA_OPT} ryusa/bootcamp-springboot:2021
```

3. アプリケーションの起動チェック

```bash
# コンテナの中にアタッチする
$ docker exec -it bootcamp-springboot bash
# Spring Bootを起動する
❯ ./gradlew bootrun
# ...
# いろんなログが流れる
```

4. 動作チェック

ホストマシンの適当なブラウザから[localhost:8080](http://localhost:8080)にアクセスし、下記のようなエラーページが表示されることを確認してください。

![初回起動 - WhitelabelErrorPage](./images/white-label-error.png)


:::details オプション設定
ハンズオンにおいて必須ではありませんが、Visual Studio Code(以下 VSCode)を利用することでより良い開発体験ができます。

1. VSCodeをインストールする
2. 拡張機能`RemoteDevelopment`をインストールする
3. 拡張機能`Java Extention Pack`をインストールする
4. 拡張機能`Remote-Container`を使って起動したコンテナの中へアタッチする
:::


## Javaの基本

JavaはOracle社が開発しているプログラミング言語です。\
古くから利用されているプログラミング言語/プラットフォームである一方、2021年現在でもSIや大規模開発の現場などでよく利用されています。

### 言語としての特徴

JavaはC言語やRustと同じ静的型付け言語です。そのため文法や記法はC言語を踏襲した書き方となっています。\
Javaの言語のパラダイムとしては、クラスの継承の概念やインタフェースなどの言語仕様を持つためオブジェクト指向プログラミングであります。その一方、Javaのバージョン8以降は関数型インタフェースやパターンマッチなど、関数型プログラミングを楽しめるような仕様も導入されています。

:::details Javaのサンプルコード

```java
package com.github.iij.bootcamp;  // パッケージ名(世界でユニークであると良い)
// 自社ドメインを持つ企業での製造物には自社ドメインをそのまま利用することが多い

import java.util.List; // 外部モジュールの利用(JavaではIDEに任せてしまうのが一般的)

/**
 * 複数行に渡るコメント文、特にメソッドとクラスに付与する複数行のコメント文をJavaDocと呼ぶ
 *
 * - 一般的にはJavaのクラス名の命名はパスカルケース
 * - クラス名とjavaファイルの名前は一致させる方が良い(1クラス1ファイル)
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
        var ins = new MyInnerClass("hello"); // Java11から型推論が使える
        ins.getFinalizedString(); // → hello
    }
}
```

:::

### プロジェクト構成

Javaのプロジェクトのディレクトリ構成は、他のプログラミング言語と異なり言語として定められています。名前空間として定義することができる"パッケージ"がそのままディレクトリに反映されるようにディレクトリを構成する必要があります。

参考: https://docs.oracle.com/javase/tutorial/java/package/managingfiles.html

例えば`com.github.iij.bootcamp`パッケージ(=名前空間)配下に`Hoge`と`Huga`というクラスを作成する場合、下記のようなディレクトリ構造/ファイル構造になります。

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
Javaにおけるパッケージとは、DNS形式で定義することができる名前空間のような概念です。`.`で区切ることでパッケージ間の親子関係を定義することができます。例えば`com.example.iij`パッケージと`com.example.iij.bootcamp`パッケージでは前者が親で後者が子といった関係があります。

:::

### Gradle
Pythonであればpip、Rustであればcargo、Node.jsであればnpmのようにプログラミング言語にはそれぞれ依存関係を解決しビルドを自動化する自動化システムツールが用意されています。

JavaではMavenとGradleという2つの種類の自動化システムツールがよく利用されています。本講義ではGradleを利用して話を進めていきます。

:::warning

Mavenを使わずにGradleを利用する理由は、Gradleの方が優れている/イケているからではなく、単に筆者がXMLが嫌いであるためである。

:::


## Spring Bootの基本
SprinbBootはJavaのWebフレームワークのひとつです。Spring Bootの規約に従ってアプリケーションロジックを実装することで簡単にWebアプリケーションを構築することができます。

このフレームワークは大規模な基幹システムやWebアプリケーションを実装/構築する際によく利用されており、IIJがホストしているいくつかのサービスもSpring Bootを利用して実装されています。

### 特徴
Spring Bootは複雑な業務要件や非機能要件をクリアするためのさまざまな機能を有しています。依存関係を宣言して注入してくれるDIコンテナや横断的な関心事を解決するAOPのサポート、数多く公開されているstarterパッケージなどはその最たる例です。

残念ながらこのBootcampですべての要素に触れることはできないため、興味のある方はドキュメントを読んでみることをおすすめします。

## Spring Bootハンズオン
本ハンズオンではブラウザで閲覧できるWebUIの機能を持たない、HTTP API(Application Programming Interface)だけを持つAPIサーバを構築していきます。

それでは始めましょう。

### かんたんなクラスを作ってみる
まずはじめに、Java言語のウォーミングアップとして純粋なJavaのクラスを作ってみましょう。

:computer: Userクラスを作成します。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/example/demo/User.java
```

```java
package com.github.iij.bootcamp;

public class User {

  private String name;
  private String slug;

  public User(String name, String slug) {
    this.name = name;
    this.slug = slug;
  }

  public String getName() {
    return this.name;
  }

  public String getSlug() {
    return this.slug;
  }

  public void setName(String name) {
    return this.name = name;
  }

  public void setSlug(String slug) {
    return this.slug = slug;
  }

  public String toString() {
    return "";
  }
}
```

これで`User`クラスを作成することができました。次にこのクラスを実際にインスタンス化してみます。\
Spring Bootアプリケーションのmain関数は`com.github.iij.bootcamp.DemoApplication`にあります。ためしにこのmain関数の中でUserクラスをインスタンス化してみます。

:computer: DemoApplication.javaを修正してみましょう。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/example/demo/DemoApplication.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java{5-8,17-25}
package com.github.iij.bootcamp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class DemoApplication {

  public static void main(String[] args) {
    // 追記BEGIN
    User alice = new User("アリス", "alice");
    sysout(alice.toString());
    // 追記END
    SpringApplication.run(DemoApplication.class, args);
  }

}
```

再起動時にログに`""`と表示されていればOKです。

#### チェックポイント
WIP

#### 解説
WIP


### コントローラを作成してみる
Spring Bootを使ってみましょう。\
簡単なコントローラを作成し、実際にSpring Bootがどのように動作しているのかを見てみます。

:computer: DemoApplication.javaを修正し、サーバーを再起動してみてください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/example/demo/DemoApplication.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java{5-8,17-25}
package com.github.iij.bootcamp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// 追記BEGIN
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
// 追記END

@SpringBootApplication
public class DemoApplication {

  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
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
$ curl localhost:8080
hello world
```

"hello world"が返ってきたら成功です。

#### チェックポイント
- Spring Boot で HelloWorld ができた
- RestController アノテーションをクラスに付けることでコントローラが作れることを理解した

#### 解説
`bootRun`コマンドによりSprinbBootが起動します。すると、Spring Bootの機能により `@RestController` アノテーションが付いている `DemoApplication.HelloController` がHTTPのインタフェースとして登録されます。

![handler](./images/http-handler.png)

その結果、このSpring Bootが動いている8080番ポート宛のHTTPリクエストと `DemoApplication.HelloController#helloWorld` が紐づけられることになり、/へGETリクエストを送信した結果レスポンスとして"hello world"が返ってきました。

:::details Spring BootとDIコンテナと

Spring Bootは起動時に起動クラスのパッケージ配下のJavaファイルから特殊なアノテーション(`@Contoroller` / `@Component` / etc...)がついたクラスを探し出します。そしてSpring Bootはそのクラスを適当な方法でインスタンス化し、自身の管理下(=DI コンテナ)に置きます。

(「適当な方法」を指定することもできます > [Bean Annotation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html))

特に、`@Controller` `@RestController`アノテーションが付与されたクラスから生成されたインスタンスは HTTP のインタフェースとして働くことになります。

今回の例では、 `DemoApplication` クラスに Spring BootApplication アノテーションが付与されているので `DemoApplication` クラスのパッケージ `com.github.iij.bootcamp` 配下のクラスから特殊なアノテーションがついているクラスを探索します。

先ほど作成した `HelloController` は、 `RestController` アノテーションが付与されていたためSpring Bootが `HelloController` をインスタンス化、DI コンテナに登録しました。
そして / 宛の GET のリクエストを受けると `HelloController#helloWorld` が実行されるようになっていた、というわけです。

:::


### かんたんなリクエストを受け取ってみる
次にクエリパラメータから情報を取得してみましょう。

:computer: UserController.javaを作成し、サーバーを再起動してみてください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class UserController {

  private User secretUser = new User("ボブ", "bob")

	@GetMapping(path = "/user")
	public User find(@RequestParam String slug) {
    if("bob".equals(slug)) {
      return this.secretUser;
    }else {
      return null;
    }
	}
}
```

```bash
# 動作確認
$ curl 'localhost:8080/UserController?slug=bob'
XXX
```

#### チェックポイント
- `@GetMapping`アノテーションを持つメソッドがHTTPリクエストの実際の処理であることを理解した
- 引数に`@RequestParam`アノテーションを付与することでクエリパラメータを表現できることを理解した

#### 解説
新しいクラス`com.github.iij.bootcamp.UserController.java`を作成しました。このクラスにも`@RestController`アノテーションが付いているためHTTPのエンドポイントとして振る舞います。\
さらに`UserController`クラスの持つメソッド`find`には`@GetMapping`アノテーションがついているため、このSpring Bootアプリケーションの`/user`へGETリクエストを送ることでこの`find`メソッドがコールされるようになります。

`find`メソッドの引数`slug`に`@RequestParam`アノテーションが付与されています。これにより、HTTPリクエストのクエリパラメータの値がこの変数に注入されます。つまり`/user?slug=bob`へGETリクエストをSpring Bootアプリケーションへ送ることで`find`メソッドの引数`slug=bob`が引き渡されます。


### 責任を分離する
さて、前章までで基本的なコントローラーの使い方について解説してきました。もう少し実装を深めていきましょう。

今回は簡単に、`UserController.find`の処理を抽出して別のクラスに分離、コントローラーに外から与えてあげるようにしましょう。

:computer: UserService.javaを作成、UserController.javaを修正し、サーバーを再起動してみてください。

```bash
# 新しいクラスCalculatorを作成する
❯ vim src/main/java/com/github/iij/bootcamp/UserService.java
# CalcControllerクラスを修正する
❯ vim src/main/java/com/github/iij/bootcamp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java
package com.github.iij.bootcamp;

@Component
public class UserService {

  // データソースに該当する部分
  private List<User> userPool = new ArrayList<User>(Arrays.asList(new User("ボブ", "bob")));

  /**
   * ユーザープールからslug値で検索し、その結果を返却します
   * slugと一致するユーザーが見つからない場合nullを返却します
   */
  public User findBySlug(String slug) {
    User user = this.userPool
      .stream()
      .filter(u -> slug.equals(u.getSlug()))
      .findFirst()
      .orElse(null);
		return user;
	}
}
```

```java
package com.github.iij.bootcamp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class UserController {

  @Autowired 
  private UserService userService;

	@GetMapping(path = "/user")
	public User find(@RequestParam String slug) {
		return this.userService.findBySlug(slug);
	}
}
```

```bash
# 動作確認
$ curl 'localhost:8080/user?slug=bob'
XXX
```

#### チェックポイント
- `@Component`アノテーションをクラスに付与することで、そのクラスはSpring Boot起動時に自動的にインスタンス化されることを理解した
- Spring BootにはDIコンテナが用意されていること、それをアノテーションベースで利用できることを理解した

#### 解説
新しいクラス`com.github.iij.bootcamp.CalcController.java`を作成しました。このクラスには`@Component`アノテーションが付与されており、このアノテーションによりこのクラスはSpring Boot起動時にSpring Bootによって自動的にインスタンス化されSpring Bootの管理下に入ります.

### 少し複雑なリクエストを受け取ってみる
さらにPOSTリクエストとリクエストボディを指定してみましょう。\
`slug`と`name`を指定してユーザーを作成するアンドポイントを作成してみます。

:computer: 下記のクラスを修正し、サーバーを再起動してみてください。

```bash
# 下記の通りに修正する
❯ vim src/main/java/com/github/iij/bootcamp/UserService.java
❯ vim src/main/java/com/github/iij/bootcamp/UserController.java
# Spring Bootサーバーを再起動する
❯ ./gradlew bootRun
```

```java
package com.github.iij.bootcamp;

@Component
public class UserService {

  // データソースに該当する部分
  private List<User> userPool = new ArrayList<User>(Arrays.asList(new User("ボブ", "bob")));

  /**
   * ユーザープールからslug値で検索し、その結果を返却します
   * slugと一致するユーザーが見つからない場合nullを返却します
   */
  public User findBySlug(String slug) {
    User user = this.userPool
      .stream()
      .filter(u -> slug.equals(u.getSlug()))
      .findFirst()
      .orElse(null);
		return user;
	}

  /**
   * ユーザープールにUserを追加します
   */
  public User save(User user) {
    this.userPool.add(user);
		return user;
	}
}
```

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class UserController {

  @Autowired 
  private UserService userService;

	@GetMapping(path = "/user")
	public User find(@RequestParam String slug) {
		return this.userService.findBySlug(slug);
	}

  public class UserCreateRequest {
    private String name;
    private String slug;
    // getter/setter
  }

	@PostMapping(path = "/user")
	public User create(@RequestBody UserCreateRequest request) {
    User newUser = new User(request.getName(), request.getSlug());
		return this.userService.save(newUser);
	}
}
```

#### チェックポイント
- `@PostMapping`アノテーションを持つメソッドがPOSTリクエストの実際の処理であることを理解した
- JavaのPOJOを使ってPOSTリクエストのリクエストボディを表現できることを理解した

#### 解説
WIP

## 最後に

以上でSpring Bootのハンズオンは終了です。

このBootcampでは Spring Boot の表面をさらっていくことを目的としたため、おそらくまだ全容をつかむことは難しいと思います。
ただ、今後のSpring Boot習得の足掛かりとなれば幸いです。

### 追加の資料

- [Spring Bootリファレンスドキュメント](https://spring.pleiades.io/spring-boot/docs/current/reference/html)

  - 多くのSpring Boot開発者がお世話になる公式ドキュメントです。アプリケーションの開発からデプロイ方法まで、幅広く情報が提供されています。

- [Spring Boot Guides](https://spring.pleiades.io/guides)

  - Spring Bootの各種機能を試してみるチュートリアルが公開されています。Pub/SubやMongoDB、Dockerとの連携などSpring Bootの拡張が多種公開されています。興味のある項目に触ってみてください。

<credit-footer/>
