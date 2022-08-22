---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
---

## 4. Ansible で アプリケーションサーバを作成する

ここまでで一通り、Ansible playbook の作り方を学びました。
では、ここからは実際にデータベースとアプリケーションを使った
サーバを構築しましょう。

### playbook を作成する

前回、Playbook は管理対象に対してこうなってほしいという構成や手順を記述したファイル、と述べました。
従って、ansible では、実行したい事に応じてそれぞれ playbook を作る事で操作や手順を区別しています。

今回は前回の「対象ホストに対して ping 応答を確認する」とは異なり
「データベース・アプリケーションサーバを作る」というものになりますので別の playbook ファイルを作成します。

教材には既にデータベース・アプリケーションサーバを作る為の playbook。`site.yml`が作成されていますので開いてみましょう。

```yaml
---
# データベースサーバを構築する playbook
- import_playbook: playbooks/db.yml

# アプリケーションサーバを構築する playbook
- import_playbook: playbooks/app.yml
```

データベースサーバ、アプリケーションサーバを作るにしては妙に少ない記述ですが
これも Ansible の playbook として有効な記述になります。

Ansible の playbook では、処理の共通化や流用を想定して作られています。
従って、それぞれの操作をパーツのように作成し、実際に ansible-playbook コマンドで読み込む
playbook ファイルにはそれぞれのパーツを読み込む（import）して使うことがあります。

この`site.yml`では、「データベースサーバの構築」と「アプリケーションサーバ」の構築が
それぞれ別の playbook に分解されており、この二つを実行する物が「データベース・アプリケーションサーバを構築する」(site.yml)となっています。

では、それぞれではどのような事を行っているのか見てみましょう。
試しに「データベースサーバを構築する」playbook を開いてみます。

```yaml
---
- name: set up the database server
  hosts: db
  become: no
  gather_facts: no
  vars_files:
    - ../vars/proxy.yml
  roles:
    - role: roles/mariadb
      tags: mysql
```

なにやらまた見慣れない物が沢山出てきましたのでそれぞれ解説をしていきます。

#### 解説

- 2 行目 `name: set up the database server`
  - エントリ名を表します。省略することも可能ですが`ansible-playbook`を実行した際に name が出力されるため、できるだけ分かりやすい名称を付けておきましょう
- 4 行目 `become: no`
  - yes の場合、この Playbook（Play）を root ユーザーで実行することを示します
- 5 行目 `gather_facts: no`
  - ansible は実行する前に対象ホストの情報収集を行います。 no にするとその情報収集を行いません
- 6 行目 `var_files`
  - playbooks 内で使う変数を記載したファイルの指定
- 8 行目 `roles`
  - タスク・ハンドラをひとまとめにしたものを読み出すもの

### playbook の実行


#### その前に

例えば会社の中など、外部へのアクセスに対しproxy設定が必要な場合は以下を編集して下さい

`vars/proxy.yml`

ここにコメントアウトされたサンプルがあると思いますので
適宜修正し、コメントインしてください


#### 本実行

では下記コマンドを実行してみましょう

```sh
ansible-playbook -i inventories/hosts site.yml
```

`failed=0`と表示されれば実行は成功です。
ブラウザで<http://localhost:18080>にアクセスすると素朴な Web アプリケーションの画面が見えます。
また、下記コマンドでホストに対して実際にファイルがコピーされていることが確認できます。

```sh
# MySQL config file
ansible db1 -m command -a 'cat /etc/my.cnf'

# app jar file
ansible app1 -m command -a 'ls -l /opt/ansible-exercise/app.jar'
```

### コラム シンタックスチェック・ドライランの活用

Ansible を使う上で、playbook が正しく作る事ができたか事前に確認したくなることはないでしょうか。
本講義では Docker コンテナを対象としたため、誤った操作だった場合はコンテナを破棄して作りなおせば即座にやり直すことができますが、それでもこういったスクラップ＆ビルドは新規構築の時だけでアップグレードなど、既に運用段階の物に適用する際はそういうわけにもいきません。

幸い、Ansible には事前に書式をチェックする(Syntax check)や実行チェック（ドライラン）機能が備わっています。

Playbook の書式チェックには `--syntax-check`オプションを使います。
先ほどのコマンドの例で言えば以下のように実行します。

```sh
ansible-playbook -i inventories/hosts site.yml --syntax-check
```

これは playbook が正しく記述されているかどうかをチェックするコマンドになります。
`--syntax-check`は簡単に実行できる反面、あくまで書式のチェックを行うだけなので
タスクの実行チェックはなされません。

例えば、 http サーバをインストールし、起動する。といったタスクを作ろうとしたときに
`httpd の起動` -> `httpd のインストール` と書いていてもそれぞれの書式が正しければ
syntax-check は OK となってしまいます。

従って、Playbook が正しく実行できるか？と言うことを事前に調べるにはチェックモード（ドライラン）を用います。

```sh
ansible-playbook -i inventories/hosts site.yml -C
```

こちらのコマンドであれば、実際に Playbook を順番に試行し、実行できるか否かを
チェックするため、より深く知ることが可能です。
では Ansible はこのドライランの時はどのように動作をしているのでしょうか？
それはモジュール毎に `-C`オプション付きで実行された時の動作が記載されており
条件分岐を行っています。

しかし、ドライランモードにも万能では無いところがあり、コマンドモジュール(command)のようなモジュールはチェックモードの分岐がなく、処理そのものがスキップされてしまうものがあります。
こういったタスクが含まれている場合、コマンドの結果を次のタスクに受け渡す、
といったタスクが失敗してしまうので注意して使う必要があります。

<credit-footer/>
