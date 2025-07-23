---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

## 4. Ansible によるサーバセットアップ

ここまでで一通り、Ansible playbook の作り方を学びました。
では、ここからは実際にサーバのセットアップを行っていきます。
この章では、Playbookを使って実際にサーバの構築・設定を自動化します。  
複数のタスクをまとめて記述し、ターゲットホストに対して一括で操作を行う方法を学びます。

---

## [演習.4] ユーザ・グループを作成するplaybookを作る

前回、Playbook は**一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする**と記載しました。

今回は前回の「対象ホストに対して ping 応答を確認する」とは異なり、
実際にサーバに対して何らかの操作を施すものを作ります。

以下の要件を満たす playbook を作成してください

### 要求仕様

| 項目             | 内容                       |
|------------------|----------------------------|
| Playbook名       | create_group.yml           |
| 操作対象グループ | exercise                   |
| 対象ホスト       | host00, host01             |
| タスク1          | Linuxユーザグループの作成  |
| グループ名/GID   | bootcamp / 1750            |
| タスク2          | Linuxユーザの作成          |
| ユーザ名/UID     | bootcampuser / 4000        |

#### tasks作成のヒント

- linux グループの作成には[ansible-builtin-group-module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/group_module.html#ansible-collections-ansible-builtin-group-module)を使います
- linux ユーザの作成には[ansible-builtin-user-module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html#ansible-collections-ansible-builtin-user-module)を使います


### ユーザ・グループを作成するplaybookの作成

まずはこれまでの知識を使って自分で作ってみましょう
分からなければ開いて内容を確認しながら作成してみましょう

<details><summary>create_group.yml　例</summary>

```yaml
---
- name: "演習.4 ユーザ・グループを作成するplaybookを作る"
  hosts: exercise
  gather_facts: false
  tasks:
    - name: ユーザグループを作成する
      ansible.builtin.group:
        name: bootcamp
        gid: 1750
        state: present

    - name: ユーザを作成する
      ansible.builtin.user:
        name: bootcampuser
        uid: 4000
        group: bootcamp
        state: present
```

</details>

### 動作確認

playbookが作成できたならば以下の通り実行します。
```bash
ansible-playbook -i inventories/hosts create_group.yml -k
```

実行ログ

```bash
SSH password:

PLAY [演習.4 ユーザ・グループを作成するplaybookを作る] ***********************************************************************************************************************************************************************************

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

グループとユーザが正しく作成されたか、チェック用Playbookで確認できます。

`assert_group.yml` の例:

```yaml
---
- name: "演習.4 ユーザ・グループを作成するplaybookを作る"
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

実行コマンド:

```bash
ansible-playbook -i inventories/hosts assert_group.yml
```

正常終了すれば、グループとユーザが正しく作成されています。

---

<credit-footer/>
