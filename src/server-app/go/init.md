GoでWebアプリを作る(事前準備編)
===

# 研修で利用するソフトウェア
* [Go](https://golang.org/): Go言語実行環境
* [SQLite3](https://www.sqlite.org/index.html): SQLデータベースエンジン

## Dockerを利用した環境構築
### 前提条件
* PCにDockerの実行環境がある

### 手順
1. docker imageをpullする

```shell
$ docker pull tennashi/go-tutor
...
# 確認コマンド
$ docker images | grep tennashi/go-tutor
tennashi/go-tutor   latest              69bfe60331a2        4 minutes ago        1.02GB
```

2. docker imageを実行する

```shell
$ docker run --name go-tutor -it --rm tennashi/go-tutor /bin/bash
root@8e4755a05784:/go#   # プロンプトが返ってくる
```

3. 作業ディレクトリに移動する

```shell
root@8e4755a05784:/go# cd src/localhost/

# 確認コマンド
root@8e4755a05784:/go/src/localhost# ls
1_hello_world  2_package  3_hello_http  4_rdb  Dockerfile  README.md
```