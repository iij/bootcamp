---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

## おさらい

それでは実際にDockerを使って仮想環境プラットフォームを作る前にまずは環境の確認をしましょう。皆さんは既に下準備でDocker（及びコマンド）のインストールが終わっているはずです。

下記コマンドを入力し、コマンドが実行できるか確認してください。

```bash
$ docker version
```

## Dockerコンテナで仮想環境プラットフォームを構築する

本章では、**Dockerイメージ**を取得し、実際に**Dockerコンテナ**を使って仮想環境プラットフォームを構築してみます。

Dockerコンテナを使って仮想環境プラットフォームを構築するためには、以下の作業が必要になります。

- Dockerコンテナの元となるDockerイメージの取得
- 仮想環境プラットフォームを構成するDockerコンテナの作成
- 作成されたDockerコンテナの起動

## Docker イメージの取得

Dockerコンテナを使って仮想環境プラットフォームを作成するためには、Dockerイメージが必要となります。

従ってまずは、`docker pull` コマンドを用いて、コンテナイメージを取得してみましょう。

`docker pull`コマンドは、Docker イメージを取得する為のコマンドです。
docker pullについて詳細は以下を参照してください
- https://docs.docker.com/engine/reference/commandline/pull/

それでは、実際に getting-started の Docker イメージを取得してみましょう。以下のコマンドを実行してください。

```bash
$ docker pull docker/getting-started
```

実行すると以下のような画面が表示されるかと思います。

```bash
Using default tag: latest
latest: Pulling from docker/getting-started
df9b9388f04a: Pull complete
5867cba5fcbd: Pull complete
4b639e65cb3b: Pull complete
061ed9e2b976: Pull complete
bc19f3e8eeb1: Pull complete
4071be97c256: Pull complete
79b586f1a54b: Pull complete
0c9732f525d6: Pull complete
Digest: sha256:b558be874169471bd4e65bd6eac8c303b271a7ee8553ba47481b73b2bf597aae
Status: Downloaded newer image for docker/getting-started:latest
docker.io/docker/getting-started:latest
```

## Docker コンテナの作成

では、取得したイメージを使って**Dockerコンテナ**を作成してみましょう。

`docker create` コマンドは、先ほど取得したDocker イメージをコンテナとして作成するコマンドです。
docker create コマンドの詳細は以下を参照してください
- https://docs.docker.com/engine/reference/commandline/create/

それでは実際に getting-started の Docker コンテナを作成してみましょう。以下のコマンドを実行してください。

```bash
 $ docker create --name getting-started docker/getting-started
```

## Docker コンテナの起動

それではいよいよ作成したDockerコンテナを起動してみます。

コンテナの開始には`docker start`コマンドを使用します。
docker startコマンドの詳細は以下を参照してください。
- https://docs.docker.com/engine/reference/commandline/start/

それでは以下のコマンドを実行してください。

```bash
$ docker start -a getting-started
```

上記コマンドを実行すると以下のような画面が表示されると思います。

```
$ docker start -a getting-started
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
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

## まとめ

さて、ここまでやってみて作業が面倒だと感じたことは無いでしょうか。
また、事前準備ではdockerの動作確認で`docker run`を実行したのでは無いかと思います。
実は`docker run`はこれらのコマンドを包含した物となっています。

従って、ここまでの作業であれば通常は`docker run docker/getting-started`とする事になります。

しかしながら、場合によってはイメージのみを予め取得しておきたい、
取得済みのイメージを起動したい、など順を踏んで実行する事もあるためそれぞれの動作について理解して頂ければと思います。

<credit-footer/>
