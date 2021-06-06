GoでWebアプリケーションを作る(下準備編)
===

* 講義 [GoでWebアプリケーションを作る](../../) 活用する、DockerContainerの準備手順です

## 講義利用物(配布しているDockerImageに含まれています)
* [Go](https://golang.org/)
* curl
* エディタ(いずれか1つ使えれば大丈夫です)
	* vim-nox
	* emacs-nox
	* nano

## 前提条件
* PCにDockerの実行環境がある事
* CLIでエディタを触れる心

## 手順
1. docker imageをpullする
	```shell
	$ docker pull hinoshiba/go-tutor
	...
	:# 確認コマンド
	$ docker images | grep hinoshiba/go-tutor
	hinoshiba/go-tutor   latest              <image id>        x minutes ago        <size>
	```
2. docker imageを実行する
	```shell
	$ docker run --name go-tutor -it --rm hinoshiba/go-tutor /bin/bash
	root@<container id>:/go/src/samples#   # プロンプトが返ってくる
	```
3. 作業ディレクトリの確認
	```shell
	root@<container id>:/go/src/samples# ls
	Dockerfile  README.md  calc  hello_world  poke_api  pokemon
	```
4. 任意のエディタ起動確認
	```shell
	:# 下記3つ、どちらでも大丈夫です
	root@<container id>:/go/src/samples# vim
	root@<container id>:/go/src/samples# nano
	root@<container id>:/go/src/samples# emacs
	```
	* 注意事項: DockerContainerの話
		* コンテナは、停止するとデータが **保存されません**
		* そのため、`.vimrc`のような設定ファイルを頑張って保存しても、コンテナを停止すると消えます
