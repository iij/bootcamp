---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

# Ansible による IT自動化

- [Ansible による IT自動化](#ansible-による-it自動化)
  - [はじめに](#はじめに)
    - [本講義で扱うこと](#本講義で扱うこと)
    - [本講義で扱わないこと](#本講義で扱わないこと)
    - [演習環境](#演習環境)
    - [システム構成](#システム構成)
  - [0. 事前準備](#0-事前準備)
  - [1. Ansible 概要と導入](#1-ansible-概要と導入)
  - [2. インベントリの作成](#2-インベントリの作成)
  - [3. Ansible 設定ファイルの管理](#3-ansible-設定ファイルの管理)
  - [4. Ansible playbook の作成](#4-ansible-playbook-の作成)
  - [5. Ansible によるサーバセットアップ](#5-ansible-によるサーバセットアップ)
  - [6. 変数やループ処理の実行](#6-変数やループ処理の実行)
  - [7. 正しい Playbook を書くために](#7-正しい-playbook-を書くために)


## はじめに

この講義ではハンズオン形式で Ansible について学びます。

講義を受けるにあたり、事前に環境準備が必要です。
講義当日までに**0.事前準備**を終え、Dockerが実行可能な環境を整えてください。
ハンズオン用の教材は[こちら](https://github.com/iij/ansible-exercise)になります。


### 本講義で扱うこと

- Ansibleの概要と基本操作
- Ansibleのインストールとセットアップ
- インベントリ・設定ファイル・Playbookの作成と管理
- サーバ構築・設定の自動化
- 変数やループ処理の活用

### 本講義で扱わないこと

- `ansible-navigator`の活用
- Ansible CICD
- Ansible モジュール/プラグインの開発
- Ansible Automation Platform全般

### 演習環境

本講義では主に`Visual Studio Code (VS Code)`を利用して演習を進めます。  
他のエディタ（vim等）でも問題ありませんが、講師の説明はVS Codeを前提としています。  
VS Code以外を利用する場合は、適宜読み替えてください。

この項では、Ansibleコンソールコンテナへのログイン・ログアウト方法についても解説します。  
演習中は何度もコンテナへログインする場面がありますので、手順を覚えておきましょう。

#### コンテナへのログイン方法

- Ansibleコンソールコンテナへログインするには、以下のコマンドを実行します。

  ```bash
  docker exec -it iijbootcamp_ansible_console bash
  ```

- ログイン後のプロンプト例

  ```bash
  [root@ansibleconsole ansible]#
  ```

#### 他のコンテナへのログイン方法

- 他のコンテナへログインしたい場合は、対象コンテナ名を指定して同様に `docker exec` コマンドを利用します。

  ```bash
  docker exec -it <コンテナ名> bash
  ```

- 対象となるコンテナ名は、以下のコマンドで確認できます。

  ```bash
  docker ps
  ```

  このコマンドで現在起動中のコンテナ一覧が表示されます。`NAMES`列がコンテナ名です。

#### コンテナからのログアウト方法

- コンテナ内からログアウトするには、`exit` コマンドを入力します。

  ```bash
  exit
  ```

- ログアウトすると、元のホスト環境（PCのシェル）に戻ります。


### システム構成

このハンズオンでは、複数のDockerコンテナを仮想的なVMとして扱い、演習を進めます。  
下記は演習環境のネットワーク構成図です。

![ネットワーク図](./images/network.drawio.png)

演習では、図中の `console` コンテナから各ホストを管理します。

## 0. 事前準備

[ハンズオン用の教材](https://github.com/iij/ansible-exercise)を参照し
READMEに従ってansible演習環境のセットアップを行ってください。

## 1. Ansible 概要と導入

Ansibleの概要とインストール方法について学びます

- [Ansible 概要](./INTRODUCTION.md)

## 2. インベントリの作成

Ansibleインベントリの概念とインベントリファイルの作成方法を学びます
- [インベントリの作成](./CREATE_INVENTORY.md)

## 3. Ansible playbook の作成

Ansibleの動作仕様や設定ファイルの管理方法について学びます。
- [Ansible playbookの作成](./CREATE_PLAYBOOK.md)

## 4. Ansible によるサーバセットアップ

Playbookを使って実際にサーバの構築・設定を自動化します。
- [Ansible によるサーバセットアップ](./CREATE_SERVER.md)

## 5. Ansible 設定ファイルの管理

Ansibleの動作仕様や設定ファイルの管理方法について学びます。
- [Ansible 設定ファイルの管理](./MANAGE_SETTINGS.md)

## 6. 変数やループ処理の実行

Playbookで変数やループ処理を活用し、Webサーバの構築を体験します。
- [変数やループ処理の実行](./USE_VARIABLE.md)

## 7. 正しい Playbook を書くために

保守性・可読性の高いPlaybookを書くためのポイントを学びます。
- [正しい Playbook を書くために](./ANSIBLE_CODE_STYLE.md)

<credit-footer/>
