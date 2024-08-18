---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 4. Ansible playbook の作成

皆さんはここまでで既にansible を使ってホストの管理を行っていました。
先ほどの演習で使った`ansible`コマンドがそれであり、ほかにも様々なモジュールを用いることで
例えばアプリケーションのインストールなども行うことができます。

しかし、Ansible のアドホックコマンドは単純なオペレーションには便利ですが、
複雑な構成管理や作業の定型化などには適していません。
Ansible の真価を発揮するためには、Playbook の使用方法を学習し、一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする必要があります。

### Ansible Playbookとは何か？

Ansible Playbookは、ITインフラストラクチャの自動化を実現するための主要なツールです。
Playbookは、YAML形式で記述される一連のタスクの集合であり、これを使用してサーバーの設定、アプリケーションのデプロイ、タスクの実行などを自動化できます。
Playbookは、以下の要素で構成されます。

- Play: 実行するタスクの集合。対象ホストやタスクの順序を定義します。
- Task: 実行する具体的な操作。モジュールを使用してタスクを実行します。
- Module: 実際にタスクを実行するためのスクリプト。Ansibleには多くの標準モジュールが含まれています。
- Handler: 特定の条件が満たされた場合に実行されるタスク。通常、サービスの再起動などに使用されます。
- Variable: タスク内で使用される動的な値。Playbook内で定義したり、外部ファイルから読み込んだりできます。

### Playbook(play) について

Playbook（プレイブック）は、管理対象に対してこうなってほしいという構成や手順を記述したファイルです。
playbook は先ほど実行していたアドホックコマンドを複数取り込み、複数の task のセットとして利用することができるようになります。

タスクは、特定の作業単位を実行するモジュールのアプリケーションです。
つまり、Playbook とは、特定の順序で実行される 1 つ以上の task を含むテキストファイルです。

では、これまでアドホックに行っていた ansible ping を行う playbook を作成してみましょう。
PlaybookはYAMLと呼ばれる書式によって書く必要があります。

## [演習] Playbookの作成

- Ansibleのplaybookを作成します。今回は`playbook.yml`として作成してみます
  - docker 上で作成する場合は以下の通りvi 等でテキストファイルを作成します
  - 演習環境に沿って実施している人は ansible フォルダがそのままconsoleホストにマウントされているため、ansibleフォルダ配下にファイルを作成しvscodeで編集することが可能です
- playbook.ymlの作成
  - 以下のように記載します
    ```yml
    ---
    - hosts: exercise
      tasks:
        - ping:
    ```
- playbookの実行
  - Playbookの実行には`ansible-plyabook`というコマンドを使って実行します
    ```bash
    ansible-playbook playbooks.yml
    ```
  - 実行結果
    ```bash
    SSH password:

    PLAY [exercise] ***********************************************************************************************************

    TASK [Gathering Facts] ****************************************************************************************************
    ok: [host00]
    ok: [host01]

    TASK [ping] ***************************************************************************************************************
    ok: [host01]
    ok: [host00]

    PLAY RECAP ****************************************************************************************************************
    host00                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    host01                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   ```
    ```

上記の通り exercise グループに属している host00, host01, の 2 台に対し、ping モジュールが実行され`OK`が表示されれば成功です。

### 解説

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


## [演習] dry-run

- Playbookを実行する前に、実際に変更が行われるかどうかを確認するためにdry-runを行います。
- 既に作成済みの `playbook.yml` を使用します。
- 以下のコマンドでPlaybookをdry-runモードで実行します。
  ```bash
  ansible-playbook -i inventory playbook.yml --check
  ```
- dry-runの結果を確認し、実際に変更が行われるかどうかを確認します。

## [発展] gather の停止

先ほどの実行結果で `TASK[ping]` の前に `TASK[Gathering Facts]`というものがあったことに気づいたでしょうか。
Ansible は通常、実行する際に実行対象となるホストから様々な情報の収集を行っています。
これらはansible_factsと呼ばれる特殊な変数に格納され、続くtaskで活用したり、収集結果をファイルに出力するなどに活用することができます。

しかし一方でそういった情報を収集する必要が無い場合は、収集の分だけ実行時間が長引くことになってしまいます。
従って収集する必要がない場合は明示的に情報収集を停止したり、設定ファイルを編集し、デフォルトの動作を切り替えることで収集を停止し、即座に記載したtaskを実行させることができます。

以下のいずれかを実施することで下記の通り直ぐにpingモジュールの実行に移ることができます。

```bash
ansible-playbook playbooks.yml
SSH password:

PLAY [exercise] ***********************************************************************************************************

TASK [ping] ***************************************************************************************************************
ok: [host01]
ok: [host00]

PLAY RECAP ****************************************************************************************************************
host00                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host01                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### playbook単位での停止

- playbookに以下を宣言することで停止することができます
  - 記載する場所どこでも構いませんが`hosts`等のセクションと同じレベル（同じインデントレベル）で宣言する必要があります。
  ```yaml
  gather_facts: false
  ```

### 設定ファイルでの停止

- ansible.cfg に以下の通り記載することでこのplaybookに宣言しなくともgatherを停止することができます
  - 宣言する箇所は`[defaults]`セクションに宣言してください
  ```
  gathering = explicit
  ```


## [発展演習] 変数の追加と表示

Playbook内で変数を定義し、その値を表示します

- 以下の内容でPlaybookを作成します。
    ```yaml
    ---
    - name: 変数の追加と表示
      hosts: all
      vars:
        username: "新人"
        home_dir: "/home/new_member"
      tasks:
        - name: 変数の値を表示
          debug:
            msg: "ユーザー名: {{ username }}, ホームディレクトリ: {{ home_dir }}"
    ```

- 以下のコマンドでPlaybookを実行します。
    ```sh
    ansible-playbook -i inventory playbook.yml
    ```

## [発展演習] 対象ホストの絞り込み

- 特定のホストグループに対してのみタスクを実行します

- 以下の内容でインベントリファイルを作成します。
    ```ini
    [exercise]
    host00
    host01
    [web]
    web00
    ```
- 以下の内容でPlaybookを作成します。
    ```yaml
    ---
    - name: Webサーバーに対するタスク
      hosts: web
      tasks:
        - name: HTTPサービスのステータスを確認
          service:
            name: httpd
            state: started
    ```
- 以下のコマンドでPlaybookを実行します。
    ```sh
    ansible-playbook -i inventory playbook.yml
    ```
