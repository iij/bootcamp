---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Java Springフレームワークを使ったアプリ開発に関するハンズオンです
time: 1h
prior_knowledge: 特になし
---

<header-table/>

# SpringでWebアプリを作る

## Springとは

ここでいうSpringとはSpringフレームワークのことです。

Springフレームワークは、もともと、複雑すぎるJava EEに対するアンチテーゼとして登場したフレームワークでした。Java EE (Enterprise Edition) は多数のサーバからなる分散アプリケーションを包括的に実現する業界標準として鳴り物入りで登場しました。ServletやJSPといった技術もJava EEの部分を構成する要素技術です。

話が長くなるので結論だけ言うと、Springは大成功を収め、現在では巨大なフレームワークに成長しています。その首尾範囲と言い、規模と言い...おそらく一人でSpringフレームワークの全容を把握できる人はいないのではないか? と思われるほどです。

あまりにも巨大になったSpringフレームワークの導入を助けるために、現在ではSpring Bootと呼ばれる、スタンドアローンなSpringベースのWebアプリケーションを簡単に作り始めることのできる仕組みが用意されています。

われわれも、このSpring Bootを使って、SpringベースのWebアプリケーションを簡単に作ってみようと思います。

## 環境構築

### 必要な道具

1. JDK
2. データベース
3. Maven
4. IDE

### JDK

事前準備で用意したVMにOpenJDK8がインストール済みなので、そのまま使います。

JDKとはJava Development Kitのアクロニムで、プログラミング言語Javaで開発を行なうために必須のプログラムです。
(そう、SpringフレームワークはJavaのためのフレームワークです!)

OpenJDKは、JDKのオープンソース実装です。

JDのバージョン8は、少し古いバージョンなのですが、バージョン9で入った変更が非常に大きなインパクトがあり、まだ本番環境でバージョン9以降を採用しているところは多くないと思われます。そこで、今回はバージョン8を採用してハンズオンを進めたいと思います。

### データベース

データベースも、事前準備で用意したVMにMongoDBがインストール済みなので、そのまま使います。

### Maven

Mavenは、Javaにおけるプロジェクト管理およびライブラリ管理のための標準的なツールです。

プロジェクト管理とは、Mavenの文脈では、プロジェクトに必要なライブラリやプラグインをダウンロードしてきてインストールし、ソースコードをしかるべきディレクトリに整理し、プロジェクトを実行可能な形式にビルドし、テストを実行し、ステージング環境や本番環境にデプロイする、といったタスクを一元的に引き受けてくれるツールを指します。

Mavenのインストールは、以下のとおりの手順です。

```
$ curl -OL wget https://archive.apache.org/dist/maven/maven-3/3.6.1/binaries/apache-maven-3.6.1-bin.tar.gz
$ gzip -dc apache-maven-3.6.1-bin.tar.gz | tar xvf -
$ sudo mv apache-maven-3.6.1 /opt/
$ sudo ln -s /opt/apache-maven-3.6.1 /opt/apache-maven
$ rm apache-maven-3.6.1-bin.tar.gz
```

やっていることは、

1. 最新の安定板であるバージョン3.6.1のバイナリtarボールをダウンロードしてきて
2. 展開し
3. /opt以下にmvして
4. 新しいバージョンが出てきたときに備えてシンボリックリンクを切り、
5. 1でダウンロードしたtarボールを削除する

ということですね。

それから、社内でMavenを使うためにはプロキシの設定が必要です。

ホームディレクトリの直下に.m2というディレクトリを作り、そこに以下の内容のsettings.xmlを置いてください。

```xml
<settings>
  <proxies>
    <proxy>
      <active>true</active>
      <host>proxy.jp</host>
      <port>8080</port>
    </proxy>
  </proxies>
</settings>

```

### IDE

Javaの開発では、実質的にIDE (統合開発環境) の使用が必須です。

有名なIDEは以下の3つです。

1. Eclipse
2. IntelliJ IDEA
3. NetBeans

講師はIntelliJ IDEAをおすすめします。

デフォルトで気の利いた設定になっており、あれこれプラグインを入れる必要がなく、動作も軽快だからです。

IntelliJ IDEAは無料のCommunity Editionと有料のUltimate Editionがありますが、どちらを選んでもかまいません。Untimate Editionでも、30日間は試用が可能ですし、それほど高価なソフトウェアではありません。

(IntelliJ IDEAのインストールは、やや時間がかかるので、ハンズオンでは説明を省略し、IDEを使わずに進めます。)

## プロジェクトの準備

まずはプロジェクトディレクトリを作りましょう。

どこでも良いですし、どんな名前でも良いです。

講師は、個人的に、ホームディレクトリの直下にworkというディレクトリを作成し、その中に各種プロジェクトのディレクトリを作るようにしています。

```
$ mkdir -p work/bootcamp-spring
```

このような感じですね。

gitを使っているなら、このディレクトリでgit initしましょう。

GitHubを使っているなら、.gitignoreのプルダウンメニューからMavenを選んで新しいレポジトリを作ってgit cloneすると良いと思います。

MercurialやBitBucketを使っている人も、まあ、同様です。

gitもGitHubもMercurialもBitBucketも使っていないなら...後で校長室に来るように。

### pom.xmlの準備

続いてpom.xmlを準備します。pom.xmlは、Mavenのためのプロジェクト設定ファイルです。

個人的には、この種の設定ファイルは写経を兼ねて手で入力すると良いと思うのですが、今日はハンズオンですので、以下のURLからダウンロードしてください。

https://iij.github.io/bootcamp/server-app/java/pom.xml

pom.xmlはプロジェクトディレクトリの直下に置きます。

### ソースディレクトリの作成

プロジェクトディレクトリの下にソースディレクトリを作成します。

```
$ cd プロジェクトディレクトリ
$ mkdir -p src/main/java
$ mkdir -p src/main/resources
$ mkdir -p src/test/java
$ mkdir -p src/test/resources
```

src/main/java以下には、プロダクトコードを配置します。実際に動かすソフトウェアのためのソースコードす。

src/main/resources以下には、JARファイルに格納したいリソース(各種設定ファイル等)を配置します。

src/test/java以下には、テストコードを配置します。JUnitなどを使うコードですね。本ハンズオンでは、使用しません...

src/test/java以下には、テスト用のリソースを配置します。src/test/javaに書いたテストコードで利用したいリソースをここに配置して、読み込ませます。本ハンズオンでは、使用しません...

IntelliJ IDEAを使っている場合は、ここで一度`mvn compile`します。

```
$ mvn compile
```

そうしてから、プロジェクトディレクトリをOpenすると、Mavenプロジェクトであることを認識してくれます。

### メインクラスの作成

src/main/javaの下にパッケージjp.ad.iij.bootcamp.simpleのためのディレクトリ(つまりsrc/main/java/jp/ad/iij/bootcamp/simple)を作成し、以下の内容のソースファイルSimpleApplication.javaを作成しましょう。

```java
package jp.ad.iij.bootcamp.simple;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableAutoConfiguration
public class SimpleApplication {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleApplication.class, args);
    }
}
```

(IntelliJ IDEAでやる場合のデモを見せる。)

そうしたらコマンドラインから以下でサーバを起動します。

```
$ mvn spring-boot:run
```

ブラウザを開いて、 http://localhost:8080 にアクセスしましょう。

Hello World! と表示されましたね。

上記のソースコードは、コード量としては少ないですが、実はいろいろなことをやっています。

少し詳しく（しかし簡単に）読んでみましょう。

まずクラスSimpleApplicationの宣言に2つのアノテーションが記述されています。

```java
@RestController
@EnableAutoConfiguration
public class SimpleApplication {
```

最初のアノテーション `@RestController` はこのSimpleApplicationがRESTコントローラであることを宣言しています。

そのことによって、その後に出てくる `SpringApplication.run`によってアプリケーションを起動しようとするとき、RESTコントローラであるこを意識した起動プロセスが実行される仕組みになっています。

その次のアノテーション `@EnableAutoConfiguration` も似たような感じですが、こちらはソースコードをビルドする際に、このクラスのアノテーションから設定ファイルを自動生成してくれます。ここでいう設定ファイルとは、アプリケーションサーバであるTomcatのための設定ファイルです。今回、われわれがpom.xmlに記述しているspring-boot-starter-data-mongodbには、Tomcatが同梱されています。TomcatにWebアプリケーションをデプロイするためにはアプリケーション記述子と呼ばれる設定ファイルが最低限必要で、その他にも諸々の設定ファイルが必要になるのですが、それらの設定ファイルを自動生成してくれるのですね。

（Tomcatというのは、JavaにおけるWebアプケーション開発に必要となるServlet標準のためのリファレンス実装であるアプリケーションサーバです。簡単に言えば、JavaにおけるWebアプリケーションの実行にはServlet標準に準拠したアプリケーションサーバが必要で、Tomcatはそのもっとも標準的な実装である、ということですね。）

### データベースアクセス

最後に...というほどのことはしていませんが...データベースへのアクセスを実現してみましょう。

以下のコマンドでMongoDBを起動してください。

```
$ sudo service mongod start
```

今回はpeoplesというテーブルに`_id`と`name`という属性をもつドキュメントを作成し、その一覧を取得するAPIを作ってみます。

まずはモデルクラスを定義します。ここでいうモデルは、MongoDBで言うところのコレクションに対応します。

```java
package jp.ad.iij.bootcamp.simple.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="peoples")
public class People {

    @Id
    public String id;
    public String name;

    public People(String id) {
        this.id = id;
    }

    public People() {
    }


}
```

パッケージをjp.ad.iij.bootcamp.simple.modelとしましたが、実は規約等で決まっているわけではありません（この点はRuby on Railsなどとは異なるところです）。ただ、通常は多数のモデルを扱うので、モデルクラスを定義するmodelパッケージを専用に用意することは、慣習的に行なわれています。

アノテーション `@Document` は、このクラスがMongoDBのドキュメントに対応するモデルクラスであることを表現しています。`collection="peoples"`という指定は、このクラスで取り扱うモデル（ドキュメント）を格納するコレクションを指定しています。（MongoDBでいうコレクションは、RDBでいうテーブルに相当する概念です...MongoDBでは、あるコレクションに挿入するドキュメントの形式/構造は自由です。任意のJSONドキュメントを挿入することができます。しかし、一般的には、あるコレクションには一定の型のドキュメントを入れることが多く、RDBにおけるテーブルのように考えるわけです。）

アノテーション `@Id` は、Springにおいてモデルの主キーを指定するものです。つまり、変数名idは主キーであることを意味しておらず、アノテーション `@Id`が付与されていることだけがその変数を主キーに対応させるのです。

続いてレポジトリのインターフェースを定義します。

```java
package jp.ad.iij.bootcamp.simple.service;

import jp.ad.iij.bootcamp.simple.model.People;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PeopleRepository extends MongoRepository<People, String> {
}
```

レポジトリとは、DBアクセスのためのクラスを指すSpringフレームワークの用語です。

ここではインターフェースとして定義しており、MongoRepositoryインターフェースを継承しています。

Spring Bootのビルドプロセスは、MongoRepositoryインターフェースを継承しているインターフェースを探索し、その定義に基づいて実装クラスを自動的に生成します。ここではPeopleクラスをモデルとして用い、主キーの型をStringとして定義することが宣言されているので、それに従って実装クラスが生成されるのです。

データベース接続設定について、設定ファイルを用意します

src/main/resourcesにapplication.ymlを以下の内容で記述してください。

```yaml
spring:
  # MONGODB (MongoProperties)
  data:
    mongodb:
      host: localhost
      port: 27017
      uri: mongodb://localhost/bootcamp
      database: bootcamp
```

最後に、RESTコントローラーにエントリポイントを追加し、データベース問い合わせを記述してみます。

```java
package jp.ad.iij.bootcamp.simple;

import jp.ad.iij.bootcamp.simple.model.People;
import jp.ad.iij.bootcamp.simple.service.PeopleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@EnableAutoConfiguration
public class SimpleApplication {

    @Autowired
    private PeopleRepository peopleRepository;

    @RequestMapping("/api/people/listAll")
    public List<People> listAll() {
        return peopleRepository.findAll();
    }

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleApplication.class, args);
    }
}
```

まずアノテーション `@Autowired` を付与しているPeopleRepository peopleRepositoryを定義しています。

メソッドlistAllを定義しています。アノテーション `@RequestMapping` を通じて、このメソッドはRESTコントローラーのリクエスト処理用のメソッドであること、対応するクエリパスが/api/people/listAllであることを宣言しています。

peopleRepository.findAll()によって、データベースbootcampのコレクションpeoplesからドキュメントを取得し、これを `List<People>` にインスタンス化して、戻しています。RESTコントローラーは、これをJSON形式に変換してレスポンスボディに書き込みます。

（まだサーバが動いているなら、Ctrl-Cで止めて）`mvn spring-boot:run`しましょう。

そしてブラウザで http://localhost:8080/api/people/listAll にアクセスしてみます。

最初は `[]` が表示されますね。

mongoコマンドを使ってデータを投入してみます。

```
$ mongo
> use bootcamp
> db.createCollection('peoples')
{ "ok" : 1 }
> db.peoples.insert({name: 'Alice'})
WriteResult({ "nInserted" : 1 })
> db.peoples.insert({name: 'Bob'})
WriteResult({ "nInserted" : 1 })
```

ブラウザをリロードしてください。

挿入したデータが画面に表示されたと思います。

## 最後に

もし、JavaによるWebアプリケーション開発について、Struts時代のものしか知らなかった人がSpring Bootを見たら、なんと簡単なんだ!! と驚くと思います。

Springフレームワークは、非常に広大なフレームワークなので、ここで述べたことは本当にごくごく一部です。

みなさんがJavaによるWebアプリケーション開発について、怖がらずに、「やってみようかな」と思っていただけたら、幸いに存じます。

<credit-footer/>
