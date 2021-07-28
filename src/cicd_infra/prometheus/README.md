# prometheusでアプリケーションを監視してみよう
## 0. まえがき
### 0-1. 想定している受講者
本講義では以下の受講者を対象としています。
- 監視って言われても何を監視すればいいのか分からない
- 監視が必要なのはわかるけど、なんで必要なのか分からない
- Prometheusを触ったことがないので触ってみたい

### 0-2. 前提知識
基本的に前提知識は無しでも問題ないですが、以下の点を押さえておくと講義がスムーズに聞けます。
- Linuxの基礎的なコマンド
- dockerの基礎

### 0-3. 事前準備
- Dockerのインストール
  - `docker image ls`で"hello-world"が存在しない状態で、`docker run hello-world`が実行できていればOK
- Docker Composeのインストール
  - `docker-compose --version`でバージョン情報が出ていればOK
  - バージョンに指定はありませんが新しい方がいいです

## 1. 監視概論
### 1-1. 監視とは
「監視」の国語的な意味は「(警戒して)見張ること」です。システムに置ける監視、つまりシステム監視(以下、"監視"と略す)とは「システムを(警戒して)見張ること」です(アラートを発することだけが監視ではないですよ！)。現在、IT技術が著しい発展をとげ、「仮想化」「クラウド化」「サーバレス」「コンテナ化」といった最新の技術がトレンドに上がっていますが、そのどの技術にも「監視」というのは必ずついて周ります。むしろ監視で得られた情報を元に、自動でスケールするようなシステムも多々あり、今まで以上に監視の重要性が高まってきています。本講義ではこの「監視」について、監視における必要な考え方から具体的な構築までをテーマに取り扱っていきたいと思います。

そもそも、監視の目的は「サービスを通してユーザに価値を提供する」ことにあるとされています。もし監視を行わなかった場合、そのシステムは障害が発生の原因が分からず、同じ障害を頻繁に引き起こします。また、障害解決をする際、原因特定に時間がかかり復旧はかなり難航するものとなります。どれだけ素晴らしく画期的なサービスでも、システムが停止している時間が長ければ長いほど顧客を手離し、利益を損なうことになります。またシステムに異常が発生していなくとも、傾向が掴めずちょっとした障害をトリガーに大きな障害を起こしてしまうこともあります。

身近な例ですとソーシャルゲームがいい例です。サーバ負荷を監視しておくことで、毎年どの時期に負荷がかから傾向を掴み、みんながちゃんとガチャを回せるようにサーバを増強させています。そうしないと、せっかく諭吉を片手にゲームを開いたのに、不具合でガチャを回せない状況になっていたら、正気に戻ってガチャを回さなくなってしまいます。

監視とは一体何者なのか？何を監視すればいいのか？それらについて本講義では座学から解説していきたいと思います。

### 1-2. 監視の役割
監視の役割は主に四つあります。

1. システムのリソース状況を誰でも見れるようにする(可視性)
2. 問題発生時にアラートを発し即座に対応できるようにする(通知性)
3. 問題発生時の原因特定をしやすくする(特定性)
4. 統計データを取りシステム傾向を掴み対策をとりやすくする(分析性)

1と3は似たような要素なので一つにまとめられることもありますが、大体この四つが監視の役割として挙げられます。以下、この4つの役割について詳しく説明します。

1. 可視性

システムのアクセス率やサーバ負荷などといったリソース状況を誰でも見れるようにすることで、システム全体状況を把握できる人が増え、監視属人化を防ぐことができます。注意して欲しいのは「複雑な手順を踏まないとリソースが見れない/把握できない」ような監視システムは後にも説明しますが、アンチパターンとなります。

2. 通知性

アラートを発し、即座に対応することでサービス提供機会の損失を低くすることができます。ここでいうアラートとは電話をかけるだけがアラートではありません。障害の度合により適切な通知手段(電話、SMS、チャット)を取らないと、誰も通知を信用しない狼少年状態になることがあります。<!--ちなみにメールのみでのアラートは読まない可能性が高いので避けた方がいいです。-->

3. 特定性

原因特定にはそのソースが不可欠です。障害発生時に何が起きているか分かる情報を常日頃から取らないと、原因が分からないまま同じ障害を繰り返すことになります。

4. 分析性

障害対応だけが監視ではありません。過去のデータを基にシステム全体の傾向を掴み、それに対しスーケリングやロードバランシングといった対応を施すことが大切です。障害を起こさないための準備も監視の役割となります。さらにもっと広い意味で「そのビジネスがうまくいっているのか」といった分析も監視で担うと尚よい監視システムであるといえます。



### 1-3. 簡単な監視ハンズオン
Webサーバを建ててそのサーバを監視してみましょう。ハンズオンの流れは以下のSTEPになります。
1. dockerを使って簡単なWordPressサーバをローカルに建てる
2. vmstatでパフォーマンス監視を行う
3. curlを使って外部からサービス監視を行う

まず、公式のWordPressサーバ(コンテナ)をdocker hubからpullします。pull出来ているか心配な場合は適宜`docker image ls`で存在を確認してください。
```
# docker pull wordpress:php8.0-apache
```
次にコンテナを立ち上げます。ポートはlocalhostの8080をコンテナの80にフォワードさせていますが、すでに他のコンテナで使用中の場合は適宜空いているポートを割り当ててください。
```
# docker run -d --name prometheus_bootcamp -p 8080:80 wordpress:php8.0-apache 
```
最後に`docker ps`でwordpressが立ち上がって、Webページにアクセス出来ていればSTEP1は完了です。
```
# docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                  NAMES
3d7494717550   wordpress   "docker-entrypoint.s…"   47 minutes ago   Up 11 minutes   0.0.0.0:8080->80/tcp   prometheus_bootcamp
```
適当なブラウザでdockerを立ち上げたサーバ宛にアクセスできればOKです。

![wordpress](images/wordpress.png)

STEP2ではサーバパフォーマンスを目視で確認します。(これをパフォーマンス監視といいます)立ち上げたコンテナの中に入り`vmstat`コマンドを入力します。
```
# docer exec -it prometheus_bootcamp /bin/bash
container~# vmstat -tw 1
```
`-t`はタイムスタンプ表示、`-w`はワイド表示です。引数の数字は1秒おきに実行するという意味です。vmstatコマンドを叩くとサーバパフォーマンスのメトリクス情報が出てきます。
```
procs -----------------------memory---------------------- ---swap-- -----io---- -system-- --------cpu-------- -----timestamp-----
 r  b         swpd         free         buff        cache   si   so    bi    bo   in   cs  us  sy  id  wa  st                 UTC
 3  0            0      9249760       122220      3209688    0    0     0     0   41  237   0   0 100   0   0 2021-05-28 10:10:46
 0  0            0      9246812       122220      3209688    0    0     0     0   84  371   0   0 100   0   0 2021-05-28 10:10:47
 0  0            0      9246004       122220      3209688    0    0     0     0   34  227   0   0 100   0   0 2021-05-28 10:10:48
 0  0            0      9246116       122220      3209696    0    0     0     0   34  112   0   0 100   0   0 2021-05-28 10:10:49
 0  0            0      9246116       122220      3209696    0    0     0     0   33  241   0   0 100   0   0 2021-05-28 10:10:50
 0  0            0      9246116       122220      3209696    0    0     0     0   32  112   0   0 100   0   0 2021-05-28 10:10:51
```
`man`コマンドでも確認できますが、各数字の意味は以下になります。
- proc
  - r：ランタイム待ちのプロセス数
  - b：割り込み不可能なスリープ状態にあるプロセス数
- memory
  - swpd：仮想メモリの量
  - free：空きメモリの量
  - buff：バッファに用いられるメモリの量
  - cache：キャッシュに用いられるメモリの量
- swap
  - si：ディスクからスワップインされているメモリの量(/s)
  - so：ディスクからスワップアウトされているメモリの量(/s)
- io
  - bi：ブロックデバイスから受け取ったブロック(blocks/s)
  - bo：ブロックデバイスに送られたブロック(blocks/s)
- system
  - in：1秒あたりの割り込み回数。クロック割込みも含む
  - cs：1秒あたりのコンテキストスイッチの回数
- cpu
  - us：カーネルコード以外の実行に使用した時間
  - sy：カーネルコードの実行に使用した時間
  - id：アイドル時間
  - wa：IO待ち時間
- timestamp：タイムスタンプ

次に、実際に負荷をかけて変化の様子を見ていきます。今回はWebサーバのなので代表的な負荷であるHTTPリクエストの負荷をかけていこうと思います。端末をもう一つ開き、そこからHTTPリクエストを1万個投げます。(端末が一つしか開けない方は`screen`や`tmux`を駆使しください)
```
# seq 1 10000 | xargs -I % -P 20 curl "http://localhost:8080" -o /dev/null -s
```
リクエストを投げると`vmstat`の画面ではどこの負荷がかかっているかが確認できます。
```
負荷かける前
procs -----------------------memory---------------------- ---swap-- -----io---- -system-- --------cpu-------- -----timestamp-----
 r  b         swpd         free         buff        cache   si   so    bi    bo   in   cs  us  sy  id  wa  st                 JST
 0  0            0      9171992       127648      3322200    0    0     0     0   48  218   0   0 100   0   0 2021-05-28 13:30:57
 0  0            0      9171992       127648      3322200    0    0     0     0   30  100   0   0 100   0   0 2021-05-28 13:30:58
 0  0            0      9171992       127648      3322200    0    0     0     0   34  204   0   0 100   0   0 2021-05-28 13:30:59
 0  0            0      9171992       127648      3322200    0    0     0     4   41  128   0   0 100   0   0 2021-05-28 13:31:00
 0  0            0      9171992       127648      3322200    0    0     0     0   34  220   0   0 100   0   0 2021-05-28 13:31:01
```
```
負荷かけた後
procs -----------------------memory---------------------- ---swap-- -----io---- -system-- --------cpu-------- -----timestamp-----
r  b         swpd         free         buff        cache   si   so    bi    bo   in   cs  us  sy  id  wa  st                 JST
 9  0            0      9156508       127648      3322200    0    0     0     0 5351 29472  47  34  19   0   0 2021-05-28 13:31:04
 9  0            0      9157360       127656      3322392    0    0     0    12 5559 31376  48  36  15   0   0 2021-05-28 13:31:05
 2  0            0      9160176       127656      3322508    0    0     0     0 6056 31527  46  37  17   0   0 2021-05-28 13:31:06
 9  0            0      9154440       127656      3322628    0    0     0     0 5915 31500  46  38  15   0   0 2021-05-28 13:31:07
 7  0            0      9151888       127656      3322772    0    0     0     0 5906 31615  49  36  15   0   0 2021-05-28 13:31:08
 ```
 負荷がかかっているのは`procs`の`r`、`system`の`in`、`cs`、`cpu`の`us`と`sy`というのがここからわかります。これらから、
 - `procs`の`r`が異様に高いためプロセスの処理が追いついてない
   - CPUかメモリが原因？`b`に負荷がないからディスクは問題なさそう……。
 - `swap`の`si`か`so`が0だからメモリの量は間に合ってる
   - メモリ原因説はなさそう……。
 - `system`が異様に高く、オーバヘッドが多く生じてる
   - CPUに負荷がかかりすぎている。
 - `cpu`の`us`と`sy`が高く、アイドル時間も短くなってる
   - やはりCPUに負荷がかかっているのが原因か！

といった感じで、もしこのシステムが障害起こした時は「プロセス過多によるCPUへの高負荷が原因である！」と判断が出来るわけです。あとはここからどんなプロセスが具体的に多いかなどをログから漁っていることになると思います。<!--`yes > /tmp/yes.txt`ってやればディスクIOの負荷が見れるよ-->

最後のSTEPではサービスがちゃんと動いているかを確認します(これをサービス監視といいます)。「サービスがちゃんと動いている」とは何かについては、サービスごとに定義する必要がありますが、ここでは「WebページにアクセスしてHTTPステータスコード200が返ってくること」とします。まずは、端末をもう一つ開き、そこから`curl`コマンドを使ってHTTPステータスコードを取得します。(端末が一つしか開けない方は`screen`や`tmux`を駆使しください)
```
# while true; do date && curl -LI localhost:8080 -o /dev/null -w '%{http_code}\n' -s; sleep 1; done
もしくは
# watch -n 1 -d curl -LI localhost:8080 -o /dev/null -w '%{http_code}' -s
```
端末に「200」と表示されればOKです。この状態でWebサーバ内の情報を書き換えて、エラーを吐かせてみます。外部から監視している端末とは別の端末を使ってコンテナ内部の情報を書き換えます。
```
# docker exec -it prometheus_bootcamp mv /var/www/html/wp-admin /var/www/html/wp-admins
```
すると外部からサービス監視していた端末に「500」と表示されます。すごく地味な監視ではありますが、このようなデータを記録することでいつ、どこで、どれぐらいの頻度で、なんのエラーを吐いているかを「ユーザに一番近いところ」で監視することができるため、サービス全体の方針決めに大きなキッカケを作ることができます。
```
# docker exec -it prometheus_bootcamp mv /var/www/html/wp-admins /var/www/html/wp-admin
```
忘れずに戻しておきましょう。

今回目視で監視を行いましたが、これすべて人が張り付いて確認するのはもちろん、必要なデータを抜き出すのも大変な作業になります。次章ではこの監視を「Prometheus」というナウでヤングな監視ツールを使って楽に監視する方法を紹介します。

### 1-4. 監視のアンチパターン(読みたい人は読んでください)
監視はそれを実装するシステム時々で正解が異なります。すべてのパターンを紹介するのは現実的ではないため、監視における代表的なアンチパターンを4つほど紹介します。
1. ツール依存

一番陥りがちなアンチパターンです。監視デザインが素晴らしく、サービス自体も成功している会社/チームが使っているツールやその手順を形だけ真似て導入しても、いずれどこかでボロが出て監視に失敗します。目的化を避け、サービスに必要な監視事項を洗い出した上でツールを選定してください。有名な例で「昔、水や食料をとある島の集落に飛行機を使って運んでいたら、現地の住民が"滑走路を作れば飛行機が物資を運んでくる！"と勘違いし、滑走路に似たものをヤシの木などで作ったが、一向に飛行機はやってこなかった。」という物があります。形だけ真似ても失敗します。

2. 監視を役割にする

監視のエキスパートを一人持ってきて、その人に監視システムの責任を負わせるのはアンチパターンです。一見、「DBのエキスパート」や「アプリのエキスパート」のように役割として「監視のエキスパート」を誰か一人に任せることは効率がいいように見えますが、システム構成を理解していない人にサービスの監視をさせても「何が異常状態なのかわからない」「今すぐ対応すべきことと後で対応すべきことの判断がつかない」といった状態になり、必要なアラートを無視したり、アラート自体が狼少年状態になることもあります。監視に関するスキルをメンバー全員が持ち、属人化をしないようにしてください。

3. 監視ツールが複雑すぎる

色んな機能を盛りだくさんの監視ツールをそのまま使うのはアンチパターンです。大抵の場合、担当者以外が操作できなくなります。誰でも使えるツールというのは難しい課題ですが、少なくとも要らない機能は外すか見えないようにしましょう。

4. 手動監視

手動で手順書を手順通り実行し、確認して問題があればアラートを発するような監視は自動化できないか見直す方がいいです。例えば先ほどのハンズオンで行った内容をそのまま監視システムとして組み込み、「人力で確認して200OKじゃないときにアラートを投げる」というのを手動で行っているのなら、それはスクリプトに出来るのでするべきです。


### 1-5. まとめ
ここまで監視について基礎的なことを記載しました。監視の目的は「可視性」「即時性」「特定性」「分析性」の4つあり、これらを満たす柔軟なシステムを組む必要があります。(時としてそれは「1からオリジナルの監視ツールを作った方がいい」という場合をもある)

ここまで監視の考え方については記載しましたが、具体的な監視の手法については記載していません。例えば「得た監視データをどう分析するのか？」や「セキュリティ監視やネットワーク監視は何を意識すればいいのか？」など、については講義の最後に参考文献を挙げるので興味のある方は読んでみるといいかもしれません。ただ、本によって書いてあることが違う場合があるので、いくつかの情報を横断的に入手して分析することをオススメします。


## 2. Prometheusを触ってみよう
### 2-1. Prometheusとは
Prometheusについて説明する前に、色んな監視ツールについて簡単に簡単に紹介します。

世の中にはPrometheus、Zabbix、Datadogというように多くの監視ツールがありますが、それらは「Push型」と「Pull型」の2つに大きく分類することが出来ます。
- Push型監視サーバ
  - 特徴
    - 監視対象のサーバからエージェントなどを使い、監視サーバへ監視情報を送る
  - メリット
    - 監視対象サーバが増えてもそこにエージェントを入れるだけで監視対象を増やすことが出来る
  - デメリット
    - 監視対象ではないサーバからの監視情報も受け取ってしまう
  - 例
    - Datadog、Machinist
- Pull型監視サーバ
  - 特徴
    - 監視サーバが監視対象へ監視情報を取りにいく
  - メリット
    - 監視サーバ側の設定で指定したサーバからの監視情報のみを受け取る
  - デメリット
    - ノードが増えた時にエージェントなどを入れたうえで、さらに監視サーバの設定ファイルを変更する必要がある
  - 例
    - Prometheus、Zabbix、Nagios

どちらもメリットデメリットがあり、要件にあわせて選ぶ必要があります。

ここからはPrometheusの説明になります。Prometheusはsoundcloud社が作ったPull型の監視ツールです。CNCF管理下のOSS監視ツールとなっていて、ランクはGraduatedでかなり成熟したOSSとなります。Prometheusの特徴の一つとして「Pull型監視ツールの欠点である"サーバを追加する度に監視サーバの設定を変更する必要がある"というのを"サービスディスカバリ"という機能で補っている」というものがあります。

近年、クラウド化が進みAWSやGCP、Azureなどで自由にサーバを建てたり壊したりすることができたり、Kubernetesのようにコンテナの破壊と創造を頻繁に繰り返すようなツールが普及したことで、監視対象が頻繁に切り替わることが多くあります。そんななかで、それらのサーバをサービスディスカバリで楽に監視することが出来るのが「Prometheus」であり、そういった背景でいま話題に上がっています。

サービスディスカバリとは一言でいうと「ある特徴の属性を持つサーバを自動で調べてくれる」機能で、たとえばAWSでは起動しているEC2を一覧化するAPIがあり、サービスディスカバリはそれを使ってホスト情報を取得し、自動で監視対象に追加することができます。

### 2-2. Prometheusで出来ること/出来ないこと
- 出来ること
  - 監視対象のサーバから監視情報の取得
  - 取得した監視情報の保管
  - 監視情報を元にしたアラート(Alertmanagerが必要)
- 出来ないこと
  - 冗長構成(TSDBが冗長性を考慮していない設計なので、外部DBに保存するといった手段を取る必要が出てくる)
  - 複雑なダッシュボードを見やすく表示(これを解決するためにGrafanaが使われることが多い)
  - データの長期保存(長期保存を前提として設計されていないので、別途保存用のサーバが必要)
- 出来なさそうで出来ること
  - Push型の監視(「Pushgateway」というサーバを立ててそこから監視情報をpullする形で実装できる)
  - ログ情報を収集してそこからメトリクスを取得(fluentdやtmailの実装が必要)

### 2-3. Prometheusの実装
Prometheusのアーキテクチャは以下の図を見ると分かりやすいです。
![architecture](./images/architecture.png)
登場人物を順に説明します。
- Prometheus Server
  - Retrieval
  - TSDB
  - HTTPserver

Prometheus Serverは読んで字のごとく、監視ツールPrometheusを実行するサーバです。内部はRetrivalとTSDBとHTTPserverで構成されており、Retrivalは「サービスディスカバリで監視対象のサーバを探し出し、exporterから監視情報を取得する」、TSDB(Time Series DataBase)は「取得した情報を時系列データとしてDBに保存する」、HTTPserverは「DBにあるデータをWebUI上に表示させる」という役割を持っています。(余談ですがTSDBはRDBMSと違って時系列情報のI/Oが早い傾向にあります)

![Prometheus_server](./images/prometheus_server.png)

- Prometheus Targets
  - exporter
  - Pushgateway

Prometheus Tartgetsは監視情報を取得したい対象のサーバです。Pull型はこの対象にあるエージェントから監視情報を取得しますが、そのエージェントをexporterといいます。上でも若干ふれましたが、どうしてもPushしたい場合はPushgatawayをインストールしたサーバへcurlコマンドなりで監視情報をPushすることで、Prometheus Serverはそこから監視情報をPullします。

![Promethesu_targets](./images/prometheus_targets.png)

- Alertmanager

AlertmanagerはPrometheus ServerからPushされたAlertを各ツール(slack,mailなど)へ通知することが出来ます。(メールサーバなど外部ツールとの連携を必要とするため、今回はこの箇所のハンズオンは飛ばしています。)

![Alertmanager](./images/alertmanaer.png)

- Data visualization and export
  - PromtheusWebUI
  - Grafana

PrometheusWebUIならびにGrafanaはPrometheusに格納されたデータをPromQLというPrometheus独自のクエリ言語で取得してWebUIに表示させます。

![data_visualization_and_export](./images/data_visualization.png)

### 2-3. Prometheusハンズオン
ハンズオンは以下の流れで勧めます。
1. PrometheusサーバとWebサーバを建て、node exporterを使ってパフォーマンス監視を行う
2. サービス監視を行うexporterを作ってサービス監視を行う
3. サービスディスカバリ機能を使って監視対象のサーバを追加する

始める前に、ハンズオンで使ったコンテナを`docker stop`で止めておいてください。また、`docker ps`で余計なコンテナがないかを確認してください。(理由があって何かしらのコンテナを立てている場合はポートが被らないように適宜読み替えてください)

構成は以下になります。`docker-compose.yml`という名前でymlファイルを作り以下を書き込んでください。
```
version: '3'
services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
    command: "--config.file=/etc/prometheus/prometheus.yml"
    ports:
      - 9090:9090
    restart: always

  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - 3000:3000
    restart: always

  wordpress_1:
    image: wordpress:php8.0-apache
    container_name: wordpress_1
    ports:
      - 8080:80
      - 9100:9100
    volumes:
      - ./node_exporter-1.1.2.linux-amd64.tar.gz:/root/node_exporter-1.1.2.linux-amd64.tar.gz
      - wordpress:/var/www/html
    working_dir: /root
    command: >
      bash -c "service apache2 start &&
      tar xvfz node_exporter-1.1.2.linux-amd64.tar.gz &&
      cd node_exporter-1.1.2.linux-amd64 &&
      ./node_exporter"
    restart: always

volumes:
  wordpress:
```
構成をネットワーク図にすると以下です。(ポートは順に対応してます)

![default](./images/handson_default.png)

次にPrometheusの設定ファイルを作ります。`docker-compose.yml`と同じディレクトリ内にファイルを格納するディレクトリを作り、中に設定ファイルを入れます。
```
# mkdir prometheus
# cd prometheus
# vim prometheus.yml
```
設定ファイルは以下の内容になります。
```
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    scrape_interval: 5s
    static_configs:
      - targets:
        - 'wordpress_1:9100'
```
次に監視対象のサーバに入れるエージェント(exporter)を入れます。まずはパフォーマンス監視を行いたいので、公式が出しているexporter「Node exporter」を`docker-compose.yml`が入っているディレクトリを同じ階層に用意します。
```
# wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz
```
これで一通りの準備は完了しました。`docker-compose up -d`で`docker-compose.yml`を実行してコンテナを立ち上げてください。(うまく立ち上がらない方は`docker ps`や`docker logs`を使って確認してください)

コンテナの立ち上げが完了したら、ブラウザから`http://<dockerホストのIP:8080>`でwordpressのサイトが表示させることを確認してください。(DBに接続していないので先に進めないのは仕様です)

![wordpress](./images/wordpress.png)

次にnode exporterの起動確認をします。prometheusはnode exporterに対してhttpでメトリクスを取りに行きますが、ブラウザからも`http://<dockerホストのIP:9100>`から`Metrics`にアクセスすることでPromQL形式のメトリクスを見ることができます。

![node_exporter](./images/node_exporter.png)

次にPrometheusでメトリクスを持ってこれていることを確認します。Prometheusサーバにブラウザから`http://<dockerホストのIP:9090>`に入り、`Status`から`Target`を選択し、wordpressのサーバがあればOKです。

![status](./images/status_node.png)

ホーム画面からは好きなメトリックスを表示することが出来ます。試しに`node_memory_Active_bytes`を選択すれば、メモリの使用量が表示されます。

![mem_metrics](./images/mem_metrics.png)

このグラフ上では単純な計算も行えます。例えば先ほどメモリ使用量を出しましたが、メモリ使用率を出したい場合は総メモリで割れば出せます。そのため、`node_memory_MemTotal_bytes`で割る形で表示すればメモリ使用率が表示されます。

![mem_per](./images/mem_per.png)

最後にこれらの値をPromQL形式でGrafanaに送り、ナウでヤングな可視化を行います。`http://localhost:3000`にアクセスします。ID/PASSはadmin/adminです。

![grafana](./images/grafana.png)

次にPrometheusサーバの場所を設定し、Grafanaにデータを読み込ませます。`Configuration`(左の歯車マーク)から`data source`を選択し、`add data sorce`からPrometheusを選択。

![datasource](./images/datasource.png)

URLにPrometheusサーバである`http://prometheus:9090`を入力し、Accessを`Server(default)`にます。AccessはPrometheusへの接続元を選択します。ここではGrafanaサーバである`Server(default)`を選択していますが、セキュリティの都合で各端末のブラウザからしかPrometheusにアクセスできないような状況では、Accessを`Browser`にブラウザから見たPrometheusサーバを選択してください。docker network上でGrafanaサーバからPrometheusサーバは「http://prometheus:9090」でアクセスできるため、今回は表記になっています。最後に一番下の`save & test`でエラーが出なければOKです。

![access](./images/access.svg)

次にダッシュボードを作っていきます。`Create`タブから`NewDashboard`を選択、`Add Panel`から知りたいメトリックスを選択します。とりあえずロードアベレージ(実行待ちタスクの平均)を1分間、5分間、15分間ので表示させます。`Metrics`から`node_load1`を選択。`+Query`をでクエリを追加し`node_load5`を選択。同様に`+ Query`でクエリを追加し`node_load15`を選択。右側の`Panel`から`Panel title`を編集し、最後に右上のApplyを押すことで、パネルに追加できます。

![load_average](./images/load_ave.png)

これの繰り返しで自分だけのダッシュボードを作り上げていく形になります。

最後に、Grafanaの公式では、有志の手によってダッシュボードのテンプレートがいくつか用意されているので、今度はお手軽にいい感じのダッシュボードを作ります。まず[Grafana lab](https://grafana.com/grafana/dashboards)にアクセスして、[Node Exporter Quickstart and Dashboard](https://grafana.com/grafana/dashboards/13978?pg=dashboards&plcmt=featured-sub1)を選びます。ここにあるDashboardIDまたは生JSONファイルをメモし、Grafanaにインポートすることで、有志の作ったダッシュボードと同じ形式のダッシュボードを手元で開くことが出来ます。

![template](./images/node-exporter_temp.png)

次のSTEPではHTTPでのアクセスを監視する、サービス監視を行います。パフォーマンス監視では監視対象のサーバにexporterを導入して、Prometheusサーバからメトリクスをpullしていましたが、ICMPやHTTPを使った監視はその手段が使えません。そのため、システム内部から監視を行うのではなく、外部から監視を行う「外形監視」という手段で監視します。

外形監視には「blackbox exporter」というexporterを使います。まずblackbox_exporterのコンフィグファイル`blackbox.yml`を作ります。`docker-compose.yml`があるディレクトリ配下で`blackbox.yml`を格納するディレクトリを作成します。
```
# mkdir blackbox_exporter
# cd blackbox_exporter
# vim blackbox.yml
```
設定ファイルは以下の内容にします。ここでは監視先のターゲットを指定しません。Prometheusのサービスディスカバリを使うため、ターゲットはPrometheus側で設定するためです。(ICMPなどの他監視方法も知りたい人は[公式サイト](https://github.com/prometheus/blackbox_exporter)を参照)。
```
modules:
  http_2xx:
    prober: http
    timeout: 20s
    http:
      valid_status_codes: []
      method: GET
      preferred_ip_protocol: "ip4"
```
次にblackbox_exporterのdocker imageを`docker-compose.yml`に追加します。ボリュームのマウントには先ほど追加したコンフィグファイルを指定します。
```
version: '3'
services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
      - /var/run/docker.sock:/var/run/docker.sock
    command: "--config.file=/etc/prometheus/prometheus.yml"
    ports:
      - 9090:9090
    restart: always

  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - 3000:3000
    restart: always

  wordpress_1:
    image: wordpress:php8.0-apache
    container_name: wordpress_1
    ports:
      - 8080:80
      - 9100:9100
    volumes:
      - ./node_exporter-1.1.2.linux-amd64.tar.gz:/root/node_exporter-1.1.2.linux-amd64.tar.gz
      - wordpress:/var/www/html
    working_dir: /root
    command: >
      bash -c "service apache2 start &&
      tar xvfz node_exporter-1.1.2.linux-amd64.tar.gz &&
      cd node_exporter-1.1.2.linux-amd64 &&
      ./node_exporter"
    restart: always

  blackbox_exporter:
    image: prom/blackbox-exporter
    container_name: blackbox_exporter
    ports:
      - 9115:9115
    volumes:
      - ./blackbox_exporter/blackbox.yml:/etc/blackbox_exporter/config.yml

volumes:
  wordpress:
```
最後にPrometheusのコンフィグファイル`prometheus.yml`に監視対象を追加します。
```
global:
  scrape_interval: 15s 

scrape_configs:
  - job_name: 'node'
    scrape_interval: 5s
    static_configs:
      - targets:
        - 'wordpress_1:9100'

  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets:
         - 'localhost:9090'

  - job_name: 'blackbox'
    scrape_interval: 30s
    scrape_timeout: 20s
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - http://wordpress_1
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox_exporter:9115
```
`relabel_configs`の箇所ではblackbox_exporter自身のラベルを監視対象のラベルに置き換えてます。これをしないとPrometheusに収集されるデータがwordpressに関するものではなく、blackbox_exporterのものだと判断されてしまいます。

これで準備は完了です。`docker-compose up -d`でblackbox_exporterを起動させたのち、`docker-compose restart prometheus`でprometheusのコンフィグファイルを再読み込みしてください。`localhost:9090`でPrometheusサーバにアクセスし、StatusからTartgetを表示し、blackboxが存在すれば成功です。

![blackbox_exporter](./images/blackbox_exporter.png)

本当にPrometheusが取得できているかグラフを表示させてみましょう。まずPrometheusホーム画面の`Expression`に`probe_success`と入力し、`Excute`を押してください。

![probe_success_table](./images/probe_success_table.png)

タブをTableからGraphにし、値が`1`になっていれば成功です。`0`は取得に失敗しています。

![probe_success](./images/probe_success.png)

他にも`probe_http_status_code`を使えばそのサイトのHTTPステータスを確認出来たりできます。

![probe_status](./images/probe_status.png)

最後にGrafanaでHTTPステータスコードを表示して終わりにします。Grafanaを`localhost:3000`で開き、追加したいダッシュボードを選択します。
次に`Add Panel`からパネル追加画面を開き、`Metrics`に`probe_http_status_code`と入力します。

![grafana_status_graph](./images/grafana_status_graph.png)

このままだとステータスコードの数字をグラフにしてるだけで味気ないので、`Instant`をONにし、右のカラムの`Visualization`を`Stat`に変更します。

![grafana_status](./images/grafana_status.png)

最後にステータスコードごとに色を変えます。右のカラムのタブを`Field`にし、`Thresholds`を開きます。

![thresholds](./images/thresholds.png)

既存の設定は削除し、`300`を黄色、`400`を赤とします。このように設定することでこの値を閾値として、HTTPステータスコードが値を超えると値の色が変ります。下の画像では「200以上300未満は青」「300以上400未満は黄色」「400以上は赤」「それ以外は赤」となるように設定しています。

![http_status](./images/http_status.png)

試しにwordpressの中身を書き換えてみましょう。
```
# docker exec -it wordpress_1 mv /var/www/html/wp-admin /var/www/html/wp-admins
```
を実行すればWebサーバの中身が書き換えられ、HTTPステータスコードが500になり、赤くなるはずです。

![http_status](./images/http_status_error.png)

最後に`Apply`することで簡単な監視ダッシュボードが完成しました。

![all](./images/grafana_all.png)

### 2-4. まとめ
Prometheusは非常に柔軟性の高い有力なツールです。実は今回の講義では有力な機能の一つであるサービスディスカバリの恩恵を最大限体験することが出来ていません。ほかにも閾値を超えたらアラートを投げるAlertmanagerなど、重要な機能がまだまだたくさんありますが、dockerにて用意する環境に限界があるため、今回は省略しました。興味のある方は[公式サイト](https://prometheus.io/)などからGetting Startedなどを見てみるといいかもしれません。

## 3. 最後に
本講義では「監視そのものの概念説明」から「実際に監視システムを構築する」ところまでを簡単に紹介しました。今回Prometheusをハンズオンにて使用しましたが、Prometheusは決して銀の弾丸にはなりえないということに注意してください。先に紹介をしましたがこれは代表的なアンチパターンです。監視という概念について詳しく知りたい方はオーライリーの「入門 監視」を読んでみるといいと思います。Prometheusについてもっと詳しく知りたい方はまだまだ日本語のドキュメントが充実していないため、手探りにはなりますが公式サイトを漁ってみたり、「Prometheus Meetup(JP)」などに参加して導入事例を聞いてみるといいと思います。