# Java と Gradle について概要

## Java 言語

ここでは Bootcamp についてくるために最低限必要な Java の基本について解説します。

Java の基本的な構成について下記の`com.example.demo.SampleClass`に記載しておきます。

```java
package com.example.com;  // パッケージ名(世界でユニークであると良い)
// 自社ドメインを持つ企業での製造物には自社ドメインをそのまま利用することが多い

import java.util.List; // 外部モジュールの利用(JavaではIDEに任せてしまうのが一般的)

/**
 * 複数行に渡るコメント文、特にメソッドとクラスに付与する複数行のコメント文をJavaDocと呼ぶ
 *
 * - Javaのクラス名の命名はパスカルケース
 * - クラス名とjavaファイルの名前は常に一致
 * - 継承できるクラスは1つまで
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
		if (a.equals("hello")) {
			b = "world";
		}
		return b.toString(); // 残念ながらJavaはnull安全な言語ではない(NullPointerExceptionの危機)
    }

    public class MyInnerClass { // クラスの中にクラスを定義することもできる
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

### パッケージとディレクトリ構成

Java にはパッケージという概念があり、いわゆる名前空間のような概念です。そのため。同名のクラスがあったとしてもパッケージが異なれば別のクラスと扱います。

たとえば`com.example.demo.SampleClass`と`com.example.demo.storage.SampleClass`は同じクラス名を持ちますが、Java プロジェクト上では別のモジュールとしてクラスを import できます。
一方自分で`java.lang`というパッケージを自分で作成すると、`java.lang`のパッケージを持つ別のモジュールと名前が競合して正常に動作しなくなります。

故にパッケージ名は世界で固有であることが望ましく、例として下記のようなパッケージ名がよく使われます。

- 自社ドメイン
- 組織ドメイン(io.kubernetes)
- 公開先のドメイン(com.github.ryusa)

またパッケージとディレクトリ構造には関係性があり`.`で区切られている部分でディレクトリを作成することになっています。
たとえば`com.example.demo.bootcamp.SampleClass`というクラスの場合、SampleClass.java までのディレクトリ構造は下記のようになります。

<pre>
.
├── build.gradle
├── gradlew
├── .classpath
└── src
    └── main
        └── java
            └── com
                └── example
                    └── demo
                        └── bootcamp
                            └── SampleClass.java
</pre>

## Gradle

Node.js でいうところの npm に対応するパッケージマネージャー兼ビルド自動化ツールとして今回は gradle を利用します。`build.gradle`ファイルに依存関係やビルド設定などを記述することで、Gradle がその情報を元に適切な依存関係を解決しビルドやテストを行うことができます。

SpringInitilizr から Spring プロジェクトを利用する場合は Gradle そのものをインストールする必要はありません。 `gradlew`というシェルスクリプト(Windows の場合は`gradlew.bat`)が自動的に適切な Gralde をインストールして使えるようにしてくれます。

`gradlew`にはデフォルトで含まれているタスクがいくつかあり、Bootcamp で利用する(および試しておいてほしい)コマンドを下記に記載しておきます。

```bash
# gradlewで登録されているタスクをすべて表示する
./gradlew tasks

# プロジェクトのmain関数を実行する(Springbootを起動する)
./gradlew bootRun

# jar(実行ファイル)を生成する
# デフォルトではbin/libs配下にjarファイルが生成される
./gradlew bootJar

# ビルドする(Jar生成＆単体テスト実行)
# デフォルトではbin/libs配下にjarファイルが生成される
./gradlew build
```
