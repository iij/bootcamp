---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
---

## 1. Ansibleとは

Ansibleとは、IT自動化ツールです。
Ansibleを利用するとシステムの構成、ソフトウェアの展開、より高度なITタスク (継続的なデプロイメントやダウンタイムなしのローリング更新など) のオーケストレーションが可能になります。

Ansible docs: <https://docs.ansible.com/ansible/latest/index.html>

```
Ansible is an IT automation tool. It can configure systems, deploy software, and orchestrate more advanced IT tasks such as continuous deployments or zero downtime rolling updates.
```

github: <https://github.com/ansible/ansible>

```
Ansible is a radically simple IT automation system. It handles configuration management, application deployment, cloud provisioning, ad-hoc task execution, network automation, and multi-node orchestration. Ansible makes complex changes like zero-downtime rolling updates with load balancers easy. More information on the Ansible website.
```

### Ansible の特徴

- エージェントレスである
  - Ansibleは対象の管理は基本的に[OpenSSH](https://www.openssh.com/)を利用する為、専用のクライアント/デーモンを必要としません
- 状態を管理しない
  - Ansibleには対象となるマシン情報（Inventory) を持ちますが、そのマシンの状態を保有することはありません。Inventoryファイルはansible playbooksなどで利用するためのものであり、状態を管理・監視することはありません
- 冪等性を持つ
  - Ansibleはplaybooksを基本的に何回実行しても結果は同じになります。例えばhttpdのインストールタスク等はインストール済みであれば複数回実行しても2回目以降は実行済みとして処理され、二度実行されることがありません。


Ansibleの記述には基本的に[YAML](https://yaml.org/)と呼ばれる記述（解読）言語が用いられておりユーザにも読み書きしやすいようになっています。

2.10以降、Ansibleのパッケージ方針には大幅な変更がなされ、Ansible-core, Ansible-collectionといった物が登場しており、パッケージングについては未だ流動的ですがAnsibleは基本的にモジュール・プラグインといった形で機能追加ができるようになっている為、必要に応じて自らモジュールを作成することも可能です。

* [モジュール一覧](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)
* [プラグイン一覧](https://docs.ansible.com/ansible/latest/plugins/plugins.html)


### Ansibleの基本用語

本講義に限らず、Ansibleに登場する基本的な用語の解説。
基本的には以下の引用ですが、一部追加・割愛しています。

[Ansible Trail Map](https://www.redhat.com/ja/explore/ansible/trailmap/yaml/step3)


#### Target Node / Host
Ansibleから操作する対象で、ホストとも表現されます。Ansibleでは、Target Nodeに特別なエージェントなどのインストールは必要ありません。Ansibleは、Linuxサーバやネットワーク機器、クラウド等の様々なものを操作対象にできます。

#### Inventory
操作・管理対象とするTarget Nodeを纏めたリストを指します。Inventory内においてTarget Nodeは複数のグループに分類して登録することができます。このInventoryは、Ansibleによる処理を実施する場合に必要です。

#### Roles

既知のファイル構造に基づいて特定の変数、タスク、およびハンドラーを自動的に読み込むようひとまとめにしたものです。 ロールでコンテンツをグループ化すると、他のユーザーとのロールの共有が容易になります。

#### Task
Ansibleにおける、処理（ステップ）の最小単位です。実行対象に対してあってほしい状態や実施する処理を記述します。

#### Module
Ansibleにおいて対象に対して何かを実施する際に用いる最小の部品（プログラム）で、Taskごとに一つのModuleを指定して利用します。

#### Play
インベントリ内の対象範囲と実施する1つ以上のTaskを記載します。

#### Playbook
Ansibleにおいて、自動化の手順書にあたります。

Playbookの中には、1つ以上のPlayが含まれます。このトレイルマップではPlaybookには1つのPlayのみの構成となっています。