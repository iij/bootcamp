---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: テストプログラミング ハンズオン
description: 開発を行う際に覚えておくと非常に便利なテストを伝授します。
time: 1h
prior_knowledge: Python3
---

<header-table/>

# {{$page.frontmatter.title}}

## 目次
- [目次](#目次)
- [概論](#概論)
  - [なぜテストを行うのか](#なぜテストを行うのか)
  - [いつテストを作るのか](#いつテストを作るのか)
- [準備](#準備)
  - [dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)
  - [テストの実行](#テストの実行)
- [テストを実行する](#テストを実行する)
  - [同値クラス・境界値テスト](#同値クラス境界値テスト)
  - [APIと関数のモック](#apiと関数のモック)
  - [TDDをやってみる](#tddをやってみる)
  - [おまけ問題](#おまけ問題)
- [おわりに](#おわりに)

## 概論

### なぜテストを行うのか
- _

- 例えば、あるプロダクトに使用される、以下のような仕様の関数```f(x)```があるとします。
  - 関数```f```は、任意の数字```x```の値を取ります。
  - 任意の数字```x```は、int型であり、*-2,147,483,648*から*2,147,483,647*の範囲の値を格納できます。
  - 関数```f```は、与えられた数字が*0*から*100*の間であれば```True```、そうでなければ```False```を返却します。
- 上記の```f(x)```の挙動を完璧に確かめるためには、およそ*4,294,967,296*件のテストを行わなければなりません。
- しかし、実際のプロダクトを作成する場合、1つの関数に対し40億回もテストを実施してしまうと、プロダクトの売上以上に人件費や計算機の運用コストがかかってしまい、会社は倒産の危機に瀕してしまいます。
- そのため、後述する「同値クラス・境界値テスト」などの手法によって、最低限かつ最適な回数でテストを行うことが求められます。

### いつテストを作るのか
- _

## 準備

### dockerコンテナの立ち上げ方

- 下記のコマンドでdockerコンテナを立ち上げます。

```bash
$ docker-compose up --build
```

### テストの実行

- 下記のコマンドで、任意の「[テストを実行する](#テストを実行する)」の項のテストを実行します。
- まずは「[dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)」で起動中のコンソールとは別のコンソールを開き、実行中のコンテナにアクセスします。
- ちなみに、ローカルのソースファイルの変更は、コンテナ内にも自動で同期されます。

```bash
$ docker exec -it test-hands-on_bootcamp-test_1 bash
```

- 上記のコマンドを実行すると、コンテナ内のbashが実行されます。
- 下記のコマンドで、試しにテストを実行してみましょう。
```bash
# ソースは全て"/test-hands-on"配下にあります。
$ cd /test-hands-on

# 任意のテストを実行します。
# 以下では「同値クラス・境界値テスト」のテストを実行します。
python -m unittest -v exercises.exercise1.test_challenge
```

- 上手くいくと、下記のようにテストが「OK」と表示されます。
- また、コマンド内の「exercise1」のパッケージ名を変更することで、テストの対象を変更することができます。
```bash
test_boundary_value (exercises.exercise1.test_challenge.ApplyTestCase) ... ok
test_catch_typeerror (exercises.exercise1.test_challenge.ApplyTestCase) ... ok
test_equivalence_partitioning (exercises.exercise1.test_challenge.ApplyTestCase) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.001s

OK
```

## テストを実行する

### 同値クラス・境界値テスト
- この項では「同値クラステスト」と「境界値テスト」について説明します。

#### 同値クラステストとは
- 同値クラステストとは「任意の関数```g(x)```の引数```x```に対し、有効である値、無効である値のグループ（有効同値クラス、無効同値クラス）を定義してテストを実施する」ものになります。
- 例えば、本書の冒頭で出てきた、関数```f(x)```では、```x```の値が*0*から*100*の間であれば有効、そうでなければ無効、と定義できます。
- 仮に「有効同値クラス内の値が入力された場合は正常終了、無効同値クラス内の値が入力された場合は異常終了する」と見た場合、終了の仕方は「正常終了か異常終了か」の2択と見ることができます。
- すなわち、関数```f(x)```に対する同値クラステストとは、有効同値である*10*, *50*, *90*など、いくつかの値のグループと、無効同値である *-500*, *-10*, *110*, *500*などの値のグループのテストを実施すればよいことになります。

#### 境界値テストとは
- 同値クラステストでは「有効/無効と定義した値に対する処理が正しく動くか」を確認できました。
- しかし、これでは「有効と定義した値に対し、有効値に対する処理が正しく実行されるか」が確認できていません。
- こういった場合は境界値テストを実施し、有効値/無効値の境界が、正しく実行されるかのテストを行います。
- 本書冒頭の関数```f(x)```では、境界値は *-1*, *0*, *100*, *101*となります。


#### テスト実装例
- 本書冒頭で定義した、関数```f(x)```がPythonで以下のように定義されてiいるとします。
```python
def f(x):
  if 0 <= x <= 100:
    return True
  else:
    return False
```


- 上記の関数に対し、同値クラスのテストを定義すると、下記のように書くことができます。
- 下記のテストでは、関数```f(x)```に有効同値クラスの値を入力すると```True```、そうでない値を入力すると```False```が返却されることを確認しています。
```python
import unittest

class FxTestCase(unittest.TestCase):
    def test_equivalence_partitioning(self):
        # 有効同値のテスト
        self.assertEqual(fx(10), True)
        self.assertEqual(fx(50), True)
        self.assertEqual(fx(90), True)

        # 無効同値のテスト
        self.assertEqual(fx(-500), False)
        self.assertEqual(fx(-10), False)
        self.assertEqual(fx(110), False)
        self.assertEqual(fx(500), False)
```


- 境界値テストを定義すると、下記のように書くことができます。
- 下記のテストでは、関数```f(x)```に下限の境界値*-1*, *0*、上限の境界値*100*, *101*を入力し、適宜```True```か```False```が返却されることを確認しています。
```python
import unittest

class FxTestCase(unittest.TestCase):
    def test_equivalence_partitioning(self):
        # 下限の境界値
        self.assertEqual(fx(-1), False)
        self.assertEqual(fx(0), True)

        # 上限の境界値
        self.assertEqual(fx(100), True)
        self.assertEqual(fx(101), False)
```


#### 問題にチャレンジしよう
- dockerコンテナ内の```/test-hands-on/exercises/exercise1/challenge.py```に、何かの申し込みを行う関数```apply(quantity)```が定義されています。
関数は以下の仕様になっています。
  - この関数は、int型の引数```quantity```を取ります。
  - 関数```apply()```は、10以上、100以下の値が入力されると、申し込みが成功し、文字列```"accepted"```が返却されます。
  - 申し込みに失敗した場合は、文字列```"not accepted"```が返却されます。
  - int型以外のデータが入力された場合、例外```TypeError()```が発生し、プログラムが異常終了します。
- dockerコンテナ内の```/test-hands-on/exercises/exercise1/test_challenge.py```に、作成途中のテストクラス```ApplyTestCase```が定義されているため、関数```apply(quantity)```に対するテストを作成してみましょう。



### APIと関数のモック


#### 例題
ここに例題を書く

#### 問題
ここに問題を書く


### TDDをやってみる


#### 問題
ここに問題を書く

## おわりに

<credit-footer/>
