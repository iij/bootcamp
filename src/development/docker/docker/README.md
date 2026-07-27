---
footer: CC BY-SA Licensed | Copyright (c) 2026, Internet Initiative Japan Inc.
title: Docker を触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作、Linux 基本操作(推奨)
updated: 2026-07
---

<header-table/>

# {{$page.frontmatter.title}}

## はじめに

Docker は、当初 Docker Inc. によって開発され、現在は Mirantis を中心にコミュニティと共に保守・開発が続けられている、コンテナ型の仮想環境プラットフォームです。
コンテナとは、1台のコンピュータ上で複数のアプリケーションを分離して動かすための、軽量かつ高速な仮想化技術のひとつです。

Docker を利用することで、アプリケーションとその依存関係を「コンテナ」と呼ばれる独立した実行環境としてパッケージ化し、どこでも同じように動作させることができます。

では、「コンテナ」と「仮想マシン」には、どのような違いがあるのでしょうか？

従来の仮想マシンでは、ホストOS 上に仮想化ソフトウェア(例：VirtualBox, VMware など)を動かし、その中でゲストOS を実行します。
一方、コンテナはホストOS のカーネルを共有しつつ、独立したユーザー空間を構築することで、軽量で高速な実行環境を提供します。

### 本講義の目的

- Docker についての基礎的な知識と仕組みを理解する
- Dockerfile および `docker` コマンドを使って、コンテナの作成・操作を体験する

#### 本講義で扱わないこと

- `docker` コマンドのすべてのオプション解説
- コンテナイメージのレイヤー構造などの詳細な内部仕様

### 本講義の目標

- `docker` コマンドを使って、コンテナの取得・起動・停止ができるようになる
- Dockerfile の基本的な書き方・読み方を理解し、自分の目的に応じてコンテナを構築できるようになる

### 講義の進め方

この講義は、Docker があらかじめインストールされている環境を前提としています。
未インストールの場合は、「ハンズオン事前準備」(社内限定資料)に従ってセットアップを済ませてください。

- また、その他の受講者の方はDocker 公式ドキュメント等を参考に、セットアップを済ませてください。
- 一例としてUbuntu 環境にDocker をインストールする方法が記載された公式ドキュメントを下記に示します。
  - [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

> 💡 注意：Docker Desktop は商用利用に制限があります。Linux では `docker-ce` や `podman` などの代替も検討してください。

### 事前準備

このハンズオンでは `docker` コマンドを使用します。
ハンズオンの実施にあたり、それぞれが実行できることを確認してください

事前準備の項を済ませているならばDocker 環境は構築されているはずです。
下記コマンドを入力し、コマンドが実行できるか確認してください。

```bash
$ docker version
```

上記コマンドが実行できない方は、Docker（及びコマンド）のインストールが終わっているか確認し、未完了であればDockerのインストールを行ってください。

## ハンズオン項目一覧

- [Docker コンテナで仮想環境プラットフォームを構築する](./GETSTART.md)
- [Docker コンテナイメージを作成して起動する](./RUN_AS_IMAGE.md)
- [Docker コンテナの管理](./OPERATION.md)

## 参考

### "Docker" とは

ここで扱う "Docker" とは、コンテナ仮想化プラットフォームおよびその周辺ツール群を指します。

以下はDocker を扱う上で基本となる概念です。

- **Docker コンテナ**
  アプリケーションとその実行環境をパッケージ化したもの。OS やハードウェアに依存せず、どこでも同じ動作を再現できます。

- **Docker イメージ**
  コンテナの元となるファイルシステムのテンプレート。アプリケーションとその依存ファイル、設定が含まれており、Dockerfile を用いて構築します。

- **コンテナオーケストレーション**
  複数のコンテナを効率よく展開・管理する仕組み。シンプルな構成管理には `docker compose` を、より大規模なシステムには Kubernetes(k8s) がよく利用されます。

  ※ 本講義では `docker compose`（Docker Compose v2 以降）を前提とします。従来の `docker-compose`（v1）は非推奨です。

- **イメージの共有と配布**
  Docker Hub や GitHub Container Registry などのリポジトリを通じて、コンテナイメージを共有・再利用できます。

- **OCI (Open Container Initiative)**
  現在、コンテナ技術は OCI により標準化されており、Docker はその仕様に準拠した実装のひとつです。Podman やcontainerd なども同様にOCI準拠です。

本講義では「Dockerコンテナ」と「Dockerイメージ」の操作を中心に学習を進めていきます。
「コンテナオーケストレーション」については、後続の `docker compose` の講義で触れます。

### 仮想マシン vs コンテナ

仮想マシンとコンテナ、どちらが「優れている」というよりは、それぞれ用途や目的に応じた使い分けが重要です。

コンテナは、仮想マシンよりも軽量かつ高速な環境構築が可能であり、CI/CD やマイクロサービスアーキテクチャとの相性が良いのが特徴です。
ただし、仮想マシンのように完全に分離された環境を必要とする場合は、VM の方が適していることもあります。

例）

- コンテナ：Linux 上で Linux アプリケーションを高速起動したい
- 仮想マシン：Linux 上で Windows アプリケーションを実行したい

### Docker のアーキテクチャ

![Docker Image](https://docs.docker.com/get-started/images/docker-architecture.webp)

### Docker Hub のレート制限について

Docker Hub には、匿名ユーザでのpull操作に対してレート制限（1時間に最大100回）が設けられています。
大量にpullする場合は `docker login` を行うことで制限緩和されます。

### セキュリティの観点(発展)

実務では、例として以下のセキュリティ対策が重要です：

- コンテナイメージの脆弱性スキャン：`trivy`, `dockle`, `Grype` などのツール
- Dockerfileでの `USER` 指定(root 実行の回避)

また、Docker デーモンとコンテナを非root ユーザとして実行する[Rootless mode](https://docs.docker.com/engine/security/rootless/) での利用も選択肢としてあります。

---
<credit-footer/>
