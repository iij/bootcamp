---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: テストプログラミング ハンズオン
description: 開発を行う際に覚えておくと非常に便利なテストを伝授します。
time: 2h
prior_knowledge: Python3
---

<header-table/>

# {{$page.frontmatter.title}}

# 目次
- [はじめに](#はじめに)
- [概論](#概論)
  - [なぜテストを行うのか](#なぜテストを行うのか)
  - [効率的なテストとは](#効率的なテストとは)
  - [いつテストをするのか](#いつテストをするのか)
- [準備](#準備)
  - [dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)
  - [テストの実行方法](#テストの実行方法)
  - [関数・テストの修正方法](#関数・テストの修正方法)
- [テストを実行する](#テストを実行する)
  - [同値クラス・境界値テスト](#同値クラス・境界値テスト)
  - [APIと関数のモック](#APIと関数のモック)
- [おわりに](#おわりに)
- [付録](#付録：TDDをやってみる)


# はじめに

本講義はdockerを使用します。
dockerコンテナのpullには時間を要するため、概論の聴講と並行して「準備 ⇒ [dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)」を実施することを推奨します。

また、ローカルでのコマンド実行なのか、docker コンテナ内でのコマンド実行なのかが分かるよう、以下の記述方法を用います。
基本的には、手を動かすのはローカル、成果物の確認 (テスト実行) は docker コンテナになります。
```terminal
### "$" で始まるものはローカルでのコマンド実行
$ cd bootcamp/src/server-app/test-hands-on

### "root@..." で始まるものは docker コンテナ内でのコマンド実行
root@a3f5935947a2:/# cd /test-hands-on
```

また、ファイルを開くのは以下のように vscode を前提として書いていますが、適宜お手元のエディターに読み替えていただいて問題ありません。
```terminal
### とりあえず vscode にしているが、コードを編集できれば何でもよい
$ code ./exercises/exercise0/test_challenge.py
```



# 概論
## なぜテストを行うのか

昨今ではIT技術が普及し、炊飯器・電子レンジ・洗濯機といった身の回りのものから、航空機や車など、普段の生活に必須になるものにまで、ソフトウェアが使用されています。
また、世の中に流通しているソフトウェアはテストが実施されており、その挙動で問題が起こらないことを保証されています。

例えばソフトウェアに対し、テストを行われていないと仮定して、個人的に運営しているブログなどで不具合が発生した場合はどうなるでしょうか。
その不具合によってサーバがダウンしている間は、運営者に広告費が入らないなど、ある程度小規模で済みます。
（ブログ収益で生計を立てている場合、致命的ですが。）

例えば自動車や医療機器などで不具合が発生してしまった場合、どうなるでしょうか。
最悪の場合、ブレーキが効かない、医療機器のレーザーの出力が多すぎたなど、ソフトウェアの欠陥によって人命が失われてしまう可能性もあります。

上記2つの例を上げましたが、大なり小なり、ソフトウェアの不具合によって、どこかの誰かが被害を被ってしまいます。
そのため、自身が作成するプログラムでは必ず動作のテストを行い、極力不具合を発生させないソフトウェアを作ることを目指す必要があります。

## 効率的なテストとは

テストを作成する場合には、不具合をなくすことも重要ですが、テストにコストをかけないことも重要になります。

例えば、あるプロダクトに使用される、以下のような仕様の関数```f(x)```があるとします。
- 関数```f```は、任意の数字```x```の値を取ります。
- 任意の数字```x```は、int型であり、 *-2,147,483,648* から *2,147,483,647* の範囲の値を格納できます。
- 関数```f```は、与えられた数字が *0* から *100* の間であれば```True```、そうでなければ```False```を返却します。

上記の```f(x)```の挙動を100%確かめるためには、 *4,294,967,296* 件のテストを行わなければなりません。
しかし、実際のプロダクトを作成する場合、1つの関数に対し40億回もテストを実施してしまうと、プロダクトの売上以上に人件費や計算機の運用コストがかかってしまい、会社は倒産の危機に瀕してしまいます。

そのため、後述する「同値クラス・境界値テスト」などの手法によって、最低限かつ最適な回数でテストを行うことが求められます。

## いつテストをするのか

開発を行う際、ウォーターフォール型の開発では、下記の流れになります。
右下向きの矢印が設計工程、中央が開発工程、右上向きの矢印がテスト工程になります。

![figure1.png](./images/figure1.png "figure1")

設計における各要素は、テスト工程の各要素に対応することになります。
例えば、最初の工程では要求定義を行い、ソフトウェアに必要な要件を決めます。そして工程の最後にソフトウェアが要件を満たしているかを確認するためのテスト（システムテスト）行います。

これはコーディングにおいても同様です。書いたコードの機能 1 つ 1 つに問題がないかを単体テストします。
多くの場合、少しをコードを書く → 単体テストを実行 → 少しコードを書く ... というサイクルを繰り返します。

なぜこのようなサイクルを繰り返すかというと、早い段階で単体テストに失敗することで不具合やロジックミスを早期発見でき、後からまとめてデバッグするよりも効率的に問題を修正できるからです。

---

概論は以上です。以降は実際にハンズオンをやってみましょう。今回のハンズオンではコーディング・単体テスト段階で実施するテストプログラミングをやっていきます。

# 準備

## dockerコンテナの立ち上げ方

下記のコマンドでdockerコンテナを立ち上げます。

```terminal
### リポジトリのクローン (既にある場合はスキップで OK)
$ git clone https://github.com/iij/bootcamp.git
$ cd bootcamp/src/server-app/test-hands-on
### clone をスキップした場合は、リポジトリを最新化
$ git pull

### コンテナの立ち上げ
$ docker compose up --build

### 以下のように出力されたら OK.
(中略)
 ✔ Network test-hands-on_default            Created  0.0s
 ✔ Container test-hands-on-bootcamp-test-1  Created  0.0s
Attaching to bootcamp-test-1
bootcamp-test-1  | Python 3.12.4 (main, Aug  1 2024, 21:02:17) [GCC 12.2.0] on linux
bootcamp-test-1  | Type "help", "copyright", "credits" or "license" for more information.
```

## テストの実行方法

まずは単純な例で、テストの実行と修正をやってみましょう。

「[dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)」で、起動中のコンソールとは別のコンソールを開き、実行中のコンテナにアクセスします。
コマンドを実行すると、コンテナ内のbashが実行されます。
```terminal
$ cd bootcamp/src/server-app/test-hands-on
$ docker compose exec bootcamp-test bash
```

下記のコマンドで、テストを実行してみましょう。
```terminal
### コードは全て"/test-hands-on"配下にあります。
root@a3f5935947a2:/# cd /test-hands-on

### 任意のテストを実行します。
root@a3f5935947a2:/test-hands-on# python -m unittest -v exercises.exercise0.test_challenge
```

## 関数・テストの修正方法

「テストの実行方法」の項でテストを行うと、初回は下記のようにテストが失敗してしまいます。

```terminal
root@a3f5935947a2:/test-hands-on# python -m unittest -v exercises.exercise0.test_challenge
test_success (exercises.exercise0.test_challenge.HelloTestCase.test_success) ... FAIL

======================================================================
FAIL: test_success (exercises.exercise0.test_challenge.HelloTestCase.test_success)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/test-hands-on/exercises/exercise0/test_challenge.py", line 7, in test_success
    self.assertEqual(hello(), "hello iij-bootcamp")
AssertionError: 'hello world' != 'hello iij-bootcamp'
- hello world
+ hello iij-bootcamp


----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
```

テストコードを開いて確認してみましょう。
```terminal
$ cd bootcamp/src/server-app/test-hands-on
$ code ./exercises/exercise0/test_challenge.py
```

内容は下記のようになっており、コード内でimportしている ```hello()``` 関数に対し、文字列 "hello iij-bootcamp" が来ることを期待してテストを行っているようです。

```python
import unittest
from .challenge import hello


class HelloTestCase(unittest.TestCase):
    def test_success(self):
        self.assertEqual(hello(), "hello iij-bootcamp")
```

では次に、テスト対象である ```hello()``` 関数を見てみましょう。

```terminal
$ code ./exercises/exercise0/challenge.py
```
どうやら、この関数は文字列"hello world"を返すようです。

```python
def hello():
    return "hello world"
```

しかし、これではテストコードで期待されている関数の返り値と、実際の関数の返り値が異なってしまっています。

ちなみにテストコードは、対象の関数やインスタンスが動作したときにどういった振る舞いをするのかを具体的に表現したもの、「動く仕様書」であると考えることができます。
この考えからいくと、今回は仕様を表現している (期待値を書いている) テストコードが正であり、実装に不具合があるといえます。

それでは、テストが失敗する (期待する振る舞いになっていない) 原因である、return 値 "hello world" を "hello iij-bootcamp" に変えてみましょう。

```python
def hello():
    return "hello iij-bootcamp"
```

もう一度テストを実行してみると、先程まで失敗していたテストが成功しました。

```terminal
root@a3f5935947a2:/test-hands-on# python -m unittest -v exercises.exercise0.test_challenge
test_success (exercises.exercise0.test_challenge.HelloTestCase.test_success) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

このように、テストコードというものは、テストを実施したい関数に対して動作を確認するように作成・実行します。
そして動作に問題があれば、適宜実装を (場合によってはテストコードも) 修正していくことになります。

本講義では、テストを実施したい関数に対し、テストコードで期待する返り値を設定し、関数の動作確認を行っていきます。

ちなみに、ローカルでのコードの変更は、コンテナ内にも自動で同期されます。
以降はローカルでファイルを変更し、コンテナ内でテストを実行してみましょう。

# テストを実行する

## 同値クラス・境界値テスト

この項では「同値クラステスト」と「境界値テスト」という手法のテストを実施し、効率的なテストについて学びます。

### 同値クラステストとは
同値クラステストとは「任意の関数```g(x)```の引数```x```に対し、有効である値、無効である値のグループ（有効同値クラス、無効同値クラス）を定義してテストを実施する」ものになります。

例えば、本書の冒頭で出てきた、関数```f(x)```では、```x```の値が *0* から *100* の間であれば有効同値クラス、そうでなければ無効同値クラス、と定義できます。

```
関数fは、任意の数字xの値を取ります。
任意の数字xは、int型であり、 -2,147,483,648 から 2,147,483,647 の範囲の値を格納できます。
関数fは、与えられた数字が 0 から 100 の間であればTrue、そうでなければFalseを返却します。
```

仮に「有効同値クラス内の値が入力された場合は正常終了、無効同値クラス内の値が入力された場合は異常終了する」と見た場合、終了の仕方は「正常終了か異常終了か」の2択と見ることができます。

すなわち、関数```f(x)```に対する同値クラステストとは、有効同値である *10* , *50* , *90* など、いくつかの値のグループと、無効同値である *-500* , *-10* , *110* , *500* などの値のグループのテストを実施すればよいことになります。

### 境界値テストとは
同値クラステストでは「有効/無効と定義した値に対する処理が正しく動くか」を確認できました。

しかし、これでは「有効/無効の範囲は正しいか」が確認できていません。
こういった場合は境界値テストを実施し、有効値/無効値の境界が、正しく実行されるかのテストを行います。

本書冒頭の関数```f(x)```を例にすると、下限の境界値は *-1* , *0* 、上限の境界値は *100* , *101* となります。

### テスト実装例
本書冒頭で定義した、関数```f(x)```がPythonで以下のように定義されているとします。

`exercies/sample1/sample.py` を作成してみましょう。

```terminal
$ cd exercies/
$ mkdir sample1
$ cd sample1
$ code ./sample.py
```

```python
def f(x):
    if 0 <= x <= 100:
        return True
    else:
        return False
```

上記の関数に対し、同値クラスのテストを定義すると、下記のように書くことができます。
下記のテストでは、関数```f(x)```に有効同値クラスの値を入力すると```True```、そうでない値を入力すると```False```が返却されることを確認しています。

`exercies/sample1/test_sample.py` を作成してみましょう。
```terminal
$ code ./test_sample.py
```

```python
import unittest
from .sample import f


class ExampleTestCase(unittest.TestCase):
    def test_equivalence_partitioning(self):
        # 有効同値のテスト
        self.assertEqual(f(10), True)
        self.assertEqual(f(50), True)
        self.assertEqual(f(90), True)

        # 無効同値のテスト
        self.assertEqual(f(-500), False)
        self.assertEqual(f(-10), False)
        self.assertEqual(f(110), False)
        self.assertEqual(f(500), False)
```

境界値テストを定義すると、下記のように書くことができます。
下記のテストでは、関数```f(x)```に下限の境界値 *-1* , *0* 、上限の境界値 *100* , *101* を入力し、適宜```True```か```False```が返却されることを確認しています。
```python
import unittest
from .sample import f


class ExampleTestCase(unittest.TestCase):
    def test_equivalence_partitioning(self):
        # 有効同値のテスト
        # ... 略

        # 無効同値のテスト
        # ... 略

        # 下限の境界値
        self.assertEqual(f(-1), False)
        self.assertEqual(f(0), True)

        # 上限の境界値
        self.assertEqual(f(100), True)
        self.assertEqual(f(101), False)
```

docker コンテナ内からテスト実行してみましょう。
```terminal
root@a3f5935947a2:/test-hands-on# python -m unittest -v exercises.sample1.test_sample
test_equivalence_partitioning (exercises.sample1.test_sample1.ExampleTestCase.test_equivalence_partitioning) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

### 問題にチャレンジしよう
```exercises/exercise1/challenge.py```に、商品の申し込みを行う関数```apply(quantity)```が定義されています。

関数は以下の仕様になっています。
- この関数は、int型の引数```quantity```を取ります。
- 関数```apply()```は、10以上、100以下の値が入力されると、申し込みが成功し、文字列```"accepted"```が返却されます。
- 申し込みに失敗した場合は、文字列```"not accepted"```が返却されます。
- int型以外のデータが入力された場合、例外```TypeError()```が発生し、プログラムが異常終了します。

```exercises/exercise1/test_challenge.py```に、作成途中のテストクラス```ApplyTestCase```が定義されているため、関数```apply(quantity)```に対するテストを作成してみましょう。

## APIと関数のモック

この項では、Pythonで実行できるAPI（FastAPI）のフレームワークを使用し、APIに対するテストや、関数のモックに触れてみましょう。

### モックとは
「モックアップ」の略称であり、工業製品などの試作や、店頭展示などのためにつくられる実物大模型のことを指します。
「[goo辞書 モックアップ（mock-up）](https://dictionary.goo.ne.jp/word/%e3%83%a2%e3%83%83%e3%82%af%e3%82%a2%e3%83%83%e3%83%97/)」より

テストにおけるモックとは、主にクラスや関数の動作をシミュレートするためのオブジェクトになります。

例えば、以下のような仕様の関数```rock_paper_scissors(shoot)```があるとします。
- 関数```rock_paper_scissors(shoot)```は、じゃんけんを行う関数で、引数```shoot```は文字列"rock", "paper", "scissors"の、いずれかを取ります。
- 関数```rock_paper_scissors()```は、内部で引数に対してじゃんけんの手を出す関数```my_shoot()```が実行されます。
- 関数```my_shoot()```は、それぞれ *1/3* の確率で"rock", "paper", "scissors"のいずれかを取得します。
- 関数```rock_paper_scissors()```は、入力された引数```shoot```が、関数```my_shoot()```の返り値に勝利できる場合 *1* 、引き分けであれば *0* 、敗北であれば *-1* を返します。

上記の関数```rock_paper_scissors()```をテストする場合、内部の関数の返り値が乱数で決定されてしまうため、通常であればテストが実行できません。
（例えば、1回目の```my_shoot()```を実行した時に"rock"が返却されたとしても、2回目も"rock"が返却されるとは限らないですよね）

こういった場合、関数のモックを使用して、テスト対象の関数内で使用されているクラスや関数をモックし、返り値を固定してシミュレーションを行う必要があります。

### テスト実装例

関数```rock_paper_scissors(shoot)```が、Pythonで以下のように定義されているとします。

`exercies/sample2/sample.py` を作成してみましょう。

```terminal
$ cd exercies/
$ mkdir sample2
$ cd sample2
$ code ./sample.py
```

```python
import random


def _my_shoot():
    choices = ["rock", "paper", "scissors"]
    return random.choice(choices)


def rock_paper_scissors(shoot):
    # 1/3で"rock", "paper", "scissors"が格納される
    my_shoot_result = _my_shoot()

    # あいこ
    if shoot == my_shoot_result:
        return 0

    # 勝利
    if shoot == "rock" and my_shoot_result == "scissors":
        return 1
    if shoot == "paper" and my_shoot_result == "rock":
        return 1
    if shoot == "scissors" and my_shoot_result == "paper":
        return 1

    # 敗北
    return -1
```

上記の関数に対し、モックを使用したテストを定義すると、下記のように書くことができます。

`exercies/sample2/test_sample.py` を作成してみましょう。
```terminal
$ code ./test_sample.py
```

```python
import unittest
from unittest import mock
from . import sample

rock_paper_scissors = sample.rock_paper_scissors


class ExampleTestCase(unittest.TestCase):
    def test_rock_paper_scissors(self):
        # あいこのテスト
        with mock.patch.object(sample, '_my_shoot', return_value="rock"):
            self.assertEqual(rock_paper_scissors("rock"), 0)

        # 勝利のテスト
        with mock.patch.object(sample, '_my_shoot', return_value="scissors"):
            self.assertEqual(rock_paper_scissors("rock"), 1)

        # 敗北のテスト
        with mock.patch.object(sample, '_my_shoot', return_value="paper"):
            self.assertEqual(rock_paper_scissors("rock"), -1)
```

docker コンテナ内から実行してみましょう。
```terminal
root@a3f5935947a2:/test-hands-on# python -m unittest -v exercises.sample2.test_sample
test_rock_paper_scissors (exercises.sample2.test_sample2.ExampleTestCase.test_rock_paper_scissors) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

### FastAPIについて
IIJ Bootcamp「FastAPI でwebアプリを作る」にて紹介されているため、詳細の説明は省きます。

下記「テスト実装例」にサンプルを記載するように、簡単にAPIを実装できるフレームワークになっています。

### テスト実装例
FastAPIは、下記のようにAPIを実装できます。
下記は、ブラウザで```http://localhost:8000/hello```にアクセスすると、データ```{"response": "hello"}```を返却します。

`exercies/sample3/sample.py` を作成してみましょう。

```terminal
$ cd exercies/
$ mkdir sample3
$ cd sample3
$ code ./sample.py
```

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/hello")
async def get_hello():
    return {"response": "hello"}
```

上記のAPIに対し、HTTPステータスやレスポンスを検証するテストは、下記のように書くことができます。

`exercies/sample3/test_sample.py` を作成してみましょう。
```terminal
$ code ./test_sample.py
```

```python
import unittest
from fastapi.testclient import TestClient
from . import sample

client = TestClient(sample.app)


class ExampleTestCase(unittest.TestCase):
    def test_api(self):
        # パス"/hello"に接続する
        res = client.get("/hello")

        # HTTPステータスと、レスポンスの取得
        status = res.status_code
        data = res.json()

        # HTTPステータスと、レスポンスの検証
        self.assertEqual(status, 200)
        self.assertEqual(data, {"response": "hello"})
```

docker コンテナ内から実行してみましょう。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample3.test_sample
test_api (exercises.sample3.test_sample.ExampleTestCase.test_api) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.003s

OK
```

### 問題にチャレンジしよう
```exercises/exercise2/challenge.py```に、FastAPIと、いくつかのエンドポイントが定義されています。

上記のAPIは、コンテナから下記のコマンドで実行することができます。
```terminal
root@233072c168ae:/test-hands-on# python3 -m uvicorn exercises.exercise2.challenge:app --reload --host "0.0.0.0"
```

API実行後は、ブラウザに下記のURLを入力すると、APIにアクセスできます。
```
http://localhost:8000/
```

また、APIは下記のエンドポイントがあります。
|パス|詳細|
|---|---|
|/|```{"message": "hello world"}```が返却されます。|
|/echo/{data}|```{"message": "got the message: {data}"}```が返却されます。<br />※```{data}```は、任意の値が代入されます。|
|/gacha|```{"message": "{result}"```が返却されます。<br />※```{result}```は、 *1/100* で文字列"you win"、それ以外で文字列"you lose"が代入されます。|

```exercises/exercise2/test_challenge.py```に、作成途中のテストクラス```ApiTestCase```が定義されているため、上記の仕様のAPIに対するテストを作成してみましょう。


# おわりに

一般的にソフトウェアテストというと、専門のテスト部隊があって「Excelにスクショをペタペタ貼るだけでしょ？」というようなイメージを持ち、敬遠される方も少なくはないと思います。

開発者がテストについて知識を持ち、単体テストで可能な限りの不具合をなくしておくと、後の工程で不具合が少なく済ますことができたり、メリットがあります。
また、後の工程で発生した不具合の内容を聞いた・見ただけで、どのモジュール同士で問題が起こっているのか目星がつくなど、効率的なトラブルシュートやソフトウェアの理解にも繋がります。

冒頭でも述べましたが、ソフトウェアにも品質というものがあり、この品質次第で会社の売上に影響が出たり、企業のセキュリティや人命に影響を及ぼしてしまう懸念もあります。

そのため、開発を行う際には是非テストにも注力し、ユーザーの満足できるソフトウェアを作れるよう、目指してみてください。

良いエンジニアライフを！👍


# 付録：TDDをやってみる

TDDとは、「テスト駆動開発( *Test Driven Development* )」のことを指し「イテレーティブ (反復的) な手順」と「インクリメンタル (少しずつ着実) な設計」を組み合わせて開発を行う、反復型の **開発手法** のことになります。(※テスト手法のことではない)

## TDDのやり方

TDDは、下記のサイクルで開発を行っていきます。

0. 準備
    - 必要になりそうなテスト (実装したい振る舞い) を TODO リストとして書き出す
1. Red
    - TODO リストから 1 つ選び、テストから書き (テストファースト)、そのテストを実行して失敗させる
2. Green
    - 迅速に、テストを実行できるコードを書いてテストを通すようにする (※このとき、コードが汚くても良い)
3. Refactoring
    - Green を保ったまま、コードをきれいにする
4. フィードバック
    - *3.* まで終わったら、気付きを TODO リストに反映し、1. に戻る

上記 *1. ~ 4.* のサイクルを反復的に実行することで、自動テストによってとりあえず動くことが保証され、かつリファクタリングによってきれいになっていくコードを、少しずつ着実に作って (設計して) いきます。

## テスト実装例
例えば、以下の仕様のプログラムを作りたいとして、実際に TDD による開発を体験してみましょう。

- 実行回数が 3 の倍数なら "Fizz"、5 の倍数なら "Buzz"、両方を満たすなら "FizzBuzz" を返す
- 実行回数は内部でカウントする
- 3 でも 5 の倍数でもないカウントに対しては、そのカウント数を返す

## サイクル(1) TODOリスト

コーディングする際、何もない状態で、何も考えずにいきなりコードを書き始めることはあまり多くありません。
TDD も例外ではなく、まずはやること (TODO) リストを作るところから始めます。

愚直に整理してみると、以下のようになりそうです。

- [ ] 実行回数を内部で保持し、カウントする
- [ ] 実行すると、カウント数を返す
- [ ] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す
- [ ] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す
- [ ] 実行回数が 3 と 5 両方の倍数なら、カウント数の代わりに "FizzBuzz" を返す

TODO リストが整理できたところで、`exercises/sample4/sample.py` と `exercises/sample4/test_sample.py` を作成し、サイクル(1) に進みましょう。

```terminal
$ cd exercies/
$ mkdir sample4
$ cd sample4
$ code ./sample.py
$ code ./test_sample.py
```

## サイクル(1) Red

TODO リストから 1 つ選びます。

> - [ ] 実行すると、カウント数を返す

最初は、この仕様の実装に向けてサイクルを回してみましょう。

Red でやるべきは「失敗するテストを書く」でした。

> 1. Red
>     - TODO リストから 1 つ選び、テストから書き (テストファースト)、そのテストを実行して失敗させる

とにかく仕様をテストコードで表現してみるというのが、ここでやるべきことです。

とりあえず1回目の実行では「1」が返ってくるはずなので、テストでは「1」を期待してみます。
`FizzBuzz` クラスに、`increment_counter()` メソッドがあると仮定して、`test_sample.py` を書いてみましょう。

```python
import unittest
from .sample import FizzBuzz


class TestFizzBuzz(unittest.TestCase):
    def test_increment_counter(self):
        fizzbuzz = FizzBuzz()
        expected = fizzbuzz.increment_counter()
        self.assertEqual(expected, 1)
```

テスト実行してみると、そもそも実装がないので当然エラーになります。

```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_sample (unittest.loader._FailedTest.test_sample) ... ERROR

======================================================================
ERROR: test_sample (unittest.loader._FailedTest.test_sample)
----------------------------------------------------------------------
ImportError: Failed to import test module: test_sample
Traceback (most recent call last):
  File "/usr/local/lib/python3.12/unittest/loader.py", line 137, in loadTestsFromName
    module = __import__(module_name)
             ^^^^^^^^^^^^^^^^^^^^^^^
  File "/test-hands-on/exercises/sample4/test_sample.py", line 2, in <module>
    from .sample import FizzBuzz
ModuleNotFoundError: No module named 'exercises.sample4.sample'


----------------------------------------------------------------------
Ran 1 test in 0.000s

FAILED (errors=1)
```

## サイクル(1) Green

次は「とりあえず動くコード」を目指します。

> 2. Green
>     - 迅速に、テストを実行できるコードを書いてテストを通すようにする (※このとき、コードが汚くても良い)


とにかくテストを通すようなコードを最短距離で書くというのが、ここでやるべきことです。

テストでは 1 が返却されることを期待していますので、`sample.py` に実装を書いて、1 を返すようにしてみましょう。

```python
class FizzBuzz:
    def increment_counter(self):
        return 1
```

テスト実行してみると、成功するようになりました。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(1) Refactoring

> 3. Refactoring
>     - Green を保ったまま、コードをきれいにする

次は、「動作するきれいなコード」を目指します。
今回、あまり直すところはないですが、テストコードに一部冗長なところがあるのでインライン化してみましょう。

```python
import unittest
from .sample import FizzBuzz


class TestFizzBuzz(unittest.TestCase):
    def test_increment_counter(self):
        fizzbuzz = FizzBuzz()
        self.assertEqual(fizzbuzz.increment_counter(), 1)  # expected をインライン化
```

テスト実行してみると、成功したままなので OK です。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(1) フィードバック

TODO リストを見直してみると、サイクル(1) を回しきったことで仕様を満たせているものはなさそうですが、とりあえずの仮実装はできていそうです。

- [ ] 実行回数を内部で保持し、カウントする
- [ ] 実行すると、カウント数を返す
  - [x] とりあえず 1 を返す (仮実装)
- [ ] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す
- [ ] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す
- [ ] 実行回数が 3 と 5 両方の倍数なら、カウント数の代わりに "FizzBuzz" を返す

では、次のサイクルにいきましょう。

## サイクル(2) Red

2サイクル目に来ました。

引き続き、`increment_counter()` の実装を進めていきます。
> - [ ] 実行すると、カウント数を返す

実行回数毎にカウントアップする仕様ですから、何度か実行してみて、期待する値を増加させてみましょう。

```python
import unittest
from .sample import FizzBuzz


class TestFizzBuzz(unittest.TestCase):
    def test_increment_counter(self):
        fizzbuzz = FizzBuzz()
        self.assertEqual(fizzbuzz.increment_counter(), 1)
        self.assertEqual(fizzbuzz.increment_counter(), 2)
        self.assertEqual(fizzbuzz.increment_counter(), 3)
        self.assertEqual(fizzbuzz.increment_counter(), 4)
        self.assertEqual(fizzbuzz.increment_counter(), 5)
        self.assertEqual(fizzbuzz.increment_counter(), 6)
        self.assertEqual(fizzbuzz.increment_counter(), 7)
        self.assertEqual(fizzbuzz.increment_counter(), 8)
        self.assertEqual(fizzbuzz.increment_counter(), 9)
        self.assertEqual(fizzbuzz.increment_counter(), 10)
        self.assertEqual(fizzbuzz.increment_counter(), 11)
        self.assertEqual(fizzbuzz.increment_counter(), 12)
        self.assertEqual(fizzbuzz.increment_counter(), 13)
        self.assertEqual(fizzbuzz.increment_counter(), 14)
        self.assertEqual(fizzbuzz.increment_counter(), 15)
```


テスト実行してみると、対応する実装がないので失敗しました。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... FAIL

======================================================================
FAIL: test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/test-hands-on/exercises/sample4/test_sample.py", line 9, in test_increment_counter
    self.assertEqual(fizzbuzz.increment_counter(), 2)
AssertionError: 1 != 2

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
```

## サイクル(2) Green

「とりあえず動くコード」を目指し、書いてみます。一例として、以下のような実装になりそうです。

```python
class FizzBuzz:
    count = 0

    def increment_counter(self):
        FizzBuzz.count += 1
        return FizzBuzz.count
```

テスト実行してみると、成功しました。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(2) Refactoring

現在の `FizzBuzz` はクラス変数というものを利用しています。
設計にもよりますが、インスタンス間で値を共有させないようにするのが一般的でしょう。

python では `__init__` メソッドを使うことで、インスタンス生成時に保持させる、インスタンス変数を定義することができます。これを使うと、基本的にはインスタンス間での値の共有はできなくなります。

```python
class FizzBuzz:
    def __init__(self):
        self.count = 0

    def do(self):
        self.count += 1
        return self.count
```

テスト実行してみると、成功したままなので OK です。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(2) フィードバック

TODO リストを見直してみると、カウント数を返す実装はできていそうです。

また、リファクタリングをしたことで、`increment_counter()` の外側にインスタンス変数としてカウント変数を保持させることができるようになりました。

- [x] 実行回数を内部で保持し、カウントする
- [x] 実行すると、カウント数を返す
  - [x] とりあえず 1 を返す (仮実装)
- [ ] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す
- [ ] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す
- [ ] 実行回数が 3 と 5 両方の倍数なら、カウント数の代わりに "FizzBuzz" を返す

では、次のサイクルにいきましょう。

## サイクル(3) Red

3 サイクル目です。次は、以下の仕様を実装してみましょう。

> - [ ] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す

失敗するテストを書きます。

```python
import unittest
from .sample import FizzBuzz


class TestFizzBuzz(unittest.TestCase):
    def test_increment_counter(self):
        fizzbuzz = FizzBuzz()
        self.assertEqual(fizzbuzz.increment_counter(), 1)
        self.assertEqual(fizzbuzz.increment_counter(), 2)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 4)
        self.assertEqual(fizzbuzz.increment_counter(), 5)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 7)
        self.assertEqual(fizzbuzz.increment_counter(), 8)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 10)
        self.assertEqual(fizzbuzz.increment_counter(), 11)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 13)
        self.assertEqual(fizzbuzz.increment_counter(), 14)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")

```

予想通り、テストは失敗しますね。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... FAIL

======================================================================
FAIL: test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/test-hands-on/exercises/sample4/test_sample.py", line 10, in test_increment_counter
    self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
AssertionError: 3 != 'Fizz'

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
```

## サイクル(3) Green

さて、"Fizz" を返せるようにコードを修正しましょう。

```python
class FizzBuzz:
    def __init__(self):
        self.count = 0

    def increment_counter(self):
        self.count += 1
        if self.count % 3 == 0:
            return "Fizz"

        return self.count
```

テストも問題なしです。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(3) Refactoring

このサイクルで書いたコードは、特にリファクタリング箇所もなさそうなのでスキップします。

## サイクル(3) フィードバック

サイクル(3) では、"Fizz" を返す実装ができました。

- [x] 実行回数を内部で保持し、カウントする
- [x] 実行すると、カウント数を返す
  - [x] とりあえず 1 を返す (仮実装)
- [x] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す
- [ ] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す
- [ ] 実行回数が 3 と 5 両方の倍数なら、カウント数の代わりに "FizzBuzz" を返す

## サイクル(4) Red

4 サイクル目です。次は、以下の仕様を実装してみましょう。

> - [ ] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す

`15` の部分については、"FizzBuzz" としていることに注意してください。

```python
import unittest
from .sample import FizzBuzz


class TestFizzBuzz(unittest.TestCase):
    def test_increment_counter(self):
        fizzbuzz = FizzBuzz()
        self.assertEqual(fizzbuzz.increment_counter(), 1)
        self.assertEqual(fizzbuzz.increment_counter(), 2)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 4)
        self.assertEqual(fizzbuzz.increment_counter(), "Buzz")
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 7)
        self.assertEqual(fizzbuzz.increment_counter(), 8)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), "Buzz")
        self.assertEqual(fizzbuzz.increment_counter(), 11)
        self.assertEqual(fizzbuzz.increment_counter(), "Fizz")
        self.assertEqual(fizzbuzz.increment_counter(), 13)
        self.assertEqual(fizzbuzz.increment_counter(), 14)
        self.assertEqual(fizzbuzz.increment_counter(), "FizzBuzz")
```

少しずつ、Red, Green, Refactoring のサイクルの感覚は掴めてきたでしょうか。
このテストは当然失敗し、次の Green ではそれを成功に導くわけですね。

分割統治法で 1 つずつ確実に課題をクリアしていく面白さを実感してもらえればなと思います。

```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... FAIL

======================================================================
FAIL: test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/test-hands-on/exercises/sample4/test_sample.py", line 12, in test_increment_counter
    self.assertEqual(fizzbuzz.increment_counter(), "Buzz")
AssertionError: 5 != 'Buzz'

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
```

## サイクル(4) Green
"Buzz"および"FizzBuzz"を返せるようにしましょう。

```python
class FizzBuzz:
    def __init__(self):
        self.count = 0

    def increment_counter(self):
        self.count += 1
        if self.count % 3 == 0 and self.count % 5 == 0:
            return "FizzBuzz"
        if self.count % 3 == 0:
            return "Fizz"
        if self.count % 5 == 0:
            return "Buzz"

        return self.count
```

テストも成功します。
```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(4) Refactoring

最後のリファクタリングになります。

`if self.count % 3 == 0 and self.count % 5 == 0` も誤りではないですが、もう少しきれいに書けそうです。

```python
class FizzBuzz:
    def __init__(self):
        self.count = 0

    def increment_counter(self):
        self.count += 1
        if self.count % 15 == 0:
            return "FizzBuzz"
        if self.count % 3 == 0:
            return "Fizz"
        if self.count % 5 == 0:
            return "Buzz"

        return self.count
```

```terminal
root@233072c168ae:/test-hands-on# python -m unittest -v exercises.sample4.test_sample
test_increment_counter (exercises.sample4.test_sample.TestFizzBuzz.test_increment_counter) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## サイクル(4) フィードバック

当初、"Buzz" を返す実装だけやるつもりでしたが、"FizzBuzz" を返す実装も同時にできましたね。

- [x] 実行回数を内部で保持し、カウントする
- [x] 実行すると、カウント数を返す
  - [x] とりあえず 1 を返す (仮実装)
- [x] 実行回数が 3 の倍数なら、カウント数の代わりに "Fizz" を返す
- [x] 実行回数が 5 の倍数なら、カウント数の代わりに "Buzz" を返す
- [x] 実行回数が 3 と 5 両方の倍数なら、カウント数の代わりに "FizzBuzz" を返す

これで全て完了です！

## 問題にチャレンジしよう
```exercises/exercise3/challenge.py```には、FastAPIで書かれた作りかけのAPIがあります。

上記のAPIは、コンテナから下記のコマンドで実行することができます。
```terminal
root@233072c168ae:/test-hands-on# python3 -m uvicorn exercises.exercise3.challenge:app --reload --host "0.0.0.0"
```

API実行後は、ブラウザに下記のURLを入力すると、APIにアクセスできます。
```
http://localhost:8000/
```

TDD を使って、上記のAPIを完成させてみましょう。
API 仕様は、以下になります。
- `/`, `/add`, `/sub`, `/mul`, `/div` の5つのエンドポイントがある
- 内部で int 型の値を保持し、現在設定されている値を、`/` にアクセスすることで確認できる (また、値は 0 とする)
- `/add`, `/sub`, `/mul`, `/div` にパスパラメータを与えると、保持されている値に対し、四則演算を行う（後述）
- 計算は全て int 型で行う

また、各パスの詳細な仕様な以下の通りです:

|パス|詳細|
|---|---|
|/|```{"current_number": {数値}}```が返却されます。<br />{数値}には、サーバで保持されている値が入ります。
|/add/{data}|```{"current_number": {数値}}```が返却されます。<br />{data}に渡された値をサーバで保持している値に加算します。|
|/sub/{data}|```{"current_number": {数値}}```が返却されます。<br />{data}に渡された値をサーバで保持している値から減算します。|
|/mul/{data}|```{"current_number": {数値}}```が返却されます。<br />{data}に渡された値をサーバで保持している値に乗算します。|
|/div/{data}|```{"current_number": {数値}}```が返却されます。<br />{data}に渡された値をサーバで保持している値から除算します。|

サーバでの値の保持・取得関数は、コード内に定義されています。
以下に、使い方の例を記載します。
```python
# サーバ内に保持されている値を記録します。
set_current_number(1)

# サーバ内に保持されている値を取得します
got_data = get_current_number()
print(got_data)  # -> 1

set_current_number(123 + 456)
got_data = get_current_number()
print(got_data)  # -> 579
```

`exercises/exercise3/test_challenge.py` には、本APIが完成すると通るようになる、テスト```test_success()```が定義されています。

上記のテストがOKになるよう、各種APIをTDDを使って作成してみましょう。　

<credit-footer/>
