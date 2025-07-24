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

Ansibleは2012年にMichael DeHaanによって開発されました。  
既存の構成管理ツールの複雑さを解消するため、より簡単で効率的なツールとして誕生しました。  
2015年にRed Hat社に買収されて以降、エンタープライズ向け機能が強化され、2024年現在の最新バージョンは2.17です。クラウドネイティブ環境にも対応しています。

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
  管理対象には専用のクライアントやデーモンは不要。基本的にSSHで操作します。
- **状態管理をしない**  
  Inventoryファイルは管理対象のリストであり、マシンの状態自体は保持しません。
- **冪等性**  
  Playbookは何度実行しても同じ結果になるよう設計されています。例えば、インストール済みのパッケージは再度インストールされません。
- **YAML形式の採用**  
  人間にも読みやすいYAMLでPlaybookを記述。直感的で学習しやすく、チームでの共有や保守も容易です。


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
  Ansibleが操作する対象。Linuxサーバ、ネットワーク機器、クラウドなど様々なものを管理できます。
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
  自動化の手順書。複数のPlayを含みます。

---

## [演習.1] Ansible の導入

これまで ansible のインストールは `dnf(yum)` によるインストールでした。
しかしながら昨今のansible は pip にてインストールすることが推奨されています。
従って、今回は`pip`を用いてインストールしてみましょう。
`pip`はpythonのモジュールとして提供されており、環境に応じてインストール方法が異なります。

今回の演習ではpipのインストールはAnsibleの本質とは外れるため、予めインストール済みの環境にて実施します。

- コンソールコンテナへログイン
  - [README.md](./README.md)に記載した手順に従い、ansible consoleホストへログインします
- ansible のインストール
  ```bash
  pip install ansible
  ```
  <details>
  <summary>実行結果例</summary>
   
  ```bash
  Collecting ansible
    Downloading ansible-8.7.0-py3-none-any.whl (48.4 MB)
      |████████████████████████████████| 48.4 MB 23.5 MB/s            
  Collecting ansible-core~=2.15.7
    Downloading ansible_core-2.15.13-py3-none-any.whl (2.3 MB)
      |████████████████████████████████| 2.3 MB 24.8 MB/s            
  Collecting PyYAML>=5.1
    Downloading PyYAML-6.0.2-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (737 kB)
      |████████████████████████████████| 737 kB 38.2 MB/s            
  Collecting jinja2>=3.0.0
    Downloading jinja2-3.1.6-py3-none-any.whl (134 kB)
      |████████████████████████████████| 134 kB 35.1 MB/s            
  Collecting cryptography
    Downloading cryptography-45.0.5-cp37-abi3-manylinux_2_34_x86_64.whl (4.4 MB)
      |████████████████████████████████| 4.4 MB 14.8 MB/s            
  Collecting resolvelib<1.1.0,>=0.5.3
    Downloading resolvelib-1.0.1-py2.py3-none-any.whl (17 kB)
  Collecting importlib-resources<5.1,>=5.0
    Downloading importlib_resources-5.0.7-py3-none-any.whl (24 kB)
  Collecting packaging
    Downloading packaging-25.0-py3-none-any.whl (66 kB)
      |████████████████████████████████| 66 kB 8.2 MB/s              
  Collecting MarkupSafe>=2.0
    Downloading MarkupSafe-3.0.2-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (20 kB)
  Collecting cffi>=1.14
    Downloading cffi-1.17.1-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (445 kB)
      |████████████████████████████████| 445 kB 19.7 MB/s            
  Collecting pycparser
    Downloading pycparser-2.22-py3-none-any.whl (117 kB)
      |████████████████████████████████| 117 kB 21.2 MB/s            
  Installing collected packages: pycparser, MarkupSafe, cffi, resolvelib, PyYAML, packaging, jinja2, importlib-resources, cryptography, ansible-core, ansible
  Successfully installed MarkupSafe-3.0.2 PyYAML-6.0.2 ansible-8.7.0 ansible-core-2.15.13 cffi-1.17.1 cryptography-45.0.5 importlib-resources-5.0.7 jinja2-3.1.6 packaging-25.0 pycparser-2.22 resolvelib-1.0.1
  WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
   ```
   </details>
- ansible のインストール確認
   ```bash
   ansible --version
   ```
- インストールが完了すると、以下のような出力が得られます。
  ```bash
  ansible --version
  ansible [core 2.15.3]
    config file = /ansible/ansible.cfg
    configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
    ansible python module location = /usr/local/lib/python3.9/site-packages/ansible
    ansible collection location = /root/.ansible/collections:/usr/share/ansible/collections
    executable location = /usr/local/bin/ansible
    python version = 3.9.16 (main, May 29 2023, 00:00:00) [GCC 11.3.1 20221121 (Red Hat 11.3.1-4)] (/usr/bin/python3)
    jinja version = 3.x
  ```
- バージョンやパスは環境によって異なりますが、表示されればインストール成功です。

<credit-footer/>