# go-tutor

* dockerfileの更新手順です
	* `bootcamp/src/server-app/go/go/src-tutor` 上で作業することを想定しています
* 本手順は、講義[GoでWebアプリケーションを作る](../../) で使用するdocker imageの更新手順です
	* 基本的に受講者が行う必要はありません

## 1. update sample
* `./samples` 配下を更新してください
	* docker containerの、`/go/src/samples` に mountされます
* `./go_tutorial` 配下を更新してください
	* docker containerの、`/go/src/go_tutorial` に mountされます

## 2. update dockerfile
* `./Dockerfile` を編集してください
	* 平時の更新対象は以下だけだと思います
		* `LABEL maintainer="<your email address>"`
		* `ENV GOVERSION <version of golang>`

## 3. image更新やら試験
1. build と 動作確認
	* `make`
		* docker container の`/go/src/sampple` に移動するので、もろもろ試す
		* 試したあとは、exitで良い(--rm で起動しているので、containerの削除は自動)
1. `1. update sample`, `2. update dockerfile`, 本手順をくり返し、納得のいく構成に更新

## 4. build and push
1. builderの用意
	```
	docker buildx create --name <buildername>
	docker buildx use <buildername>
	docker buildx inspect --bootstrap
	```
2. login
	* `docker login`
3. build and push
	```
	docker buildx build --platform linux/arm64,linux/amd64,linux/386,linux/s390x,linux/arm/v7,linux/arm/v6 -t <username>/go-tutor:<version> --push .
	```
4. logout
	* `docker logout`

## 5. ゴミ掃除
1. tag付け対象削除
	* `docker rmi <username>/go-tutor:<version>`
2. その他 作業中のdockerimage
	* `make clean`

## 6. リンクの更新

* 講義[GoでWebアプリケーションを作る](../../) で、参照しているpathを書き換えます
* 本手順作成時点で確認しているpathは、以下です
	* [GoでWebアプリケーションを作る(下準備編)](../../var/md/init.md)
		* docker pullしてくる対象のimage名

