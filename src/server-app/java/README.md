---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: Java Springフレームワークを使ったアプリ開発に関するハンズオンです
time: 2h
prior_knowledge: 特になし
---

<header-table/>

# Java; springboot

## 前提条件

必須

* Dockerのインストールが完了していること
* ２GiB以上のディスク空き容量があること
* JavaにHelloWorldする勇気

推奨

* メモリ8GiB以上のホストマシン
* (プロキシ環境下で実施する場合) ホストマシンにプロキシの設定が入っていること
* VSCodeのインストール、およびRemoteDevelopmentの拡張機能が入っていること

## 事前準備; prepare

DockerイメージのpullとVSCodeの設定を先に完了しておいてください。

詳細 > [事前準備・環境構築編](./prepare.md)

## 難易度表記について

このBootcampで解説する内容は膨大です。(予定)そのため、各項目に下記のような難易度表記をつけて読み飛ばしの参考にしてください。(初心者の人は出来る限り触ってみてください)

|表記|ターゲット層|例|
|:--:|:--:|:--:|
|(記載なし)|全員| - |
|★|初心者|全くプログラミングしたことない|
|★★|プログラミング経験者|学校でコーディングをしたことがある / MVCは知らんけどコードは書ける|
|★★★|MVCフレームワーク経験者|何かしらのMVCフレームワークでHelloWorld出来る|
|★★★★|熟練|まさかり飛ばす人|

## java Bootcamp

### TL; DR

> Java（ジャヴァ）は、クラスベースのオブジェクト指向の、実装の依存関係をできるだけ少なくするように設計された汎用プログラミング言語である。これは、アプリケーション開発者が一度書いたらどこでも実行できるようにすること(WORA:write once, run anywhere)[1]を目的としている。つまり、コンパイルされたJavaコードは、再コンパイルを必要とせずにJavaをサポートするすべてのプラットフォーム上で実行できる

引用: Wikipedia「Java」 2020-05-26 19:00 より

### 本編

詳細 > [bootcamp/java](./java.md)

## Springboot Bootcamp

SprinbBootは今やJava界隈最大手のWebフレームワークです。小規模なブログから大規模なECサイトまでこのフレームワークだけで開発、デプロイをすることができます。

このフレームワークを開発する上で、基本的なJavaの知識やMVCやDIといった設計の知識も必要になってきます。残念ながらこのBootcampで全ての要素に触れることはできませんが、最初の入り口に立つところまでを案内します。

それでは始めましょう。

### 初回起動

[事前準備・環境構築編](./prepare.md) を終えた状態になっていることを確認します。ホストマシンのブラウザから[localhost:8080](http://localhost:8080)にアクセスすると下記のエラー画面が出る状態になっていることを確認してください。

![初回起動 - WhitelabelErrorPage](./images/white-label-error.png)

チェックポイント

* [ ] [事前準備・環境構築編](./prepare.md) を一読し、完了した。
* [ ] [localhost:8080](http://localhost:8080)にアクセスしてWhitelabel Error Page が表示される。

### DIについて

SpringBootを使いこなすためにはDIについて触れなくてはいけません。なぜなら、Springbootでコントローラーを作成するときや依存関係を書いたりする際にDIの機能を用いるからです。

が、DIについて深く記すには余白が狭すぎるためこの場では詳細な説明を省くことにします。詳しくはこちら > [DI #とは](./deepDI.md)

チェックポイント

* [ ] SpringBootではDIという概念が重要であることを理解した。

### 本編

#### コントローラーを作成してみましょう

まず始めに簡単なHelloworldを行うコントローラーを作成し、Springbootがどのように動作しているのかを見てみましょう。
それではさっそくコードを書いていきます。

> src/main/java/com/example/demo/DemoApplication.java

上記のクラスに下記の通り追記してみましょう。

``` java
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

``` bash
./gradlew bootRun
curl localhost:8080
```

"hello world"が返ってきたら成功です。

さて、この10行に満たないコードを書いている間に何が起きたのかを簡単に解説します。

`bootRun` コマンドによりSprinbBootが起動します。すると、Springbootの機能により `RestController` アノテーションが付いている `DemoApplication.HelloController` がHTTPのインターフェースとして登録されます。

その結果このSpringBootが動いている8080番ポート宛のHTTPリクエストと `DemoApplication.HelloController#helloWorld` が紐づけられることになり、GET / のリクエストのレスポンスが"hello world"になったわけです。

チェックポイント

* [ ] SpringBootでHelloWorldができた
* [ ] RestControllerアノテーションをクラスに付けることでコントローラーが作れることを理解した

##### 蛇足 : SpringBootのDIコンテナと探索

* 難易度：★★

SpringBootは `SpringBootApplication` アノテーションのついたクラスの `main` 関数を飛び出して起動します。起動すると、起動クラスのパッケージ配下のJavaファイルからContoroller/Component/...といった特殊なアノテーションがついたクラスを探し出し、適当な方法でインスタンス化します。(「適当な方法」を指定することもできます > [Bean Annotation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html))そしてそのインスタンスたちをSpringBootの管理下(=DIコンテナ)に置くようにしています。

この時、DIコンテナ内に含まれるインスタンスたちの中で「Controller」「RestController」アノテーションが付与されたクラスから生成されたインスタンスはHTTPのインターフェース=MVCのコントローラーとして働くことになります。

今回の例では、 `DemoApplication` クラスにSpringBootApplicationアノテーションが付与されているので `DemoApplication` クラスのパッケージ `com.example.demo` 配下のクラスから特殊なアノテーションがついているクラスを探索します。

先ほど作成した `HelloController` については、 `RestController` アノテーションが付与されていたためSpringBootが `HelloController` をインスタンス化、DIコンテナに登録し/宛のGETのリクエストを受けると `HelloController#helloWorld` が発火されるようになっていた、というわけです。

#### 演習：生徒管理のAPIを作成しよう

それでは、下記の機能を持つREST APIを作成してみましょう！

生徒管理APIの作成の依頼

> あなたは、あるプログラミングスクールでテストのスコアを管理するアプリケーションの製造を依頼されました。フロントエンドのアプリケーションは実装済みで、APIサーバーが必要とのことです。そこで、あなたは下記の機能を持ったAPIサーバーを製造することになりました。
> - GET   /students 保存済みの全生徒エンティティを返却する
> - GET   /students/{生徒ID} 指定された生徒IDを持つ生徒エンティティを返却する
> - POST  /students  指定されたプロパティを持つ生徒エンティティを保存し、保存した生徒エンティティを返却する
> - PUT  /students{生徒ID}  指定されたプロパティを持つ生徒エンティティを変更し、変更後の生徒エンティティを返却する
>
> ※ 生徒エンティティには「生徒ID」「生徒名」「成績(整数)」を含むものとする

下記のクラスに `RestController` アノテーションを追加します。
また `StudentController#retrieveStudents` にGET /studentsのエンドポイントとの紐付けを作成してみます。

> src/main/java/com/example/demo/controller/StudentController.java

``` java
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

再度bootRunコマンドで起動し、正しく動作していることを確認しましょう

``` bash
curl localhost:3000
> hi
```

##### オブジェクトを返却する 

今までコントローラーが返却していたのは文字列だけでしたが、場合によってはJsonなどのオブジェクトを返却したい事もあると思います。特に今回は生徒エンティティを返却するように言われているため、まずは生徒エンティティを作成しましょう。

まず、生徒Entityのクラスを作成しましょう。

> src/main/java/com/example/demo/entity/StudentEntity.java

``` java
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

SpringBootのコントローラーでJsonを返却する場合、多くの場合はPOJO(純粋なjavaオブジェクト)をそのまま返却するだけで良いです。

試しに先程作ったStudentEntityをインスタンス化して返却してみましょう。

``` java
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

bootRunして動作していることを確認しましょう。

``` bash
curl localhost:8080/student
> {"studentId":"studentId","name":"hello","score":100}
```

すでに別のフレームワークを経験したことのある人であれば「Serializerは？」と感じる人もいるかもしれません。しかしSpringBootではSerializerを意識する必要はないように作られています。もちろん自分でシリアライズ・デシリアライズを指定/実装することもできます。

最後にretrieveStudentsは「登録されている全ての生徒Entityを返却」する関数なので、Listを返却するように変更しておきましょう。

``` java
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

次は/student/{生徒ID}のAPIを作ってみましょう。

URLのパスからパラメータをもらってくる場合、パスに変数名を埋め込みその変数を関数の引数で指定することでパスから値を引き抜いてくることができます。

下記の通り実装して動作することを確認しましょう。

``` java
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

実装したら再度bootRunして確認しましょう。

``` bash
curl localhost:8080/student/hello
> hello
```

ここまでできたら、先程と同様に適当なStudentEntityを返却するように修正しておきましょう。

``` java
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

##### POSTリクエストを受け取ってみよう

ここまで作成したAPIは二つとも読み取り、GETメソッドでの実装でした。ここでPOSTリクエストを利用してデータを書き込むAPIを用意してあげましょう。

POSTリクエストを受け取るには、今まで使ってきた `GetMapping` の代わりに `PostMapping` を利用しましょう。またPOSTメソッドでのデータの受け渡しはリクエストボディで行うのがRFCでの既定なので、データをリクエストボディで受け取れるようにしましょう。

``` java
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

再度bootRunして動作を確認しましょう。

``` 
curl -X POST localhost:8080/student -H 'Content-type: application/json' -d '{"name": "hello POST", "score": 50}'
> {"studentId":"studentId","name":"hello POST","score":50}
```

##### 業務処理を作ろう

コントローラー部分を作成したので、実際に生徒entityを管理するクラスを実装していきましょう。今回はあくまでもSpringBootのBootcampなのでRDSやKVSなどに永続化することはせず、ヒープメモリに保存するだけに留めておきます。

下記のjavaファイルを作成して、仮の実装をしましょう。

> src/main/java/com/example/demo/service/StudentService.java

``` java
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

このクラスにおいて話しておかないといけないのは`@Component`についてです。`@Component`はSpringBootを開発する上で一番利用するアノテーションで、このアノテーションが付与されたクラスはSpringBootが起動時に自動的にインスタンス化しSpringBootの管理下(=DIコンテナ)に配置されるようになります。

そのため、今`StudentService`はSpringBootの管理下におかれるようになっているため`StudentController`からアクセスできるようになりました。

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

接続の仕方は簡単で、今回は`@Autowired`を利用しました。`@Autowired`が付与されたフィールドはにはSpringBootが適切なインスタンスを自身のDIコンテナから配置してくれるようになります。

このため、`StudentController`は`StudentService`をインスタンス化する方法を知る必要なく`StudentService`を利用することができるようになりました。

ここまでできたら、再度bootRunして動作を確認しましょう。


### 演習：生徒管理のAPIを実装してみましょう！
ここまでで

- Javaの書き方
- APIのエンドポイントの実装の方法
- APIのスキーマ定義の方法
- DIコンポーネントの定義の方法
- @AutowiredによるDIの実現方法

を学びました。これらを利用して、残りのAPIを自分で実装してみましょう。

また、サンプルとして実装を終えたコードを用意しておきます。必要な方は実装を確認してみてください。


#### ヒント
- StudentController#updateStudent
    - GETメソッドのエンドポイントを作成する場合はGetMapping、POSTメソッドのエンドポイントを作成する場合はPostMapping。であればPUTメソッドのエンドポイントを作成する場合は……？


<credit-footer/>
