# go-tutor

* dockerfileの更新手順です
	* `bootcamp/src/server-app/go/src/go-tutor` 上で作業することを想定しています
* 本手順は、講義[GoでWebアプリケーションを作る](../../) で使用するdocker imageの更新手順です
	* 基本的に受講者が行う必要はありません

## 1. update sample
* `./samples` 配下を更新してください
	* docker containerの、`/src/go/samples` に mountされます

## 2. update dockerfile
* `./Dockerfile` を編集してください
	* 平時の更新対象は以下だけだと思います
		* `LABEL maintainer="<your email address>"`
		* `ENV GOVERSION <version of golang>`

## 3. image更新やら試験
1. build と 動作確認
	* `make`
		* docker container の`/src/go/sampple` に移動するので、もろもろ試す
		* 試したあとは、exitで良い(--rm で起動しているので、containerの削除は自動)
1. `1. update sample`, `2. update dockerfile`, 本手順をくり返し、納得のいく構成に更新

## 4. build and push
1. login
	* `docker login`
2. 任意のimage idを確認しておく
	* `docker images`
	* 1つも作成されていない場合は、`3. image更新やら試験` をすると作成されます
3. tag付け
	* `docker tag <image id> <username>/go-tutor:<version>`
		* `<imaege id>`
			* `2. 任意のimage idを確認しておく` で確認したもの
		* `<username>`, `<version>`
			* 任意の値
2. `docker push <username>/go-tutor:<version>`
	* `3. tag付け` と同じ変数値

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

