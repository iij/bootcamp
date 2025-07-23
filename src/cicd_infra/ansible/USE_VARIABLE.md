---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 6. 変数やループ処理の実行

先ほどのplaybookではユーザとグループを作成しました。
しかし、実際は大量のユーザを作ったりサーバ毎にユーザ名を切り替えたりするなどの作業が必要です。

Ansible では、様々な変数をサポートしています。
これにより、プロジェクトの作成および保守がシンプルになり、エラーの数も低減されます。

- https://docs.ansible.com/ansible/2.9_ja/user_guide/playbooks_variables.html

この章では、Playbookで変数やループ処理を活用し、Webサーバの構築を体験します。  
Ansibleの変数機能を使うことで、柔軟な構成管理や大量のリソース操作を効率化できます。


## [演習.6] 変数の追加と表示

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
- 期待される出力例

    ```text
    TASK [変数の値を表示] ************************************************************
    ok: [host00] => {
        "msg": "ユーザー名: 新人, ホームディレクトリ: /home/new_member"
    }
    ok: [host01] => {
        "msg": "ユーザー名: 新人, ホームディレクトリ: /home/new_member"
    }
    ```

## [発展演習.1] インベントリファイルで変数を定義する方法

先ほどの演習では変数をplaybookに記載しましたが、インベントリに関連付けた値になることもあります
インベントリは使い回す状況にもかかわらず毎回playbookに記載するのは非効率であり、そのような場合はインベントリファイルに変数を定義することができます

- インベントリファイル（例: `inventory`）に変数を記載します。
  ```ini
  [all]
  host00 username=新人 home_dir=/home/new_member
  host01 username=新人 home_dir=/home/new_member
  ```
- Playbookは変数定義なしでOKです。
  ```yaml
  ---
  - name: インベントリ変数の表示
    hosts: all
    tasks:
      - name: 変数の値を表示
        debug:
          msg: "ユーザー名: {{ username }}, ホームディレクトリ: {{ home_dir }}"
  ```
- 実行コマンド
  ```sh
  ansible-playbook -i inventory playbook.yml
  ```
- 動作確認
  -　先ほどの演習と同じ結果が表示されれば成功です


### [発展演習.2] コマンドラインオプションで変数を渡す方法

変数の定義は実行に明け渡すことで定義することも可能です。
先ほどのインベントリから変数を削除し、今度はコマンドへの追加として明け渡してみましょう

- Playbookは変数定義なしでOKです。
  ```yaml
  ---
  - name: コマンドライン変数の表示
    hosts: all
    tasks:
      - name: 変数の値を表示
        debug:
          msg: "ユーザー名: {{ username }}, ホームディレクトリ: {{ home_dir }}"
  ```
- 実行コマンド（`-e` オプションで変数を渡します）
  ```sh
  ansible-playbook -i inventory playbook.yml -e "username=新人 home_dir=/home/new_member"
  ```
- 動作確認
  -　先ほどの演習と同じ結果が表示されれば成功です


## [発展演習.3] 変数を使ってユーザ・グループを作成するplaybookを作る

ここまでの知見を活用してサーバのセットアップを行ってみましょう。
- 事前演習で作成した **web00** **app** ホストに以下の要件でセットアップを行います

以下の要件を満たす playbook を作成してください

### 要求仕様

| 項目         | 内容                                         |
|--------------|----------------------------------------------|
| Playbook名   | use_variable.yml                             |
| 対象グループ | web                                          |
| 対象ホスト   | web00, app00                                 |
| タスク1      | 変数を使ったLinuxユーザの作成                |
| タスク2      | 変数（リスト）を使ったLinuxユーザの作成（ループ）|
| タスク3      | 変数（リスト）を使ったパッケージのインストール |
| タスク4      | サービス(httpd)の起動                        |
| タスク5      | 変数を使ったHTMLコンテンツの作成             |

#### tasks作成のヒント

### 基本形

```yaml
- name: "演習.6 ユーザ・グループを作成するplaybookを作る"
  hosts: exercise
  gather_facts: false
  tasks:
    ---ここにtaskを記載する---
```

#### tasks作成のヒント

- パッケージのインストールには[ansible-builtin-package](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/package_module.html)を使います
- Ansibleでループを扱うには[こちら](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_loops.html)を使います

### playbookの作成

まずはこれまでの知識を使って自分で作ってみましょう
分からなければ開いて内容を確認しながら作成してみましょう

<details><summary>use_variable.yml　例</summary>

```yaml
---
- name: "演習.6 変数・ループを使ったWebサーバ構築"
  hosts: web
  gather_facts: false
  vars:
    web_user: web_user00
    app_users:
      - app_user01
      - app_user02
      - app_user03
    packages:
      - httpd
    html_content: "Hello bootcamp"
  tasks:
    - name: webユーザの作成
      ansible.builtin.user:
        name: "{{ web_user }}"
        state: present

    - name: appユーザの作成（ループ）
      ansible.builtin.user:
        name: "{{ item }}"
        state: present
      loop: "{{ app_users }}"

    - name: パッケージのインストール（ループ）
      ansible.builtin.package:
        name: "{{ item }}"
        state: present
      loop: "{{ packages }}"

    - name: サービス(httpd)の起動
      ansible.builtin.systemd:
        name: httpd
        state: started
        enabled: true

    - name: HTMLコンテンツの作成
      ansible.builtin.copy:
        dest: /var/www/html/index.html
        content: "{{ html_content }}"
```

</details>

### playbookの実行

- playbookが作成できたならば以下の通り実行します
  ```bash
  ansible-playbook use_variable.yml
  ```
- 期待される出力例
  ```text
  TASK [webユーザの作成] ***********************************************************
  changed: [web00]
  changed: [app00]

  TASK [appユーザの作成（ループ）] **************************************************
  changed: [web00] => (item=app_user01)
  changed: [web00] => (item=app_user02)
  changed: [web00] => (item=app_user03)
  changed: [app00] => (item=app_user01)
  changed: [app00] => (item=app_user02)
  changed: [app00] => (item=app_user03)

  TASK [パッケージのインストール（ループ）] *****************************************
  changed: [web00] => (item=httpd)
  changed: [app00] => (item=httpd)

  TASK [サービス(httpd)の起動] *****************************************************
  changed: [web00]
  changed: [app00]

  TASK [HTMLコンテンツの作成] ******************************************************
  changed: [web00]
  changed: [app00]
  ```

<credit-footer/>
