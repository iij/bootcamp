---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 3. ansible 設定ファイルの管理

先ほど、アドホックにansibleコマンドを実行した際に、`-k`オプションを使っていました。
これはansibleを実行する際にsshのパスワードを入力させるというオプションになります。

Ansibleは通常、sshのログインにパスワードなしの鍵認証を想定しているため、オプション無しで実行した場合は
sshのパスワードを入力させることはありません。

しかし、今回の演習ではパスワードログインによって実行していますので
毎回`-k`オプションを実行するのは手間になります。

これらの設定についてAnsibleでは設定ファイルの設定を変更することでカスタマイズできます。

ansibleの設定ファイルは `ansible.cfg` という名前になっています。
従って今回は設定ファイルを編集し、`-k`オプションなしでもsshのパスワードを入力させるように変更してみましょう。

## [演習] 設定ファイルの編集

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
- 動作確認
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

## 参考情報

### ansible.cfg パラメータの確認

Ansibleには様々な設定を施すことが可能な他、デフォルト値が定められている物もあります。
これらを確認するにはどうすれば良いのでしょうか。
また、どのような設定が可能なのか全ての設定値を覚えておくことは現実的ではありません。

こういったときのために`ansible-config` というコマンドを用いることができます。

```bash
 ansible-config
```