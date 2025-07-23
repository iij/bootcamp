---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 5. ansible 設定ファイルの管理

先ほど、アドホックにansibleコマンドを実行した際に、`-k`オプションを使っていました。
これはansibleを実行する際にsshのパスワードを入力させるというオプションになります。

Ansibleは通常、sshのログインにパスワードなしの鍵認証を想定しているため、オプション無しで実行した場合はsshのパスワードを入力させることはありません。

しかし、今回の演習ではパスワードログインによって実行しています。
従って、毎回`-k`オプションを付与して実行する必要がありますが、手間になってします。

この章では、Ansibleの動作仕様や設定ファイルの管理方法について学びます。  
Ansibleの設定ファイルを活用することで、動作のカスタマイズや運用の効率化が可能です。

### Ansible設定ファイルの種類

Ansibleの設定は主に以下の方法で管理できます。

- **ansible.cfg**: Ansibleのメイン設定ファイル。動作全般のカスタマイズが可能です。
- **環境変数**: 環境ごとに設定値を上書きできます。
- **コマンドラインオプション**: 一時的な設定変更に利用します。

### 設定ファイルでできること

Ansibleの設定ファイルでは、以下のような設定が可能です。

- 並列実行数の設定（`forks` パラメータ）
- リトライ回数の設定（`retry_files_enabled` パラメータ）
- ログの保存場所指定（`log_path` パラメータ）
- プラグインの設定（`callback_plugins` など）

他にも様々な設定が可能となっており、詳細については公式ドキュメントを確認してください

## [演習.5] 設定ファイルの編集 - パスワード入力をデフォルト動作とする

では、実際に設定ファイルを編集してみましょう。
設定ファイルは `ansible.cfg` となります。

- ansible.cfg の作成
  ```bash
  vi ansible.cfg
  ```
- `askpass = True`を `[defaults]`セクションに記載する
  ```bash
  [defaults]
  ask_pass = True
  ```

### 動作確認

- 先ほど作成した設定が正しいことを確かめるために、`ansible`コマンドで Ping モジュールを実行してみます。 `-k`オプションを指定しなくてもパスワードを求められるはずです
  ```bash
  ansible -i inventories/hosts exercise -m ping
  ```
- パスワードを聞かれるため事前準備で設定したパスワード(ansible)を入力します
- 出力結果
  ```bash
  host01 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python"
      },
      "changed": false,
      "ping": "pong"
  }
  host00 | SUCCESS => {
      "ansible_facts": {
          "discovered_interpreter_python": "/usr/bin/python"
      },
      "changed": false,
      "ping": "pong"
  }
  ```

正しく実行されれば *SUCCESS* と出力されます。


## [発展演習.1] ログの設定

タスクの実行ログを保存し、後で確認できるようにします

- 設定ファイルの編集: ansible.cfg ファイルを開き、以下の設定を追加します。
  ```bash
  [defaults]
  log_path = /var/log/ansible.log
  ```
- Ansibleコマンドを実行し、ログファイルが生成されていることを確認します。
  ```bash
  ansible-playbook -i inventory playbook.yml
  ```
- ログファイル `/var/log/ansible.log` が生成されていることを確認します。
  ```bash
  cat /var/log/ansible.log
  ```
- ログには各タスクの実行内容や結果が記録されているはずです。

## 参考情報

### ansible.cfg パラメータの確認

Ansibleには様々な設定を施すことが可能な他、デフォルト値が定められている物もあります。
これらを確認するにはどうすれば良いのでしょうか。
また、どのような設定が可能なのか全ての設定値を覚えておくことは現実的ではありません。

こういったときのために`ansible-config` というコマンドを用いることができます。

```bash
 ansible-config
```