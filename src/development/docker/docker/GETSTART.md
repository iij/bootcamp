---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

## おさらい

それでは実際にDockerを使って仮想環境プラットフォームを作る前にまずは環境の確認をしましょう。

下記コマンドを入力し、コマンドが実行できるか確認してください。

```bash
$ docker version
```

上記コマンドが実行できない方は事前にDocker（及びコマンド）のインストールが終わっているか否か確認し、未完了の人は、Docker のインストールを行ってください。

## Dockerコンテナで仮想環境プラットフォームを構築する

本章では、**Dockerイメージ**を取得し、実際に**Dockerコンテナ**を使って仮想環境プラットフォームを構築します。

Dockerコンテナを使って仮想環境プラットフォームを構築するためには、以下の作業が必要になります。

- Dockerイメージのビルド
- Dockerコンテナの作成
- Dockerコンテナの起動

## Docker イメージのビルド

Dockerコンテナを使って仮想環境プラットフォームを作成するためには、Dockerイメージが必要となります。

通常であれば、`Dockerfile`を使用して自分のアプリケーションのDockerイメージを作成します。
`Dockerfile`は、アプリケーションの依存関係や設定、実行コマンドなどを指定するためのテキストファイルです。
`DockerFile`が作成できたらDockerイメージをビルドして作成します。その際に使うコマンドは`docker build`になります。

通常であればテキストエディタを開いて`DockerFile`を作成しますが、完全にゼロの状態から`DockerFile`を作成するのは難しい為、先ずはチュートリアル用に公開されている物を使用すると良いでしょう

### 基本演習

基本演習では予め作成済みである`DockerFile`を使用してDockerイメージを作成します。

1. DockerFileの取得
    ```bash
    git clone https://github.com/docker/getting-started.git
    ```
2. イメージのビルド
    ```bash
    cd getting-started
    docker build -t iijbootcamp_docker01 .
    ```
3. コンテナの起動
    ```bash
    docker run --rm --name iijbootcamp_docker01-tutorial iijbootcamp_docker01
    ```

ここまでできた方は、プロンプトに以下のように出力されているはずです。

```
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2022/06/17 04:10:18 [notice] 1#1: using the "epoll" event method
2022/06/17 04:10:18 [notice] 1#1: nginx/1.21.6
2022/06/17 04:10:18 [notice] 1#1: built by gcc 10.3.1 20211027 (Alpine 10.3.1_git20211027)
2022/06/17 04:10:18 [notice] 1#1: OS: Linux 4.18.0-348.2.1.el8_5.x86_64
2022/06/17 04:10:18 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2022/06/17 04:10:18 [notice] 1#1: start worker processes
2022/06/17 04:10:18 [notice] 1#1: start worker process 32
```

ここまでできたらDockerコンテナによる仮想環境プラットフォームの構築は完了です。
とりあえずここでは **Ctrl+C** で停止してください。

#### ビルドがうまくいかない人の為に

`git clone` できない、 `docker build` ができないという方は以下を試してみましょう。
getting-startedでは予めビルド済みイメージを公開している為、ビルド済みのイメージを使って起動することが可能です。


```bash
 docker run --rm --name iijbootcamp_docker01-tutorial getting-started
```

### 発展課題

先ほどの作業ではフォアグラウンドで実行している為、ターミナルが占有されてしまいます。
また、このような起動では例えばssh等で接続している場合はセッション切断と共にコンテナが停止してしまう為、発展課題ではこれを永続化する事をやってみましょう。

デーモン起動をすると、ターミナルは返ってきてしまうため起動確認は `docker ps`を使って確認します。

1. コンテナのデーモン起動
   ```bash
    docker run -d --name iijbootcamp_docker01-tutorial iijbootcamp_docker01
    ```
2. コンテナの起動確認
    ```bash
    CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS         PORTS     NAMES
    41ee2d91a50a   iijbootcamp_docker01   "/docker-entrypoint.…"   3 minutes ago   Up 3 seconds   80/tcp    iijbootcamp_docker01-tutorial
    ```
3. コンテナの停止
    ```bash
    docker stop iijbootcamp_docker01-tutorial
    ```
4. コンテナの再起動
    - 先ほど停止したコンテナを再起動してみましょう。
5. コンテナの削除
   - 停止したコンテナを削除してみましょう

#### 発展課題Tips

4. 5. は発展自己学習です。以下のコマンドを使うことで実現可能です。
他にもコマンドがあるので調べながら色々やってみましょう。

  - `docker start`
  - `docker ps -a`
  - `docker rm`


## まとめ

さて、ここまでやってみて作業が面倒だと感じたことは無いでしょうか。
また、事前準備ではdockerの動作確認で`docker run`を実行したのでは無いかと思います。
実は`docker run`はこれらのコマンドを包含した物となっています。

従って、ここまでの作業であれば通常は`docker run docker/getting-started`とする事になります。

しかしながら、場合によってはイメージのみを予め取得しておきたい、
取得済みのイメージを起動したい、など順を踏んで実行する事もあるためそれぞれの動作について理解して頂ければと思います。

<credit-footer/>
