---
footer: CC BY-SA Licensed | Copyright (c) 2022, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>


## Dodkerイメージの作成

Docker では、「**Dockerfile**」というファイルを用いて、Docker イメージの作成を行うことができます。Dockerfile は専用言語で記述します。このようにコンテナを初めとするサーバ環境やミドルウェアなどをコード（プログラム、設定ファイルなど）で構成管理することを「**Infrastructure as Code（IaC）**」と呼びます。Dockerfile のように環境をコード化して管理することにより、以下のようなメリットが挙げられます。
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
- `EXPOSE` 命令は、コンテナ実行時にポートで待ち受けることをdocker に伝えます。注意点として、この命令を書いただけでは、ホスト環境からアクセスはできません。実際にアクセスするためには、後述する`docker run` コマンドのオプションでポートを設定する必要があります。
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
プロキシを設定している場合は下記のように`--noproxy`オプションを指定する必要があります。

```bash
$ curl --noproxy localhost http://localhost:8888
```

**curlコマンドによってHTMLが取得できることを確認してください**

## Docker イメージの共有方法

皆さんが作成したDocker イメージなどを他の人に共有したい場合、Dockerfile をファイルサーバやGitHub 等で共有する以外に、[Docker Hub](https://hub.docker.com/)を始めとする「**Docker イメージレジストリ**」で公開し、それを利用してもらうことが可能です。例えば、本講義で利用した「getting-started」や「ubuntu」のDocker イメージは、Docker Hubで公開されているものを利用しています。

Docker イメージレジストリに自分のDocker イメージを公開する際には、`docker push` コマンドを利用します。逆に、Docker イメージをダウンロードしたい場合は、`docker pull` コマンドを利用します。また、Dockerイメージを`docker save` コマンドでtarファイルとして保存し、`docker load` コマンドでtarからロードするといったことも行うことができます。

## まとめ

今回は、仮想環境プラットフォームであるDocker を実際に触っていただきました。Docker の基礎知識、Docker コンテナ、イメージの管理方法に加え、Dockerfile を作成し自身でコンテナを作っていただきました。仮想マシンに比べ軽く高速で作成することが可能なため使いどころは多いでしょう。しかしながら、実際のサービスでは、単一のアプリケーションのみで1つのコンテナで完成することはありえません。Web サーバやWeb アプリケーション、データベースなど様々なものが１つに組み合わさって初めてサービスとして完成します。Docker コンテナでは、「1コンテナ1プロセス」や「1コンテナ1ロール」が基本となっています。そのため複数のコンテナを組み合わせて構築する必要があります。次の講義「開発環境をdocker-composeで構築」では、複数のコンテナを組み合わせて管理する手法について学びます。

<credit-footer/>
