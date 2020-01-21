# GitHub 入門

[GitHub](https://github.com/)とはgitのリモートリポジトリをホスティングしてくれるサービスです。
IIJでは社内で使えるGitHub Enterprise(以下GHE)を提供しています。

## 0. まえがきと事前準備

### 0.1. この講義の目標

- GitHubを利用した開発フローであるGitHub Flowを用いて基本的な開発フローができるようになる
- Pull Requestを使った修正ができるようになる
- コードレビューの意義を理解する

### 0.2. この講義でやらないこと

- GitHub Projectの使い方
- GitHub Pagesの使い方
- GitHub APIを使った連携
- GitHub Desktopの使い方
- hubコマンドの解説

### 0.3. 要求する事前知識

- 基本的なgitの使い方を知っていること
- sshと公開鍵の知識

### 0.4. IIJの方へ

この資料はgithub.comを利用して演習を行うように記載されています。
IIJでは社内に閉じて利用できるオンプレ版のGitHub Enterpriseを提供していますのでそちらをご利用ください。

以下の資料ではGitHub Enterpriseの環境でスクリーンショットを作成しています。
github.comとは画面が異なることがありますので適宜読み替えていただくようにお願いします。

### 0.5. 事前準備

#### 0.5.1. SSH鍵の作成

sshするための鍵を生成してください。すでに作成されている方はそちらを利用してください。

::: tip
[Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
:::

#### 0.5.2. アカウントを作る

https://github.com/ に ログインしてアカウントを作成してください。

GitHubではリポジトリのやり取りで公開鍵認証方式によるsshが利用できますので、
上記で作った自分の公開鍵を以下のURLから登録してください。

https://github.com/settings/ssh/new

::: tip
[Adding a new SSH key to your GitHub account](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account)
:::

## 1. GitHubとは

Gitは分散型バージョン管理システムと呼ばれています。
他の人と共同作業をしたくなった場合は、手元で作ったリポジトリを他のリポジトリとやり取りをすることができます。
手元にあるリポジトリを**ローカルリポジトリ**と呼び、他のコンピュータにはあるリポジトリを**リモートリポジトリ**と呼びます。

しかし、他人のコンピュータのリポジトリに直接変更を送ったり、取り込んだりするのは面倒ですので
Gitサーバを立ててそこを経由してやりとりするのが一般的です。

[GitHub](https://github.com/)とはgitのリモートリポジトリをホスティングしてくれるサービスです。
GitHubは単純なGitサーバの機能だけではなく、開発に必要な便利な機能をセットで提供してくれます。

## 2. GitHubの基礎

### 2.1. リポジトリを作る

まずはGitHubで利用するためのリポジトリを登録します。
新規にリポジトリを作る方法と、既存のローカルリポジトリを登録する方法があります。
今回は新規にリポジトリを作ってはじめましょう。

右上のユーザーアイコンの横の+から「New Repository」を選びます。

![右上の＋](./images/github_create_repository.png)

リポジトリは作り放題です。

「Repository name」は「first_repo」にしましょう。

Publicリポジトリは誰でも参照することができ、Privateリポジトリは指定した人のみが参照することができます。
「Initialize this repository with a README」にもチェックを入れましょう。

![はじめてのリポジトリ](./images/github_first_repo.png)

### 2.2. Cloneする

リモートリポジトリをそっくりそのまま手元にローカルリポジトリを持ってくることできます。これを`clone`と呼びます。

さっそく作ったリポジトリを`clone`してみましょう。
「Clone or download」からアドレスをコピーすることができます。SSHとHTTPSを選ぶことができますので、SSHになっていることを確認してください。

![Clone with SSH](./images/github_clone_with_ssh.png)

- `git clone`コマンドを利用して`clone`します。

```
git clone <リモートリポジトリのアドレス>
```

コマンドラインを開き、コピーしたアドレスを使って以下のようにcloneします。

```bash
$ git clone git@github.com:kazuki-h/first_repo.git
Cloning into 'first_repo'...
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.

$ cd first_repo
$ ls -al
-rw-rw-r-- 1 kazuki-h kazuki-h 44 Apr 11 17:41 README.md
```

リポジトリがcloneできて`README.md`ができていることが確認できます。
`README.md`を開いてGitHub上で表示されているファイルと同じものが表示されていることを確認してください。

### 2.3. リモートリポジトリの情報を確認する

`git clone`をするとリモートリポジトリの情報が自動で記録されます。
`git remote`コマンドでリモートリポジトリの設定を変更することができます。
どのようにリモートリポジトリが登録されているか確認してみましょう。

- リモートリポジトリの情報を確認する

```bash
$ git remote -v
```

以下のような情報が表示されることを確認しましょう。

```
origin	git@github.com:kazuki-h/first_repo.git (fetch)
origin	git@github.com:kazuki-h/first_repo.git (push)
```

`origin`はリモートリポジトリの別名です。デフォルトで`origin`という名前になります。
これからのコマンドでは`origin`と書くことでGitHub上のリモートリポジトリを指定したことになります。

リモートリポジトリは複数登録することも、自分で好きな名前を付けることもできますが今回のハンズオンでは取り扱いません。

### 2.4. 変更をpushする

リモートリポジトリに対して手元の変更を送ることを`push`と呼びます。

README.md に好きな文言を加えてコミットし、pushしてみましょう。

```bash
$ git add README.md
$ git commit
```

```bash
$ git push origin master
```

このコマンドはoriginに手元のmasterブランチの変更を送ることを意味しています。
GitHubのページをリロードし変更が反映されているか確認してみましょう。

### 2.5. コミット履歴を見る

GitHub上でコミット履歴を確認することができます。

![コミットの表示](./images/github_commits.png)

- `2 commits`と表示されている場所をクリックしてください。

![はじめてのおわり](./images/github_end_of_first.png)

またコミットハッシュをクリックすると変更差分を確認することができます。

`<>`をクリックするとそのコミット時点でのスナップショットが表示されます。

### 2.6. Blameする

git blame コマンドを使うと、特定のファイルの各行ごとに、いつ誰がどのコミットで編集したかを調べることができます。
GitHub上ではWeb UIで見ることができます。

まずGitHub上でリポジトリの一番上に戻って`README.md`ファイルを開いてください。
Blameボタンを押してください。

![Github Blame](./images/github_blame.png)

### 2.7. ブランチを切る

複数人で開発をする場合はいきなりmasterブランチに修正をコミットするのではなく、
修正用ブランチを切ってそこに修正を入れていき、動作確認ができたらmasterブランチに戻すということを行います。

ブランチを作った場合にGitHubでどう見えるか、見てみましょう。

- ローカルリポジトリでブランチを切ります

```
$ git checkout -b fix
```

`REAMDE.md`になにか1行足してください。

- ブランチをリモートリポジトリに反映させます

```
$ git push origin fix
```

GitHubでリポジトリの一番上のページを開き、`2 branches`になっていることを確認してください。
ブランチは以下のボタンで切り替えることができます。

![Github上でブランチを切りかえる](./images/github_switch_branch.png)

fixブランチに切り替えて、README.mdの内容が切り替わることを確認してください。

## 3. Pull Request

GitHub最大のメリット、それがPull Requestです。
Web UIのないgitサーバというものも存在しますが、Pull Requestを使うためにGitHubを使うと行ってもよいくらいです。

Pull Requestは別のブランチで作成した変更を取り込んでもらう依頼を行うための機能です。
Gitlabでは「Merge Request」と呼びます。

![Pull Requestを出したところ](./images/github_pull_request.png)

さっそくPull Requestを出してみましょう。
さきほどから新しい表示が増えていることに気づいていると思いますが、
「Compare & pull request」ボタンからPull Requestを作成することができます。

- Pull Requestを作成してください

![Pull Requestを作成する](./images/github_compare_create_pull_request.png)

Pull Requestを作成する画面になったらどういった変更を入れるかを記載します。

![Pull Requestの内容を記入する](./images/github_open_pull_request.png)

変更内容が良ければマージしてもらいます。
自分のリポジトリでは他に見てもらう人がいないので自作自演でマージしてしまいましょう。
「Merge pull request」ボタンを押してください。

これでfixブランチに入れた修正がmasterブランチに反映されたはずです。

- Github上でmasterブランチの内容を表示して修正が反映されたことを確認しましょう

- 手元のローカルリポジトリのmasterブランチをpullして最新の状態にし、手元でも修正が反映されたことを確認しましょう。

```bash
$ git checkout master
$ git pull origin master
```

### 3.1. コードレビュー

ソースコードの査読を行うことをコードレビューと呼びます。
コードレビューでは不具合を見つけることを主な目的として行いますが、
可読性や保守性を向上させたり、チーム内でプロジェクトに関する知識の共有を行って属人化しないようにするなどの効果もあります。

開発にはおいては積極的にコードレビューを取り入れていきましょう。
不具合を見つけることだけが目的ではありませんので、かならず経験のあるエンジニアがレビュー役に回る必要はありません。
新人であっても先輩のコードをレビューすることが必要ですし、経験のない部分のコードであっても積極的にレビューしていきましょう。

またペアプログラミングと言って二人ー組でコードを書く方法もありますので調べてみると良いでしょう。

## 4. Fork

特定のリポジトリをコピーすることをができて、これを`fork`(フォーク)といいます。

IIJ Bootcampの講義資料がはいったリポジトリをforkしてみましょう。

- https://github.com/iij/bootcamp/ をforkする
 - forkしたリポジトリを「2.1. Cloneする」と同じように手元にcloneしましょう。

forkするとまったく別のリポジトリになります。
別のバージョンのソフトウェアを作成したり、
コミット権限のないリポジトリに対して修正を送る場合にfork先で修正したものを送ることができます。

## 5. Organization (組織)

すべてのリポジトリはOrganization(組織)の下に配置されます。
Organization（以下org）は実際の部署に紐づくものではなく、リポジトリをまとめる単位に過ぎません。
どういった単位でorgを作るかは利用者に任されていますが、サービスやプロダクト、ワーキンググループ(WG)といった単位で作ることが多いようです。

::: tip
IIJの社内環境ではorgの作成は自由で数も制限はありません。
現在IIJ社内では300以上のorgが登録されています。
たとえばこのハンズオン資料を置いておくために iij-bootcamp org が作られています。
:::

- https://github.com/iij/bootcamp

自分のアカウントもorgの一つです。先ほど作ったリポジトリは自分のアカウント名のorg配下に配置されています。

このハンズオン用のorgを作成してみます。
講師が`bootcamp-rookies` orgを作成し、みなさんのアカウントを登録します。
みなさんは画面をリロードし自分の所属orgが増えていることを確認してください。

自由に編集できるようにIIJ Bootcampリポジトリを講師がforkします。

- https://github.com/bootcamp-rookies が表示できることを確認してください。
- https://github.com/bootcamp-rookies/iij-bootcamp が表示できることを確認してください。

## 6. Issue

GitHubには簡易的な課題管理システム(Issue Tracking System、以下ITS)が備わっています。
ITSは取り組まなければいけない、機能追加や不具合の改修などを記録しておくものです。

### 6.1. バグを報告してみよう

不具合のないプログラムはおそらく存在しません。
バグは湯水のように湧いてきます。
バグは発見したら記録しておかないとどれを直したのか分からなくなってしまいます。見つけたら報告しましょう。

- まずは既存プロジェクトにどんなIssueがあるのか確認してみましょう。
    - https://github.com/iij/mruby/issues

- 自分でIssueを作成してみましょう
    - https://github.com/iij/mruby/issues

#### 6.2. よい不具合報告とは？

不具合の報告は存外難しいものです。
以下のことに気をつけて報告するようにしてください。

- 発生した事象について正確に記載する
  - 「エラーが発生しました」ではどのようなエラーが発生したかわかりません。エラーが表示されましたか？それはなんと書いてありましたか？反応がありませんでしたか？それはどのタイミングでしたか？
- 正確な用語を利用する
  - 自分の用語ではなく、システムで利用されている用語を利用してください。
- こう動作するべきだという期待値を記載する
- 現象を発生させる手順を記載する
  - いつ、どのアカウントを使って、どのページを操作し、どのボタンを押し、どんなデータを入力したかを記載します。
  - 同じ手順で現象が再現しますか？
- 環境を記載する 
  - OS、ブラウザ、インターネット環境、プロキシはどうですか？
- スクリーンショットを付ける
  - なにかエラーが表示されたらスクリーンショットを取っておきましょう。Issueには画像も貼り付けることができます。

### 6.3. ラベルを付けて分類する

Issueにはラベルを複数付けることができます。

付けたラベルで絞り込んで表示することができます。
デフォルトで用意されているラベルの他に自分で定義することもできます。

- さきほど作ったIssueにラベルを付けましょう

### 6.4. 担当者を割り当てる

Assignees に担当者を割り当てることができます。

https://github.com/issues/assigned から自分に割り当てられているチケットの一覧をリポジトリ横断で把握することができます。

## 7. みんなで開発してみよう

gitのブランチ機能は強力ですが自由度が高く、複数人で開発していると開発の進め方に迷ってしまうでしょう。
そこでgitを利用した開発モデルがいくつか提案されています。

[git-flow](https://danielkummer.github.io/git-flow-cheatsheet/index.ja_JP.html) が有名ですが、
GitHubとGitを利用している場合に使える[GitHub Flow](https://gist.github.com/Gab-km/3705015)をご紹介します。

### 7.1. GitHub Flow

git-flowは実践してみると分かりますが、かなり複雑なワークフローです。
リリースプロセスが複雑で重厚な開発に向いています。
でも実際にはもっとシンプルな開発フローで済むことも多いのです。

GitHub Flowは以下には特徴があります。

- masterブランチのものは何であれデプロイ可能である
- 新しい何かに取り組む際は、説明的な名前のブランチをmasterから作成する（例: new-oauth2-scopes）
- 作成したブランチにローカルでコミットし、サーバー上の同じ名前のブランチにも定期的に作業内容をpushする
- フィードバックや助言が欲しい時、ブランチをマージしてもよいと思ったときは、 プルリクエスト を作成する
- 他の誰かがレビューをして機能にOKを出してくれたら、あなたはコードをmasterへマージすることができる
- マージをしてmasterへpushしたら、直ちにデプロイをする

### 7.2. みんなで GitHub Flowをやってみよう

資料の中で誤字や、わかりにくい箇所、間違っている箇所を見つけて修正してみましょう。
本番の資料ではありませんのでどんどん修正して、一般的な開発の流れを体験してみてください。

https://github.com/bootcamp-rookies/iij-bootcamp

1. リポジトリをcloneする
1. ローカルブランチを作成する
1. 資料を修正する
1. ローカルブランチにコミットする
1. pushする
1. Masterブランチに対してPull Requestを作成する 
1. 講師がレビューする
1. 必要に応じてさらに修正する
1. レビューが承認される
1. Masterにマージされる

## 8. Gist

[Gist](https://github.com/gist) はテキストデータを保存し、公開することのできる「Pastebin」と呼ばれるサービスの一種です。
githubのアカウントを持っている人は自由に作成することができ、参照は自由にできます。
コードハイライトを利用することもできます。

IIJでは社内での情報共有ため[Confluence](https://www.atlassian.com/ja/software/confluence)が導入されていますが、
confluenceにgistのURLを貼ると内容が自由に展開されるマクロが導入されています。

![gistをcfに貼り付けた様子](./images/gist.png)

## 9. 参考資料
- [GitHub Learning Lab](https://lab.github.com/)
