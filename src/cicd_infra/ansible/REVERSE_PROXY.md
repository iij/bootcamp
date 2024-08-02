---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 5. リバースプロキシの導入/運用

それではいよいよ本格的に Ansible を活用してみます。
さきほどのセクションで構築したデータベースとアプリケーションを流用し変更を加えてみます。

現在の状態は、ブラウザから直接アプリケーションに`HTTP`でアクセスしている状態です。
nginx を導入し、`HTTPS`でアクセスしてみましょう。

今回、新たに Reverse proxy サーバを構築するにあたっては
既存の`site.yml`への追記が必要となります。

前回までで記述ルールのいくつかはご説明致しましたが
本格的に作業に取り組む前に一つ確認をしておきます。

### Ansible playbook ディレクトリ構造

作業に取りかかる前にまず、ディレクトリ構造を確認してみましょう。
下記は教材のディレクトリ構造から Ansible に関わるファイルやディレクトリのみを抜粋しています。

それぞれのファイル・ディレクトリに役割説明を記載しています。

```sh
├── ansible.cfg  # Ansibleの設定ファイル
├── inventories  # 管理対象サーバの情報を格納するディレクトリ
│   ├── group_vars  # グループごとの変数ファイルを格納するファイル
│   │   └── all.yml  # すべてのグループに適用される変数ファイル
│   └── hosts  # サーバのIPやSSHのユーザやグループなどを記述するファイル
├── playbooks  # 実行用ファイルを格納するディレクトリ。各ファイルはsite.ymlからインポートします。
│   ├── acl.yml
│   ├── app.yml
│   ├── db.yml
│   └── rp.yml
├── roles  # ロールを格納するディレクトリ。Ansibleの実行はロールと呼ばれるまとまりで管理されます。
│   └── webapp
│       ├── defaults
│       │   └── main.yml  # ロール内で使用される変数のデフォルト値を定義するファイル
│       ├── files  # サーバへ配布したいファイルを格納するディレクトリ
│       ├── handlers
│       │   └── main.yml  # ハンドラタスクを定義するファイル
│       ├── tasks
│       │   └── main.yml  # Ansibleの具体的な処理内容を記述するファイル
│       └── templates  # サーバへ配布したいJinja2テンプレートを使ったファイルを格納するディレクトリ
├── site.yml  # playbookファイル
└── vars
    └── proxy.yml  # Proxy配下でハンズオンを実施するためのファイル
```

なぜ、このような構成にしているかと言うと、
Ansible ではより多くの人たちが正しく仕えるように推奨の記述方式を定めています。

ディレクトリ構成もその一部であり、Inventory や Role 等は Ansible を実行する上で
それぞれのファイルを探すデフォルトパスになっていますので、よほどの理由が無い限り
ベストプラクティスに沿って作成する事が推奨されます。

詳しく知りたい人は Ansible の[ベストプラクティス](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)をご覧ください。

### ファイル編集

それではファイルを作成してみましょう。
TLS の証明書に加え、いくつかの設定ファイルはすでに用意してあります。
皆さんには下記 4 つのファイルを編集してもらいます。

#### roles/nginx/tasks/main.yml

nginx を構築するためのタスクファイルです。
[公式ドキュメント](http://nginx.org/en/linux_packages.html#RHEL-CentOS)のインストール手順に加え、設定ファイルや証明書の配布を行っています。

Ansible はモジュールと呼ばれるものを使って、さまざまな処理を行います。
Ansible に組込み済みのモジュールは[公式ドキュメント](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)にリストアップされており、各モジュールごとの書き方が載っています。
モジュールを自作して使うこともできますが、基本的には上記のサイトから行いたい処理に合ったモジュールを探し、タスクファイルを作ります。

下記の内容を教材の`roles/nginx/tasks/main.yml`にコピーしましょう。

```yml
---
- name: install yum-utils
  yum:
    name: yum-utils
    state: present
  environment: "{{ proxy_env | default({}) }}"

- name: add Nginx repository
  copy:
    src: "etc/yum.repos.d/nginx.repo"
    dest: "/etc/yum.repos.d/nginx.repo"
    mode: 0644

- name: install Nginx
  yum:
    name: "nginx"
    state: present
  environment: "{{ proxy_env | default({}) }}"
  ignore_errors: "{{ ansible_check_mode }}"

- name: create ssl directory
  file:
    state: directory
    path: /etc/nginx/ssl
    owner: root
    group: root
    mode: 0600

- name: deploy ssl files
  copy:
    src: "etc/nginx/ssl/{{ item }}"
    dest: "/etc/nginx/ssl/{{ item }}"
    mode: 0400
  with_items:
    - server.crt
    - server.key
    - dhparam.pem

- name: remove default config file
  file:
    state: absent
    path: /etc/nginx/conf.d/default.conf
  notify: reload nginx

- name: deploy config file
  template:
    src: etc/nginx/conf.d/app.conf.j2
    dest: /etc/nginx/conf.d/app.conf
    owner: root
    group: root
    mode: 0644
  notify: reload nginx

- name: start nginx
  systemd:
    name: nginx
    state: started
    enabled: yes
```

nginx の構築に使用したモジュールの一覧は以下になります。

|                                           モジュール名                                           | 説明                                                                                                                                                                              |
| :----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        [yum](https://docs.ansible.com/ansible/latest/modules/yum_module.html#yum-module)         | yum コマンドを使って RPM パッケージを操作できるモジュールです。                                                                                                                   |
|       [file](https://docs.ansible.com/ansible/latest/modules/file_module.html#file-module)       | 対象サーバのファイルシステムを操作できるモジュールです。<br>ディレクトリやファイルを作成/削除したり、ファイルのオーナーやパーミッションを変更できたりします。                     |
|       [copy](https://docs.ansible.com/ansible/latest/modules/copy_module.html#copy-module)       | 対象サーバへファイルをコピーできるモジュールです。                                                                                                                                |
| [template](https://docs.ansible.com/ansible/latest/modules/template_module.html#template-module) | 対象サーバへファイルをコピーできるモジュールです。`copy`との違いはファイル内に`Jinja2`テンプレートが使える点です。<br>ファイル内で変数を使いたい場合はこちらを使います。          |
|  [systemd](https://docs.ansible.com/ansible/latest/modules/systemd_module.html#systemd-module)   | [systmed](https://wiki.archlinux.jp/index.php/Systemd)によって管理されるプロセスを操作できるモジュールです。<br>基本的には Linux 環境でプロセスを常駐させる場合はこれを使います。 |

#### roles/nginx/templates/etc/nginx/conf.d/app.conf.j2

nginx の設定ファイルです。
ファイル内で変数を使用しているので`templates`下に配置しています。

分かりやすさのために、配置するディレクトリをコピー先のパスと同じにしています。
Ansible やサーバの構築/運用に慣れないうちは、こうしておくことをお勧めします。

下記の内容を教材の`roles/nginx/templates/etc/nginx/conf.d/app.conf.j2`にコピーしましょう。

```jinja
upstream app_backend {
    {% for app in nginx_backends %}
    server {{ app.host }}:{{ app.port }} max_fails=1 fail_timeout=3s;
    {% endfor %}
}

server {
  listen {{ nginx_https_port }} ssl;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_certificate /etc/nginx/ssl/server.crt;
  ssl_certificate_key /etc/nginx/ssl/server.key;
  ssl_dhparam /etc/nginx/ssl/dhparam.pem;

  location / {
    proxy_set_header  Host  $http_host;
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  X-Forwarded-Host  $server_name;
    proxy_set_header  X-Forwarded-Server  $host;
    proxy_set_header  X-Forwarded-Proto  $scheme;
    proxy_set_header  X-Forwarded-Port {{ nginx_https_port }};
    proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_pass  http://app_backend;
  }

  error_page 404 /404.html;

  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
    root  /usr/share/nginx/html;
  }
}
```

nginx の設定について説明することは主題から外れるので、この講義では行いません。
興味のある人は nginx の[公式ドキュメント](http://nginx.org/en/docs/http/configuring_https_servers.html)をご覧ください。

#### playbooks/rp.yml

nginx を構築するための実行ファイルです。
対象サーバとロールを指定することで、指定したサーバに nginx を構築できます。

下記の内容を教材の`playbooks/rp.yml`にコピーしましょう。

```yml
---
- name: set up the reverse proxy server
  hosts: rp
  become: no
  gather_facts: no
  vars_files:
    - ../vars/proxy.yml
  roles:
    - role: roles/nginx
      tags: nginx
```

#### site.yml

最後に、さきほど作った`playbooks/rp.yml`をインポートする様に教材の`site.yml`に下記を追記します。

```yml
- import_playbook: playbooks/rp.yml
```

### 実行

さて、ファイルがすべて準備できたらいよいよ Ansible を実行します。

```sh
ansible-playbook -i inventories/hosts site.yml
```

`failed=0`と表示されれば実行は成功です。

ブラウザで<https://localhost:8443>にアクセスして確認します。
自己署名証明書を使っているためブラウザから注意文言が表示されますが、スキップしてください。
すると、さきほどと同じ画面が表示されます。

ここで、もう一つ注目してほしい部分があります。
Ansible の実行ログを眺めると、データベースや Java アプリケーションの構築用のタスクもステータスが`ok`の状態で、実行されているのが分かると思います。
またさきほど実行した`ansible-playbook site.yml`をもう一度実行すると、nginx の構築タスクも含め、すべてのタスクのステータスが`ok`になります。

ある操作を何回行っても等価であるとき、その操作を`冪等`であると言います。
**Ansible の良さの 1 つがこの`冪等`性です。**
基本的に Ansible は同じタスクを何回実行しても、差分のないタスクは実行されません。
すなわち、ファイルを変更しない限りホストに対して余計な変更が加わらず、安全です。

しかしこの`冪等`性は意識していないと壊れてしまう場合があります。
Ansible を使うときは`冪等`性に注意を払いましょう。

## 3. [ケース 2] バージョンアップ & スケーリング

さて、nginx を導入して初期構築タスクを自動化できました。
次は変数やホスト情報を編集して、運用タスクを自動化してみましょう。

### バージョンアップ

まずは nginx のバージョンアップをしてみましょう。

さきほどインストールされた nginx のバージョンは少し古めの`1.20.0`です。
このバージョンは`roles/nginx/defaults/main.yml`に`nginx_version`という変数として定義されています。
また、下記のコマンドを実行することで、確認することもできます。

```sh
ansible rp1 -m command -a 'nginx -V'
```

これを`1.22.0`にアップデートしてみたいと思います。
教材の`inventories/group_vars/all.yml`に下記を追記しましょう。

```yml
nginx_version: 1.22.0
```

Ansible には変数の優先度が設定されており、同じ名前の変数は優先度の高いほうが有効になります。
これを利用することでロールの完全性を担保しつつ、タスクの内容を編集できます。

具体的な優先度は[公式ドキュメント](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#variable-precedence-where-should-i-put-a-variable)をご覧ください。

ファイルの準備ができたら Ansible を実行します。

```sh
ansible-playbook -i inventories/hosts site.yml
```

本実行が完了したら、さきほどの確認コマンドを実行してバージョンが上がったことを確認してみましょう。

```sh
ansible rp1 -m command -a 'nginx -V'
```

### スケールアップ

次はアプリケーションサーバをスケールアップ（増設）してみましょう。
と言っても増設用のサーバはすでにコンテナとして起動してあるので、皆さんがすべきことは下記 2 つのファイルの編集です。

#### inventories/hosts

まずは Ansible の管理対象にアプリケーション増設用のサーバ（app2）を追加します。
教材の`inventories/hosts`を下記のように追記してください。

```diff
[app]
app1
+ app2
```

これで`app`グループの中に`app2`サーバを追加できました。

Ansible には管理対象のホストをグルーピングし、設定したグループ単位で Ansible を実行したり、変数を設定できたりします。
こうすることで、柔軟かつ効率的にサーバを管理できます。
この講義ではそれぞれ 1 台しかありませんが、データベースサーバやリバースプロキシサーバもグループに分けられています。

Ansible のグループやホストについての詳細は[公式ドキュメント](hhttps://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#inventory-basics-formats-hosts-and-groups)をご覧ください。

#### inventories/group_vars/all.yml

次に変数ファイルを編集します。
さきほども編集した`inventories/group_vars/all.yml`に下記のように追記します。

```diff
nginx_backends:
  - host: 192.0.2.12
    port: "{{ server_port }}"
+ - host: 192.0.2.13
+   port: "{{ server_port }}"
```

これは nginx が通信を経由させるサーバのリストを格納している変数です。
ここに新しく`app2`サーバの情報を追記することで、nginx が`app2`サーバにも通信を流してくれます。

nginx はロードバランサ（負荷分散装置）としての機能も備えているので、
こうすることで今まで`app1`サーバにしかいかなかった通信が`app2`にも行くようになり、負荷を分散できます。

nginx の機能について詳しく説明することは主題から外れてしまいますので、この講義では行いません。
さらに詳しく知りたい人は nginx の[公式ドキュメント](http://nginx.org/en/docs/http/load_balancing.html)をご覧ください。

#### 実行

さて、ファイルの準備ができたら Ansible を実行します。
今回は事前にチェックを行ってみましょう。

```sh
ansible-playbook -C site.yml
```

`dryrun`で結果を確認すると、新たに`app2`サーバが増えていることが確認できます。
また、nginx の設定ファイルの差分も確認できるはずです。

`failed=0`と表示されていれば問題ありません。
`-C（--check）`のオプションを外し、本実行を行いましょう。

コマンドが終了したら、ブラウザで<https://localhost:8443>にアクセスして確認してみましょう。

この Web アプリケーションは動作しているサーバのホスト名を画面に表示しています。
新しくブラウザを開き<https://localhost:8443>にアクセスすると、ホスト名の表記が変わっているはずです。

これにより、nginx が正常に負荷を分散してくれていることが確認できます。

ここで、もう一つ注目していただきたいところがあります。
Ansible の実行ログの中に、`RUNNING HANDLER`という表記が確認できると思います。
さきほどと同じ様に`ansible-playbook site.yml`と実行した場合、この表記がなくなると思います。

これは Ansible のハンドラという機能になります。
これは、ハンドラを設定したタスクが`changed`のときにのみ実行されるタスクを設定できる機能です。
実際に実行されるタスクは各ロールの`handlers/main.yml`に書かれています。

これにより設定ファイルが変更された場合のみ、アプリケーションやデータベースなどのプロセスを再起動できます。
影響範囲を限定できるため、安全にホストに対して変更を加えることができます。

詳細は[公式ドキュメント](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html#handlers-running-operations-on-change)をご覧ください。

### 解答例

[教材の solution ブランチ](https://github.com/iij/ansible-exercise/tree/solution)が解答例になっています。
この解答例以外にも多くの実現方法がありますが、参考にしてもらえればと思います。

他のファイルについても、この講義を受けた後の最終的なファイルの内容になっています。
ハンズオンを進める中でつまずくことがあれば、参考にしてもらえればと思います。

### コラム 特定の playbook のみ実行する

Ansible には冪等性を担保する為の仕組みが備わっているというのは記述したとおりです。
しかしながら、実行する前から不要と分かっている作業まで読み込ませ、Ansible に実行判断を任せるというのは
万が一を気にする運用の場では不安を感じたり、処理時間が惜しいと感じることもあるでしょう。

Ansible ではそのような際に、実行タスクを分けて実行する事も可能になっています。
今回のケースでは以下のように実行する事で nginx のみのタスクだけ実行する、といった事が可能になります。

```sh
ansible-playbook -C site.yml -t nginx
```

これはどのように実行しているのでしょうか。
実は Ansible には`タグ`という機能があり、タスクやロールなどに任意の値（タグ）を付けることができます。
これを利用することで、Ansible 実行時に任意のタスクのみを実行する/しないことができます。
実はさきほどの`playbooks/rp.yml`にタグが設定してありました。

タグは増やしすぎても管理がたいへんになるので、ある程度のまとまりやよく使うタスクにのみ付与するのが良いでしょう。
タグの詳細については[公式ドキュメント](https://docs.ansible.com/ansible/latest/user_guide/playbooks_tags.html)をご覧ください。

<credit-footer/>
