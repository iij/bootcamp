---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

## 3. Ansible playbook の作成

先ほどの項で発展演習を行った人は既に Ansible を使ってホストの操作を行いました。
しかし、Ansible のアドホックコマンドは単純なオペレーションには便利ですが、
複雑な構成管理や作業の定型化などには適していません。
Ansible の真価を発揮するためには、Playbook の使用方法を学習し、一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする必要があります。

この章では、Ansible Playbook の基本概念と作成方法、実行方法について学びます。
Playbook を使うことで、複雑な構成管理や定型作業を効率的に自動化できます。

---

### Playbook とは？

Ansible Playbook は、YAML 形式で記述する一連のタスクの集合です。
サーバーの設定、アプリケーションのデプロイ、タスクの実行などを自動化できます。

主な構成要素：

- **Play**: 実行するタスクの集合。対象ホストやタスクの順序を定義します。
- **Task**: 実行する具体的な操作。モジュールを使用してタスクを実行します。
- **Module**: 実際にタスクを実行するためのスクリプト。Ansibleには多くの標準モジュールが含まれています。
- **Handler**: 特定の条件が満たされた場合に実行されるタスク。サービスの再起動などに使用します。
- **Variable**: タスク内で使用される動的な値。Playbook内や外部ファイルから定義できます。

---

### Playbook の基本構造

Playbook は、管理対象に対して「こうなってほしい」という構成や手順を記述したファイルです。
複数のタスクを順序通りに実行でき、再利用や定型化に適しています。

## [演習.3] Ansible Playbookの作成

- Ansible の Playbook を作成します。今回は`playbook.yml`として作成してみます
- playbook.ymlの作成
  - 以下のように記載します

    ```yml
    ---
    - name: "Exercise ping hosts"
      hosts: exercise
      tasks:
        - name: Ping exercise hosts
          ansible.builtin.ping:
    ```

- playbook の実行
  - Playbook の実行には`ansible-plyabook`というコマンドを使って実行します

    ```bash
    [root@ansibleconsole ansible]# ansible-playbook -i inventories/hosts playbook.yml -k
    ```

  - 実行結果

    ```bash
    PLAY [Exercise ping hosts] *************************************************************************************************

    TASK [Gathering Facts] *****************************************************************************************************
    ok: [host01]
    ok: [host00]

    TASK [Ping exercise hosts] *************************************************************************************************
    ok: [host01]
    ok: [host00]

    PLAY RECAP *****************************************************************************************************************
    host00                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    host01                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

    ```

上記の通り exercise グループに属している host00, host01, の 2 台に対し、ping モジュールが実行され`OK`が表示されれば成功です。

### 参考: playbook解説

- 1 行目: `---`
  - Playbook の始まりを意味します
  - YAML における形式の区切りの意味も持つため Playbook を書く際には必ず入れましょう
- 2 行目: `name: "Exercise ping hosts"`
  - この Playbook につける名前です
- 3 行目 `hosts: exercise`
  - この Playbook（Play）は、Inventory の中の`exercise`グループに対して実行すると示します
- 4 行目 `tasks:`
  - この行以下は、この Playbook（Play）で実行される task を定義します
  - tasks 後の行は、インデント（行頭の空白による字下げ）が入ります
    - このインデントは、YAML の書式同様、以降の要素が tasks の子要素や孫要素となっていることを意味します
- 5 行目 `- name: Ping exercise hosts`
  - この task につける名前です
  - 最近の Ansible ではすべての task に大文字から始まる名前をつけることを推奨されています
- 5 行目 `ansible.builtin.ping`
  - ここで`ping`モジュールを用いて操作する事(task)を宣言します
    - モジュールによって様々なオプションを追加することがあります
  - 古い playbook では、単に `ping` とだけ書かれていることもあります
  - 最近の Ansible ではすべてのモジュールは FQCN (ansible.builtin...で始まるような正式名称)で書くことを推奨されています


## [発展演習.1] dry-run（変更内容の確認）

Playbookを実行する前に、実際に変更が行われるかどうかを確認するためにdry-run（チェックモード）を行います。

- 既に作成済みの `playbook.yml` を使用します。
- 以下のコマンドでPlaybookをdry-runモードで実行します。
  ```bash
  [root@ansibleconsole ansible]# ansible-playbook -i inventories/hosts playbooks.yml -k --check
  ```
- dry-runの実行結果例
  ```text
  PLAY [Exercise ping hosts] *************************************************************************************************

  TASK [Gathering Facts] *****************************************************************************************************
  ok: [host01]
  ok: [host00]

  TASK [Ping exercise hosts] *************************************************************************************************
  ok: [host01]
  ok: [host00]

  PLAY RECAP *****************************************************************************************************************
  host00                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  host01                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  ```

- dry-runの結果を確認し、実際に変更が行われるかどうかを事前に把握できます。

## [発展演習.2] gather_factsの停止

Playbook実行時、デフォルトでホスト情報（facts）が収集されますが、不要な場合は収集を停止できます。

- `gather_facts: false` を指定したPlaybook例
  ```yaml
  ---
  - name: "Exercise ping hosts"
    hosts: exercise
    gather_facts: false
    tasks:
      - name: Ping exercise hosts
        ansible.builtin.ping:
  ```

- 実行コマンド
  ```bash
  [root@ansibleconsole ansible]# ansible-playbook -i inventories/hosts playbooks.yml
  ```

- 実行結果例
  ```text
  PLAY [Exercise ping hosts] *************************************************************************************************

  TASK [Ping exercise hosts] *************************************************************************************************
  ok: [host01]
  ok: [host00]

  PLAY RECAP *****************************************************************************************************************
  host00                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  host01                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  ```
- 実行結果では `TASK [Gathering Facts]` が表示されず、すぐにタスクが実行されます。

## [発展演習.3] 対象ホストの絞り込み

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
  - name: "Exercise ping hosts for web"
    hosts: web
    tasks:
      - name: Ping exercise hosts
        ansible.builtin.ping:
  ```
- 以下のコマンドでPlaybookを実行します。
  ```sh
  [root@ansibleconsole ansible]# ansible-playbook -i inventories/hosts playbooks.yml -k
  ```
- 実行結果では インベントリファイルで `web` グループに属するホスト（例: `web00`）のみがPlaybookの実行対象となる為、実行結果は以下のようになります
  ```text
  PLAY [Exercise ping hosts for web] *****************************************************************************************

  TASK [Gathering Facts] *****************************************************************************************************
  ok: [web00]
  ok: [app00]

  TASK [Ping exercise hosts] *************************************************************************************************
  ok: [app00]
  ok: [web00]

  PLAY RECAP *****************************************************************************************************************
  app00                      : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  web00                      : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
  ```
- `exercise` グループの `host00` や `host01` にはタスクが実行されません。
- 指定したグループ（web）のホストだけに対して、pingモジュールが実行され、`ok`が表示されれば成功です。

<credit-footer/>
