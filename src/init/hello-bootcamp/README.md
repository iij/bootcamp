---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
description: ハンズオン事前準備
time: 0.5h
prior_knowledge: なし
---

<header-table/>

# ハンズオン事前準備

各ハンズオンに取り組む前に、各ハンズオン用の環境を [Docker](https://www.docker.com/) で動かせるように準備します。

## Docker のインストール (Check.1)

各 OS やプラットフォームごとのインストール方法はここにドキュメントがあります。
https://docs.docker.com/engine/install/

この資料では Windows と macOS について、簡単に取り上げます。

### 読み方
```
このような 黒枠 になっている部分は 実際にコマンドを打ち込む部分です。 Terminal や コマンドプロンプトなどで入力ください
$ また、 左端の $ や > は プロンプトと言って 実際には入力しません。
```

例えば 以下の表記であれば ```$ docker --version ``` ではなく ```docker --version``` とだけ入力してください。
なお、 $ や > から始まらない ```Docker version 19.03.1``` は 出力例です。 こちらも 入力する必要はありません。
コピペするときは気をつけてください。

```
$ docker --version

Docker version 19.03.1
```

### Windows

windows の場合 [docker-for-windows](https://docs.docker.com/docker-for-windows/) を使うのがおすすめです。WSL や仮想環境に linux を立てることもできますが、ネットワークのトラブルなどが頻発するため現状あまりお勧めしません。

1. [ダウンロードページ](https://hub.docker.com/editions/community/docker-ce-desktop-windows/) にアクセスし、「Get Docker」をクリックして exe ファイルをダウンロードします。
   - stable 版で問題ありません
2. ダウンロードした exe ファイルをクリックしてインストールします。
3. PowerShell やコマンドプロンプトを開き、`docker version`コマンドが実行できれば成功です。

```
> docker --version

Docker version 19.03.1
```

### Mac

Mac の場合は [docker-for-mac](https://docs.docker.com/docker-for-mac/) を使います。

1. [ダウンロードページ](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) にアクセスし、「Get Docker」をクリックして dmg ファイルをダウンロードします。
2. ダウンロードした dmg ファイルをクリックしてインストールします。
3. terminal を開き、`docker version`コマンドが実行できれば成功です。

```
$ docker --version

Docker version 19.03, build c97c6d6
```

## Hello Docker

### hello-world コンテナを動かす (Check.2)

hello-world コンテナをダウンロードして、実際に docker で動かしてみます。

```bash
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
ca4f61b1923c: Pull complete
Digest: sha256:ca0eeb6fb05351dfc8759c20733c91def84cb8007aa89a5bf606bc8b315b9fc7
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

`Hello from Docker!`が表示されていれば成功です。

### 失敗した場合

以下のようなエラーで失敗した場合 proxy の設定が必要な場合があります。

```
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
docker: Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers).
See 'docker run --help'.
```

「docker {OS 名} proxy」などで検索すると、以下のような記事が検索されると思うので、参考にしながら設定してみてください。

- Windows: https://qiita.com/wryun0suke/items/1f4bbd2977ae41ee7a36
- Mac: https://qiita.com/kobakou/items/214129924b9cd3e64d0f

proxy の URL は環境によって異なるため、周りの誰かに確認してください。

### それでもダメな場合 or 違うエラーの場合

TA や講師など、周りの先輩に遠慮なく声をかけてください。

## Nginx を立てて手元で HTML を書き換える

次は docker の [volume](https://docs.docker.com/storage/volumes/) という機能を使い、コンテナの中のファイルを手元で編集できるようにしてみます。
これができると docker 環境で動かすファイルを手元のエディタで編集できるためとても便利です。

ここでは Nginx という web サーバーを使い、簡単な HTML ファイルをホスティングしてみます。そしてその HTML ファイルを手元で書き換えてみましょう。

### HTML ファイルの作成

以下のようにディレクトリを作成し、

```
$ mkdir content
```

その中に `index.html`  ファイルを作成してください。

例えば、 vim を使うなら以下のような コマンド になります。
vim がなければ 各種 メモ帳など自分の好きなエディタを利用してください。
vim から抜けるには ESCキーを押した後「:wq<Enter>」を入力してください。

```
$ vim content/index.html
```

`index.html`の内容はなんでもいいですが、例えば以下のようにしてみましょう。

```html
Hello Bootcamp!
```

### docker コンテナの起動 (Check.3)

`index.html` ファイルが作成できたら、nginx の docker コンテナを以下のように起動します。

いずれも
* `--name` : test-nginx という名前で
* `-p 8080:80` : localhost の 8080 port を コンテナの中で 80 port に 転送し
* `--mount....`: いまのディレクトリの content ディレクトリの内容を コンテナの中で /usr/share/nginx/html の中身として扱い
* `-d`: daemon (バックグラウンドで実行し続ける)モードで
* `nginx`: nginx:latest タグ の イメージを使って コンテナを起動する
というものになります。

windows

```
> docker run --name test-nginx -p 8080:80 --mount type=bind,source=%CD%¥content,target=/usr/share/nginx/html,ro -d nginx

47fb496ed83cb26558874e8fd6b6fff4303031a2b24f827a938310ee9646c638
```

mac/linux

```
$ docker run --name test-nginx -p 8080:80 --mount type=bind,source=$PWD/content,target=/usr/share/nginx/html,ro -d nginx

47fb496ed83cb26558874e8fd6b6fff4303031a2b24f827a938310ee9646c638
```

エラーなく起動できたら 起動したコンテナのID が表示されます。ここは実行ごとに変わります。
ブラウザを開き、[localhost:8080](http://localhost:8080) （`localhost`または ssh 先の IP アドレス）にアクセスしてみましょう。「Hello Bootcamp!」が表示されていれば成功です。
`-d` オプションを付けているので、 バックグラウンドで起動し続けています。 再度起動し直してみたい場合は 一度 ```docker stop``` する必要があります。お掃除の手順を参照してください。

### HTML ファイルを書き換える

先ほど作成した`index.html`を編集してみましょう。

```html
Hello Bootcamp!!!!!!
```

保存してブラウザをリロードしてみてください。ページが更新されていれば成功です。

## Docker コンテナのお掃除

最後に Docker コンテナを止めて掃除しておきます。

```
$ docker stop test-nginx
$ docker rm test-nginx
```

以上で事前準備は完了です。お疲れ様でした。
