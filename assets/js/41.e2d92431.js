(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{536:function(s,a,t){"use strict";t.r(a);var n=t(16),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"_5-ansible-によるサーバセットアップ"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-ansible-によるサーバセットアップ"}},[s._v("#")]),s._v(" 5. Ansible によるサーバセットアップ")]),s._v(" "),a("p",[s._v("ここまでで一通り、Ansible playbook の作り方を学びました。\nでは、ここからは実際にサーバのセットアップを行っていきます。")]),s._v(" "),a("h3",{attrs:{id:"サーバ構築用のplaybook-を作成する"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#サーバ構築用のplaybook-を作成する"}},[s._v("#")]),s._v(" サーバ構築用のplaybook を作成する")]),s._v(" "),a("p",[s._v("前回、Playbook は"),a("strong",[s._v("一連のターゲットホストに対して複数の複雑なタスクを簡単に反復可能な方法で実行できるようにする")]),s._v("と記載しました。")]),s._v(" "),a("p",[s._v("今回は前回の「対象ホストに対して ping 応答を確認する」とは異なり、\n実際にサーバに対して何らかの操作を施すものを作ります。")]),s._v(" "),a("h2",{attrs:{id:"実践演習-ユーザ・グループを作成するplaybookを作る"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#実践演習-ユーザ・グループを作成するplaybookを作る"}},[s._v("#")]),s._v(" [実践演習] ユーザ・グループを作成するplaybookを作る")]),s._v(" "),a("p",[s._v("以下の要件を満たす playbook を作成してください")]),s._v(" "),a("h3",{attrs:{id:"要求仕様"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#要求仕様"}},[s._v("#")]),s._v(" 要求仕様")]),s._v(" "),a("ul",[a("li",[s._v("作成する playbook 名\n"),a("ul",[a("li",[a("strong",[s._v("create_group.yml")])])])]),s._v(" "),a("li",[s._v("操作対象のターゲットグループ\n"),a("ul",[a("li",[s._v("グループ名\n"),a("ul",[a("li",[a("strong",[s._v("exercise")])])])]),s._v(" "),a("li",[s._v("対象ホスト\n"),a("ul",[a("li",[a("strong",[s._v("host00, host01")])])])])])]),s._v(" "),a("li",[s._v("実行タスク\n"),a("ul",[a("li",[s._v("タスク1\n"),a("ul",[a("li",[s._v("Linux ユーザグループの作成\n"),a("ul",[a("li",[s._v("グループ名, GID\n"),a("ul",[a("li",[a("strong",[s._v("bootcamp")]),s._v(", "),a("strong",[s._v("1750")])])])])])])])]),s._v(" "),a("li",[s._v("タスク2\n"),a("ul",[a("li",[s._v("Linux ユーザ の作成\n"),a("ul",[a("li",[s._v("ユーザ名, UID\n"),a("ul",[a("li",[a("strong",[s._v("bootcampuser")]),s._v(", "),a("strong",[s._v("4000")])])])])])])])])])])]),s._v(" "),a("h4",{attrs:{id:"tasks作成のヒント"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tasks作成のヒント"}},[s._v("#")]),s._v(" tasks作成のヒント")]),s._v(" "),a("ul",[a("li",[s._v("linux グループの作成には"),a("a",{attrs:{href:"https://docs.ansible.com/ansible/latest/collections/ansible/builtin/group_module.html#ansible-collections-ansible-builtin-group-module",target:"_blank",rel:"noopener noreferrer"}},[s._v("ansible-builtin-group-module"),a("OutboundLink")],1),s._v("を使います")]),s._v(" "),a("li",[s._v("linux ユーザの作成には"),a("a",{attrs:{href:"https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html#ansible-collections-ansible-builtin-user-module",target:"_blank",rel:"noopener noreferrer"}},[s._v("ansible-builtin-user-module"),a("OutboundLink")],1),s._v("を使います")])]),s._v(" "),a("h3",{attrs:{id:"動作確認"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#動作確認"}},[s._v("#")]),s._v(" 動作確認")]),s._v(" "),a("p",[s._v("playbookが作成できたならば以下の通り実行します。")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("ansible-playbook create_group.yml\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("実行ログ")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("SSH password:\n\nPLAY "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("演習.5 ユーザ・グループを作成するplaybookを作る"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" ***********************************************************************************************************************************************************************************\n\nTASK "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("ユーザグループを作成する"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" **********************************************************************************************************************************************************************************************************\nchanged: "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("host00"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\nchanged: "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("host01"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\nTASK "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("ユーザを作成する"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" ******************************************************************************************************************************************************************************************************************\nok: "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("host01"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\nok: "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("host00"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\nPLAY RECAP *******************************************************************************************************************************************************************************************************************************\nhost00                     "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ok")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("changed")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("unreachable")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("failed")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("skipped")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("rescued")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ignored")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("host")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br")])]),a("h3",{attrs:{id:"作成されたことの確認"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#作成されたことの確認"}},[s._v("#")]),s._v(" 作成されたことの確認")]),s._v(" "),a("p",[s._v("ansibleコマンドが無事に実行できたならば、\nansible-exerciseのリポジトリにあるチェック用のplaybookを使ってグループとユーザの確認を行います。")]),s._v(" "),a("p",[s._v("分からなければ以下をそのままコピーして確認用のplaybookを作成します")]),s._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("---")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"演習.5 ユーザ・グループを作成するplaybookを作る"')]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("hosts")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" exercise\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("gather_facts")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[s._v("false")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("tasks")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" グループ 'bootcamp' の情報を取得\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ansible.builtin.command")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" getent group bootcamp\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("register")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" bootcamp_group\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ignore_errors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[s._v("true")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("changed_when")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[s._v("false")]),s._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ユーザ 'bootcampuser' の情報を取得\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ansible.builtin.command")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" getent passwd bootcampuser\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("register")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" bootcampuser_user\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ignore_errors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[s._v("true")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("changed_when")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean important"}},[s._v("false")]),s._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" グループ 'bootcamp' が存在し、GID 1750 を持っているか確認\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ansible.builtin.assert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("that")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"bootcamp_group.rc == 0"')]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("\"bootcamp_group.stdout.split(':')[2] == '1750'\"")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("fail_msg")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("\"'bootcamp' グループが GID 1750 を持っていません。\"")]),s._v("\n\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ユーザ 'bootcampuser' が存在し、UID 4000 を持っているか確認\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ansible.builtin.assert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("that")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"bootcampuser_user.rc == 0"')]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("\"bootcampuser_user.stdout.split(':')[2] == '4000'\"")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("fail_msg")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("\"'bootcampuser' ユーザが UID 4000 を持っていません。\"")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br")])]),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("ansible-playbook assert_group.yml\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("正しくグループとユーザが作成されていれば正常終了するはずです。")]),s._v(" "),a("h2",{attrs:{id:"参考情報"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考情報"}},[s._v("#")]),s._v(" 参考情報")]),s._v(" "),a("h3",{attrs:{id:"syntax-check・dryrunの活用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#syntax-check・dryrunの活用"}},[s._v("#")]),s._v(" syntax-check・dryrunの活用")]),s._v(" "),a("p",[s._v("Ansible を使う上で、playbook が正しく作る事ができたか事前に確認したくなることはないでしょうか。\n幸い、Ansible には事前に書式をチェックする(Syntax check)や実行チェック（dryrun）機能が備わっています。")]),s._v(" "),a("p",[s._v("Playbook の書式チェックには "),a("code",[s._v("--syntax-check")]),s._v("オプションを使います。\n先ほどのコマンドの例で言えば以下のように実行します。")]),s._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("ansible-playbook -i inventories/hosts create_group.yml --syntax-check\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("これは playbook が正しく記述されているかどうかをチェックするコマンドになります。\n"),a("code",[s._v("--syntax-check")]),s._v("は簡単に実行できる反面、あくまで書式のチェックを行うだけなので\nタスクの実行チェックはなされません。")]),s._v(" "),a("p",[s._v("例えば、 http サーバをインストールし、起動する。といったタスクを作ろうとしたときに\n"),a("code",[s._v("httpd の起動")]),s._v(" -> "),a("code",[s._v("httpd のインストール")]),s._v(" と書いていてもそれぞれの書式が正しければ\nsyntax-check は OK となってしまいます。")]),s._v(" "),a("p",[s._v("従って、Playbook が正しく実行できるか？と言うことを事前に調べるにはチェックモード（dryrun）を用います。")]),s._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("ansible-playbook -i inventories/hosts create_group.yml -C\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("こちらのコマンドであれば、実際に Playbook を順番に試行し、実行できるか否かを\nチェックするため、より深く知ることが可能です。\nでは Ansible はこのドライランの時はどのように動作をしているのでしょうか？\nそれはモジュール毎に "),a("code",[s._v("-C")]),s._v("オプション付きで実行された時の動作が記載されており\n条件分岐を行っています。")]),s._v(" "),a("p",[s._v("しかし、dryrunもsyntax-check同様万能ではありません。\nAnsibleにおけるdryrunの実装はモジュールに委ねられており、Ansible全体としての動作を保証していません。\n例えば、コマンドモジュール(command)のようなモジュールはチェックモードの分岐がなく、処理そのものがスキップされてしまいます。\nこういったタスクが含まれている場合、コマンドの結果を次のタスクに受け渡す、\nといったタスクが失敗してしまうので注意して使う必要があります。")]),s._v(" "),a("credit-footer")],1)}),[],!1,null,null,null);a.default=e.exports}}]);