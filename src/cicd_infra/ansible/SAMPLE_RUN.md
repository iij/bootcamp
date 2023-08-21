---
footer: CC BY-SA Licensed | Copyright (c) 2023, Internet Initiative Japan Inc.
---

## 2. Ansibleの実行

Ansibleを利用する為にはいくつかのファイルを書く必要がありますが
まずは実際にAnsibleを実行してイメージを掴んでみましょう。

### サンプルの実行

ダウンロードした[教材](https://github.com/iij/ansible-exercise)のフォルダ内で下記コマンドを実行しコンテナ内に入る、
またはVScodeの`Remote - Containers`を使い教材のフォルダを開き、コンテナ内に入ります。

Windows

```powershell
docker compose -f docker-compose\docker-compose.yml start
docker exec -it docker-compose-ansible-1 bash
```

Mac/Linux

```sh
docker compose -f docker-compose/docker-compose.yml up -d
docker exec -it docker-compose-ansible-1 bash
```

続いて[ansibleコマンド](https://docs.ansible.com/ansible/latest/cli/ansible.html)を使って
アドホックにansibleを実行します。

```sh
ansible -m ping db1
```

```txt
db1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
```

Ansibleは基本的に実行すべき内容（task)を記載したplaybookを作成し、`ansible-playbook`コマンドを用いて実行するものですが、上記の通りplaybookを作成しなくとも実行できるコマンドもあるため、細かな日々の運用作業や確認作業などに使えます。

なお、[ansible-playbookコマンド](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html)は`playbook`と呼ばれるYAMLファイルにしたがってAnsibleを実行するコマンドになります。
今回はAnsibleの実行イメージと出力のイメージを掴んで頂くためにアドホックで実行しましたが以後、このハンズオンでは主に`ansible-playbook`コマンドを使っていきます。
