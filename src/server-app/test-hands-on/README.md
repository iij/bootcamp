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
- [おわりに](#おわりに)

## 概論

### なぜテストを行うのか
- _


例えば、あるプロダクトに使用される、以下のような仕様の関数```f(x)```があるとします。  
- 関数```f```は、任意の数字```x```の値を取ります。
- 任意の数字```x```は、int型であり、 *-2,147,483,648* から *2,147,483,647* の範囲の値を格納できます。
- 関数```f```は、与えられた数字が *0* から *100* の間であれば```True```、そうでなければ```False```を返却します。

上記の```f(x)```の挙動を100%確かめるためには、 *4,294,967,296* 件のテストを行わなければなりません。  
しかし、実際のプロダクトを作成する場合、1つの関数に対し40億回もテストを実施してしまうと、プロダクトの売上以上に人件費や計算機の運用コストがかかってしまい、会社は倒産の危機に瀕してしまいます。  
  
そのため、後述する「同値クラス・境界値テスト」などの手法によって、最低限かつ最適な回数でテストを行うことが求められます。  

### いつテストを作るのか
WIP  
  

## 準備

### dockerコンテナの立ち上げ方

下記のコマンドでdockerコンテナを立ち上げます。  

```bash
$ docker-compose up --build
```


### テストの実行方法

この項では、任意の「[テストを実行する](#テストを実行する)」の項のテストを実行します。  
  
  
「[dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)」で、起動中のコンソールとは別のコンソールを開き、実行中のコンテナにアクセスします。  
コマンドを実行すると、コンテナ内のbashが実行されます。  
```bash
$ docker exec -it test-hands-on_bootcamp-test_1 bash
```

下記のコマンドで、テストを実行してみましょう。  
```bash
# ソースは全て"/test-hands-on"配下にあります。
$ cd /test-hands-on

# 任意のテストを実行します。
# 以下では「同値クラス・境界値テスト」のテストを実行します。
$ python -m unittest -v exercises.exercise1.test_challenge
```


上手くいくと、下記のようにテストが「OK」と表示されます。  
また、コマンド内の「exercise1」のパッケージ名を変更することで、テストの対象を変更することができます。  
```bash
test_boundary_value (exercises.exercise1.test_challenge.ApplyTestCase) ... ok
test_catch_typeerror (exercises.exercise1.test_challenge.ApplyTestCase) ... ok
test_equivalence_partitioning (exercises.exercise1.test_challenge.ApplyTestCase) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.001s

OK
```
ちなみに、ローカルのソースファイルの変更は、コンテナ内にも自動で同期されます。  
以降はローカルでファイルを変更し、コンテナ内でテストを実行してみましょう。  

## テストを実行する

### 同値クラス・境界値テスト

この項では「同値クラステスト」と「境界値テスト」という手法のテストを実施し、効率的なテストについて学びます。

#### 同値クラステストとは
同値クラステストとは「任意の関数```g(x)```の引数```x```に対し、有効である値、無効である値のグループ（有効同値クラス、無効同値クラス）を定義してテストを実施する」ものになります。  
  
例えば、本書の冒頭で出てきた、関数```f(x)```では、```x```の値が *0* から *100* の間であれば有効、そうでなければ無効、と定義できます。  
仮に「有効同値クラス内の値が入力された場合は正常終了、無効同値クラス内の値が入力された場合は異常終了する」と見た場合、終了の仕方は「正常終了か異常終了か」の2択と見ることができます。  
  
すなわち、関数```f(x)```に対する同値クラステストとは、有効同値である *10* , *50* , *90* など、いくつかの値のグループと、無効同値である *-500* , *-10* , *110* , *500* などの値のグループのテストを実施すればよいことになります。  
  
  
#### 境界値テストとは
同値クラステストでは「有効/無効と定義した値に対する処理が正しく動くか」を確認できました。  
  
しかし、これでは「有効/無効の範囲は正しいか」が確認できていません。  
こういった場合は境界値テストを実施し、有効値/無効値の境界が、正しく実行されるかのテストを行います。  
  
本書冒頭の関数```f(x)```では、境界値は *-1* , *0* , *100* , *101* となります。  


#### テスト実装例
本書冒頭で定義した、関数```f(x)```がPythonで以下のように定義されているとします。  
```python
def f(x):
  if 0 <= x <= 100:
    return True
  else:
    return False
```
  
  
上記の関数に対し、同値クラスのテストを定義すると、下記のように書くことができます。  
下記のテストでは、関数```f(x)```に有効同値クラスの値を入力すると```True```、そうでない値を入力すると```False```が返却されることを確認しています。  
```python
import unittest

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

class ExampleTestCase(unittest.TestCase):
    def test_equivalence_partitioning(self):
        # 下限の境界値
        self.assertEqual(f(-1), False)
        self.assertEqual(f(0), True)

        # 上限の境界値
        self.assertEqual(f(100), True)
        self.assertEqual(f(101), False)
```


#### 問題にチャレンジしよう
dockerコンテナ内の```/test-hands-on/exercises/exercise1/challenge.py```に、何かの申し込みを行う関数```apply(quantity)```が定義されています。  
関数は以下の仕様になっています。  
- この関数は、int型の引数```quantity```を取ります。
- 関数```apply()```は、10以上、100以下の値が入力されると、申し込みが成功し、文字列```"accepted"```が返却されます。
- 申し込みに失敗した場合は、文字列```"not accepted"```が返却されます。
- int型以外のデータが入力された場合、例外```TypeError()```が発生し、プログラムが異常終了します。
dockerコンテナ内の```/test-hands-on/exercises/exercise1/test_challenge.py```に、作成途中のテストクラス```ApplyTestCase```が定義されているため、関数```apply(quantity)```に対するテストを作成してみましょう。  


### APIと関数のモック

この項では、Pythonで実行できるAPI（fatsapi）のフレームワークを使用し、APIに対するテストや、関数のモックに触れてみましょう。

#### モックとは
「モックアップ」の略称であり、工業製品などの試作や、店頭展示などのためにつくられる実物大模型のことを指します。  
「[goo辞書 モックアップ（mock-up）](https://dictionary.goo.ne.jp/word/%e3%83%a2%e3%83%83%e3%82%af%e3%82%a2%e3%83%83%e3%83%97/)」より  
  
テストにおけるモックとは、主にクラスや関数の動作をシミュレートするためのオブジェクトになります。  
  
例えば、以下のような仕様の関数```rock_paper_scissors(shoot)```があるとします。
- 関数```rock_paper_scissors(shoot)```は、じゃんけんを行う関数で、引数```shoot```は文字列"rock", "paper", "scissors"の、いずれかを取ります。
- 関数```rock_paper_scissors()```は、引数に対してじゃんけんの手を出す関数```my_shoot()```が実行されます。
- 関数```my_shoot()```は、それぞれ *1/3* の確率で"rock", "paper", "scissors"のいずれかを取得します。
- 関数```rock_paper_scissors()```は、入力された引数```shoot```に対して、関数```my_shoot()```の返り値に勝利できる場合 *1* 、引き分けであれば *0* 、敗北であれば *-1* を返します。

上記の関数```rock_paper_scissors()```をテストする場合、内部の関数の返り値が乱数で決定されてしまうため、通常であればテストが実行できません。  
（例えば、1回目の```my_shoot()```を実行した時に"rock"が返却されたとしても、2回目も"rock"が返却されるとは限らないですよね）  
  
こういった場合、関数のモックを使用して、テスト対象の関数内で使用されているクラスや関数をモックし、返り値を固定してシミュレーションを行う必要があります。  
  
#### テスト実装例
関数```rock_paper_scissors(shoot)```が、Pythonで以下のように定義されているとします。  
```python
def rock_paper_scissors(shoot):
  # 1/3で"rock", "paper", "scissors"が格納される
  my_shoot_result = my_shoot()

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
```python
import unittest
from unittest import mock
# 関数rock_paper_scissors(), my_shoot()は、exampleパッケージに含まれているとする
from . import example


class ExampleTestCase(unittest.TestCase):
    def test_rock_paper_scissors(self):
        # あいこのテスト
        with mock.patch.object(example, 'my_shoot', return_value="rock"):
            self.assertEqual(rock_paper_scissors("rock"), 0)
        
        # 勝利のテスト
        with mock.patch.object(example, 'my_shoot', return_value="scissors"):
            self.assertEqual(rock_paper_scissors("rock"), 1)

        # 敗北のテスト
        with mock.patch.object(example, 'my_shoot', return_value="paper"):
            self.assertEqual(rock_paper_scissors("rock"), 1)
```

#### FastAPIについて
IIJ Bootcamp「FastAPI でwebアプリを作る」にて紹介されているため、詳細の説明は省きます。
  
下記「テスト実装例」にサンプルを記載するように、簡単にAPIを実装できるフレームワークになっています。
  
#### テスト実装例
FastAPIは、下記のようにAPIを実装できます。  
下記は、ブラウザで```http://localhost:8000/hello```にアクセスすると、データ```{"response": "hello"}```を返却します。
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def get_hello():
    return {"response": "hello"}
```

上記のAPIに対し、HTTPステータスやレスポンスを検証するテストは、下記のように書くことができます。
```python
import unittest


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

#### 問題にチャレンジしよう
dockerコンテナ内の```/test-hands-on/exercises/exercise2/challenge.py```に、FastAPIと、いくつかのエンドポイントが定義されています。  
  
上記のAPIは、コンテナから下記のコマンドで実行することができます。  
```bash
$ python3 -m uvicorn exercises.exercise2.challenge:app --reload --host "0.0.0.0"
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

dockerコンテナ内の```/test-hands-on/exercises/exercise2/test_challenge.py```に、作成途中のテストクラス```ApiTestCase```が定義されているため、上記の仕様のAPIに対するテストを作成してみましょう。  


### TDDをやってみる

#### テスト実装例

#### 問題にチャレンジしよう
ここに問題を書く


## おわりに

<credit-footer/>
