(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{493:function(e,s,a){"use strict";a.r(s);var t=a(10),n=Object(t.a)({},(function(){var e=this,s=e._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("header-table"),e._v(" "),s("h2",{attrs:{id:"おさらい"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#おさらい"}},[e._v("#")]),e._v(" おさらい")]),e._v(" "),s("p",[e._v("それでは実際にDockerを使って仮想環境プラットフォームを作る前にまずは環境の確認をしましょう。")]),e._v(" "),s("p",[e._v("下記コマンドを入力し、コマンドが実行できるか確認してください。")]),e._v(" "),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" version\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])]),s("p",[e._v("上記コマンドが実行できない方は事前にDocker（及びコマンド）のインストールが終わっているか否か確認し、未完了の人は、Docker のインストールを行ってください。")]),e._v(" "),s("h2",{attrs:{id:"dockerコンテナで仮想環境プラットフォームを構築する"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dockerコンテナで仮想環境プラットフォームを構築する"}},[e._v("#")]),e._v(" Dockerコンテナで仮想環境プラットフォームを構築する")]),e._v(" "),s("p",[e._v("本章では、"),s("strong",[e._v("Dockerイメージ")]),e._v("を取得し、実際に"),s("strong",[e._v("Dockerコンテナ")]),e._v("を使って仮想環境プラットフォームを構築します。")]),e._v(" "),s("p",[e._v("Dockerコンテナを使って仮想環境プラットフォームを構築するためには、以下の作業が必要になります。")]),e._v(" "),s("ul",[s("li",[e._v("Dockerイメージのビルド")]),e._v(" "),s("li",[e._v("Dockerコンテナの作成")]),e._v(" "),s("li",[e._v("Dockerコンテナの起動")])]),e._v(" "),s("h2",{attrs:{id:"docker-イメージのビルド"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#docker-イメージのビルド"}},[e._v("#")]),e._v(" Docker イメージのビルド")]),e._v(" "),s("p",[e._v("Dockerコンテナを使って仮想環境プラットフォームを作成するためには、Dockerイメージが必要となります。")]),e._v(" "),s("p",[e._v("通常であれば、"),s("code",[e._v("Dockerfile")]),e._v("を使用して自分のアプリケーションのDockerイメージを作成します。\n"),s("code",[e._v("Dockerfile")]),e._v("は、アプリケーションの依存関係や設定、実行コマンドなどを指定するためのテキストファイルです。\n"),s("code",[e._v("DockerFile")]),e._v("が作成できたらDockerイメージをビルドして作成します。その際に使うコマンドは"),s("code",[e._v("docker build")]),e._v("になります。")]),e._v(" "),s("p",[e._v("通常であればテキストエディタを開いて"),s("code",[e._v("DockerFile")]),e._v("を作成しますが、完全にゼロの状態から"),s("code",[e._v("DockerFile")]),e._v("を作成するのは難しい為、先ずはチュートリアル用に公開されている物を使用すると良いでしょう")]),e._v(" "),s("h3",{attrs:{id:"基本演習"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#基本演習"}},[e._v("#")]),e._v(" 基本演習")]),e._v(" "),s("p",[e._v("基本演習では予め作成済みである"),s("code",[e._v("DockerFile")]),e._v("を使用してDockerイメージを作成します。")]),e._v(" "),s("ol",[s("li",[e._v("DockerFileの取得"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/docker/getting-started.git\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])])]),e._v(" "),s("li",[e._v("イメージのビルド"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" getting-started\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" build -t iijbootcamp_docker01 "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v("\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br")])])]),e._v(" "),s("li",[e._v("コンテナの起動"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" run --rm --name iijbootcamp_docker01-tutorial iijbootcamp_docker01\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])])])]),e._v(" "),s("p",[e._v("ここまでできた方は、プロンプトに以下のように出力されているはずです。")]),e._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v('/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/\n/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh\n10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf\n10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf\n/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh\n/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh\n/docker-entrypoint.sh: Configuration complete; ready for start up\n2022/06/17 04:10:18 [notice] 1#1: using the "epoll" event method\n2022/06/17 04:10:18 [notice] 1#1: nginx/1.21.6\n2022/06/17 04:10:18 [notice] 1#1: built by gcc 10.3.1 20211027 (Alpine 10.3.1_git20211027)\n2022/06/17 04:10:18 [notice] 1#1: OS: Linux 4.18.0-348.2.1.el8_5.x86_64\n2022/06/17 04:10:18 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576\n2022/06/17 04:10:18 [notice] 1#1: start worker processes\n2022/06/17 04:10:18 [notice] 1#1: start worker process 32\n')])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br"),s("span",{staticClass:"line-number"},[e._v("6")]),s("br"),s("span",{staticClass:"line-number"},[e._v("7")]),s("br"),s("span",{staticClass:"line-number"},[e._v("8")]),s("br"),s("span",{staticClass:"line-number"},[e._v("9")]),s("br"),s("span",{staticClass:"line-number"},[e._v("10")]),s("br"),s("span",{staticClass:"line-number"},[e._v("11")]),s("br"),s("span",{staticClass:"line-number"},[e._v("12")]),s("br"),s("span",{staticClass:"line-number"},[e._v("13")]),s("br"),s("span",{staticClass:"line-number"},[e._v("14")]),s("br")])]),s("p",[e._v("ここまでできたらDockerコンテナによる仮想環境プラットフォームの構築は完了です。\nとりあえずここでは "),s("strong",[e._v("Ctrl+C")]),e._v(" で停止してください。")]),e._v(" "),s("h4",{attrs:{id:"ビルドがうまくいかない人の為に"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ビルドがうまくいかない人の為に"}},[e._v("#")]),e._v(" ビルドがうまくいかない人の為に")]),e._v(" "),s("p",[s("code",[e._v("git clone")]),e._v(" できない、 "),s("code",[e._v("docker build")]),e._v(" ができないという方は以下を試してみましょう。\ngetting-startedでは予めビルド済みイメージを公開している為、ビルド済みのイメージを使って起動することが可能です。")]),e._v(" "),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" run --rm --name iijbootcamp_docker01-tutorial docker/getting-started\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])]),s("p",[e._v("また、 この "),s("code",[e._v("docker/getting-started")]),e._v(" image を "),s("code",[e._v("iijbootcamp_docker01")]),e._v(" と呼べるようにしておきましょう")]),e._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("docker tag docker/getting-started iijbootcamp_docker01\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])]),s("p",[s("code",[e._v("docker images")]),e._v(" コマンドで今 pull してあったり build して用意した image が確認できます。")]),e._v(" "),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" images\n\nREPOSITORY               TAG       IMAGE ID       CREATED          SIZE\ndocker/getting-started   latest    3e4394f6b72f   "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("6")]),e._v(" months ago     47MB\niijbootcamp_docker01     latest    3e4394f6b72f   "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("6")]),e._v(" months ago     47MB\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br"),s("span",{staticClass:"line-number"},[e._v("3")]),s("br"),s("span",{staticClass:"line-number"},[e._v("4")]),s("br"),s("span",{staticClass:"line-number"},[e._v("5")]),s("br")])]),s("h3",{attrs:{id:"発展課題"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#発展課題"}},[e._v("#")]),e._v(" 発展課題")]),e._v(" "),s("p",[e._v("先ほどの作業ではフォアグラウンドで実行している為、ターミナルが占有されてしまいます。\nまた、このような起動では例えばssh等で接続している場合はセッション切断と共にコンテナが停止してしまう為、発展課題ではこれを永続化する事をやってみましょう。")]),e._v(" "),s("p",[e._v("デーモン起動をすると、ターミナルは返ってきてしまうため起動確認は "),s("code",[e._v("docker ps")]),e._v("を使って確認します。")]),e._v(" "),s("ol",[s("li",[e._v("コンテナのデーモン起動"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" run -d --name iijbootcamp_docker01-tutorial iijbootcamp_docker01\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])])]),e._v(" "),s("li",[e._v("コンテナの起動確認"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v("CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS         PORTS     NAMES\n41ee2d91a50a   iijbootcamp_docker01   "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"/docker-entrypoint.…"')]),e._v("   "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("3")]),e._v(" minutes ago   Up "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("3")]),e._v(" seconds   "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("80")]),e._v("/tcp    iijbootcamp_docker01-tutorial\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br"),s("span",{staticClass:"line-number"},[e._v("2")]),s("br")])])]),e._v(" "),s("li",[e._v("コンテナの停止"),s("div",{staticClass:"language-bash line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("docker")]),e._v(" stop iijbootcamp_docker01-tutorial\n")])]),e._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[e._v("1")]),s("br")])])]),e._v(" "),s("li",[e._v("コンテナの再起動\n"),s("ul",[s("li",[e._v("先ほど停止したコンテナを再起動してみましょう。")])])]),e._v(" "),s("li",[e._v("コンテナの削除\n"),s("ul",[s("li",[e._v("停止したコンテナを削除してみましょう")])])])]),e._v(" "),s("h4",{attrs:{id:"発展課題tips"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#発展課題tips"}},[e._v("#")]),e._v(" 発展課題Tips")]),e._v(" "),s("ol",{attrs:{start:"4"}},[s("li",[s("ol",{attrs:{start:"5"}},[s("li",[e._v("は発展自己学習です。以下のコマンドを使うことで実現可能です。\n他にもコマンドがあるので調べながら色々やってみましょう。")])])])]),e._v(" "),s("ul",[s("li",[s("code",[e._v("docker start")])]),e._v(" "),s("li",[s("code",[e._v("docker ps -a")])]),e._v(" "),s("li",[s("code",[e._v("docker rm")])])]),e._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[e._v("#")]),e._v(" まとめ")]),e._v(" "),s("p",[e._v("さて、ここまでやってみて作業が面倒だと感じたことは無いでしょうか。\nまた、事前準備ではdockerの動作確認で"),s("code",[e._v("docker run")]),e._v("を実行したのでは無いかと思います。\n実は"),s("code",[e._v("docker run")]),e._v("はこれらのコマンドを包含した物となっています。")]),e._v(" "),s("p",[e._v("従って、ここまでの作業であれば通常は"),s("code",[e._v("docker run docker/getting-started")]),e._v("とする事になります。")]),e._v(" "),s("p",[e._v("しかしながら、場合によってはイメージのみを予め取得しておきたい、\n取得済みのイメージを起動したい、など順を踏んで実行する事もあるためそれぞれの動作について理解して頂ければと思います。")]),e._v(" "),s("credit-footer")],1)}),[],!1,null,null,null);s.default=n.exports}}]);