---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>


## Dockerコンテナの管理

前回は、Dockerコンテナのイメージの取得からコンテナの構築までを行いました。
しかし、先ほどの講義では取得したイメージがきちんと取得できているのか？
起動したコンテナが間違いなく起動しているのか？といった事の確認ができていません。
コンテナの活用にはこういったDockerコンテナの管理が必要不可欠になります。
従って本講では、Dockerコンテナを管理する為のコマンドを学習します。

### docker images

`docker images` コマンドは、ローカル環境に存在するDocker イメージの一覧を表示するコマンドです。現状では、「hello-world」イメージのみが存在すると思います。

```bash
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
docker/getting-started                                                    latest       cb90f98fd791   2 months ago    28.8MB
```

Dockerイメージには、名前の他に「TAG」を付けることができます。TAGでは、主にバージョンを管理していることが多いです。今回表示されている「latest」は最新版であることを意味しています。
### docker ps

`docker ps` コマンドは、ローカル環境に存在するDockerコンテナに関する情報を表示してくれます。現在起動しているコンテナは`docker ps` と入力すると表示されます。
しかしながら今の状態で本コマンドを実行してもヘッダー情報だけで何も表示されないと思います。
と言うのも`docker ps`コマンドのデフォルトの動作で表示されるのは永続的に稼働しているコンテナだけだからです
既に終了してしまったり、エラーで起動できていないコンテナを確認するためには、オプションで`-a` を付けることで表示可能です。

```bash
$ docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS    PORTS     NAMES
f908c593f036   docker/getting-started   "/docker-entrypoint.…"   2 seconds ago   Created             getting-started
```

### docker start、stop

`docker start` は、コンテナの起動を行うコマンドで、`docker stop` は、コンテナを停止するコマンドです。これらのコマンドでは、起動・停止対象のコンテナを選択する必要があるため、引数として`docker ps` の表示結果にあった「CONTAINER ID」を設定します。

先ほどの項では`docker/getting-started`コンテナの起動に`docker start`を使用していました。
従って、`docker/getting-started`コンテナの停止したい時は`docker stop`を使う事になります。

では、実際に`docker stop`を使う演習をしてみましょう。
先ほどは、`docker/getting-started`をそのまま起動していましたが今回は、daemon動作として簡単なコンテナを作り、それを停止してみましょう。

#### コンテナの起動

```bash
 $ docker run -d -p 8080:80 docker/getting-started
```

#### 起動確認

```bash
 $ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                                   NAMES
6d868b858fd7   docker/getting-started   "/docker-entrypoint.…"   4 seconds ago   Up 3 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   interesting_darwin
```

#### コンテナの停止

```bash
 $ docker stop <CONTAINER ID>
```

### docker rm、rmi

`docker rm` と`docker rmi` は、それぞれDocker コンテナ、Docker イメージの削除を行うコマンドです。それぞれ引数に「CONTAINER ID」や「IMAGE ID」を設定する必要があります。また、削除したいDocker イメージを元に作成したDocker コンテナが存在する場合削除できません。その際は、事前にDocker コンテナを削除した後に、Docker イメージを削除してください。

```bash
$ docker rm docker/getting-started
docker/getting-started
$ docker rmi docker/getting-started
docker/getting-started
```

## まとめ

ここまで実施することでDockerコンテナの取得から後片付けまでの一通りの作業ができるようになりました。
しかし、実際に自分好みのDockerコンテナを作るにはどうすれば良いでしょうか。
次項ではDockerコンテナの作り方について学びたいと思います。


<credit-footer/>
