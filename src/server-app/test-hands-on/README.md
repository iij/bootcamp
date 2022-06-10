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
- [はじめに](#はじめに)
- [準備](#準備)
  - [dockerコンテナの立ち上げ方](#dockerコンテナの立ち上げ方)
  - [テストの実行](#テストの実行)
- [テストを実行する](#テストを実行する)
  - [同値クラス・境界値テスト](#同値クラス境界値テスト)
  - [APIと関数のモック](#apiと関数のモック)
  - [TDDをやってみる](#tddをやってみる)
  - [おまけ問題](#おまけ問題)
- [おわりに](#おわりに)

## はじめに
※ ここに単体テストの概要を書く

## 準備

### dockerコンテナの立ち上げ方

下記のコマンドでdockerコンテナを立ち上げます。

```bash
$ docker build -t bootcamp-test .
$ docker run -it  bootcamp-test
```

下記のコマンドで、実行したコンテナにアクセスします。

```bash
$ docker exec -it bootcamp-test bash
```

### テストの実行

下記のコマンドで、任意の「[テストを実行する](#テストを実行する)」の項のテストを実行します。

```bash
# ソースは全て"/test-hands-on"配下にあります。
$ cd /test-hands-on
# 「テストを実行する」のソースがある階層へ移動します。
cd exercises

# 任意のテストを実行します。
# 以下では「同値クラス・境界値テスト」のテストを実行します。
python -m unittest -v exercise1.test_challenge
```

## テストを実行する

### 同値クラス・境界値テスト
同値クラス・境界値テストの説明

#### 例題
ここに例題を書く

#### 問題
ここに問題を書く


### APIと関数のモック


#### 例題
ここに例題を書く

#### 問題
ここに問題を書く


### TDDをやってみる

#### 例題
ここに例題を書く

#### 問題
ここに問題を書く

## おわりに

<credit-footer/>
