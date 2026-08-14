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
2015年に RedHat 社に買収されて以降、エンタープライズ向け機能が強化され、2026年7月現在の最新バージョンは 2.10.8 です。クラウドネイティブ環境にも対応しています。

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

- ansible のインストール

  ```bash
  pip install ansible
  ```

  <details>
  <summary>実行結果例</summary>

  ```bash
      installed package ansible 10.7.0, installed using Python 3.10.12
    These apps are now globally available
      - ansible
      - ansible-community
      - ansible-config
      - ansible-connection
      - ansible-console
      - ansible-doc
      - ansible-galaxy
      - ansible-inventory
      - ansible-playbook
      - ansible-pull
      - ansible-test
      - ansible-vault
      - cffi-gen-src
  ⚠  Note: '/home/***/.local/bin' is not on your PATH environment variable. These apps will not be
      globally accessible until your PATH is updated. Run `pipx ensurepath` to automatically add it, or manually
      modify your PATH in your shell's config file (i.e. ~/.bashrc).
  done! ✨ 🌟 ✨
   ```

   </details>
- ansible のインストール確認
  - pip でインストールした後、一度シェルを立ち上げ直す必要があります

   ```bash
   exit
   ## 再ログインする
  ```

- インストールが完了すると、以下のような出力が得られます。

  ```bash
  # ansible --version
  ansible [core 2.15.13]
    config file = /etc/ansible/ansible.cfg
    configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
    ansible python module location = /usr/local/lib/python3.9/site-packages/ansible
    ansible collection location = /root/.ansible/collections:/usr/share/ansible/collections
    executable location = /usr/local/bin/ansible
    python version = 3.9.25 (main, Jul 13 2026, 00:00:00) [GCC 11.5.0 20240719 (Red Hat 11.5.0-14)] (/usr/bin/python3)
    jinja version = 3.1.6
    libyaml = True
  ```

- バージョンやパスは環境によって異なりますが、表示されればインストール成功です。

<credit-footer/>
