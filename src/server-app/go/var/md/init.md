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
    * VSCode

## 前提条件
* PCにDockerの実行環境がある事

## 手順
### 1. docker imageをpullする
	```shell
	:# 全員
	$ docker pull jo7oem/go-tutor:v2022
 
	:# VSCodeの人はこのImageも
	$ docker pull jo7oem/go-tutor-vscode:v2022
	...
	:# 確認コマンド
	$ docker images | grep go-tutor
	hinoshiba/go-tutor   latest              <image id>        x minutes ago        <size>
	```
### 2. docker imageを実行する
	```shell
	$ docker run --name go-tutor -it --rm jo7oem/go-tutor:v2022 /bin/bash
	root@<container id>:/go/src/samples#   # プロンプトが返ってくる
	```
### 3. 作業ディレクトリの確認
    ```shell
    root@<container id>:/go/src/# ls
    go_tutorial  samples
    ```
   
### 4. 任意のエディタ起動確認
#### 4.0. 注意事項: DockerContainerの話
   
   * コンテナは、停止するとデータが **保存されません**
   * そのため、`.vimrc`のような設定ファイルを頑張って保存しても、コンテナを停止すると消えます

#### 4.1. CLIで作業する場合
   ```shell
   :# 下記3つ、どちらでも大丈夫です
   root@<container id>:/go/src/# vim
   root@<container id>:/go/src/# nano
   root@<container id>:/go/src/# emacs
   ```
      
#### 4.2. VSCodeで作業する場合
##### 4.2.1. VSCode Serverを起動します
      ```shell
         :# VSCode Server の起動
         $  docker run --name go-tutor-vscode -p 8888:8888 -itd --rm jo7oem/go-tutor-vscode
      ```
   
##### 4.2.2. ブラウザで`http://localhost:8888`にアクセス
##### 4.2.3. パスワードを聞かれた場合は`iij-bootcamp`と入力
