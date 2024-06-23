---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
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

- Ansible概論
- Ansibleの導入
- Ansibleの実行

### 本講義で扱わないこと

- `ansible-navigator`の活用
- Ansible CICD
- Ansible モジュール/プラグインの開発
- Ansible Automation Platform全般

### 演習環境

本講義では`vscode` を使って演習を行います。
vim等による開発でも問題ありませんが、講義においては講師の環境を`vscode`にて説明を行うため、
vscode以外で開発を行う場合は適宜自身で読み替えてください。

### システム構成

この講義で使用するコンテナのネットワーク図です。
コンテナを VM（Virtual Machine）に見立て、ハンズオンを実施します。

![ネットワーク図](./images/network.drawio.png)

この講義では図中の `console` コンテナから各ホストを管理します。

## 0. 事前準備

[ハンズオン用の教材](https://github.com/iij/ansible-exercise)を参照し
READMEに従ってansible演習環境のセットアップを行ってください。

## 1. Ansible 概要と導入

Ansibleの概要とインストール方法について学びます

- [Ansible 概要](./INTRODUCTION.md)

## 2. インベントリの作成

Ansibleインベントリの概念とインベントリファイルの作成方法を学びます
- [インベントリの作成](./CREATE_INVENTORY.md)

## 3. Ansible 設定ファイルの管理

Ansibleの基本動作仕様とその変更方法について学びます
- [Ansible 設定ファイルの管理](./MANAGE_SETTINGS.md)

## 4. Ansible playbook の作成

Ansible playbookの概念と作成方法を学びます
- [Ansible playbookの作成](./CREATE_PLAYBOOK.md)

## 5. Ansible によるサーバセットアップ

Ansible playbookを通じて実際にサーバに設定を加えていきます
- [Ansible によるサーバセットアップ](./CREATE_SERVER.md)

## 6. 変数やループ処理の実行

Ansible playbookを通じてWebサーバを作ってみましょう
- [Ansible によるWebサーバセットアップ](./USE_VARIABLE.md)

## 7. 正しい Playbook を書くために

- [正しい Playbook を書くために](./ANSIBLE_CODE_STYLE.md)

<credit-footer/>
