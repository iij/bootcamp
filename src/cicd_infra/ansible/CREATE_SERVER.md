---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 5. Ansible によるサーバセットアップ

ここまでで一通り、Ansible playbook の作り方を学びました。
では、ここからは実際にサーバのセットアップを行っていきます。

### サーバ構築用のplaybook を作成する

前回、Playbook は**一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする**と記載しました。

今回は前回の「対象ホストに対して ping 応答を確認する」とは異なり、
実際にサーバに対して何らかの操作を施すものを作ります。

## [実践演習] ユーザ・グループを作成するplaybookを作る

以下の要件を満たす playbook を作成してください
### 要求仕様

- 作成する playbook 名
  - **create_group.yml**
- 操作対象のターゲットグループ
  - グループ名
    - **exercise**
  - 対象ホスト
    - **host00, host01**
- 実行タスク
  - タスク1
    - Linux ユーザグループの作成
      - グループ名, GID
        - **bootcamp**, **1750**
  - タスク2
    - Linux ユーザ の作成
      - ユーザ名, UID
        - **bootcampuser**, **4000**

#### tasks作成のヒント

- linux グループの作成には[ansible-builtin-group-module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/group_module.html#ansible-collections-ansible-builtin-group-module)を使います
- linux ユーザの作成には[ansible-builtin-user-module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html#ansible-collections-ansible-builtin-user-module)を使います

### 動作確認

playbookが作成できたならば以下の通り実行します。

```bash
ansible-playbook create_group.yml
```

実行ログ

```bash
SSH password:

PLAY [演習.5 ユーザ・グループを作成するplaybookを作る] ***********************************************************************************************************************************************************************************

TASK [ユーザグループを作成する] **********************************************************************************************************************************************************************************************************
changed: [host00]
changed: [host01]

TASK [ユーザを作成する] ******************************************************************************************************************************************************************************************************************
ok: [host01]
ok: [host00]

PLAY RECAP *******************************************************************************************************************************************************************************************************************************
host00                     : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
host
```

### 作成されたことの確認

ansibleコマンドが無事に実行できたならば、
ansible-exerciseのリポジトリにあるチェック用のplaybookを使ってグループとユーザの確認を行います。

分からなければ以下をそのままコピーして確認用のplaybookを作成します

```yaml
---
- name: "演習.5 ユーザ・グループを作成するplaybookを作る"
  hosts: exercise
  gather_facts: false
  tasks:
    - name: グループ 'bootcamp' の情報を取得
      ansible.builtin.command: getent group bootcamp
      register: bootcamp_group
      ignore_errors: true
      changed_when: false

    - name: ユーザ 'bootcampuser' の情報を取得
      ansible.builtin.command: getent passwd bootcampuser
      register: bootcampuser_user
      ignore_errors: true
      changed_when: false

    - name: グループ 'bootcamp' が存在し、GID 1750 を持っているか確認
      ansible.builtin.assert:
        that:
          - "bootcamp_group.rc == 0"
          - "bootcamp_group.stdout.split(':')[2] == '1750'"
        fail_msg: "'bootcamp' グループが GID 1750 を持っていません。"

    - name: ユーザ 'bootcampuser' が存在し、UID 4000 を持っているか確認
      ansible.builtin.assert:
        that:
          - "bootcampuser_user.rc == 0"
          - "bootcampuser_user.stdout.split(':')[2] == '4000'"
        fail_msg: "'bootcampuser' ユーザが UID 4000 を持っていません。"
```

```bash
ansible-playbook assert_group.yml
```

正しくグループとユーザが作成されていれば正常終了するはずです。

## 参考情報

### syntax-check・dryrunの活用

Ansible を使う上で、playbook が正しく作る事ができたか事前に確認したくなることはないでしょうか。
幸い、Ansible には事前に書式をチェックする(Syntax check)や実行チェック（dryrun）機能が備わっています。

Playbook の書式チェックには `--syntax-check`オプションを使います。
先ほどのコマンドの例で言えば以下のように実行します。

```sh
ansible-playbook -i inventories/hosts create_group.yml --syntax-check
```

これは playbook が正しく記述されているかどうかをチェックするコマンドになります。
`--syntax-check`は簡単に実行できる反面、あくまで書式のチェックを行うだけなので
タスクの実行チェックはなされません。

例えば、 http サーバをインストールし、起動する。といったタスクを作ろうとしたときに
`httpd の起動` -> `httpd のインストール` と書いていてもそれぞれの書式が正しければ
syntax-check は OK となってしまいます。

従って、Playbook が正しく実行できるか？と言うことを事前に調べるにはチェックモード（dryrun）を用います。

```sh
ansible-playbook -i inventories/hosts create_group.yml -C
```

こちらのコマンドであれば、実際に Playbook を順番に試行し、実行できるか否かを
チェックするため、より深く知ることが可能です。
では Ansible はこのドライランの時はどのように動作をしているのでしょうか？
それはモジュール毎に `-C`オプション付きで実行された時の動作が記載されており
条件分岐を行っています。

しかし、dryrunもsyntax-check同様万能ではありません。
Ansibleにおけるdryrunの実装はモジュールに委ねられており、Ansible全体としての動作を保証していません。
例えば、コマンドモジュール(command)のようなモジュールはチェックモードの分岐がなく、処理そのものがスキップされてしまいます。
こういったタスクが含まれている場合、コマンドの結果を次のタスクに受け渡す、
といったタスクが失敗してしまうので注意して使う必要があります。

<credit-footer/>
