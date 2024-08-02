GoでWebアプリケーションを作る(下準備編)
===

* 講義 [GoでWebアプリケーションを作る](../../) 活用する、DockerContainerの準備手順です

## 講義利用物(配布しているDockerImageに含まれています)
* [Go](https://golang.org/)
* curl
* エディタ(いずれか1つ使えれば大丈夫です)
	* vim
	* emacs
	* nano
    * VSCode

## 前提条件
* PCにDockerの実行環境がある事

## 手順
### 1. docker compose ファイルの取得

```shell
$ curl -o docker-compose.yml https://raw.githubusercontent.com/iij/bootcamp/master/src/server-app/go/src/go-tutor/docker-compose.yml
```
   
### 2. 任意のエディタ起動確認
#### 4.0. 注意事項: DockerContainerの話
   
   * コンテナは、停止するとデータが **保存されません**
   * そのため、`.vimrc`のような設定ファイルを頑張って保存しても、コンテナを停止すると消えます

#### 4.1. CLIで作業する場合
コンテナを動かして作業してください。
	
```shell
$ docker compose run golang /bin/bash
```

各エディタは以下のコマンドから起動できます	
```shell
root@<container id>:/go/src/# vim
root@<container id>:/go/src/# nano
root@<container id>:/go/src/# emacs
```
      
#### 4.2. VSCodeで作業する場合
##### 4.2.1. VSCode Serverを起動します
```shell
:# VSCode Server の起動
$  docker compose up -d 
 ```
   
##### 4.2.2. ブラウザで`http://localhost:80`にアクセス
パスワードを聞かれた場合は`iij-bootcamp`と入力

VScodeの画面が表示されたら `/go/src/go_tutorial/` ディレクトリを開いてください。