---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
---

## 3. Ansible playbook の作成

Ansible のアドホックコマンドは単純なオペレーションには便利ですが、
複雑な構成管理や作業の定型化などには適していません。

従って Ansible を実行するには playbook と呼ばれる YAML ファイルを作成し実行します。
では、実際に playbook を作成してみましょう。

### インベントリを作成する

まずはじめに Inventory ファイルと呼ばれる物を作成します。
Ansible において、Inventory ファイルは対象を示していて実行に欠かせない要素です。

[教材](https://github.com/iij/ansible-exercise)のフォルダには
先ほどのサンプル実行でも使われた inventory ファイルがありますので
試しに開いてみましょう。

```sh
 $ cat inventories/hosts
[app]
app1

[db]
db1

[rp]
rp1
[ain
```

Ansible の Inventory ファイルは INI 形式に近い記述によって作成されます。
上記、Inventory ファイルの括弧内の見出し(`[app]`など)はグループ名を表し、
ホストをグルーピングすることができます。
なお、[]に属さないホストはデフォルトである`all`グループに属することになります

では、host ファイルに `host000`, `host001`, `host002` を追加してみましょう。
グループ名は`exercise`として下さい。

#### Inventory ファイルのテスト

先ほど作成した Inventory が正しいことを確かめるために、`ansible`コマンドで Ping モジュールを実行してみます。 コマンドと実行結果は下記のようになるはずです。

```sh
ansible -i ~/inventory/hosts exercise -m ping
host002 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
host001 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
host000 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
```

### Playbook を作成する

Playbook（プレイブック）は、管理対象に対してこうなってほしいという構成や手順を記述したファイルです。
playbook は先ほど実行していたアドホックコマンドを複数取り込み、
複数の task のセットとして利用することができるようになります。

では、これまでアドホックに行っていた ansible ping を行う playbook を作成してみましょう。

```yml
---
- hosts: exercise

  tasks:
    - ping:
```

#### 解説

- 1 行目: `---`
  - Playbook の始まりを意味します
  - YAML における形式の区切りの意味も持つため Playbook を書く際には必ず入れましょう
- 2 行目 `hosts: exercise`
  - この Playbook（Play）は、Inventory の中の`exercise`グループに対して実行すると示します
- 4 行目 `tasks:`
  - この行以下は、この Playbook（Play）で実行される task を定義します
  - tasks 後の行は、インデント（行頭の空白による字下げ）が入ります
    - このインデントは、YAML の書式同様、以降の要素が tasks の子要素や孫要素となっていることを意味します
- 5 行目 `ping`
  - ここで`ping`モジュールを用いて操作する事（task)を宣言します
    - モジュールによって様々なオプションを追加することがあります

#### Playbook の実行

ここまでで Inventory ファイルと Playbook ファイルが作成できました。
`ansible-plyabook`を使用する上での最低限のファイルが作成できたので実行してみましょう。
コマンドと実行結果は下記のようになるはずです。

```sh
# ansible-playbook -i inventories/hosts playbooks.yml

PLAY [exercise] ****************************************************************************************************************************************************************

TASK [Gathering Facts] *********************************************************************************************************************************************************
ok: [host000]
ok: [host001]
ok: [host002]

TASK [ping] ********************************************************************************************************************************************************************
ok: [host001]
ok: [host002]
ok: [host000]

PLAY RECAP *********************************************************************************************************************************************************************
host000                    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host001                    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host002                    : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

上記の通り exercise グループに属している host000, host001, host002 の 3 台に対し、ping モジュールが実行され`OK`が表示されれば成功です。

### コラム Inventory を YAML で書く

Ansible のターゲットホストの情報を定義するインベントリファイルは、INI 形式の他にも YAML 形式でも定義できす。

先ほど利用した INI 形式の Inventory ファイルを YAML 形式で記述すると以下の通りになります。
YAML 形式で記述すると全てのグループが`all`グループの配下にあることが分かります。
それぞれ

```
all:
  children:
    app:
      hosts:
        app1: {}
    db:
      hosts:
        db1: {}
    exercise:
      hosts:
        host000: {}
        host001: {}
        host002: {}
    rp:
      hosts:
        rp1: {}
    ungrouped: {}
```
