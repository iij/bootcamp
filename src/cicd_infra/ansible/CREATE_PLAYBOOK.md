---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
---

## 3. Ansible playbookの作成

Ansibleを実行するには playbookと呼ばれるYAMLファイルを作成する事が
一般的であるというのは前項で述べたとおりです。
では、実際にplaybookを作成してみましょう。

### インベントリを作成する

まずはじめにInventoryファイルと呼ばれる物を作成します。
Ansibleにおいて、Inventoryファイルは対象を示していて実行に欠かせない要素です。

[教材](https://github.com/iij/ansible-exercise)のフォルダには
先ほどのサンプル実行でも使われたinventoryファイルがあります。

```sh
 $ cat inventories/hosts
[app]
app1

[db]
db1

[rp]
rp1
[ain
```


下記に簡単なInventoryの例を示します。皆さんの環境でも試してみてください。

