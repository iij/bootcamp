---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

## 2. インベントリ の作成

この章では、Ansibleインベントリの基本概念と、インベントリファイルの作成・管理方法について学びます。

---

### インベントリとは？

Ansibleインベントリは、管理対象ノード（ホスト）のリストやグループを定義するファイルです。
インベントリを使うことで、複数のホストに対して一括でタスクを実行できます。
インベントリは静的ファイル（INI形式またはYAML形式）として定義するほか、動的に生成することも可能です。

- ホストはグループ化でき、グループは子グループを持つこともできます。
- ホストは複数グループに所属可能です。
- インベントリにはホストやグループに適用する変数も記述できます。

---

### インベントリファイルの作成方法

Ansibleのインベントリファイルは、INI形式またはYAML形式で記述します。
Ansible において、Inventory ファイルは対象を示していて実行に欠かせない要素です。

[教材](https://github.com/iij/ansible-exercise)には ansible ディレクトリの配下にインベントリファイルを置くためのディレクトリ（inventories）があります。
inventories/hosts を試しに開いてみましょう。
以下のような記載がなされているはずです。

```text
[web]
web00
app00
```

このようにAnsible の Inventory ファイルは INI 形式に近い記述によって作成されます。
インベントリファイルの括弧内の見出し(`[app]`など)はグループ名を表し、任意のホストをグルーピングすることができます。

なお、グルーピングでは暗黙のallグループが存在しており、[]に属さないホストはデフォルトである`all`グループに属することになります。

## [演習.2] インベントリの作成

### インベントリファイルの作成

では、実際にインベントリファイルを作成してみましょう。
ここでは `host00`, `host01` を追加します。
また、ホストにログインする時に使用するユーザ名を定義しておきます。

- `ansible/inventories/hosts` を編集します。
  ```bash
  [root@ansibleconsole ansible]# cd ansible
  [root@ansibleconsole ansible]# vim inventories/hosts
  ```

- 追記する内容

  ```ini
  ...
  [exercise]
  host00
  host01
  ```

### インベントリファイルの書式チェック

作成したインベントリファイルが正しい書式かどうかを確認するには、`ansible-inventory`コマンドを利用します。

```bash
[root@ansibleconsole ansible]# ansible-inventory -i inventories/hosts --list
```

このコマンドを実行すると、インベントリの内容がJSON形式で表示され、構造やグループ分けが正しく認識されているか確認できます。

### インベントリ構造の表示（YAML形式）

さらに、`-y` オプションを付けることでYAML形式でインベントリの構造を表示できます。

```bash
[root@ansibleconsole ansible]# ansible-inventory -i inventories/hosts --list -y
```

これにより、グループやホストの階層構造がより分かりやすく表示されます。

## [発展演習.1] 不要エントリのコメントアウトと動作確認

先ほど作ったインベントリファイルですが、こんなケースは考えられないでしょうか。
あるプロジェクトで、インベントリファイルに不要なホストエントリが含まれていることが判明しました。
これらのホストは現在使用されておらず、誤ってタスクが実行されるのを防ぐためにコメントアウトする必要があります。

デプロイの対象から特定のホストを除外するのはエントリを削除すれば良いのですが
一時的な除外のためにエントリを削除してしまったのでは、元に戻すときに苦労してします。
従って、そのような時のためにコメントアウトによる除外を試してみましょう。

### コメントアウト作業

- `ansible/inventories/hosts` ファイルを編集し、不要なホストエントリをコメントアウトしてください。

  ```ini
  [web]
  web00
  app00

  [exercise]
  host00
  #host01
  ```

### 動作確認

- コメントアウトしたホストが実行対象から外れていることを確認します。

  ```bash
  [root@ansibleconsole ansible]# ansible-inventory --list -i inventories/hosts
  ```

- 出力結果に `host01` が含まれていないことを確認してください。
- 確認したら戻しておきましょう。

## [発展演習.2] Ansibleインベントリを活用したアドホック操作

先ほど作成したインベントリの動作確認はあくまで作成したファイルの書式チェックのみとなっており、実際に登録したホストに対して疎通がある、操作可能、といった事は担保されていません。
従って、登録したインベントリが実際に有効であるかどうかを確かめるために、`ansible`コマンドで ping モジュールを実行してみます。

- ansibleコマンドの実行

  ```bash
  [root@ansibleconsole ansible]# ansible -i inventories/hosts web -m ping -k
  ## -k は、ターゲットノードへの SSH 接続にパスワードを使うオプション
  ## 以下のように ssh パスワードを効かれるので、 `ansible` と入力して Enter
  SSH password:
  ```
- 正しく実行されれば以下のように、対象のインベントリに対して**SUCCESS**として返ってきます

  ```bash
  app00 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python3.12"
      },
      "changed": false,
      "ping": "pong"
  }
  web00 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python3.12"
      },
      "changed": false,
      "ping": "pong"
  }
  ```

---
<credit-footer/>
