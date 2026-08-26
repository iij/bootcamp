---
footer: CC BY-SA Licensed | Copyright (c) 2026, Internet Initiative Japan Inc.
title: Docker を触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
updated: 2026-07
---

<header-table/>

# Docker コンテナの管理

## おさらい

ここまででDocker コンテナのイメージの取得からコンテナの構築に加え、実際に自分でイメージを作成する所までを行いました。  
しかし、先ほどの講義では以下の項目についての確認には言及していません。

- 取得したイメージがきちんと取得できているのか？
- 起動したコンテナが間違いなく起動しているのか？
- 作業完了後に後片付け・余計なリソースやプロセスが残っていないか？

実際のコンテナの活用にはこういったDocker コンテナの管理が必要不可欠です。
特に運用現場では、不要なリソースの整理や状態確認が重要です。  
従って本項では、Docker コンテナを管理する為のコマンドを学習します。

## 演習3. Docker コマンド各種を実行してみる

ここで紹介するコマンドは日常的な管理作業で使う代表的なものを挙げています。
それぞれ実行してみましょう。

### 3-1. イメージの一覧表示

`docker image` コマンドは、ローカルに存在するDocker イメージを管理するためのコマンドです。  
`docker image ls`　でローカルに存在するDockerイメージの一覧を表示します。 イメージ名やタグ、サイズなどを確認できます。

```bash
$ docker image ls
```

<details><summary>実行例</summary>

```bash
IMAGE                           ID             DISK USAGE   CONTENT SIZE   EXTRA
alpine:latest                   28bd5fe8b56d         13MB         3.93MB
bootcamp_docker:latest          1d9aa4c413b3        232MB         72.1MB
docker/getting-started:latest   d79336f4812b       73.9MB         21.4MB
hello-world:latest              96498ffd522e       25.9kB         9.49kB
ubuntu:latest                   3131b4cc82a7        161MB         45.3MB
```

</details>

### 3-2. コンテナの一覧表示

`docker ps` コマンドは、現在起動中のコンテナを表示します。  
停止したコンテナも含めて確認したい場合は `-a` オプションを付けます。

```bash
$ docker ps
$ docker ps -a
```

<details><summary>実行例</summary>

```bash
$ docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                     NAMES
ee4fc314d694   bootcamp_docker   "nginx -g 'daemon of…"   9 minutes ago   Up 9 minutes   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   stoic_lewin
```

```bash
$ docker ps -a
CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS                     PORTS                                     NAMES
47cec83d9286   hello-world       "/hello"                 5 minutes ago    Exited (0) 5 minutes ago                                             inspiring_elgamal
ee4fc314d694   bootcamp_docker   "nginx -g 'daemon of…"   10 minutes ago   Up 10 minutes              0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   stoic_lewin
```

</details>

### 3-3. コンテナの起動・停止・再開

- **起動(初回)**  
  イメージから新しくコンテナを作成して起動します。

  ```bash
  $ docker run --name iij-bootcamp -d -p 8888:80 docker/getting-started
  ```

  `docker ps` を実行するとコンテナが起動しているはずです。

- **停止**  
  起動中のコンテナを停止します。「CONTAINER ID」 は`docker ps` で確認できます。

  ```bash
  $ docker stop <CONTAINER ID>
  ```
  
  コンテナを停止すると`docker ps` の一覧からは見れなくなっているはずです。  
  その場合は演習3-2. にて説明したように `-a` オプションを付けることで停止したコンテナも確認できるという訳です。  
  また、コマンドで確認してみると「STATUS」列の表示が直近の時間で停止した旨の表示になっています。

  <details><summary>出力例</summary>

  ```bash
  $ docker ps -a
  CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS                     PORTS                                     NAMES
  4e37d78daa1f   docker/getting-started   "/docker-entrypoint.…"   32 minutes ago   Exited (0) 2 seconds ago                                             iij-bootcamp
  ```

- **再開**  
  停止したコンテナを再度起動します。

  ```bash
  $ docker start <CONTAINER ID>
  ```

  `docker ps` コマンドで確認してみると「STATUS」列が直近の時間で起動した旨の表示になっています。

  <details><summary>出力例</summary>

  ```bash
  $ docker ps
  CONTAINER ID   IMAGE                    COMMAND                  CREATED              STATUS          PORTS                                     NAMES
  7437957e85b6   docker/getting-started   "/docker-entrypoint.…"   About a minute ago   Up 2 seconds    0.0.0.0:8888->80/tcp, [::]:8888->80/tcp   iij-bootcamp
  ```

  </details>

### 3-4. コンテナ・イメージの削除

不要なコンテナやイメージは削除してディスク容量を確保しましょう。

- **コンテナの削除**  
  基本的にコンテナを削除する場合、対象となるコンテナは停止しておく必要があります。  
  3-3. で再開させたコンテナを今一度停止させましょう。

  ```bash
  $ docker stop iij-bootcamp
  ```

  ここで何かに気づいた人はいますか?

  今までコンテナに対して操作する為に「CONTAINER ID」を確認して貰っていましたがここでは「iij-bootcamp」という文字列を指定しています。  
  これは演習3-3. 起動時にオプションとして`--name` を使いユーザが識別しやすいユニークな名前を指定していたためです。  
  この様に適切な名前を付与しておくことで、ユーザがより効率的にコンテナを管理することができます。  
  `--name` を付与しなくともdocker 側で任意の名前を付与してくれるため必ずしも`--name` オプションが必要な訳ではありません。
  
  ではコンテナが停止しているはずなので、コンテナを削除しましょう。

  ```bash
  $ docker rm iij-bootcamp
  ```

  前項の[Docker コンテナイメージを作成して起動する](./RUN_AS_IMAGE.md)(演習2-5.) から続けてハンズオンを受講している方は恐らくコンテナが1つ起動していると思いますので、先程と同様にコンテナの停止・削除をしておきましょう。  
  「CONTAINER ID」の値を用いて停止・削除を行っても良いですし、 「NAMES」の値を用いても構いません。

  > 💡 コンテナを停止せずに直接削除しようとすると...
  > <details><summary>エラー例</summary>
  >
  > ```bash
  > Error response from daemon: cannot remove container "4e37d78daa1f": container is running: stop the container before removing or force remove
  > ```
  >
  > </details>

- **イメージの削除**  
  イメージを削除する前に改めてイメージの一覧表示をしておきましょう。  
  コマンドが分からない場合は演習3-1. を確認しましょう。

  一覧を確認したのち、実際にイメージを削除します。

  ```bash
  $ docker image rm docker/getting-started
  ```

  イメージ削除後、改めてイメージ一覧を確認すると「docker/getting-started」が一覧から削除されていることが確認できます。

  ※ イメージを削除する前に、そのイメージを使ったコンテナが全て削除されている必要があります。

### 3-5. その他の管理コマンドの一例

- **ログの確認**  
  コンテナの標準出力ログを確認できます。

  ```bash
  $ docker logs <CONTAINER ID>
  ```

- **リソース使用状況の確認**  
  コンテナのCPUやメモリ使用量をリアルタイムで確認できます。

  ```bash
  $ docker stats
  ```

- **不要なリソースの一括削除**  
  停止中のコンテナや未使用イメージをまとめて削除できます。

  ```bash
  $ docker system prune
  ```

  > ⚠️ **注意:**  
  > このコマンドを実行すると、停止中のコンテナ・未使用のイメージ・未使用のネットワーク・ビルドキャッシュなどがすべて削除されます。  
  > 必要なデータやイメージまで消してしまう可能性があるため、実行前に内容をよく確認してください。  
  > さらに、`-a` オプションを付けると未使用のすべてのイメージも削除されるので、特に注意が必要です。

## まとめ

この章では、Docker コンテナやイメージの状態確認・起動・停止・削除など、運用に必要な基本操作を学びました。  
これらのコマンドを活用することで、効率的にDocker 環境を管理できます。  

<credit-footer/>
