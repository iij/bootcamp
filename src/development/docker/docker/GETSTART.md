---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

## Docker イメージの取得

Dockerコンテナを作成するためにはDockerイメージが必要となります。
従ってまずは、`docker pull` コマンドを用いて、コンテナイメージを取得してみましょう。

`docker pull`コマンドは、Docker イメージを取得する為のコマンドです。
docker pullについて詳細は以下を参照してください
- https://docs.docker.com/engine/reference/commandline/pull/

それでは実際にhello-world の Docker イメージを取得してみましょう。以下のコマンドを実行してください。

```bash
$ docker pull hello-world
```

実行すると以下のような画面が表示されるかと思います。

```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
Status: Downloaded newer image for hello-world:latest
```

## Docker コンテナの作成

続いて行う事はコンテナの作成です。

`docker create` コマンドは、先ほど取得したDocker イメージをコンテナとして作成するコマンドです。
docker create コマンドの詳細は以下を参照してください
- https://docs.docker.com/engine/reference/commandline/create/

それでは実際にhello-world の Docker コンテナを作成してみましょう。以下のコマンドを実行してください。

```bash
 $ docker create hello-world
```

## Docker コンテナの起動

それではいよいよコンテナを起動してみます。
コンテナの開始には`docker start`コマンドを使用します。
docker startコマンドの詳細は以下を参照してください。
- https://docs.docker.com/engine/reference/commandline/start/

それでは以下のコマンドを実行してください。

```bash
$ docker start -a hello-world
```

上記コマンドを実行すると以下のような画面が表示されると思います。

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

## まとめ

さて、ここまでやってみて作業が面倒だと感じたことは無いでしょうか。
また、事前準備ではdockerの動作確認で`docker run`を実行したのでは無いかと思います。
実は`docker run`はこれらのコマンドを包含した物となっています。（docker ps 除く）

従って、ここまでの作業であれば通常は`docker run hello-world`とする事になります。

しかしながら、場合によってはイメージのみを予め取得しておきたい、
取得済みのイメージを起動したい、など順を踏んで実行する事もあるためそれぞれの動作について理解して頂ければと思います。

<credit-footer/>
