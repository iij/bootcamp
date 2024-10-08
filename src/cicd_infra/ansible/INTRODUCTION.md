---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## Ansible とは

Ansibleは、IT環境の自動化を実現する強力なオープンソースツールです。システム構成管理、アプリケーションデプロイ、タスク実行、オーケストレーションなど、幅広い用途で活用されています。Ansibleの最大の特徴は、シンプルさと柔軟性を兼ね備えていることです。YAMLという人間にも読みやすい形式で設定を記述でき、学習曲線が緩やかなため、初心者でも比較的短期間で習得できます。

Ansible docs: <https://docs.ansible.com/ansible/latest/index.html>

```
Ansible is an IT automation tool. It can configure systems, deploy software, and orchestrate more advanced IT tasks such as continuous deployments or zero downtime rolling updates.
```

github: <https://github.com/ansible/ansible>

```
Ansible is a radically simple IT automation system. It handles configuration management, application deployment, cloud provisioning, ad-hoc task execution, network automation, and multi-node orchestration. Ansible makes complex changes like zero-downtime rolling updates with load balancers easy. More information on the Ansible website.
```

### Ansibleの歴史と背景

Ansibleは2012年2月20日にMichael DeHaanによって開発されました。当時、既存の構成管理ツールの複雑さに課題を感じていたDeHaanは、より簡単で効率的なツールを目指してAnsibleを生み出しました。
Ansibleはその後も順調に改良を重ね、2015年10月にRed Hat社に買収されてからは更にエンタープライズ向けの機能強化が進められています。
2024年現在、Ansibleの最新バージョンは2.17であり、クラウドネイティブ環境にも対応しています。

### Ansibleの主要コンポーネント

Ansbleには以下の4つの主要なコンポーネントがあります。
それぞれはそのまま用語としても使うので覚えておきましょう。

- Playbooks: YAML形式で記述される設定ファイル。タスクの順序や条件を定義します。
- Modules: 実際にタスクを実行するためのスクリプト。Ansibleには多くの標準モジュールが含まれています。
- Inventory: 管理対象のホスト情報を記述するファイル。ホストグループや変数を定義します。
- Roles: 再利用可能なPlaybookのセット。特定の機能やサービスの設定をまとめて管理します。

## Ansible の特徴

- エージェントレスである
  - Ansible は対象の管理は基本的に[OpenSSH](https://www.openssh.com/)を利用する為、専用のクライアント/デーモンを必要としません
- 状態を管理しない
  - Ansible には対象となるマシン情報（Inventory) を持ちますが、そのマシンの状態を保有することはありません。Inventory ファイルは ansible playbooks などで利用するためのものであり、状態を管理・監視することはありません
- 冪等性を持つ
  - Ansible は playbooks を基本的に何回実行しても結果は同じになります。例えば httpd のインストールタスク等はインストール済みであれば複数回実行しても 2 回目以降は実行済みとして処理され、二度実行されることがありません。
- YAML形式の採用
Ansibleでは、YAMLという人間にも読みやすい形式でPlaybookを記述します。YAMLは直感的で学習が容易であり、複雑な設定も簡潔に表現できます。これにより、チーム内でのコード共有や保守が容易になり、生産性の向上につながります。


## Ansible の構成

Ansibleは、コントロールノードと管理対象ホストという 2 種類のマシンで構成されています。Ansible はコントロールノードからインストールおよび実行されます。

Ansibleはエージェントレス、ということからAnsibleのインストールはコントロールノードのみに行えばよく、管理対象にインストールする必要はありません。

Ansible のインストールはRPMによる提供もされていますが、現在では`pip`によるインストールが推奨されています。

Ansibleパッケージは長らく単一のパッケージとなっていましたが、2.10 以降、Ansible のパッケージ方針には大幅な変更がなされ、Ansibleの実行部分と、タスクを実行する（モジュール）の分離がなされ、それぞれ別のパッケージで提供されるようになっています。

- [モジュール一覧](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)
- [プラグイン一覧](https://docs.ansible.com/ansible/latest/plugins/plugins.html)

### Ansible の基本用語

本講義に限らず、Ansible に登場する基本的な用語の解説。
基本的には以下の引用ですが、一部追加・割愛しています。

[Ansible Trail Map](https://www.redhat.com/ja/explore/ansible/trailmap/yaml/step3)

#### Target Node / Host

Ansible から操作する対象で、ホストとも表現されます。Ansible では、Target Node に特別なエージェントなどのインストールは必要ありません。Ansible は、Linux サーバやネットワーク機器、クラウド等の様々なものを操作対象にできます。

#### Inventory

操作・管理対象とする Target Node を纏めたリストを指します。Inventory 内において Target Node は複数のグループに分類して登録することができます。この Inventory は、Ansible による処理を実施する場合に必要です。

#### Roles

既知のファイル構造に基づいて特定の変数、タスク、およびハンドラーを自動的に読み込むようひとまとめにしたものです。 ロールでコンテンツをグループ化すると、他のユーザーとのロールの共有が容易になります。

#### Task

Ansible における、処理（ステップ）の最小単位です。実行対象に対してあってほしい状態や実施する処理を記述します。

#### Module

Ansible において対象に対して何かを実施する際に用いる最小の部品（プログラム）で、Task ごとに一つの Module を指定して利用します。

#### Play

インベントリ内の対象範囲と実施する 1 つ以上の Task を記載します。

#### Playbook

Ansible において、自動化の手順書にあたります。

Playbook の中には、1 つ以上の Play が含まれます。このトレイルマップでは Playbook には 1 つの Play のみの構成となっています。

## [演習]Ansible の導入

では、実際にAnsibleを使ってみましょう。

### Ansible のインストール

これまで ansible のインストールは `dnf(yum)` によるインストールでした。
しかしながら昨今のansible は pip にてインストールすることが推奨されています。
従って、今回は`pip`を用いてインストールしてみましょう。

ただし、演習環境には`pip`コマンドがインストールされていない為、
まずは`pip`のインストールから行う必要があります。
以下をそれぞれ実行し、ansible のインストールまで行ってください

- pip のインストール
   ```bash
   dnf install python3-pip
   ```
- ansible のインストール
   ```bash
   pip install ansible
   ```
- ansible のインストール確認
   ```bash
   ansible --version
   ```

ここまで実行したならば以下のような出力が得られるはずです。

```bash
 ansible --version
ansible [core 2.15.3]
  config file = /ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/local/lib/python3.9/site-packages/ansible
  ansible collection location = /root/.ansible/collections:/usr/share/ansible/collections
  executable location = /usr/local/bin/ansible
  python version = 3.9.16 (main, May 29 2023, 00:00:00) [GCC 11.3.1 20221121 (Red Hat 11.3.1-4)] (/usr/bin/python3)
  jinja version = 3.
```

ansible-core の `2.5.13`やそれぞれのバージョンには実行する時期によって異なることがありますが問題ありません。

<credit-footer/>
