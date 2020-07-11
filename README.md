# bootcamp
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

## 概要

[IIJ](https://www.iij.ad.jp/) では「IIJ Bootcamp」と題して主に新人向けのハンズオン勉強会を実施しており、これはその資料集です。

IIJ Bootcampでは、各技術が誕生した経緯・歴史、他の技術と比較といった知識を得るためのきっかけとして、様々な言語・フレームワーク・ツールに触れて実際に動かすハンズオン研修を行っています。
研修ではハンズオンだけではなく、「overview」として技術ジャンルの全体像や歴史などを紹介する回も設けています。

## ディレクトリ構成

```sh
.
├── src # 資料となるmarkdownファイルを置く
│   ├── database # データベースカテゴリの資料
│   │   ├── mongodb # MongoDBハンズオン用ディレクトリ
│   │   │   └── README.md # MongoDBハンズオン資料
│   │   ├── mysql
│   │   │   └── README.md
│   │   └── redis
│   │       ├── README.md
│   ├── development # その他開発カテゴリ
│   │   ├── drone
│   │   │   ├── README.md
│   │   │   └── images # 資料用画像ファイル
│   │   │       ├── drone_branch_protection.png
│   │   │       ├── drone_first_test.png
│   │   │       ├── drone_pull_request_base.png
│   │   ├── git
│   │   ├── github
│   │   └── jenkins
│   ├── docker # dockerカテゴリ
│   │   ├── docker
│   │   └── docker-compose
│   ├── frontend # フロントエンドカテゴリ
│   │   ├── angular
│   │   ├── jquery
│   │   ├── overview
│   │   ├── react
│   │   └── vue
│   ├── init # 事前準備
│   │   └── hello-bootcamp
│   ├── server-app # サーバーアプリケーションカテゴリ
│   │   ├── go
│   │   ├── java
│   │   ├── node
│   │   ├── overview
│   │   └── rails
│   └── web-server # webサーバーカテゴリ
│       ├── apache
│       ├── hosting
│       ├── nginx
│       └── overview
```

## Contribution

このリポジトリでは内容についての質問や指摘、資料の改善などにご協力いただけるcontributerを募集しています。
詳しくは [Contribution Guide](CONTRIBUTING.md) をご覧ください。
