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
しかし、先ほどの講義では以下の項目についての確認には言及していません。

- 取得したイメージがきちんと取得できているのか？
- 起動したコンテナが間違いなく起動しているのか？
- 作業完了後に後片付け・余計なリソースやプロセスが残っていないか？

実際のコンテナの活用にはこういったDockerコンテナの管理が必要不可欠になります。
従って本講では、Dockerコンテナを管理する為のコマンドを学習します。

### 演習3 docker images

`docker images` コマンドは、ローカル環境に存在するDocker イメージの一覧を表示するコマンドです。
これを用いることでコンテナの元となるイメージファイルの有無を確認することができます。

なお、Dockerイメージには、名前の他に「TAG」を付けることができます。
TAGとして使われる文字列にはバージョンを記載することが一般的です。
今回表示されている「latest」は最新版であることを意味しています。

コマンドを実行し、手元にどんなイメージがあるか確認してみてください

```bash
$ docker images
```

<details><summary>実行例</summary>

```
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
docker/getting-started                                                    latest       cb90f98fd791   2 months ago    28.8MB
```
</details>


### 演習4 docker ps

`docker ps` コマンドは、ローカル環境に存在するDockerコンテナに関する情報を表示してくれます。
現在起動しているコンテナは`docker ps` と入力すると表示されます。
こちらもコマンドを実行してみましょう。

`docker ps`コマンドのデフォルトの動作で表示されるのは永続的に稼働しているコンテナのみ表示されるため、
本講義に従って実行した場合は何も表示されないと思います。
既に終了してしまったり、エラーで起動できていないコンテナを確認するためには、
オプションで`-a` を付けることで表示可能です。

```bash
$ docker ps -a
```

<details><summary>実行例</summary>

```
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS    PORTS     NAMES
f908c593f036   docker/getting-started   "/docker-entrypoint.…"   2 seconds ago   Created             getting-started
```
</details>

### 演習5 docker start、stop

`docker start` は、コンテナの起動を行うコマンドで、`docker stop` は、コンテナを停止するコマンドです。
これらのコマンドでは、起動・停止対象のコンテナを選択する必要があるため、引数として`docker ps` の表示結果にあった「CONTAINER ID」を設定します。

先ほどの項では`docker/getting-started`コンテナの起動に`docker run`を使用していましたが、`docker run`と`docker start`には大きな違いがあります。

`docker run`は、`docker start`だけでなく、`docker create`を兼ねるコマンドとなっており、実行対象のコンテナが存在しない場合はイメージからコンテナ化を試みるようになっています。

このように大変便利なコマンドですが、既にコンテナ化されており停止しているだけの物を起動したいと思った時に`docker run`を使用すると、既にコンテナ化されていものがあるにも関わらず新たにイメージからコンテナを作り出そうとするなど、思わぬ動作を引き起こすことがあります。

従って、`docker run`は初回起動時に使う物として考え、
`docker stop`で停止しただけのコンテナを再び起動させたい場合は`docker start`を用いましょう。

では、実際に`docker stop`と`docker start`を使う演習をしてみましょう。

#### 5-1. コンテナの起動

```bash
 $ docker run --name iij-bootcamp_docker01 -d -p 8080:80 docker/getting-started
```

<details><summary>実行例</summary>

```bash
 $ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                                   NAMES
6d868b858fd7   docker/getting-started   "/docker-entrypoint.…"   4 seconds ago   Up 3 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   interesting_darwin
```
</details>


#### 5-2. コンテナの停止

先ほど実行したコンテナを停止します。 **<CONTAINER ID>**については先ほどの演習で行った`docker ps`等を用いて確認してください

```bash
 $ docker stop <CONTAINER ID>
```

#### 5-3. コンテナの開始(再開)

```bash
 $ docker start <CONTAINER ID>
```

### 演習6 docker rm、rmi

`docker rm` と`docker rmi` は、それぞれDocker コンテナ、Docker イメージの削除を行うコマンドです。
軽量であるとは言え、コンテナイメージも一定の容量を持つため作成するだけで削除を行わないといずれディスクを圧迫し、溢れてしまいます。
従って、不要なコンテナやイメージは削除するよう心がけましょう。
ただし、削除したいDocker イメージを元に作成したDocker コンテナが存在する場合削除できません。
その際は、事前にDocker コンテナを削除した後に、Docker イメージを削除してください。

なお、削除には`docker stop`等と同様に引数に「CONTAINER ID」や「IMAGE ID」を設定する必要があります。

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
