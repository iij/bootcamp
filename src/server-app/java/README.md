---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Java Springフレームワークを使ったアプリ開発に関するハンズオンです
time: 2h
prior_knowledge: 特になし
---

<header-table/>

# Java; springboot

IIJ Bootcamp java; SpringBoot に関する資料です。あらかじめ Bootcamp のリポジトリをローカルへ clone し、次の事前準備へ進んでください。

> git clone https://github.com/iij/bootcamp.git

## 事前準備

事前準備として、Docker の動作確認と IDE の設定などを行っておいてください。Java イメージや依存関係などのダウンロードを行うので、安定したネットワーク環境下で実行することをお勧めします。

詳細 > [事前準備・環境構築編](./prepare.md)

## 難易度表記について

この Bootcamp で解説する内容は膨大です。(予定)そのため、各項目に下記のような難易度表記をつけて読み飛ばしの参考にしてください。(初心者の人は出来る限り触ってみてください)

|    表記    |       ターゲット層       |                                 例                                  |
| :--------: | :----------------------: | :-----------------------------------------------------------------: |
| (記載なし) |           全員           |                                  -                                  |
|     ★      |          初心者          |                   全くプログラミングしたことない                    |
|     ★★     |   プログラミング経験者   | 学校でコーディングをしたことがある / MVC は知らんけどコードは書ける |
|    ★★★     | MVC フレームワーク経験者 |          何かしらの MVC フレームワークで HelloWorld 出来る          |
|    ★★★★    |           熟練           |                          まさかり飛ばす人                           |

## java Bootcamp

### TL; DR

> Java（ジャヴァ）は、クラスベースのオブジェクト指向の、実装の依存関係をできるだけ少なくするように設計された汎用プログラミング言語である。これは、アプリケーション開発者が一度書いたらどこでも実行できるようにすること(WORA:write once, run anywhere)[1]を目的としている。つまり、コンパイルされた Java コードは、再コンパイルを必要とせずに Java をサポートするすべてのプラットフォーム上で実行できる

引用: Wikipedia「Java」 2020-05-26 19:00 より

### 本編

詳細 > [bootcamp/java](./java.md)

## Springboot Bootcamp

SprinbBoot は今や Java 界隈最大手の Web フレームワークです。小規模なブログから大規模な EC サイトまでこのフレームワークだけで開発、デプロイをすることができます。

このフレームワークを開発する上で、基本的な Java の知識や MVC や DI といった設計の知識も必要になってきます。残念ながらこの Bootcamp で全ての要素に触れることはできませんが、最初の入り口に立つところまでを案内します。

それでは始めましょう。

### 初回起動

[事前準備・環境構築編](./prepare.md) を終えた状態になっていることを確認します。ホストマシンのブラウザから[localhost:8080](http://localhost:8080)にアクセスすると下記のエラー画面が出る状態になっていることを確認してください。

![初回起動 - WhitelabelErrorPage](./images/white-label-error.png)

チェックポイント

- [ ] [事前準備・環境構築編](./prepare.md) を一読し、完了した。
- [ ] [localhost:8080](http://localhost:8080)にアクセスして Whitelabel Error Page が表示される。

### DI について

SpringBoot を使いこなすためには DI について触れなくてはいけません。なぜなら、Springboot でコントローラーを作成するときや依存関係を書いたりする際に DI の機能を用いるからです。

が、DI について深く記すには余白が狭すぎるためこの場では詳細な説明を省くことにします。詳しくはこちら > [DI #とは](./deepDI.md)

チェックポイント

- [ ] SpringBoot では DI という概念が重要であることを理解した。

### 本編

#### コントローラーを作成してみましょう

まず始めに簡単な Helloworld を行うコントローラーを作成し、Springboot がどのように動作しているのかを見てみましょう。
それではさっそくコードを書いていきます。

> src/main/java/com/example/demo/DemoApplication.java

上記のクラスに下記の通り追記してみましょう。

```java
package com.example.demo;

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

ここまで書いたら、再びアプリを再起動してあげましょう！

```bash
./gradlew bootRun
curl localhost:8080
```

"hello world"が返ってきたら成功です。

さて、この 10 行に満たないコードを書いている間に何が起きたのかを簡単に解説します。

`bootRun` コマンドにより SprinbBoot が起動します。すると、Springboot の機能により `RestController` アノテーションが付いている `DemoApplication.HelloController` が HTTP のインターフェースとして登録されます。

その結果この SpringBoot が動いている 8080 番ポート宛の HTTP リクエストと `DemoApplication.HelloController#helloWorld` が紐づけられることになり、GET / のリクエストのレスポンスが"hello world"になったわけです。

チェックポイント

- [ ] SpringBoot で HelloWorld ができた
- [ ] RestController アノテーションをクラスに付けることでコントローラーが作れることを理解した

##### 蛇足 : SpringBoot の DI コンテナと探索

- 難易度：★★

SpringBoot は `SpringBootApplication` アノテーションのついたクラスの `main` 関数を飛び出して起動します。起動すると、起動クラスのパッケージ配下の Java ファイルから Contoroller/Component/...といった特殊なアノテーションがついたクラスを探し出し、適当な方法でインスタンス化します。(「適当な方法」を指定することもできます > [Bean Annotation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html))そしてそのインスタンスたちを SpringBoot の管理下(=DI コンテナ)に置くようにしています。

この時、DI コンテナ内に含まれるインスタンスたちの中で「Controller」「RestController」アノテーションが付与されたクラスから生成されたインスタンスは HTTP のインターフェース=MVC のコントローラーとして働くことになります。

今回の例では、 `DemoApplication` クラスに SpringBootApplication アノテーションが付与されているので `DemoApplication` クラスのパッケージ `com.example.demo` 配下のクラスから特殊なアノテーションがついているクラスを探索します。

先ほど作成した `HelloController` については、 `RestController` アノテーションが付与されていたため SpringBoot が `HelloController` をインスタンス化、DI コンテナに登録し/宛の GET のリクエストを受けると `HelloController#helloWorld` が発火されるようになっていた、というわけです。

#### 演習：生徒管理の API を作成しよう

それでは、下記の機能を持つ REST API を作成してみましょう！

生徒管理 API の作成の依頼

> あなたは、あるプログラミングスクールでテストのスコアを管理するアプリケーションの製造を依頼されました。フロントエンドのアプリケーションは実装済みで、API サーバーが必要とのことです。そこで、あなたは下記の機能を持った API サーバーを製造することになりました。
>
> - GET /students 保存済みの全生徒エンティティを返却する
> - GET /students/{生徒 ID} 指定された生徒 ID を持つ生徒エンティティを返却する
> - POST /students 指定されたプロパティを持つ生徒エンティティを保存し、保存した生徒エンティティを返却する
> - PUT /students{生徒 ID} 指定されたプロパティを持つ生徒エンティティを変更し、変更後の生徒エンティティを返却する
>
> ※ 生徒エンティティには「生徒 ID」「生徒名」「成績(整数)」を含むものとする

下記のクラスに `RestController` アノテーションを追加します。
また `StudentController#retrieveStudents` に GET /students のエンドポイントとの紐付けを作成してみます。

> src/main/java/com/example/demo/controller/StudentController.java

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生徒エンティティのCRUD APIエンドポイント
 *
 * TODO 適切なアノテーションを付与してRESTのコントローラーにする
 */
@RestController
public class StudentController {
    /**
     * 登録されている生徒エンティティを全て返却する
     *
     * TODO 適切なアノテーションを付与してGET /studentでHTTPを受け取れるようにする ← DONE
     * TODO 適切な返却の型を指定する
     * TODO 内部ロジックを書く
     */
    @GetMapping(path = "/student")
    public String retrieveStudents() {
        return "hi";
    }
    // snip
}
```

再度 bootRun コマンドで起動し、正しく動作していることを確認しましょう

```bash
curl localhost:3000
> hi
```

##### オブジェクトを返却する

今までコントローラーが返却していたのは文字列だけでしたが、場合によっては Json などのオブジェクトを返却したい事もあると思います。特に今回は生徒エンティティを返却するように言われているため、まずは生徒エンティティを作成しましょう。

まず、生徒 Entity のクラスを作成しましょう。

> src/main/java/com/example/demo/entity/StudentEntity.java

```java
package com.example.demo.entity;

/**
 * 生徒Entity
 */
public class StudentEntity {
    /**
     * 生徒ID
     */
    private String studentId;

    /**
     * 生徒名
     */
    private String name;

    /**
     * 成績
     */
    private long score;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }
}
```

SpringBoot のコントローラーで Json を返却する場合、多くの場合は POJO(純粋な java オブジェクト)をそのまま返却するだけで良いです。

試しに先程作った StudentEntity をインスタンス化して返却してみましょう。

```java
package com.example.demo.controller;

import com.example.demo.entity.StudentEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生徒エンティティのCRUD APIエンドポイント
 *
 * TODO 適切なアノテーションを付与してRESTのコントローラーにする
 */
@RestController
public class StudentController {

    /**
     * 登録されている生徒エンティティを全て返却する
     *
     * TODO 適切なアノテーションを付与してGET /studentでHTTPを受け取れるようにする
     * TODO 適切な返却の型を指定する ← DONE
     * TODO 内部ロジックを書く
     */
    @GetMapping(path = "/students")
    public StudentEntity retrieveStudents() {
        var studentEntity = new StudentEntity();
        studentEntity.setName("hello");
        studentEntity.setScore(100);
        studentEntity.setStudentId("studentId");
        return studentEntity;
    }
    // snip
```

bootRun して動作していることを確認しましょう。

```bash
curl localhost:8080/student
> {"studentId":"studentId","name":"hello","score":100}
```

すでに別のフレームワークを経験したことのある人であれば「Serializer は？」と感じる人もいるかもしれません。しかし SpringBoot では Serializer を意識する必要はないように作られています。もちろん自分でシリアライズ・デシリアライズを指定/実装することもできます。

最後に retrieveStudents は「登録されている全ての生徒 Entity を返却」する関数なので、List を返却するように変更しておきましょう。

```java
    // snip
    @GetMapping(path = "/students")
    public List<StudentEntity> retrieveStudents() {
        var studentEntity = new StudentEntity();
        studentEntity.setName("hello");
        studentEntity.setScore(100);
        studentEntity.setStudentId("studentId");
        // 追加 java.util.Listからimportするようにしましょう
        List<StudentEntity> entities = List.of(studentEntity, studentEntity);
        return entities;
    }
    // snip
```

##### パスパラメータから情報を受け取ろう

次は/student/{生徒 ID}の API を作ってみましょう。

URL のパスからパラメータをもらってくる場合、パスに変数名を埋め込みその変数を関数の引数で指定することでパスから値を引き抜いてくることができます。

下記の通り実装して動作することを確認しましょう。

```java
package com.example.demo.controller;

import java.util.List;

import com.example.demo.entity.StudentEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生徒エンティティのCRUD APIエンドポイント
 *
 * TODO 適切なアノテーションを付与してRESTのコントローラーにする
 */
@RestController
public class StudentController {
    // snip
    /**
     * 指定された生徒エンティティを返却する
     * TODO 適切なアノテーションを付与してGET /student/{id} でHTTPを受け取れるようにする
     * TODO 適切な返却の型を指定する
     * TODO 内部ロジックを書く
     */
    @GetMapping(path = "/student/{studentId}")
    public String retrieveStudent(@PathVariable String studentId) {
        return studentId;
    }
    // snip
```

実装したら再度 bootRun して確認しましょう。

```bash
curl localhost:8080/student/hello
> hello
```

ここまでできたら、先程と同様に適当な StudentEntity を返却するように修正しておきましょう。

```java
    // snip
    /**
     * 指定された生徒エンティティを返却する
     * TODO 適切なアノテーションを付与してGET /student/{id} でHTTPを受け取れるようにする
     * TODO 適切な返却の型を指定する
     * TODO 内部ロジックを書く
     */
    @GetMapping(path = "/student/{studentId}")
    public StudentEntity retrieveStudent(@PathVariable String studentId) {
        var studentEntity = new StudentEntity();
        studentEntity.setStudentId(studentId);
        studentEntity.setName("hello2");
        studentEntity.setScore(0);
        return studentEntity;
    }
    // snip
```

##### POST リクエストを受け取ってみよう

ここまで作成した API は二つとも読み取り、GET メソッドでの実装でした。ここで POST リクエストを利用してデータを書き込む API を用意してあげましょう。

POST リクエストを受け取るには、今まで使ってきた `GetMapping` の代わりに `PostMapping` を利用しましょう。また POST メソッドでのデータの受け渡しはリクエストボディで行うのが RFC での既定なので、データをリクエストボディで受け取れるようにしましょう。

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

    // snip
    /**
     * POST /student で受け取るリクエストボディのスキーマ
     */
    public static class PostRequestBody {

        private String name;
        private Long score;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getScore() {
            return score;
        }

        public void setScore(Long score) {
            this.score = score;
        }
    }

    /**
     * 指定されたプロパティを持つ生徒エンティティを登録し、登録した生徒エンティティを返却する
     * TODO 適切なアノテーションを付与してPOST /student でHTTPを受け取れるようにする
     * TODO HTTPリクエストの際に受け取るリクエストの型を定義する
     * TODO 適切な返却の型を指定する
     * TODO 内部ロジックを書く
     */
    @PostMapping(path = "/student")
    public StudentEntity createStudent(@RequestBody PostRequestBody body) {
        var studentEntity = new StudentEntity();
        studentEntity.setStudentId("studentId");
        studentEntity.setName(body.getName());
        studentEntity.setScore(body.getScore());
        return studentEntity;
    }
    // snip
```

再度 bootRun して動作を確認しましょう。

```
curl -X POST localhost:8080/student -H 'Content-type: application/json' -d '{"name": "hello POST", "score": 50}'
> {"studentId":"studentId","name":"hello POST","score":50}
```

##### 業務処理を作ろう

コントローラー部分を作成したので、実際に生徒 entity を管理するクラスを実装していきましょう。今回はあくまでも SpringBoot の Bootcamp なので RDS や KVS などに永続化することはせず、ヒープメモリに保存するだけに留めておきます。

下記の java ファイルを作成して、仮の実装をしましょう。

> src/main/java/com/example/demo/service/StudentService.java

```java
package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.entity.StudentEntity;

import org.springframework.stereotype.Component;

@Component
public class StudentService {

    private List<StudentEntity> savedStudents;

    public StudentService() {
        // 本当にこれでいい……？(発展課題：Immutableに変更し、動作確認をしましょう)
        this.savedStudents = new ArrayList<StudentEntity>();
    }

    /**
     * 保存している生徒Entityを全て返却する
     * @return {@link StudentEntity}
     */
    public List<StudentEntity> findStudents() {
        return this.savedStudents;
    }

    /**
     * TODO 実装
    */
    public StudentEntity findStudentById(String studentId) {
        return null;
    }

    /**
     * TODO 実装
    */
    public StudentEntity insertStudentEntity(String name, Long score) {
        return null;
    }
}
```

このクラスにおいて話しておかないといけないのは`@Component`についてです。`@Component`は SpringBoot を開発する上で一番利用するアノテーションで、このアノテーションが付与されたクラスは SpringBoot が起動時に自動的にインスタンス化し SpringBoot の管理下(=DI コンテナ)に配置されるようになります。

そのため、今`StudentService`は SpringBoot の管理下におかれるようになっているため`StudentController`からアクセスできるようになりました。

それではこの業務処理を行うクラスを`StudentController`に接続してあげましょう。

```java
    // snip

    // 追加する
    @Autowired
    private StudentService studentService;

    /**
     * 登録されている生徒エンティティを全て返却する
     *
     * TODO 適切なアノテーションを付与してGET /studentでHTTPを受け取れるようにする
     * TODO 適切な返却の型を指定する
     * TODO 内部ロジックを書く
     */
    @GetMapping(path = "/student")
    public List<StudentEntity> retrieveStudents() {
        return studentService.findStudents();
    }
```

接続の仕方は簡単で、今回は`@Autowired`を利用しました。`@Autowired`が付与されたフィールドはには SpringBoot が適切なインスタンスを自身の DI コンテナから配置してくれるようになります。

このため、`StudentController`は`StudentService`をインスタンス化する方法を知る必要なく`StudentService`を利用することができるようになりました。

ここまでできたら、再度 bootRun して動作を確認しましょう。

### 演習：生徒管理の API を実装してみましょう！

ここまでで

- Java の書き方
- API のエンドポイントの実装の方法
- API のスキーマ定義の方法
- DI コンポーネントの定義の方法
- @Autowired による DI の実現方法

を学びました。これらを利用して、残りの API を自分で実装してみましょう。

また、サンプルとして実装を終えたコードを用意しておきます。必要な方は実装を確認してみてください。

#### ヒント

- StudentController#updateStudent
  - GET メソッドのエンドポイントを作成する場合は GetMapping、POST メソッドのエンドポイントを作成する場合は PostMapping。であれば PUT メソッドのエンドポイントを作成する場合は……？

<credit-footer/>
