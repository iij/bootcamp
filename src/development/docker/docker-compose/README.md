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

この講義では ```docker compose (docker-compose)```はコマンドを使います。
従って講義を受けるにあたり、**docker comose(docker-compose)**のインストールを済ませておいてください

- 環境ごとに インストール方法が異なるので、自身の環境に合わせて導入してください。
- インストールが完了したら下記コマンドを実際に入力し、コマンドが実行できるか確認してください。
  ```bash
  $ docker compose version
  ```

### Windows, macOS向け

* [ハンズオン事前準備](https://iij.github.io/bootcamp/init/hello-bootcamp/) で Docker Desktop for Windowsや、Docker Desktop for Mac を導入済みであれば、すでにインストールされているはずです。

### Linux向け

* 以下の手順に従って、`docker compose` をインストールしてください。
 * https://matsuand.github.io/docs.docker.jp.onthefly/compose/install/


## Docker Compose 概要

Docker composeは、Dockerコンテナを管理し、複数のコンテナから成るアプリケーションを定義、実行、管理するためのツールです。
Docker composeを使用することで、複数のDockerコンテナを1つのアプリケーションとして簡単に扱うことができます。
Docker composeの主な機能は以下の通りです。

- アプリケーションの定義
  - docker-composeでは、YAML形式のファイルである`docker-compose.yml`を使用して、アプリケーションの構成やサービスの定義を行います。
  - このファイルには、各コンテナのイメージ、ポートマッピング、環境変数、ボリュームのマウントなど、アプリケーションの構成情報が含まれます。
- 複数コンテナの一括管理
  - docker-composeは、複数のコンテナを一括して管理するためのコマンドを提供します。
    - 例えば`docker-compose up`コマンドを実行すると、`docker-compose.yml`に定義されたすべてのコンテナが起動します。
    - 同様に`docker-compose stop`コマンドを使用すると、`docker-compose.yml`に定義されたすべてのコンテナが停止されます。
- サービス間の依存関係の管理
  - docker-composeでは、複数のコンテナ間の依存関係を簡単に管理することができます。
    - 例えば、アプリケーションがデータベースコンテナとWebサーバーコンテナから成る場合、データベースが正しく起動した後にWebサーバーが起動するようにする、といったことができます
- 環境変数とシークレットの管理
  - docker-composeでは、環境変数やシークレットの値を`docker-compose.yml`ファイルに定義することができます
    - これにより、アプリケーションの設定情報や機密情報を簡単かつ安全に管理することができます。
- スケーリングと更新
  - docker-composeを使用すると、アプリケーションのスケーリングや更新も簡単に行うことができます。
    - 例えば、`docker-compose scale`コマンドを使用すると、特定のサービスのコンテナ数をスケールアップまたはスケールダウンすることができます。また、新しいイメージのビルドや既存のコンテナの更新もdocker-composeコマンドで行うことができます。

このようにdocker-composeを使用することで、開発、テスト、本番環境など、さまざまな環境でアプリケーションを簡単かつ一貫して管理することができます。

### 依存関係を用いたDocker compose の使い方

前項で説明したように以下の2つのコンポーネントから構成されるWebサービスをDockerコンテナを用いた場合を想定してみましょう。

- フロントエンド（Flask）
- バックエンド（Rails）

通常、この構成のWeb サービスを起動する際、各コンテナを立ち上げるため、`docker run` コマンドを2回実行する必要がでてきます。従って停止する際も同様に2回の操作が必要です。

しかし、Docker Compose を用いて管理を行うと、各コンテナの定義をした設定ファイルである「**docker-compose.yml**」に基づいて一括管理することが可能となります。
具体的には、上記の各コンテナの起動・停止などは、`docker compose` コマンドを1回実行するだけで済みます。

また、コンテナの起動順序も先にデータベースを起動し、後からWebサーバを起動する、といったように適切な順番で起動することが可能となります。

これらは特に開発やテストなどの際に、サービスの起動停止は複数回繰り返したりする為、作業の効率化につながります。

本講義では、実際に複数コンテナをDocker Composeを用いて管理を行っていきます。Docker Composeを使ったアプリケーションを実行するまでの一般的な流れは以下の通りです。

1. 各コンテナのDockerfile の作成
2. docker-compose.yml の作成
3. `docker compose` コマンドを使った複数のコンテナの管理

そこで本講義でも上記の流れに沿って講義を進めていきます。

## Docker Compose 演習1

本章では、実際に`docker compose` コマンドを使って複数コンテナの立ち上げや停止などをしていただきます。
今回題材のサービスは、Python製のWebAPIフレームワークとしてFlask を利用したWebアプリケーションです。
Webアプリケーション自体の作成は本質ではないので、サンプルコードをそのまま利用していただきます。Web アプリケーションの機能は以下の2点です。

作業の過程で作成・取得するそれぞれのファイルは以下のように配置してください

```bash
.
├── app.py
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

### 1-1. サンプルアプリケーションの作成

今回は Docker composeの項であるため Pythonアプリケーションについては言及しません。
アプリケーションはそれぞれ以下から取得してください。

```bash
 curl https://raw.githubusercontent.com/iij/bootcamp/master/src/development/docker/docker-compose/solution/app.py -O app.py
```

```bash
 curl https://raw.githubusercontent.com/iij/bootcamp/master/src/development/docker/docker-compose/solution/requirements.txt -O requirements.txt
```

### 1-2. Dockerfile の作成

この節では、前述したコンテナのDockerfile を作成します。
Dockerfile の作成については、前講義「Docker を触ってみよう」で行いましたので、各命令などの詳細な説明は割愛します。

以下の内容をファイル名「Dockerfile」で作成してください。

```Dockerfile
FROM python:3.11-slim
WORKDIR /code

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

EXPOSE 5000
COPY app.py app.py
CMD ["flask", "run"]
```

### 1-3. docker-compose.yml の作成と解説

次に、以下の内容をファイル名「docker-compose.yml」で新規作成してください。

```yaml
version: '3'
services:
  web:
    container_name: iijbootcamp-flask
    build: .
    # networks:
    #   - iijbootcamp
    ports:
      - "8088:5000"
    # volumes:
    #   - ./index /app/index
    logging:
      driver: "json-file" # defaults if not specified
      options:
        max-size: "1m"
        max-file: "30"
  redis:
    container_name: iijbootcamp-backend
    image: "redis:alpine"
    # networks:
    #   - iijbootcamp
    logging:
      driver: "json-file" # defaults if not specified
      options:
        max-size: "1m"
        max-file: "30"

# networks:
#   iijbootcamp:
#     external: true
```

では、ファイルの各設定について見ていきたいと思います。

- `version` では、docker-compose.yml自体のバージョンを設定します。現在の最新版は、3系です。ここで指定するバージョンによって機能の違いが生じるため、調べる際には気を付けてください。

- `services` では、Docker Compose で管理する各サービスを子要素として定義していきます。本設定の子要素になっている`web` と`redis` が、それぞれflaskとRedisのWebアプリケーション用のサービスです。ここは、好きな名前を設定できます。

次に、`redis` の子要素について見ていきます。

- `container_name` は、作成されるコンテナ名を設定しています。この値やサービス名は、別コンテナからアクセスされる際のホスト名としても利用可能となります。
- `image` では、Docker イメージを指定します。Dockerfile と同様ローカルにDocker イメージが存在しない場合は、DockerHub などからダウンロードしてきます。

最後に、`web` の子要素について見ていきます。

- `build` は、独自にDockerfile などを用いてDocker イメージを作成する際に使う設定です。`build` の子要素に、Dockerfile が格納されているディレクトリを示す`context` が必須となっています。また、今回のようにDockerfile に「Dockerfile」以外の名前を使っている場合は、`dockerfile` で対象ファイル名を指定する必要があります。


- `ports` は、ホストとコンテナのポートをマッピングする設定です。今回の場合、backend サービスは、コンテナ内でポート80で起動しているので、ホストのポート8088へアクセスしたらコンテナ内の80に接続されるように設定しています。ここに記載する値は、文字列を推奨します。なぜならば、YAML の仕様では、`XX:YY` は、60進数として解釈されてしまうため、意図しない値になる可能性があるためです。

その他詳しい機能について知りたい方は、[公式のリファレンス](https://docs.docker.com/compose/compose-file/)をご参照ください。

### 1-4. docker compose コマンドを用いて起動する

では、必要なものはすべて揃ったので、「docker-compose.yml」が存在するディレクトリで、以下のコマンドを入力してください。

```bash
$ docker compose build
$ docker compose up
```

初回実行時は必要な image の取得や Dockerfile.backend を利用した docker build などが実行されるため、時間がかかります。

また、もし プロキシ 環境下で 正常に apk 等が成功しない場合は 以下のように ```docker compose build``` してから試してみてください。

```bash
$ docker compose build --build-arg https_proxy=http://<proxy>:<port>
$ docker compose up
```

`docker compose up` コマンドは、docker-compose.yml ファイルに基づきコンテナを新規作成し、起動するコマンドです。
`-d` オプションを利用することで、デーモンとして起動することが可能です。
デーモンで起動している際は、ログが表示されなくなってしまうので、見たい場合は`docker compose logs` コマンドで閲覧可能です。
また、`-f` オプションを渡すことで、ログを流し続けることができます。

別のターミナル環境を開いて、「docker-compose.yml」が存在するディレクトリ で以下のコマンドを入力してください。

```bash
$ docker compose ps
```

<details><summary>実行例</summary>

```
NAME                  IMAGE               COMMAND                  SERVICE             CREATED             STATUS              PORTS
iijbootcamp-backend   redis:alpine        "docker-entrypoint.s…"   redis               8 seconds ago       Up 7 seconds        6379/tcp
iijbootcamp-flask     solution-web        "flask run"              web                 8 seconds ago       Up 7 seconds        0.0.0.0:8088->5000/tcp, :::8088->5000/tcp
```
</details>

`docker compose ps` コマンドでは、Docker Compose で管理してる各コンテナの状態を一覧で見ることができます。「State」が「Up」になっていれば立ち上がっている状態です。その他のカラムは`docker ps` の意味と同様です。


#### 1-5. Webアプリケーションの動作確認方法

無事に起動できたならば `http://localhost:8088`にて画面が表示される為、ブラウザでアクセスしてみてください。
内部では表示回数をカウントしているため、リロードなどをする度に数が増える事でしょう。

## 演習2 Docker のネットワークを確認する

前章では、Docker Composeでコンテナ間接続を体験しました。
本章では、Docker がどのようにしてネットワークを構築し、ホストとコンテナやコンテナ間を接続しているのかをご紹介します。

### 2-1. docker network ls

`docker network` コマンドは、Docker ネットワークを管理するためのコマンドです。
`ls` サブコマンドは、Docker が把握しているすべてのネットワーク一覧を表示するコマンドです。
Docker をインストールすると、自動的に以下の名前の3つのネットワークを作成します。

1. bridge
2. none
3. host

`docker run` コマンドを実行する際に、`--net` オプションで、これらの値を設定することができます。
デフォルト値では、`bridge` になっています。Docker がインストールされた今回の環境では、ホストに「**docker0**」というブリッジネットワークが表れます。
これが「bridge」に接続されており、Docker はデフォルトでこのネットワークにコンテナを接続します。
そのため、ホストからコンテナへの接続やコンテナ間の接続が可能となります。`none` は、ネットワークの接続を必要としないコンテナを作成する際に利用します。
`host` は、コンテナがホストと同じインタフェースやIPアドレスを持たせたい際に利用します。

上記結果の中で、「default」で終わるネットワークは、`docker compose` コマンドによって自動的に作成されたネットワークのことです。「default」の前には、プロジェクト名（docker-compose.ymlファイルが存在するディレクトリ名）が利用されます。

それでは、以下のコマンドを実行してみてください。

```bash
$ docker network ls
```

<details><summary>実行例</summary>

```
NETWORK ID          NAME                     DRIVER              SCOPE
420d7b4e475a        bridge                   bridge              local
24bd91406a30        docker-compose_default   bridge              local
7b99e3f7a971        host                     host                local
f70accdb164f        none                     null                local
```
</details>


### 2-2. docker networkの詳細を知る

では、それぞれのネットワークがどのような空間・アドレスレンジを持っているのか確認するにはどうすればいいでしょうか。
`docker network`には`inspect`というサブコマンドがあり、詳細を確認することができるようになっています。

`inspect` サブコマンドでは、引数に取ったネットワークやコンテナの情報を表示できます。本コマンドによって、サブネットやゲートウェイといった情報などが閲覧できます。
割愛しますが、`docker compose` コマンドによって生成されたbridgeネットワークと各コンテナのIPアドレスを`inspect` サブコマンドで確認してみると同一ネットワークにいることが確認できると思います。


以下のコマンドを入力してください。

```bash
$ docker network inspect bridge
```

<details><summary>実行例</summary>

```json
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
</details>


## 4. まとめ

本講義では、Docker Compose を紹介し、実際に`docker compose` コマンドを使って、複数のサービスを管理していただきました。
複数のDocker コンテナを管理する場合、Docker Compose を用いるとDocker単独で利用するよりも効率的に管理することができるためぜひ利用してください。
また、OSS の中ではDocker イメージを始め、`docker-compose.yml` を公開しているものも多いため、それらを使って簡単に検証作業や環境構築などを行うことができます。
ぜひ有効活用してみてください。

<credit-footer/>
