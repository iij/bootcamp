---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>

# Dockerを触ってみよう

## 事前準備

以下の手順に従って、`docker` コマンドをインストールしてください。

```bash
sudo yum -y install lvm2 device-mapper device-mapper-persistent-data device-mapper-event device-mapper-libs device-mapper-event-libs
sudo curl https://download.docker.com/linux/centos/docker-ce.repo -o /etc/yum.repos.d/docker-ce.repo
sudo yum -y install docker-ce
sudo systemctl start docker
sudo usermod -aG docker $USER #本コマンドを実行後sshで再接続する
```

導入できたら、下記コマンドを実際に入力し、コマンドが実行できるかどうか確認してください。

```bash
$ docker version
```

## 1. Docker とは

Docker は、現在Docker 社が開発しているコンテナ型の仮想環境プラットフォームです。コンテナとは、仮想マシンのような1台のコンピュータの上で、仮想的に複数のコンピュータを動作させる技術の1つの仕組みです。しかしながら、仮想マシンとは少し異なる仕組みの元動作しています。一般的な仮想マシンと呼ばれるソフトウェア（VirtualBox など）では、ホストOS上で、仮想マシン用のソフトウェアを動かし、その中でまたOS を起動します。OS の中で別のOS を起動するため起動やホスト自体のハードウェアにアクセスする際に時間がかかるなどのデメリットが存在します。しかしコンテナ型では、ホストOS 上に専用のアプリケーション実行用の領域を作成し、その中で実行する仕組みになっているため、アプリケーションや環境の起動が高速で、メモリやディスクも小容量で実行することができます。また、開発環境などにDocker を使うことで、ホストアプリケーションを実行に必要な環境と共に配布し、メンバー全員が同じ環境で開発を行うことが容易になります。

Docker には、大きくわけて2つの重要な概念が存在します。1つ目は、前述しているコンテナである「**Docker コンテナ**」です。2つ目は、「**Docker イメージ**」と呼ばれるコンテナの土台となるシステムファイルです。
多くの場合docker、docker内のアプリケーションが動作するまでの流れは以下のようになっています。
1. Docker イメージのダウンロード（または作成）
2. Docker イメージを元にコンテナを作成
3. Docker コンテナを起動しアプリケーションを実行

そこで本講義では、
- Docker イメージのダウンロード、Docker コンテナの作成方法
- ダウンロードしたDocker イメージやDocker コンテナの管理方法
- Dockerfileを用いたDocker イメージの作成

についてご紹介したいと思います。

## 2. Docker でHello World

では初めに、`docker run` コマンドを用いて、初めてのコンテナ作成をしてみましょう。

`docker run` コマンドは、上記の

1. Docker イメージのダウンロード
2. Docker イメージを元にコンテナを作成

を実行してくれるコマンドです。今回の場合、初めに「hello-world」のDocker イメージをダウンロードしてきます。ダウンロードが完了後、Docker イメージの定義に基づいて、**Hello from Docker!** という文字列を表示するアプリケーションが自動的に実行されます。

以下のコマンドを実行してください。

```bash
$ docker run hello-world
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

## 3. dockerコマンドを用いたコンテナ・イメージの管理

### 3.1 docker ps

`docker ps` コマンドは、ローカル環境に存在するDockerコンテナに関する情報を表示してくれます。現在起動しているコンテナは`docker ps` と入力すると表示されます。しかしながら今の状態で本コマンドを実行してもヘッダー情報だけで何も表示されないと思います。実は今回のコンテナは文字を出力したら終了してしまいます。つまり永続的に稼働しているコンテナではありません。こういったすでに終了してしまったり、エラーで起動できていないコンテナを確認するためには、オプションで`-a` を付けることで表示可能です。

```bash
$ docker ps -a
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                      PORTS                      NAMES
9b1f2c08a269        hello-world                     "/hello"                 11 seconds ago      Exited (0) 11 seconds ago                              admiring_jang
```

### 3.2 docker images

`docker images` コマンドは、ローカル環境に存在するDocker イメージの一覧を表示するコマンドです。現状では、「hello-world」イメージのみが存在すると思います。

```bash
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
hello-world                   latest              fce289e99eb9        5 weeks ago         1.84kB
```
Dockerイメージには、名前の他に「TAG」を付けることができます。TAGでは、主にバージョンを管理していることが多いです。今回表示されている「latest」は最新版であることを意味しています。

### 3.3 docker start、stop

`docker start` は、コンテナの起動を行うコマンドで、`docker stop` は、コンテナを停止するコマンドです。これらのコマンドでは、起動・停止対象のコンテナを選択する必要があるため、引数として`docker ps` の表示結果にあった「CONTAINER ID」を設定します。  

では、今回のコンテナを起動してみましょう。ただし普通に起動するだけでは、標準入出力がコンテナ内にとどまってしまい、最初と同じ画面は表示されません。そこで、手元の標準入出力とコンテナ内の標準入出力を紐づけるために、`-a` オプション（`--attach` オプション)を付けてあげます。

```bash
$ docker start -a 9b1f2c08a269
(省略)
```

### 3.4 docker rm、rmi

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

## 4. Dockerfile によるDocker イメージ作成

Docker では、「**Dockerfile**」というファイルを用いて、Docker イメージの作成を行うことができます。Dockerfile は専用言語で記述します。このようにコンテナを初めとするサーバ環境やミドルウェアなどをコード（プログラム、設定ファイルなど）で構成管理することを「**Infrastracture as Code（IaC）**」と呼びます。Dockerfile のように環境をコード化して管理することにより、以下のようなメリットが挙げられます。
- 新規メンバーの開発環境が、Dockerfile を共有するだけで構築可能
- 複雑なインフラ環境がテキストベースで管理でき、git 等での管理が容易に
- 構築手順などがコード化されるため、漏れや間違いが発見しやすくなる

今回は、ubuntu というDocker イメージを元にカスタマイズしながら、nginx によるWeb サーバのDocker イメージを作成します。また、作成したDocker イメージを使ってDocker コンテナを立ち上げ、HTML ファイルがレスポンスされることを確認します。

では、実際にDockerfile を作成し、Docker イメージを作成していきましょう。以下の内容をファイル名「Dockerfile」として作成してください。

```Dockerfile
FROM ubuntu
LABEL maintainer="your_email"

RUN apt-get update && \
    apt-get install nginx -y && \
    rm /var/www/html/index.nginx-debian.html

COPY index.html /var/www/html/

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

また、`COPY` コマンドで利用する「index.html」を以下のように作成してください（あくまで一例です）。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello world</title>
  </head>
  <body>
    <h1>IIJ Boot Camp</h1>
    <p>Hello World from docker container!!</p>
  </body>
</html>
```

作成したDockerfile の内容を先頭から読み解いていきましょう。

- `FROM` 命令は、ベースとなるDocker イメージを設定する命令です。今回は、ubuntu を利用しています。Dockerfile は必ず`FROM` 命令から始まっていなければなりません。
- `LABEL` 命令は、Docker イメージにメタデータを付加するときに利用します。今回は、`maintainer` つまり管理者を追加しています。昔のDockerfile においては、`MAINTAINER` 命令を使って設定していましたが、現在は非推奨となっています。
- `RUN` 命令は、Dockerfile の中でもとても重要な命令で、Docker イメージ作成時に実行する命令を記述します。今回はパッケージのアップデートとnginx のインストール、nginx のデフォルトウェブページであるHTML ファイルの削除を行っています。この行で重要なのは、**&&** で繋いで実行している点です。Dockerfile からDocker イメージを作成する際、`RUN` 命令などの実行した状態をキャッシュとして保存します。そのため、`apt-get update` と`apt-get install nginx -y` が異なる行で書かれていると、新しくパッケージを追加するために、`apt-get install nginx -y`の行を更新して、再度Docker イメージを作成しようとした際に、`apt-get update` で作成されたキャッシュを利用してしまい、**最新版ではないnginx やパッケージがインストールされてしまう**可能性があります。
- `COPY` 命令は、ローカルにあるファイルなどをコンテナの内部へコピーする際に利用します。
- `EXPOSE` 命令は、コンテナ実行時にポートで待ち受けることをdocker に伝えます。注意点として、この命令を書いただけでは、ホスト環境からアクセスはできません。実際にアクセスするためには、口述する`docker run` コマンドのオプションでポートを設定する必要があります。
- `ENTRYPOINT` 命令は、`RUN` 命令と異なり、Dockerイメージから実際のコンテナを作成する際に実行されます。  

その他詳しい機能について知りたい方は、[公式のリファレンス](https://docs.docker.com/engine/reference/builder/)をご参照ください。

では、先ほど作成したDockerfileが存在するディレクトリ内で以下のコマンドを実行してください。

```bash
$ docker build -t iijbootcamp .
```

このコマンドによって、Dockerfile からDocker イメージが作成されます。`-t` オプションでイメージ名を決めることができます。また、最後の`.` は、Dockerfile が存在するディレクトリ（カレントディレクトリ）を意味しています。  

実際にDockerイメージが作成されているかコマンドで確認してみてください。

```bash
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
iijbootcamp         latest              417ab982faaa        6 days ago          170MB
ubuntu              latest              93fd78260bd1        6 days ago          86.2MB
```

「REPOSITORY」がubuntu とiijbootcamp の２つのイメージが新たに作られていると思います。ubuntu は`FROM` で指定したDocker イメージです。iijbootcamp は、ubuntu のDocker イメージを元にnginx やHTML ファイルを追加して今回作成したDocker イメージです。  

では、実際にこのコンテナを起動してアクセスしてみましょう。次のコマンドを実行してください。

```bash
$ docker run -d -p 8888:80 iijbootcamp
```

`-d` オプションはコンテナをデタッチドモードで起動することを意味しています。また、nginx はデフォルトでデーモンとして起動してしまうため、Dockerfile ではnginx をデーモンとして起動しないオプションで起動しています。また、`-p` オプションでは、ホスト側とコンテナ側のポートを対応付けています。「:」の左側がホスト環境、右側がコンテナ環境のポートを示しており、**ホスト環境の8888ポートへアクセスすると、コンテナの80ポートにつながる**ようになっています。  

コンテナが起動していることを確認してください。正しく実行されていると以下のような画面が表示されます。

```bash
$ docker ps
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                      NAMES
171c3b25c75e        iijbootcamp:latest         "nginx -g 'daemon of…"   15 minutes ago      Up 15 minutes       0.0.0.0:8888->80/tcp       condescending_wilson
```

では、実際にコンテナに対してアクセスしてみましょう。お好きな方法（Webブラウザでもcurlコマンド等でも)で「 http://localhost:8888 」にアクセスしてみましょう。以下にcurl コマンドを用いた例を示します。

```bash
$ curl http://localhost:8888
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello world</title>
  </head>
  <body>
    <h1>IIJ Boot Camp</h1>
    <p>Hello World from docker container!!</p>
  </body>
</html>
```

上記のように実際に作成したHTMLが表示されていれば成功です。

## 5. Docker イメージの共有方法

皆さんが作成したDocker イメージなどを他の人に共有したい場合、Dockerfile をファイルサーバやGitHub 等で共有する以外に、[Docker Hub](https://hub.docker.com/)を始めとする「**Docker イメージレジストリ**」で公開し、それを利用してもらうことが可能です。例えば、本講義で利用した「hello-world」や「ubuntu」のDocker イメージは、Docker Hubで公開されているものを利用しています。  

Docker イメージレジストリに自分のDocker イメージを公開する際には、`docker push` コマンドを利用します。逆に、Docker イメージをダウンロードしたい場合は、`docker pull` コマンドを利用します。また、Dockerイメージを`docker save` コマンドでtarファイルとして保存し、`docker load` コマンドでtarからロードするといったことも行うことができます。

## 6. まとめ

今回は、仮想環境プラットフォームであるDocker を実際に触っていただきました。Docker の基礎知識、Docker コンテナ、イメージの管理方法に加え、Dockerfile を作成し自身でコンテナを作っていただきました。仮想マシンに比べ軽く高速で作成することが可能なため使いどころは多いでしょう。しかしながら、実際のサービスでは、単一のアプリケーションのみで1つのコンテナで完成することはありえません。Web サーバやWeb アプリケーション、データベースなど様々なものが１つに組み合わさって初めてサービスとして完成します。Docker コンテナでは、「1コンテナ1プロセス」や「1コンテナ1ロール」が基本となっています。そのため複数のコンテナを組み合わせて構築する必要があります。次の講義「開発環境をdocker-composeで構築」では、複数のコンテナを組み合わせて管理する手法について学びます。

<credit-footer/>
