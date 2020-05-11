---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Apache webサーバーの紹介と、自力ビルドに挑戦します。
time: 1h
prior_knowledge: 特になし
---

<header-table/>

# Web Server: Apache 編

このハンズオンの狙い

- Docker に慣れる
- Apache を自力でビルドしてみる
- Apache の設定ファイルを眺めてみる
- Apache の動作確認とパフォーマンス測定をする

## 事前準備

- Docker を使用できる

### 事前準備手順

1. ubuntu イメージを使えるようにする

    ```Shell
    docker pull ubuntu
    docker images

    REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
    ubuntu                         latest              4c108a37151f        4 weeks ago         64.2MB
    ```

## 資料

### Apache を自力でビルドしてみよう

- [インストールドキュメント](http://httpd.apache.org/docs/2.4/install.html)

このドキュメントとメッセージを読みながら進めてみます。

ubuntu 使用を前提にしていますが、CentOS や FreeBSD など、他のメジャーな OS ならそれほどはまらないはずです。
ただし、他の OS を使う場合は、その OS のパッケージシステム (yum, pkg など) にある程度慣れている必要があるかもしれません。
必要そうなパッケージ名はググれば見つけられます。

1. インストールのプランを立てる
    - 通常どおりインストールすると /usr/bin や /usr/local/bin, /usr/local/apache2 などに配置される
    - 今回は別の場所に入れてみましょう

        ```Text
        /opt/{bin,lib,share...}  自分でビルドした必要なプログラム
        /opt/apache2             自分でビルドした Apache
        ```

    - 素の ubuntu イメージで作業して、インストールしたパッケージなどはあとで Dockerfile などにまとめます
    - インストール先の /opt は、ホスト側ディレクトリに残るようにします

1. Docker コンテナを立ち上げる
    - docker run -it --rm --name apache-test -v ~/opt:/opt ubuntu /bin/bash
        - Windows 環境では winpty docker run -it 〜

    ```Shell
    docker run -it --rm --name apache-test -v ~/opt:/opt ubuntu /bin/bash
    root@efa7173e38f5:/# cd
    root@efa7173e38f5:~#
    ```

1. Apache httpd をダウンロードして展開
    - ダウンロードサイトは自社のを使うことにします
    - [ftp.iij.ad.jp apache httpd](http://ftp.iij.ad.jp/pub/network/apache/httpd/)
    - httpd-2.4.39.tar.bz2 または httpd-2.4.39.tar.gz をダウンロードする
        - tar コマンドでエラーが出る場合は、bzip2 コマンドなどをインストールして解凍しましょう (bzip2 -d httpd-2.4.39.tar.bz2)

    ```Shell
    root@efa7173e38f5:~# wget http://ftp.iij.ad.jp/pub/network/apache/httpd/httpd-2.4.39.tar.bz2
    bash: wget: command not found
    root@efa7173e38f5:~# curl
    bash: curl: command not found
    root@efa7173e38f5:~# apt update
    ... (省略) ...
    root@efa7173e38f5:~# apt install wget
    ... (省略) ...
    root@efa7173e38f5:~# wget http://ftp.iij.ad.jp/pub/network/apache/httpd/httpd-2.4.39.tar.bz2
    ... (省略) ...
    root@efa7173e38f5:~# tar xvf httpd-2.4.39.tar.bz2
    root@efa7173e38f5:~# cd httpd-2.4.39
    root@efa7173e38f5:~/httpd-2.4.39#
    ```

1. configure
    - ./configure --help を一度読んでみるといいと思います
    - インストールプランに従って、prefix を設定してみます

    ```Shell
    root@efa7173e38f5:~/httpd-2.4.39# ./configure --prefix=/opt/apache2
    ...
    checking for APR... no
    configure: error: APR not found.  Please read the documentation.
    ```

1. APR をダウンロードしてインストール
    - [ftp.iij.ad.jp apr](http://ftp.iij.ad.jp/pub/network/apache/apr/)
    - apr-1.7.0.tar.bz2 をダウンロードする

    ```Shell
    root@efa7173e38f5:~/httpd-2.4.39# cd ..
    root@efa7173e38f5:~# wget http://ftp.iij.ad.jp/pub/network/apache/apr/apr-1.7.0.tar.bz2
    root@efa7173e38f5:~# tar xvf apr-1.7.0.tar.bz2
    root@efa7173e38f5:~# cd apr-1.7.0
    root@efa7173e38f5:~/apr-1.7.0# ./configure --prefix=/opt
    ...
    configure: error: in `/root/apr-1.7.0':
    configure: error: no acceptable C compiler found in $PATH
    See `config.log' for more details
    ```

1. コンパイラなど、ビルドに必要なプログラムをインストール
    - ubuntu のパッケージを調べたところ、build-essential というパッケージで必要な一式が入るもよう
        - CentOS や FreeBSD ではパッケージ名が違います
        - gcc などの C コンパイラと周辺ツールをインストールしてください

    ```Shell
    apt install build-essential
    ```

1. 再び configure
    - ビルドに使うコマンドがインストールできたら、PATH を通します

    ```Shell
    root@efa7173e38f5:~/apr-1.7.0# ./configure --prefix=/opt
    ...
    root@efa7173e38f5:~/apr-1.7.0# make
    ...
    root@efa7173e38f5:~/apr-1.7.0# make install
    ...
    root@efa7173e38f5:~/apr-1.7.0# ls -l /opt/bin
    total 8
    -rwxr-xr-x 1 root root 6945 Jul 18 15:37 apr-1-config
    root@efa7173e38f5:~/apr-1.7.0# export PATH=/opt/bin:$PATH
    ```

1. httpd ディレクトリに戻って、再び configure

    ```Shell
    root@efa7173e38f5:~/httpd-2.4.39# ./configure --prefix=/opt/apache2
    ...
    checking for APR-util... no
    configure: error: APR-util not found.  Please read the documentation.
    ```

1. APR-util をダウンロードしてインストール
    - [ftp.iij.ad.jp apr](http://ftp.iij.ad.jp/pub/network/apache/apr/)
    - apr-util-1.6.1.tar.bz2 をダウンロードする

    ```Shell
    root@efa7173e38f5:~# wget http://ftp.iij.ad.jp/pub/network/apache/apr/apr-util-1.6.1.tar.bz2
    root@efa7173e38f5:~# tar xvf apr-util-1.6.1.tar.bz2
    root@efa7173e38f5:~# cd apr-util-1.6.1
    root@efa7173e38f5:~/apr-util-1.6.1# ./configure --prefix=/opt
    ...
    checking for APR... no
    configure: error: APR could not be located. Please use the --with-apr option.
    root@efa7173e38f5:~/apr-util-1.6.1# ./configure --prefix=/opt --with-apr=/opt/bin/apr-1-config
    ...
    root@efa7173e38f5:~/apr-util-1.6.1# make
    ...
    xml/apr_xml.c:35:10: fatal error: expat.h: No such file or directory
     #include <expat.h>
              ^~~~~~~~~
    compilation terminated.
    /root/apr-util-1.6.1/build/rules.mk:206: recipe for target 'xml/apr_xml.lo' failed
    make[1]: *** [xml/apr_xml.lo] Error 1
    make[1]: Leaving directory '/root/apr-util-1.6.1'
    /root/apr-util-1.6.1/build/rules.mk:118: recipe for target 'all-recursive' failed
    make: *** [all-recursive] Error 1
    ```

1. expat ライブラリをインストール
    - どれを自力で入れて、どれをパッケージで入れるかは悩ましいところ

    ```Shell
    apt search expat
    apt install libexpat1-dev
    ```

1. APR-util のビルドに戻る

    ```Shell
    root@efa7173e38f5:~/apr-util-1.6.1# make
    root@efa7173e38f5:~/apr-util-1.6.1# make install
    root@efa7173e38f5:~/apr-util-1.6.1# ls -l /opt/bin/
    total 16
    -rwxr-xr-x 1 root root 6945 Jul 18 15:37 apr-1-config
    -rwxr-xr-x 1 root root 6121 Jul 18 15:51 apu-1-config
    ```

1. httpd のビルドに戻る

    ```Shell
    root@efa7173e38f5:~/httpd-2.4.39# ./configure --prefix=/opt/apache2
    ...
    checking for pcre-config... false
    configure: error: pcre-config for libpcre not found. PCRE is required and available from http://pcre.org/
    ```

1. PCRE ライブラリをインストール
    - ライブラリ(のバージョン)が複数ある場合、私はまずは新しいのから試すようにしています

    ```Shell
    apt search pcre
    apt install libpcre3-dev
    ```

1. httpd のビルドに戻る
    - make distclean は、ビルドの中間ファイルやゴミなどを消す

    ```Shell
    root@efa7173e38f5:~/httpd-2.4.39# make distclean
    root@efa7173e38f5:~/httpd-2.4.39# ./configure --prefix=/opt/apache2
    ...
    configure: summary of build options:

    Server Version: 2.4.39
    Install prefix: /opt/apache2
    C compiler:     gcc
    CFLAGS:          -g -O2 -pthread
    CPPFLAGS:        -DLINUX -D_REENTRANT -D_GNU_SOURCE
    LDFLAGS:
    LIBS:
    C preprocessor: gcc -E

    root@efa7173e38f5:~/httpd-2.4.39# make
    ...
    root@efa7173e38f5:~/httpd-2.4.39# make install
    ...
    root@efa7173e38f5:~/httpd-2.4.39# ls -l /opt/apache2
    total 0
    drwxr-xr-x  18 root root  576 Jul 18 16:10 bin
    drwxr-xr-x  11 root root  352 Jul 18 16:10 build
    drwxr-xr-x   6 root root  192 Jul 18 16:10 cgi-bin
    drwxr-xr-x   7 root root  224 Jul 18 16:10 conf
    drwxr-xr-x  22 root root  704 Jul 18 16:10 error
    drwxr-xr-x   3 root root   96 Jul 18 16:10 htdocs
    drwxr-xr-x 179 root root 5728 Jul 18 16:10 icons
    drwxr-xr-x  65 root root 2080 Jul 18 16:10 include
    drwxr-xr-x   2 root root   64 Jul 18 16:10 logs
    drwxr-xr-x   4 root root  128 Jul 18 16:10 man
    drwxr-xr-x 205 root root 6560 Jul 18 16:10 manual
    drwxr-xr-x  89 root root 2848 Jul 18 16:10 modules
    ```

    - この段階で「XML_なんとか ライブラリが見つからない」旨のエラーメッセージが出た場合
        - apr-util の configure & make install をやり直す
        - 再度 httpd を configure & make install する

### Apache の設定ファイルを眺めてみる

~/opt/apache2/conf/httpd.conf を読んでみよう。

- ping や ip しようとしたらコマンドがなかったのでインストール

    ```Shell
    cat /etc/hosts
    apt install iproute2 iputils-ping
    ip addr
    ```

- サーバを起動するためには、最低限 ServerName を設定する必要がある
    - コメントを読んで、とりあえず IP アドレスを設定する

    ```Text
    ServerName 172.17.0.2:80
    ```

    - /etc/hosts にサーバ名を各方法でも大丈夫です

    ```Text
    root@efa7173e38f5:~# cat /etc/hosts
    127.0.0.1   localhost
    ::1 localhost ip6-localhost ip6-loopback
    fe00::0 ip6-localnet
    ff00::0 ip6-mcastprefix
    ff02::1 ip6-allnodes
    ff02::2 ip6-allrouters
    172.17.0.2  efa7173e38f5  www.example.com
    ```

### Apache の動作確認とパフォーマンス測定をする

- httpd を起動する

    ```Shell
    root@efa7173e38f5:~# /opt/apache2/bin/apachectl -k start
    root@efa7173e38f5:~# ps auxww | fgrep httpd
    root     48683  0.0  0.1  73548  3644 ?        Ss   10:20   0:00 /opt/apache2/bin/httpd -k start
    daemon   48684  0.0  0.1 1280024 3696 ?        Sl   10:20   0:00 /opt/apache2/bin/httpd -k start
    daemon   48685  0.0  0.1 1280024 3696 ?        Sl   10:20   0:00 /opt/apache2/bin/httpd -k start
    daemon   48688  0.0  0.1 1280024 3696 ?        Sl   10:20   0:00 /opt/apache2/bin/httpd -k start
    root     48769  0.0  0.0  11460  1100 pts/0    S+   10:20   0:00 grep -F --color=auto httpd
    root@efa7173e38f5:~# wget http://172.17.0.2/index.html
    --2019-07-18 10:31:56--  http://172.17.0.2/index.html
    Connecting to 172.17.0.2:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 45 [text/html]
    Saving to: 'index.html'

    index.html          100%[===================>]      45  --.-KB/s    in 0s

    2019-07-18 10:31:56 (1.00 MB/s) - 'index.html' saved [45/45]

    root@efa7173e38f5:~# cat index.html
    <html><body><h1>It works!</h1></body></html>
    ```

- ベンチマークを取ってみる

    ```Shell
    root@efa7173e38f5:~# ab -n 1000 -c 1000 http://172.17.0.2/index.html
    This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/

    Benchmarking 172.17.0.2 (be patient)
    Completed 100 requests
    Completed 200 requests
    Completed 300 requests
    Completed 400 requests
    Completed 500 requests
    Completed 600 requests
    Completed 700 requests
    Completed 800 requests
    Completed 900 requests
    Completed 1000 requests
    Finished 1000 requests


    Server Software:        Apache/2.4.39
    Server Hostname:        172.17.0.2
    Server Port:            80

    Document Path:          /index.html
    Document Length:        45 bytes

    Concurrency Level:      1000
    Time taken for tests:   2.818 seconds
    Complete requests:      1000
    Failed requests:        0
    Total transferred:      289000 bytes
    HTML transferred:       45000 bytes
    Requests per second:    354.87 [#/sec] (mean)
    Time per request:       2817.911 [ms] (mean)
    Time per request:       2.818 [ms] (mean, across all concurrent requests)
    Transfer rate:          100.15 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0   71  30.1     66     151
    Processing:    20  211 187.8    148    2244
    Waiting:        5  172 185.2    119    2243
    Total:         63  282 185.5    233    2307

    Percentage of the requests served within a certain time (ms)
      50%    233
      66%    263
      75%    306
      80%    311
      90%    500
      95%    672
      98%    979
      99%    986
     100%   2307 (longest request)
    ```

## 質問

- ビルドが一度ですんなりいかなかったのはなぜでしょう？

## 追加課題

- httpd.conf に設定を入れてみる
    - NameVirtualHost を設定してみる (/etc/hosts にホスト名を追加、別のディレクトリにコンテンツを配置)
- 定番モジュール mod_rewrite などを設定する
    - ホスト部、パス部などを書き換える
- /opt/apache2/htdocs 以下に大きめのファイルを置いて、パフォーマンス測定する
- 追加したモジュールをすべてインストールした Docker image を作成する
    - httpd, apr, apr-util のソースを、/root 以下にコピーする
- http/2 を使えるようにしてみる
    - [HTTP/2 guide](https://httpd.apache.org/docs/2.4/en/howto/http2.html)
    - Docker 設定で母艦からアクセスできるようにして、Chrome などで見てみる
    - Chrome 開発者ツールで確認する

<credit-footer/>
