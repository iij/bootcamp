---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

## dockerコマンドを用いたコンテナ・イメージの管理

### docker ps

`docker ps` コマンドは、ローカル環境に存在するDockerコンテナに関する情報を表示してくれます。現在起動しているコンテナは`docker ps` と入力すると表示されます。しかしながら今の状態で本コマンドを実行してもヘッダー情報だけで何も表示されないと思います。実は今回のコンテナは文字を出力したら終了してしまいます。つまり永続的に稼働しているコンテナではありません。こういったすでに終了してしまったり、エラーで起動できていないコンテナを確認するためには、オプションで`-a` を付けることで表示可能です。

```bash
$ docker ps -a
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                      PORTS                      NAMES
9b1f2c08a269        hello-world                     "/hello"                 11 seconds ago      Exited (0) 11 seconds ago                              admiring_jang
```

### docker images

`docker images` コマンドは、ローカル環境に存在するDocker イメージの一覧を表示するコマンドです。現状では、「hello-world」イメージのみが存在すると思います。

```bash
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
hello-world                   latest              fce289e99eb9        5 weeks ago         1.84kB
```
Dockerイメージには、名前の他に「TAG」を付けることができます。TAGでは、主にバージョンを管理していることが多いです。今回表示されている「latest」は最新版であることを意味しています。

### docker start、stop

`docker start` は、コンテナの起動を行うコマンドで、`docker stop` は、コンテナを停止するコマンドです。これらのコマンドでは、起動・停止対象のコンテナを選択する必要があるため、引数として`docker ps` の表示結果にあった「CONTAINER ID」を設定します。

では、今回のコンテナを起動してみましょう。ただし普通に起動するだけでは、標準入出力がコンテナ内にとどまってしまい、最初と同じ画面は表示されません。そこで、手元の標準入出力とコンテナ内の標準入出力を紐づけるために、`-a` オプション（`--attach` オプション)を付けてあげます。

```bash
$ docker start -a 9b1f2c08a269
(省略)
```

### docker rm、rmi

`docker rm` と`docker rmi` は、それぞれDocker コンテナ、Docker イメージの削除を行うコマンドです。それぞれ引数に「CONTAINER ID」や「IMAGE ID」を設定する必要があります。また、削除したいDocker イメージを元に作成したDocker コンテナが存在する場合削除できません。その際は、事前にDocker コンテナを削除した後に、Docker イメージを削除してください。

```bash
$ docker rm 9b1f2c08a269
9b1f2c08a269
$ docker rmi fce289e99eb9
Untagged: hello-world:latest
Untagged: hello-world@sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
Deleted: sha256:fce289e99eb9bca977dae136fbe2a82b6b7d4c372474c9235adc1741675f587e
Deleted: sha256:af0b15c8625bb1938f1d7b17081031f649fd14e6b233688eea3c5483994a66a3
```

<credit-footer/>
