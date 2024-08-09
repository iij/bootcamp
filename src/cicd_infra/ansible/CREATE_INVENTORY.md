---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 2. インベントリ の作成

ansibleを実行する為にはまずインベントリを作成しなければなりません。
インベントリとは、Ansible が管理するホストの集合を定義します。
インベントリを用いることでansibleによって、ホストをまとめて管理することができます。

インベントリでは管理ホストをグループに割り当てることが可能なほか
グループは子グループを含むことも可能で、ホストは複数のグループのメンバーになることができます。
また、インベントリでは、それが定義するホストとグループに適用される、変数の設定も行います。

### インベントリを作成する

まずはじめに Inventory ファイルを作成します。
Ansible において、Inventory ファイルは対象を示していて実行に欠かせない要素です。

[教材](https://github.com/iij/ansible-exercise)のフォルダには ansible フォルダの配下にインベントリファイルを置くためのフォルダ（inventories）があります。
試しに開いてみましょう。

先ほど、AnsibleはYAML形式で記述される、と説明しましたが
Ansible の Inventory ファイルは INI 形式に近い記述によって作成されます。
現在はYAML形式だけでなく動的インベントリ、としてJSON等の情報も読み込むことが可能ですが
ここではもっとも記述形式が簡単であるINI形式で記載してみましょう。

INI形式による記述ではインベントリファイルの括弧内の見出し(`[app]`など)はグループ名を表し、
ホストをグルーピングすることができます。
なお、[]に属さないホストはデフォルトである`all`グループに属することになります。

## [演習]インベントリの作成

では、実際にインベントリファイルを作成してみましょう。
`hosts` というファイルを作成し `host00`, `host01` を追加します。
グループ名は`exercise`として下さい。

- inventoryファイルを作成する
  ```bash
  vi hosts
  ```
- 記載内容
  ```bash
  [exercise]
  host00
  host01
  ```
- インベントリの動作確認
  - 先ほど作成したインベントリが正しいことを確かめるために、`ansible-inventory`コマンドを実行してみます
    ```bash
    ansible -i hosts exercise -m ping -k
    ```
  - パスワードを聞かれるため事前準備で設定したパスワード(ansible)を入力します


## [演習] Ansibleコマンドの実行

- インベントリの動作確認
  - 先ほど作成したインベントリが正しいことを確かめるために、`ansible`コマンドで ping モジュールを実行してみます。 コマンドと実行結果は下記のようになるはずです。
    ```bash
    ansible -i hosts exercise -m ping -k
    ```
  - パスワードを聞かれるため事前準備で設定したパスワード(ansible)を入力します
- 出力結果
  ```bash
  host01 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python"
      },
      "changed": false,
      "ping": "pong"
  }
  host00 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python"
      },
      "changed": false,
      "ping": "pong"
  }
  ```

正しく実行されれば *SUCCESS* と出力されます。

## [発展演習] インベントリを YAML で書く

Ansible のターゲットホストの情報を定義するインベントリファイルは、INI 形式の他にも YAML 形式でも定義できす。

先ほど利用した INI 形式の Inventory ファイルを YAML 形式で記述すると以下の通りになります。
YAML 形式で記述すると全てのグループが`all`グループの配下にあることが分かります。

```yaml
all:
  children:
    exercise:
      hosts:
        host00:
        host01:
```

なお、YAML書式についてはiniファイルのインベントリファイルがあれば以下のようなコマンドで作成することが可能です。
使いこなせるようになればYAML形式は大変便利なのですが、単にホスト名を列挙するだけであればINI形式の方が楽であることがわかるかと思います。


```bash
ansible-inventory -i inventories/hosts --list -y
```

