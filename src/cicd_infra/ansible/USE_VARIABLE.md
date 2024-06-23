---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 6. 変数やループ処理の実行

先ほどのplaybookではユーザとグループを作成しました。
しかし、実際は大量のユーザを作ったりサーバ毎にユーザ名を切り替えたりするなどの作業が必要です。

Ansible では、様々な変数をサポートしています。
これにより、プロジェクトの作成および保守がシンプルになり、エラーの数も低減されます。

- https://docs.ansible.com/ansible/2.9_ja/user_guide/playbooks_variables.html

では、実際に変数やループを使った playbook を作成してみましょう


## [演習] 変数を使ってユーザ・グループを作成するplaybookを作る

- 事前演習で作成した **web00** **app** ホストに以下の要件でセットアップを行います

以下の要件を満たす playbook を作成してください
### 要求仕様

- 作成する playbook 名
  - **use_variable.yml**
- 操作対象のターゲットグループ
  - グループ名
    - **web**
  - 対象ホスト
    - **web00, app00**
- 実行タスク
  - タスク1
    - 変数を使ったLinux ユーザの作成
      - 変数名, ユーザ名
        - **web_user**, **web_user00**
  - タスク2
    - 変数（ファイル）を使ったLinux ユーザの作成(ループ)
      - 変数名, ユーザ名
        - **app_users**, **app_user01, app_user02, app_user03**
  - タスク2
    - 変数（ファイル）を使ったパッケージのインストール
      - 変数名, ユーザ名
        - **packages**, **httpd**
  - タスク3
    - サービスの起動
    ```yaml
    - name: "サービス(httpd)の起動"
      ansible.builtin.systemd:
        name: httpd
        state: started
        enabled: true

    ```
  - タスク4
    - 変数（ファイル）を使ったHTMLコンテンツの作成
      - 変数名, 文字列
        - **html_content**, **"Hello bootcamp"**

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


### 動作確認

playbookが作成できたならば以下の通り実行します

```bash
ansible-playbook use_variable.yml
```

<credit-footer/>
