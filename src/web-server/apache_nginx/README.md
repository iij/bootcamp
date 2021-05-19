---
footer: CC BY-SA Licensed | Copyright, Internet Initiative Japan Inc.
---

# Apache + Nginx を触ってみよう

## 事前準備

以下のように`docker pull`をしたあと、ハンズオン用のコンテナを立ち上げてログインしてください。

```shell-session
$ docker pull python:3.8.2-buster
3.8.2-buster: Pulling from library/python
90fe46dd8199: Pull complete
35a4f1977689: Pull complete
bbc37f14aded: Pull complete
74e27dc593d4: Pull complete
4352dcff7819: Pull complete
deb569b08de6: Pull complete
98fd06fa8c53: Pull complete
7b9cc4fdefe6: Pull complete
512732f32795: Pull complete
Digest: sha256:003990f08716aef3eb0772f9d9fa8e27603f2b863c56c649a3e9693ddb5b41f1
Status: Downloaded newer image for python:3.8.2-buster
docker.io/library/python:3.8.2-buster
$ docker run --rm -itd --name test-debian -p 8080:80 -p 8081:81 -p 8088:88 -p 8089:89 python:3.8.2-buster /bin/bash
b8c0df20d1540aba0342362d88d1b0cb9ec94a1877ae1ca5aea5583880193a8e
$ docker exec -it test-debian /bin/bash
root@b8c0df20d154:/#
```

Apacheとnginxをインストールします。

```shell-session
root@b8c0df20d154:/# apt update
Get:1 http://security.debian.org/debian-security buster/updates InRelease [65.4 kB] 
Get:2 http://deb.debian.org/debian buster InRelease [121 kB]                        
Get:3 http://deb.debian.org/debian buster-updates InRelease [51.9 kB]
Get:4 http://security.debian.org/debian-security buster/updates/main amd64 Packages [289 kB]
Get:5 http://deb.debian.org/debian buster/main amd64 Packages [7907 kB]
Get:6 http://deb.debian.org/debian buster-updates/main amd64 Packages [10.9 kB]
Fetched 8445 kB in 18s (471 kB/s)
Reading package lists... Done
Building dependency tree       
Reading state information... Done
103 packages can be upgraded. Run 'apt list --upgradable' to see them.

root@b8c0df20d154:/# apt install -y apache2 apache2-dev nginx vim
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  apache2-bin apache2-data apache2-utils autopoint bsdmainutils debhelper dh-autoreconf dh-strip-nondeterminism dwz geoip-database gettext gettext-base
  groff-base intltool-debian libapr1-dev libaprutil1-dbd-sqlite3 libaprutil1-dev libaprutil1-ldap libarchive-cpio-perl libarchive-zip-perl libbrotli1
  libfile-stripnondeterminism-perl libgd3 libgeoip1 libgpm2 libjansson4 libldap-2.4-2 libldap2-dev liblua5.2-0 

~~~略~~~

Setting up dh-strip-nondeterminism (1.1.2-1) ...
Setting up apache2-dev (2.4.38-3+deb10u4) ...
Processing triggers for mime-support (3.62) ...
Processing triggers for hicolor-icon-theme (0.17-2) ...
Processing triggers for libc-bin (2.28-10) ...
root@b8c0df20d154:/#
```

以下のコマンドでバージョンが表示されれば成功です。

```shell-session
root@b8c0df20d154:/# apache2 -v
Server version: Apache/2.4.38 (Debian)
Server built:   2020-08-25T20:08:29

root@b8c0df20d154:/# nginx -v
nginx version: nginx/1.14.2
```

## Webサーバー

いわゆる「Webサーバー」とは、HTTP(Hypertext Transfer Protocol)でリクエストを受け、HTTPでレスポンスを返すソフトウェアの通称です。
僕らがブラウザなどにURLを入力したりリンクをクリックした時、Webページが表示されるのはWebサーバーが要求したURLに対するレスポンスを返しているからです。またスマホアプリの裏で行われるサーバーとのやりとりには多くの場合HTTPが使われており、ここでもWebサーバーがゲームのデータなどをレスポンスとして返しています。

Webサーバのシンプルな機能は前述の通りですが、実際にはユースケースに合わせてさまざまな役割を持ちます。

- HTMLやテキストファイルの配信
- 動的アプリケーションのホスティング
  - JavaやPythonやPHPなど、プログラムで生成されたレスポンスを返す
- HTTP通信を別のサーバーに中継するプロキシ
- Basic認証などによる認証処理
- ACL(Access Control List)によるアクセス制御・不正な通信への防御

簡単なWebサーバーであればどのプログラミング言語でも比較的簡単に作ることができます。
しかし実用上はさまざまな機能をもち、セキュリティやパフォーマンスについても長年改善されてきた専用のソフトウェアが必要になり、それがいわゆる「Webサーバーソフトウェア」と呼ばれるツールです。

有名どころを挙げてみると

- Apache HTTP Server
- IIS
- lighttpd
- nginx

あたりでしょうか。Linuxサーバー上で動かすのであればほぼApacheとnginxの2択になると思います。

また最近ではenvoyやtraefikなど、クラウドやKubernetesという文脈ではプロキシ機能に特化したソフトウェアが使われることも多くなりました。

## Apache と Nginx

### Apache HTTP Server

「Apache HTTP Server」はnginxと並んで2台勢力を誇っているWebサーバソフトウェアのひとつです。 CentOSではhttpdという名前になっていたり、単にApacheと呼ばれます。

「Apache HTTP Server」は「Apacheソフトウェア財団」によって管理されるOSSで、20年以上の歴史を持ちます。 世界的にもっとも普及したWebサーバで、LAMP（Linux, Apache, MySQL, PHP）環境のひとつにも挙げられ、nginxと並んで2大勢力を誇ります。
(参考: [April 2021 Web Server Survey](https://news.netcraft.com/archives/2021/04/30/april-2021-web-server-survey.html))

正式名称は「Apache HTTP Server」ですが、歴史的経緯などからCentOSではhttpdという名前になっていたり、単にApacheと呼ばれたりします。

以前は大量のリクエストを受けた際にプロセスをforkできず、リクエストを捌き切れなくなる（いわゆるC10K問題）ことが問題視されました。 その際nginxをはじめとして新しいWebサーバーソフトウェアが登場しましたが、Apache自体もworkerやevent MPMといった新しい仕組みを導入し、動作も安定していることからいまだに高いシェアを占めています。

### nginx

nginxは2004年頃、当時のWebサーバーが抱えていたパフォーマンス問題(C10K問題)の解決を背景に開発が進められました。
当時からApache 2.2は高機能で信頼性が高く、ある種成熟したソフトウェアでしたが、それに対してnginxは軽量さと高パフォーマンスに焦点をあてて開発されており、Apacheのカバーしきれないユースケースに対して力を発揮しました。

特に後段のサーバーにリクエストを流すリバースプロキシ・ロードバランサ機能がとても使いやすく、どちらかというと軽量なリクエストを大量に捌くのに向いています。

## Apache ハンズオン

### HTMLファイルの配信(check1)

まずはApacheを起動しましょう。

```shell-session
$ service apache2 start
```

ブラウザを開いて[localhost:8080](http://localhost:8080)にアクセスしてみてください。以下のような画面が表示されれば成功です。

![apache-start](./image/apache-start.png)

表示されたページはデフォルトのHTMLファイルです。これを自分で作成したページに置き換えてみましょう。 デフォルトではDocument Rootは/var/www/html/に設定されています。

::: tip
Document RootはApacheが静的ファイルを配信するためのroot directoryです。
:::

この下にある`index.html`ファイルを自分の物に置き換えてみましょう。

```shell-session
$ cd /var/www/html/
$ mv index.html _index.html
$ echo 'Hello Bootcamp!!' > index.html
```

再び`http://localhost:8080/`を開くと`Hello Bootcamp!!`が表示されるのを確認してください。

::: tip
`http://localhost:8080/` のようにファイル名を指定せずディレクトリ（この場合はルートディレクトリ）を指定した場合、Apacheは`index.html`を返すようにデフォルトで設定されています。
この設定は変更できます。
:::

Document Root配下にディレクトリを作成するとブラウザからも同様にアクセスできます。

```shell-session
$ mkdir /var/www/html/hoge
$ echo 'Hello HUGA!!' > /var/www/html/hoge/huga.txt
```

`http://localhost:8080/hoge/huga.txt` にアクセスすると追加したファイルが表示されます。

### VirtualHost の設定(check2)

1つのApacheで複数のWebサイトを管理したいことがあります。異なるIPアドレスやアドレス、port番号からアクセスされた時にDocument Rootなどを切り替えたいときは`VirtualHost`を設定することで実現できます。

ここではport番号を`80`と`81`に分けて別々のWebサイトを設定してみます。
(docker起動時にport forwardしているため、手元からは`8080`と`8081`からアクセスできます。)

まずは新しくDocument RootになるディレクトリとHTMLファイルを作成します。

```sh
mkdir /var/www/html/site-80
mkdir /var/www/html/site-81
echo 'This is site 80!' > /var/www/html/site-80/index.html
echo 'This is site 81!' > /var/www/html/site-81/index.html
```

次にApacheの設定をして行きます。やることは

- listen portに81を追加
- virtual host設定の追加

の2つです。listen portの追加は`/etc/apache2/ports.conf`に書きましょう。
以下のように`Listen 80` の下に `Listen 81`の記述を追加します。

```apache
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

Listen 80
Listen 81

<IfModule ssl_module>
        Listen 443
</IfModule>

<IfModule mod_gnutls.c>
        Listen 443
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```

VitrualHostの設定は`/etc/apache2/sites-available`の下に作成して行きます。

`/etc/apache2/sites-available/site-80.conf`

```xml
<VirtualHost *:80>
  DocumentRoot /var/www/html/site-80
</VirtualHost>
```

`/etc/apache2/sites-available/site-81.conf`

```xml
<VirtualHost *:81>
  DocumentRoot /var/www/html/site-81
</VirtualHost>
```

設定ファイルを作成したら`a2dissite`、`a2ensite`コマンドを使って設定を有効化しましょう。

```sh
a2dissite 000-default
a2ensite site-80
a2ensite site-81
```

:::tip
`a2dissite`や`a2ensite`といったコマンドは実はapache本体の機能ではありません。`a2ensite`は`/etc/apache2/sites-available`以下のファイルのsimlinkを`/etc/apache2/sites-enable`以下に追加するだけのコマンドです。
実際のApacheは`/etc/apache2/sites-enable`以下のコンフィグファイルをloadしているため、コマンドによってサイトが有効化されたように見えるのです。

CentOSなど他のディストリビューションでは、これらのコマンドが存在しないことが多いので注意してください。
:::

そしてApacheをリスタートします。

```sh
service apache2 reload
```

`localhost:8080`と`localhost:8081`にアクセスしてみてください。意図通りの挙動になっているでしょうか。

| ![site-80](./image/site-80.png) |
| ------------------------------- |

| ![site-81](./image/site-81.png) |
| ------------------------------- |

## nginx ハンズオン

### HTMLファイルの配信(check3)

次はnginxを使って同じことをしてみましょう。

80 portはすでにApacheが使っているため、nginxのサイトは88 portでリクエストを受け付けるようにします。

```bash
vim /etc/nginx/sites-enabled/default
```

```nginx
server {
        listen 88 default_server;      # 80 => 88 に変更
        listen [::]:88 default_server; # 80 => 88 に変更

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

変更したらnginxを起動しましょう。

```shell-session
root@6adf6c41f5d8:/# service nginx start
[ ok ] Starting nginx: nginx.
```

[localhost:8088](http://localhost:8088) にアクセスしてみてください。さっき作った`Hello Bootcamp!!`のHTMLが見えていれば成功です。

![nginx_html](./image/nginx_html.png)

### ロードバランス(check4)

nginxのプロキシ・ロードバランス機能を使ってみましょう。以下のような構成を作ってみます。

![nginx_proxy](./image/nginx-proxy.drawio.png)

`localhost:8089`にアクセスすると、先ほどApacheで作ったsite-80とsite-89のどちらかにランダムでリクエストをプロキシするようにします。

そのための設定を`/etc/nginx/sites-enabled/proxy`に書いていきます。

```nginx
upstream backend {
        server localhost:80 weight=1;
        server localhost:81 weight=1;
}

server {
        listen 89 default_server;
        listen [::]:89 default_server;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                proxy_pass http://backend;
        }
}
```

`/etc/nginx/sites-enabled/proxy`を作成したらnginxをリスタートしましょう。

```shell-session
root@dea1ac0e1edb:/var/www/html# service nginx restart
[ ok ] Restarting nginx: nginx.
```

[http://localhost:8089/](http://localhost:8089/) にアクセスしてみてください。
site-80とsite-81がランダムで表示されたでしょうか。

## 追加課題（時間の余った人用）

### Basic認証を追加してみよう

- ApacheとnginxそれぞれにBasic認証を導入し、アクセスした時にユーザー名とパスワードの入力を求められるようにしてください。
- ブラウザで動作確認ができたら、次は`curl`コマンドでアクセスしてBasic認証がどのように動作するか確認してください。

