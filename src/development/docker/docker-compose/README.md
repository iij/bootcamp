---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
title: 開発環境をDocker Composeで構築
description: Docker Compose を用いて開発環境を構築します。
time: 1h
prior_knowledge: docker
---

<header-table/>

# {{$page.frontmatter.title}}

## 事前準備
* この講義では ```docker compose (docker-compose)```はコマンドを使います。
* 環境ごとに インストール方法が異なるので、 以下の通り導入しておいてください。

### Windows, macOS
* [ハンズオン事前準備](https://iij.github.io/bootcamp/init/hello-bootcamp/) で Docker Desktop for Windowsや、Docker Desktop for Mac を導入済みであれば、すでにインストールされているはずです。

### Linux

* 以下の手順に従って、`docker compose` をインストールしてください。
 * https://matsuand.github.io/docs.docker.jp.onthefly/compose/install/


### 導入できたら
* 下記コマンドを実際に入力し、コマンドが実行できるか確認してください。

```bash
$ docker compose version
```

## 1. Docker Compose とは

Docker Compose とは、複数のコンテナから構成されるようなアプリケーションの管理をしやすくしたものです。Docker Compose を利用することで、各コンテナの起動・停止が一括して行えたり、後述する1つの設定ファイルに各コンテナの情報を記述するため可視性が高くなり管理もしやすくなります。また、各コンテナ間のネットワークや依存関係も設定ファイルとして管理することが出来る点も利点です。

例えば、以下の3つのコンポーネントから構成されるWebサービスをDockerコンテナを用いた場合を想定してみましょう。
- フロントエンド（Angular）
- データベースサーバ（MongoDB）
- バックエンド（Rails）

通常、この構成のWeb サービスを起動する際、各コンテナを立ち上げるため、`docker run` コマンドを3回実行する必要がでてきます。停止する際も同様です。ここで、Docker Compose を用いて管理を行うと、各コンテナの定義をした設定ファイルである「**docker-compose.yml**」に基づいて一括管理することが可能となります。具体的には、上記の各コンテナの起動・停止などは、`docker-compose` コマンドを1回実行するだけで済みます。また、コンテナの起動順序も適切な順番で起動することが可能となります。特に開発する際やテストなどの際には、サービスの起動停止は複数回繰り返したりすることも考えられるため効率化につながります。

本講義では、実際に複数コンテナをDocker Composeを用いて管理を行っていきます。Docker Composeを使ったアプリケーションを実行するまでの一般的な流れは以下の通りです。

1. 各コンテナのDockerfile の作成
2. docker-compose.yml の作成
3. `docker-compose` コマンドを使った複数のコンテナの管理

そこで本講義でも上記の流れに沿って講義を進めていきます。

## 2. Docker Compose 入門

本章では、実際に`docker compose` コマンドを使って複数コンテナの立ち上げや停止などをしていただきます。今回題材のサービスは、データベースにMongoDB を利用したGo 言語のWebアプリケーションです。Webアプリケーション自体の作成は本質ではないので、サンプルコードをそのまま利用していただきます。Web アプリケーションの機能は以下の2点です。

1. `/get` で、MongoDB に格納されているデータを一覧表示
2. `/add` で、`title` と`body` パラメータを添えてPOST することで、MongoDB にデータを格納する

### 2.1 Dockerfile の作成

この節では、前述したコンテナのDockerfile を作成します。Dockerfile の作成については、前講義「Docker を触ってみよう」で行いましたので、各命令などの詳細な説明は割愛します。Docker Compose を使う際、コンテナの指定方法は、

1. `docker run` と同様にimage を指定して起動する
2. Dockerfile を指定して起動時にbuild する

の2通りがあります。また今回の場合、MongoDB のイメージは特にカスタマイズしないため、1の方法で起動します。

以下の内容をファイル名「Dockerfile.backend」で作成してください。

```Dockerfile
FROM golang
LABEL maintainer="your_email"

COPY ./backend/main.go /root/
WORKDIR /root
RUN go env -w GO111MODULE=auto
RUN go get -v github.com/globalsign/mgo && go build main.go
ENTRYPOINT ["./main"]
```

### 2.2 docker-compose.yml の作成と解説

次に、以下の内容をファイル名「docker-compose.yml」で新規作成してください。

```yaml
version: '3'
services:
  database:
    container_name: iijbootcamp-database
    image: mongo
    expose:
      - "27017"
  backend:
    container_name: iijbootcamp-backend
    build:
      context: .
      dockerfile: Dockerfile.backend
    depends_on:
      - database
    ports:
      - "8088:80"
```
では、ファイルの各設定について見ていきたいと思います。

- `version` では、docker-compose.yml自体のバージョンを設定します。現在の最新版は、3系です。ここで指定するバージョンによって機能の違いが生じるため、調べる際には気を付けてください。

- `services` では、Docker Compose で管理する各サービスを子要素として定義していきます。本設定の子要素になっている`database` と`backend` が、それぞれMongoDBとgolangのWebアプリケーション用のサービスです。ここは、好きな名前を設定できます。

次に、`database` の子要素について見ていきます。

- `container_name` は、作成されるコンテナ名を設定しています。この値やサービス名は、別コンテナからアクセスされる際のホスト名としても利用可能となります。そのため後にダウンロードするWebアプリケーションのソースコードでは、MongoDB の接続先として「iijbootcamp-database」を利用しています。
- `image` では、Docker イメージを指定します。Dockerfile と同様ローカルにDocker イメージが存在しない場合は、DockerHub などからダウンロードしてきます。
- `expose` では、**ホストには晒さないが、別コンテナには晒すポート**の設定をします。今回は、MongoDB のデフォルトポートの27017を設定しています。

最後に、`backend` の子要素について見ていきます。

- `build` は、独自にDockerfile などを用いてDocker イメージを作成する際に使う設定です。`build` の子要素に、Dockerfile が格納されているディレクトリを示す`context` が必須となっています。また、今回のようにDockerfile に「Dockerfile」以外の名前を使っている場合は、`dockerfile` で対象ファイル名を指定する必要があります。

- `depends_on` では、各コンテナの起動順序を設定する項目になっています。今回の場合、backend サービスは、database サービスを必要とするので、こういった設定になっています。ただし、サービスの起動を待ってくれるわけではなく、database が起動しきる前にbackendサービスが起動してしまう場合もあります。[公式](http://docs.docker.jp/compose/startup-order.html) にそういったケースの対策が乗っているので興味がある方はご覧になってください。

- `ports` は、ホストとコンテナのポートをマッピングする設定です。今回の場合、backend サービスは、コンテナ内でポート80で起動しているので、ホストのポート8088へアクセスしたらコンテナ内の80に接続されるように設定しています。ここに記載する値は、文字列を推奨します。なぜならば、YAML の仕様では、`XX:YY` は、60進数として解釈されてしまうため、意図しない値になる可能性があるためです。

その他詳しい機能について知りたい方は、[公式のリファレンス](https://docs.docker.com/compose/compose-file/)をご参照ください。

### 2.3 backendサービスの作成

次に、backend のアプリケーションを作成します。しかし前述した通り、ここではコードの解説などは割愛します。Go 言語のコードに興味があったら、ぜひ中身もご覧になってください。アプリケーションのソースコードは、本リポジトリに[main.go](/bootcamp/main.go)として同梱しています。`Dockerfile.backend` と同じ階層に`backend` ディレクトリを作成して、中に[main.go](/bootcamp/main.go)を配置してください。

```bash
.
├── Dockerfile.backend
├── backend
│   └── main.go
└── docker-compose.yml

1 directory, 3 files
```

### 2.4 docker compose コマンド

では、必要なものはすべて揃ったので、「docker-compose.yml」が存在するディレクトリで、以下のコマンドを入力してください。

```bash
$ docker compose build
$ docker compose up
```

初回実行時は必要な image の取得や Dockerfile.backend を利用した docker build などが実行されるため、時間がかかります。

また、もし プロキシ 環境下で 正常に go get が成功しない場合は 以下のように ```docker compose build``` してから試してみてください。

```bash
$ docker compose build --build-arg https_proxy=http://<proxy>:<port>
$ docker compose up
```




以下が実際に実行した際の画面です。

```bash
Building backend
Step 1/6 : FROM golang
 ---> 901414995ecd
Step 2/6 : LABEL maintainer="your_email"
 ---> Using cache
 ---> af942d8500ac
Step 3/6 : COPY ./backend/main.go /root/
 ---> c337913839f2
Step 4/6 : WORKDIR /root
 ---> Running in 62a5f25461f4
Removing intermediate container 62a5f25461f4
 ---> 487a8ce36447
Step 5/6 : RUN go get -v github.com/globalsign/mgo && go build main.go
 ---> Running in 5605bfeb08b9
github.com/globalsign/mgo (download)
github.com/globalsign/mgo/internal/json
github.com/globalsign/mgo/internal/scram
github.com/globalsign/mgo/bson
github.com/globalsign/mgo
Removing intermediate container 5605bfeb08b9
 ---> fb0e91bd3afc
Step 6/6 : ENTRYPOINT ["./main"]
 ---> Running in bf08974a1e5d
Removing intermediate container bf08974a1e5d
 ---> 0dd916739b50
Successfully built 0dd916739b50
Successfully tagged docker-compose_backend:latest
Creating iijbootcamp-database ... done
Creating iijbootcamp-backend  ... done
Attaching to iijbootcamp-database, iijbootcamp-backend
iijbootcamp-database | 2019-02-15T02:55:28.221+0000 I CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
iijbootcamp-database | 2019-02-15T02:55:28.229+0000 I CONTROL  [initandlisten] MongoDB starting : pid=1 port=27017 dbpath=/data/db 64-bit host=783519c19d49
iijbootcamp-database | 2019-02-15T02:55:28.229+0000 I CONTROL  [initandlisten] db version v4.0.0
iijbootcamp-database | 2019-02-15T02:55:28.229+0000 I CONTROL  [initandlisten] git version: 3b07af3d4f471ae89e8186d33bbb1d5259597d51
iijbootcamp-database | 2019-02-15T02:55:28.229+0000 I CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.0.2g  1 Mar 2016
(省略)
```

`docker compose up` コマンドは、docker-compose.yml ファイルに基づきコンテナを新規作成し、起動するコマンドです。`-d` オプションを利用することで、デーモンとして起動することも可能です。デーモンで起動している際は、ログが表示されなくなってしまうので、見たい場合は`docker compose logs` コマンドで閲覧可能です。また、`-f` オプションを渡すことで、ログを流し続けることができます。

別のターミナル環境を開いて、「docker-compose.yml」が存在するディレクトリ で以下のコマンドを入力してください。

```bash
$ docker compose ps
        Name                     Command             State          Ports
---------------------------------------------------------------------------------
iijbootcamp-backend    ./main                        Up      0.0.0.0:8088->80/tcp
iijbootcamp-database   docker-entrypoint.sh mongod   Up      27017/tcp
```

`docker compose ps` コマンドでは、Docker Compose で管理してる各コンテナの状態を一覧で見ることができます。「State」が「Up」になっていれば立ち上がっている状態です。その他のカラムは`docker ps` の意味と同様です。


#### Webアプリケーションの動作確認方法
では、実際にWebアプリケーションが動作しているか確認するために以下のコマンドを入力してください。

ここでは、まずデータを追加し、次に追加されたデータを取り出しています。

`/get` にアクセスして、最初に登録したデータが取り出せていれば成功です。

```bash
$ curl -X POST -d 'title=iijbootcamp&body=IIJBootCamp is fun!!' http://localhost:8088/add
Successfully added

$ curl http://localhost:8088/get
[{ID:ObjectIdHex("5c6642fc04b685000117c15b") Title:iijbootcamp Body:IIJBootCamp is fun!!}]
```

また、`docker compose start`、`docker compose stop` で一括してコンテナの起動・停止を行えます。さらに起動中のコンテナの停止と削除を一括して行う場合は、`docker compose down` が利用できます。では、先ほど起動したコンテナたちを停止してみましょう。

```bash
$ docker compose down
Stopping iijbootcamp-backend  ... done
Stopping iijbootcamp-database ... done
Removing iijbootcamp-backend  ... done
Removing iijbootcamp-database ... done
Removing network docker-compose_default
```

上記の実行結果より、各コンテナを停止し、削除していることがわかります。また、後述するネットワークも削除しています。

## 3. Docker のネットワーク

前章では、Docker Composeでコンテナ間接続を体験しました。本章では、Docker がどのようにしてネットワークを構築し、ホストとコンテナやコンテナ間を接続しているのかをご紹介します。まずは、以下のコマンドを実行してみてください。

```bash
$ docker network ls
NETWORK ID          NAME                     DRIVER              SCOPE
420d7b4e475a        bridge                   bridge              local
24bd91406a30        docker-compose_default   bridge              local
7b99e3f7a971        host                     host                local
f70accdb164f        none                     null                local
```

`docker network` コマンドは、Docker ネットワークを管理するためのコマンドです。`ls` サブコマンドは、Docker が把握しているすべてのネットワーク一覧を表示するコマンドです。
Docker をインストールすると、自動的に以下の名前の3つのネットワークを作成します。
1. bridge
2. none
3. host

`docker run` コマンドを実行する際に、`--net` オプションで、これらの値を設定することができます。デフォルト値では、`bridge` になっています。Docker がインストールされた今回の環境では、ホストに「**docker0**」というブリッジネットワークが表れます。これが「bridge」に接続されており、Docker はデフォルトでこのネットワークにコンテナを接続します。そのため、ホストからコンテナへの接続やコンテナ間の接続が可能となります。`none` は、ネットワークの接続を必要としないコンテナを作成する際に利用します。`host` は、コンテナがホストと同じインタフェースやIPアドレスを持たせたい際に利用します。

上記結果の中で、「default」で終わるネットワークは、`docker-compose` コマンドによって自動的に作成されたネットワークのことです。「default」の前には、プロジェクト名（docker-compose.ymlファイルが存在するディレクトリ名）が利用されます。

以下のコマンドを入力してください。

```bash
$ docker network inspect bridge
[
    {
        "Name": "bridge",
        "Id": "420d7b4e475aa6a17e94a33cbda837af886dafd98339176e0acd31252904aed6",
        "Created": "2019-02-21T06:07:03.697181196Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```

`inspect` サブコマンドでは、引数に取ったネットワークやコンテナの情報を表示できます。本コマンドによって、サブネットやゲートウェイといった情報などが閲覧できます。割愛しますが、`docker-compose` コマンドによって生成されたbridgeネットワークと各コンテナのIPアドレスを`inspect` サブコマンドで確認してみると同一ネットワークにいることが確認できると思います。

## 4. まとめ

本講義では、Docker Compose を紹介し、実際に`docker-compose` コマンドを使って、複数のサービスを管理していただきました。複数のDocker コンテナを管理する場合、Docker Compose を用いるとDocker単独で利用するよりも効率的に管理することができるためぜひ利用してください。また、OSS の中ではDocker イメージを始め、`docker-compose.yml` を公開しているものも多いため、それらを使って簡単に検証作業や環境構築などを行うことができます。ぜひ有効活用してみてください。

<credit-footer/>
