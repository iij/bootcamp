---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

## 3. Ansible playbook の作成

先ほどの項で発展演習を行った人は既にansible を使ってホストの操作を行いました。
しかし、Ansible のアドホックコマンドは単純なオペレーションには便利ですが、
複雑な構成管理や作業の定型化などには適していません。
Ansible の真価を発揮するためには、Playbook の使用方法を学習し、一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする必要があります。

この章では、Ansible Playbookの基本概念と作成方法、実行方法について学びます。  
Playbookを使うことで、複雑な構成管理や定型作業を効率的に自動化できます。

---

### Playbookとは？

Ansible Playbookは、YAML形式で記述する一連のタスクの集合です。  
サーバーの設定、アプリケーションのデプロイ、タスクの実行などを自動化できます。

主な構成要素：

- **Play**: 実行するタスクの集合。対象ホストやタスクの順序を定義します。
- **Task**: 実行する具体的な操作。モジュールを使用してタスクを実行します。
- **Module**: 実際にタスクを実行するためのスクリプト。Ansibleには多くの標準モジュールが含まれています。
- **Handler**: 特定の条件が満たされた場合に実行されるタスク。サービスの再起動などに使用します。
- **Variable**: タスク内で使用される動的な値。Playbook内や外部ファイルから定義できます。

---

### Playbookの基本構造

Playbookは、管理対象に対して「こうなってほしい」という構成や手順を記述したファイルです。  
複数のタスクを順序通りに実行でき、再利用や定型化に適しています。

## [演習.3] Ansible Playbookの作成

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
    ansible-playbook -i inventories/hosts playbooks.yml -k
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

### 参考: playbook解説

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


## [発展演習.1] dry-run（変更内容の確認）

Playbookを実行する前に、実際に変更が行われるかどうかを確認するためにdry-run（チェックモード）を行います。

- 既に作成済みの `playbook.yml` を使用します。
- 以下のコマンドでPlaybookをdry-runモードで実行します。
  ```bash
  ansible-playbook -i inventories/hosts playbooks.yml --check -k
  ```
- dry-runの実行結果例
  ```text
  PLAY [exercise] *******************************************************************

  TASK [pingモジュールで疎通確認] ****************************************************
  ok: [host00]
  ok: [host01]

  PLAY RECAP ***********************************************************************
  host00                     : ok=1    changed=0    unreachable=0    failed=0
  host01                     : ok=1    changed=0    unreachable=0    failed=0
  ```
- dry-runの結果を確認し、実際に変更が行われるかどうかを事前に把握できます。

## [発展演習.2] gather_factsの停止

Playbook実行時、デフォルトでホスト情報（facts）が収集されますが、不要な場合は収集を停止できます。

- `gather_facts: false` を指定したPlaybook例
  ```yaml
  ---
  - hosts: exercise
    gather_facts: false
    tasks:
      - name: pingモジュールで疎通確認
        ping:
  ```

- 実行コマンド
  ```bash
  ansible-playbook -i inventories/hosts playbooks.yml -k
  ```

- 実行結果例
  ```text
  PLAY [exercise] *******************************************************************

  TASK [pingモジュールで疎通確認] ****************************************************
  ok: [host00]
  ok: [host01]

  PLAY RECAP ***********************************************************************
  host00                     : ok=1    changed=0    unreachable=0    failed=0
  host01                     : ok=1    changed=0    unreachable=0    failed=0
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
  - name: Webサーバーに対するタスク
    hosts: web
    tasks:
      - name: pingモジュールで疎通確認
        ping:
  ```
- 以下のコマンドでPlaybookを実行します。
  ```sh
  ansible-playbook -i inventories/hosts playbooks.yml -k
  ```
- 実行結果では インベントリファイルで `web` グループに属するホスト（例: `web00`）のみがPlaybookの実行対象となる為、実行結果は以下のようになります
  ```text
  PLAY [Webサーバーに対するタスク] ***************************************************

  TASK [pingモジュールで疎通確認] ****************************************************
  ok: [web00]

  PLAY RECAP ***********************************************************************
  web00                     : ok=1    changed=0    unreachable=0    failed=0
  ```
- `exercise` グループの `host00` や `host01` にはタスクが実行されません。
- 指定したグループ（web）のホストだけに対して、pingモジュールが実行され、`ok`が表示されれば成功です。

<credit-footer/>
