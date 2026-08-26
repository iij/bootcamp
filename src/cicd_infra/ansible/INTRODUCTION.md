---
footer: CC BY-SA Licensed | Copyright (c) 2025, Internet Initiative Japan Inc.
---

## Ansible とは

Ansibleは、ITインフラの自動化を実現する強力なオープンソースツールです。
システム構成管理、アプリケーションデプロイ、タスク実行、オーケストレーションなど、幅広い用途で利用されています。
最大の特徴は、シンプルかつ柔軟であること。YAML形式で設定を記述でき、初心者でも短期間で習得しやすい点が魅力です。

- 公式ドキュメント: <https://docs.ansible.com/ansible/latest/index.html>
- GitHub: <https://github.com/ansible/ansible>

> Ansible is an IT automation tool. It can configure systems, deploy software, and orchestrate more advanced IT tasks such as continuous deployments or zero downtime rolling updates.

---

### Ansibleの歴史と背景

Ansible は2012年に Michael DeHaan によって開発されました。
既存の構成管理ツールの複雑さを解消するため、より簡単で効率的なツールとして誕生しました。
2015年に RedHat 社に買収されて以降、エンタープライズ向け機能が強化され、2026年8月現在の最新バージョンは 2.21.3 です。クラウドネイティブ環境にも対応しています。

---

### Ansibleの主要コンポーネント

Ansibleは以下の4つの主要コンポーネントで構成されています。
それぞれの用語は頻繁に登場するため、しっかり覚えておきましょう。

- **Playbooks**: YAML形式で記述する設定ファイル。タスクの順序や条件を定義します。
- **Modules**: 実際にタスクを実行するためのスクリプト。標準モジュールが多数用意されています。
- **Inventory**: 管理対象ホストの情報を記述するファイル。ホストグループや変数も定義できます。
- **Roles**: 再利用可能なPlaybookのセット。特定の機能やサービスの設定をまとめて管理します。

---

## Ansibleの特徴

- **エージェントレス**
  - 管理対象には専用のクライアントやデーモンは不要。
  - Python がインストールされていれば動作します。
  - 管理対象ノードには基本的に SSH で操作します。
- **状態管理をしない**
  - Inventory ファイルは管理対象のリストであり、マシンの状態自体は保持しません。
- **冪等性**
  - Playbook は上手に設計することで冪等性(何度実行しても同じ常体になる)を確保できます。
  - 例えば、インストール済みのパッケージは再度インストールしないようにしたり、すでに設置したファイルを上書きしないようにできます。
- **YAML形式の採用**
  人間にも読みやすい YAML で Playbook を記述。直感的で学習しやすく、チームでの共有や保守も容易です。

---

## Ansibleの構成

Ansibleは「コントロールノード」と「管理対象ホスト」の2種類のマシンで構成されます。
Ansibleのインストールはコントロールノードのみに必要で、管理対象には不要です。

インストール方法は従来のRPMパッケージに加え、現在は`pip`によるインストールが推奨されています。
Ansible 2.10以降は、実行部分とモジュール部分が分離され、個別パッケージで提供されています。

- [モジュール一覧](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)
- [プラグイン一覧](https://docs.ansible.com/ansible/latest/plugins/plugins.html)

---

### Ansibleの基本用語

Ansibleで頻出する基本用語を整理します。

- **Target Node / Host**
  Ansibleが操作する対象ノード。Linux サーバ、ネットワーク機器、クラウドなど様々なものを管理できます。
- **Inventory**
  管理対象ノードのリスト。グループ分けや変数定義も可能です。
- **Roles**
  変数・タスク・ハンドラーなどをまとめた再利用可能な構成単位。
- **Task**
  Playbook内で実行する処理の最小単位。
- **Module**
  タスクごとに指定する実行用プログラム。
- **Play**
  インベントリ内の対象範囲と実施するタスク群を記載。
- **Playbook**
  自動化の手順書。複数の Play を含みます。

---

## [演習.1] Ansible の導入

これまで ansible のインストールは `dnf(yum)` によるインストールでした。
しかしながら昨今のansible は pip にてインストールすることが推奨されています。
従って、今回は`pip`を用いてインストールしてみましょう。
`pip`はpythonのモジュールとして提供されており、環境に応じてインストール方法が異なります。

今回の演習では pip のインストールは Ansible の本質とは外れるため、 pip については予めインストール済みの環境にて実施します。

※以降、プロンプトが `[root@ansibleconsole ansible]#` となっているコマンドは、
`docker compose exec console bash` を実行して console コンテナにログインして実行してください。

```bash
  ## ホストから console コンテナにログインする
  $ docker compose exec console bash
  ## 以下のようにプロンプトが変化すればOK
  [root@ansibleconsole /]#
```

- ansible のインストール

  ```bash
  [root@ansibleconsole ansible]# pip install ansible
  ```

  <details>
  <summary>実行結果例</summary>

  ```bash
      Collecting ansible
    Downloading ansible-8.7.0-py3-none-any.whl (48.4 MB)
        |████████████████████████████████| 48.4 MB 34.7 MB/s
    Collecting ansible-core~=2.15.7
      Downloading ansible_core-2.15.13-py3-none-any.whl (2.3 MB)
        |████████████████████████████████| 2.3 MB 22.2 MB/s
    Collecting cryptography
      Downloading cryptography-50.0.0-cp39-abi3-manylinux_2_34_x86_64.whl (4.8 MB)
        |████████████████████████████████| 4.8 MB 31.1 MB/s
    Collecting resolvelib<1.1.0,>=0.5.3
      Downloading resolvelib-1.0.1-py2.py3-none-any.whl (17 kB)
    Collecting PyYAML>=5.1
      Downloading pyyaml-6.0.3-cp39-cp39-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (750 kB)
        |████████████████████████████████| 750 kB 33.9 MB/s
    Collecting importlib-resources<5.1,>=5.0
      Downloading importlib_resources-5.0.7-py3-none-any.whl (24 kB)
    Collecting packaging
      Downloading packaging-26.3-py3-none-any.whl (129 kB)
        |████████████████████████████████| 129 kB 34.9 MB/s
    Collecting jinja2>=3.0.0
      Downloading jinja2-3.1.6-py3-none-any.whl (134 kB)
        |████████████████████████████████| 134 kB 34.2 MB/s
    Collecting MarkupSafe>=2.0
      Downloading markupsafe-3.0.3-cp39-cp39-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (20 kB)
    Collecting cffi>=2.0.0
      Downloading cffi-2.0.0-cp39-cp39-manylinux2014_x86_64.manylinux_2_17_x86_64.whl (216 kB)
        |████████████████████████████████| 216 kB 34.3 MB/s
    Collecting typing-extensions>=4.13.2
      Downloading typing_extensions-4.16.0-py3-none-any.whl (45 kB)
        |████████████████████████████████| 45 kB 8.1 MB/s
    Collecting pycparser
      Downloading pycparser-2.23-py3-none-any.whl (118 kB)
        |████████████████████████████████| 118 kB 40.0 MB/s
    Installing collected packages: pycparser, typing-extensions, MarkupSafe, cffi, resolvelib, PyYAML, packaging, jinja2, importlib-resources, cryptography, ansible-core, ansible
    Successfully installed MarkupSafe-3.0.3 PyYAML-6.0.3 ansible-8.7.0 ansible-core-2.15.13 cffi-2.0.0 cryptography-50.0.0 importlib-resources-5.0.7 jinja2-3.1.6 packaging-26.3 pycparser-2.23 resolvelib-1.0.1 typing-extensions-4.16.0
    WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
   ```

   </details>
- ansible のインストール確認
  - pip でインストールした後、一度シェルを立ち上げ直す必要があります

   ```bash
   exit
   ## 再度コンテナにログインする
  ```

- インストールが完了すると、以下のような出力が得られます。

  ```bash
  # ansible --version
  ansible [core 2.15.13]
    config file = None
    configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
    ansible python module location = /usr/local/lib/python3.9/site-packages/ansible
    ansible collection location = /root/.ansible/collections:/usr/share/ansible/collections
    executable location = /usr/local/bin/ansible
    python version = 3.9.25 (main, Aug  6 2026, 00:00:00) [GCC 11.5.0 20240719 (Red Hat 11.5.0-14)] (/usr/bin/python3)
    jinja version = 3.1.6
    libyaml = True
  ```

- バージョンやパスは環境によって異なりますが、表示されればインストール成功です。

<credit-footer/>
