# Contribution Guide

このリポジトリへのコントリビュート方法についてガイドです。

## ドキュメントの記述

ハンズオン用の資料は公開時に[VuePress](https://vuepress.vuejs.org/)でコンパイルされます。
基本的にMarkdownで記述されていますが、一部VuePress独自の記法が使われています。VuePressの記法についてはドキュメントをご覧ください。

- [VuePress: Markdown Extensions](https://vuepress.vuejs.org/guide/markdown.html#header-anchors)

## Issues

次のIssueを受け付けています。

- 資料に関する質問
- 内容についての問題や改善点の報告
- 資料の新規追加などの提案

その他気軽にIssueを切っていただいて構いません。

## Pull Request

Pull Requestはいつでも歓迎しています。

**受け入れるPull Request**

次の種類のPull Requestを受け付けています。
基本的なPull Request（特に細かいもの）は、Issueを立てずにPull Requestを送ってもらって問題ありません。

修正内容や改善方法に疑問がある場合は、Issueを立てて相談してください。

- 誤字の修正
- サンプルコードやスペルの修正
- 別の説明方法の提案や修正
- 文章をわかりやすくするように改善
- 資料の新規追加
- ウェブサイトの改善

:memo: **Note:** Pull Requestを送った内容はこのリポジトリの[ライセンス](./LICENSE)（CC BY-SA）が適用されます。

**受け入れていないPull Request**

- [CODE OF CONDUCT](./CODE_OF_CONDUCT.md)に反する内容を含むもの

## 修正の送り方

文章の誤字の修正程度なら、直接GitHub上で編集してPull Requestを送ってください。

- [Editing files in your repository - User Documentation](https://help.github.com/articles/editing-files-in-your-repository/ "Editing files in your repository - User Documentation")

ローカルで編集して送りたい場合は次の手順を試してください。

1. Forkする
2. Branchを作る: `git checkout -b my-new-feature`
3. 変更をコミットする: `git commit -am 'Add some feature'`
4. Pushする: `git push origin my-new-feature`
5. Pull Requestを送る :D

## 修正の確認方法

この資料は[VuePress](https://vuepress.vuejs.org/)でコンパイルされています。
`make run`で開発用サーバーを起動した後、[http://localhost:8080/](http://localhost:8080/)へアクセスすることで、資料のプレビュー表示ができます。

```bash
make setup # install vuepress
make run # start dev server

# open http://localhost:8080/
```

## ディレクトリ構造

`docs` 下にハンズオンの大項目(例: development, server-app, etc...)があり、その下に各ハンズオン用のディレクトリがあります。
各ハンズオンディレクトリには、メインのドキュメントになる`README.md`とその他画像やサンプルコードなどが含まれます。

```text
└── docs
    └── development
        ├── jenkins
        │   ├── README.md
        │   ├── images
        │   │   └── create-job.png
        │   │
        │   └── codes
        |       └── sample.js
        └── kubernetes
            ├── README.md
            └── images
```

## 書き方の色々

書き方に関するルールや表記統一について

### コードの参照方法

事前に説明した特定のコードを参照したい場合は、サンプルコードのファイル名を参照に利用してください。

```markdown
[import, example.js](src/example.js)

色々文章...

[example.js](#example.js)では、 ....

```
