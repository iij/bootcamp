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

### 演習3 docker images

`docker images` コマンドは、ローカル環境に存在するDocker イメージの一覧を表示するコマンドです。現状では、「getting-started」イメージのみが存在すると思います。

```bash
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
docker/getting-started                                                    latest       cb90f98fd791   2 months ago    28.8MB
```

Dockerイメージには、名前の他に「TAG」を付けることができます。TAGでは、主にバージョンを管理していることが多いです。今回表示されている「latest」は最新版であることを意味しています。
### 演習4 docker ps

`docker ps` コマンドは、ローカル環境に存在するDockerコンテナに関する情報を表示してくれます。現在起動しているコンテナは`docker ps` と入力すると表示されます。
しかしながら今の状態で本コマンドを実行してもヘッダー情報だけで何も表示されないと思います。
と言うのも`docker ps`コマンドのデフォルトの動作で表示されるのは永続的に稼働しているコンテナだけだからです。
既に終了してしまったり、エラーで起動できていないコンテナを確認するためには、オプションで`-a` を付けることで表示可能です。

```bash
$ docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS    PORTS     NAMES
f908c593f036   docker/getting-started   "/docker-entrypoint.…"   2 seconds ago   Created             getting-started
```

### 演習5 docker start、stop

`docker start` は、コンテナの起動を行うコマンドで、`docker stop` は、コンテナを停止するコマンドです。これらのコマンドでは、起動・停止対象のコンテナを選択する必要があるため、引数として`docker ps` の表示結果にあった「CONTAINER ID」を設定します。

先ほどの項では`docker/getting-started`コンテナの起動に`docker run`を使用していました。`docker run`は`docker create`と`docker start`双方を兼ねる大変便利なコマンドですが、既にコンテナ化されており停止しているだけの物を起動したいと思った時に`docker run`を使用すると思わぬ動作を引き起こすことがあります。

従って、`docker run`は初回起動時に使う物として考え、`docker stop`で停止しただけのコンテナを再び起動させたい場合は`docker start`を用いましょう。

では、実際に`docker stop`と`docker start`を使う演習をしてみましょう。

#### コンテナの起動

```bash
 $ docker run --name iij-bootcamp_docker01 -d -p 8080:80 docker/getting-started
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

#### コンテナの開始(再開)

```bash
 $ docker start <CONTAINER ID>
```

### 演習6 docker rm、rmi

`docker rm` と`docker rmi` は、それぞれDocker コンテナ、Docker イメージの削除を行うコマンドです。それぞれ引数に「CONTAINER ID」や「IMAGE ID」を設定する必要があります。また、削除したいDocker イメージを元に作成したDocker コンテナが存在する場合削除できません。その際は、事前にDocker コンテナを削除した後に、Docker イメージを削除してください。

```bash
$ docker rm  iij-bootcamp_docker01
iij-bootcamp_docker01
```

```bash
$ docker rmi docker/getting-started
docker/getting-started
```

## まとめ

ここまで実施することでDockerコンテナの取得から後片付けまでの一通りの作業ができるようになりました。
しかし、実際に自分好みのDockerイメージを作るにはどうすれば良いでしょうか。
次項ではDockerイメージの作り方について学びたいと思います。


<credit-footer/>
