---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Dockerコンテナで仮想環境プラットフォームを構築する
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

## おさらい

それでは実際にDockerを使って仮想環境プラットフォームを作ってみましょう。
事前準備の項を済ませているならばDocker環境は構築されているはずです。
下記コマンドを入力し、コマンドが実行できるか確認してください。

```bash
$ docker version
```

上記コマンドが実行できない方は、Docker（及びコマンド）のインストールが終わっているか確認し、未完了であればDockerのインストールを行ってください。

## Docker コンテナを起動する

Dockerコンテナを使って仮想環境プラットフォームを構築するには、大きく分けて以下のステップを踏む必要があります。

- Dockerイメージのビルド
- Dockerコンテナの作成
- Dockerコンテナの起動

まずは、**作成済みのDockerコンテナイメージ**を利用してコンテナを起動してみましょう。

---

### 演習1 Dockerコンテナを起動する

**docker run** コマンドを使用して **getting-started** コンテナを起動します。

```bash
docker run --rm -p 80:80 docker/getting-started
```

<details><summary>実行中のログ</summary>

```bash
Unable to find image 'docker/getting-started:latest' locally
latest: Pulling from docker/getting-started
c158987b0551: Pull complete
1e35f6679fab: Pull complete
cb9626c74200: Pull complete
b6334b6ace34: Pull complete
f1d1c9928c82: Pull complete
9b6f639ec6ea: Pull complete
ee68d3549ec8: Pull complete
33e0cbbb4673: Pull complete
4f7e34c2de10: Pull complete
Digest: sha256:d79336f4812b6547a53e735480dde67f8f8f7071b414fbd9297609ffb989abc1
Status: Downloaded newer image for docker/getting-started:latest
89e2c9780f5caf3b5250013e002e8aaf9f8ea74c2e940eca49b890dfc019ab5e
```

</details>

#### 起動の確認

- ブラウザで以下のURLを入力します：

  http://localhost:80

- 以下のような画面が表示されれば成功です：

  ![getting-started](./images/getting-started.png)

#### コンテナの終了

**Ctrl + C** を押して終了します。

---

## 発展課題1: デーモンとして起動する

先ほどはフォアグラウンド実行だったため、ターミナルが占有されていました。
ここではバックグラウンド（デーモン）で起動し、ターミナルを占有しない方法を学びます。
起動後は `docker ps` を使用して確認します。

### ステップ1: バックグラウンドで起動

```bash
docker run --rm -d -p 80:80 docker/getting-started
```

### ステップ2: コンテナの起動確認

```bash
docker ps

（出力例）

CONTAINER ID   IMAGE                    COMMAND                   CREATED         STATUS         PORTS                               NAMES
38ebcf110f45   docker/getting-started   "/docker-entrypoint.…"   3 seconds ago   Up 2 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp   fervent_shaw
```

- **NAMES** に表示されている値を控えておいてください。

### ステップ3: ブラウザで確認

http://localhost:80 にアクセスし、画面が表示されれば成功です。

![getting-started](./images/getting-started.png)

### ステップ4: コンテナの停止

```bash
docker stop <NAME>
```

### ステップ5: 停止の確認

- http://localhost にアクセスして、表示されないことを確認。
- 以下のコマンドで、コンテナが停止していることを確認。

```bash
docker ps

（何も表示されなければ停止しています）

CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

<credit-footer/>