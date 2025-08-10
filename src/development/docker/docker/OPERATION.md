---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
title: Dockerを触ってみよう
description: Docker の概要を学び、コンテナ操作を体験します
time: 1h
prior_knowledge: 仮想化、CUI 操作
---

<header-table/>


## Dockerコンテナの管理

ここまででDockerコンテナのイメージの取得からコンテナの構築に加え、実際に自分でイメージを作成する所までを行いました。
しかし、先ほどの講義では以下の項目についての確認には言及していません。

- 取得したイメージがきちんと取得できているのか？
- 起動したコンテナが間違いなく起動しているのか？
- 作業完了後に後片付け・余計なリソースやプロセスが残っていないか？

実際のコンテナの活用にはこういったDockerコンテナの管理が必要不可欠です。
特に運用現場では、不要なリソースの整理や状態確認が重要です。
従って本講では、Dockerコンテナを管理する為のコマンドを学習します。

## 演習.3 Dockerコマンド各種を行ってみる

ここで紹介するコマンドは日常的な管理作業で使う代表的なものを挙げています。
それぞれ実行してみましょう。

### 1. イメージの一覧表示

`docker images` コマンドは、ローカルに存在するDockerイメージの一覧を表示します。  
イメージ名やタグ、サイズなどを確認できます。

```bash
docker images
```

<details><summary>実行例</summary>

```
REPOSITORY            TAG       IMAGE ID       CREATED         SIZE
docker/getting-started latest   cb90f98fd791   2 months ago    28.8MB
```
</details>

---

### 2. コンテナの一覧表示

`docker ps` コマンドは、現在起動中のコンテナを表示します。  
停止したコンテナも含めて確認したい場合は `-a` オプションを付けます。

```bash
docker ps
docker ps -a
```

<details><summary>実行例</summary>

```
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS    PORTS     NAMES
f908c593f036   docker/getting-started   "/docker-entrypoint.…"   2 seconds ago   Created             getting-started
```
</details>

---

### 3. コンテナの起動・停止・再開

- **起動（初回）**  
  イメージから新しくコンテナを作成して起動します。

  ```bash
  docker run --name iij-bootcamp_docker01 -d -p 8080:80 docker/getting-started
  ```

- **停止**  
  起動中のコンテナを停止します。`CONTAINER ID`は`docker ps`で確認できます。

  ```bash
  docker stop <CONTAINER ID>
  ```

- **再開**  
  停止したコンテナを再度起動します。

  ```bash
  docker start <CONTAINER ID>
  ```

---

### 4. コンテナ・イメージの削除

不要なコンテナやイメージは削除してディスク容量を確保しましょう。

- **コンテナの削除**

  ```bash
  docker rm iij-bootcamp_docker01
  ```

- **イメージの削除**

  ```bash
  docker rmi docker/getting-started
  ```

※イメージを削除する前に、そのイメージを使ったコンテナが全て削除されている必要があります。

---

### 5. その他の管理コマンド（追加推奨）

- **ログの確認**  
  コンテナの標準出力ログを確認できます。

  ```bash
  docker logs <CONTAINER ID>
  ```

- **リソース使用状況の確認**  
  コンテナのCPUやメモリ使用量をリアルタイムで確認できます。

  ```bash
  docker stats
  ```

- **不要なリソースの一括削除**  
  停止中のコンテナや未使用イメージをまとめて削除できます。

  ```bash
  docker system prune
  ```

  > ⚠️ **注意:**  
  > このコマンドを実行すると、停止中のコンテナ、未使用のイメージ、未使用のネットワーク、ビルドキャッシュなどがすべて削除されます。  
  > 必要なデータやイメージまで消してしまう可能性があるため、実行前に内容をよく確認してください。  
  > さらに、`-a` オプションを付けると未使用のすべてのイメージも削除されるので、特に注意が必要です。

---

## まとめ

この章では、Dockerコンテナやイメージの状態確認・起動・停止・削除など、運用に必要な基本操作を学びました。  
これらのコマンドを活用することで、効率的にDocker環境を管理できます。  
次の章では、Dockerイメージの作成方法についてさらに詳しく学びます。

<credit-footer/>
