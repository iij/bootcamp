# GitHub Actions でCIテスト・デプロイを回す

## 0. この講義について

### 0.1 この講義の目的

GitHub Actions を利用したCI/CDを体験し、自分のプロジェクトにCI/CDを自ら導入できるようにする。

### 0.2 ハンズオンの対象者

この講義は drone/GitHub ActionsでCIテスト・デプロイを回す の 一部分です。  
  drone の説明を聞いてあること。drone のハンズオンを実施してあることが前提になっています。  

### 0.3 下準備
drone のハンズオン と同様です。また、 drone のハンズオン で作成したリポジトリを利用します。

### 0.4. この資料のお約束

:computer: は自分で操作する箇所を示しています。

 <ほげほげ> で囲まれている部分は自分の設定値で置き換えてください。たとえば

```
git clone <リモートリポジトリのアドレス>
```

と記載されている箇所は

```
git clone git@github.com:iij/bootcamp.git
```

というように置き換えてください。

## 1. GitHub Actions とは
[GitHub Actions](https://docs.github.com/ja/actions) とは GitHub が提供する CI/CD プラットフォームです。

複数の Action を組み合わせることで、 さまざまなワークフローを自動化できるようになっています。

Linux, Windows, macOS があらかじめ用意されているほか、自前で self-hosted runner と呼ばれる処理用のホストを用意することも可能です。

GitHub 上の Publicリポジトリ や、 self-hosted runner を利用する場合 無料で使えます。

Private リポジトリでは、一部制限があるので留意ください。

[GitHub Actionsの支払いについて](https://docs.github.com/ja/billing/managing-billing-for-github-actions/about-billing-for-github-actions)


### 2.1. とりあえず初めてみる

* drone ハンズオン では以下をやってみました。
  * RSpec の実行
  * textlint の実行
  * rails の test

* ここでは、RSpec の実行 と textlint の実行 を GitHub Actions で設定してみます。

#### 2.1.1. RSpec や textlint をしてみる
* drone の ハンズオンで作成した ```drone-exercise-<user名>``` へ移動してください
* その後、以下のようなファイルを```.github/workflows/ci.yml```に作成します。

```yaml
name: CI
on: [push]
jobs:
  rspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.6'
          bundler-cache: true
      - name: do test
        run: bundle exec rspec
  textlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install textlint
        run: npm install textlint
      - run: npm install textlint-rule-preset-ja-technical-writing
      - run: $(npm bin)/textlint --format pretty-error --preset ja-technical-writing README.md
```

作成後 push すると GitHub の Actions タブから実行状況を確認できます。

それでは `README.md` の内容を修正したり、 `hello_world.rb` の 内容を改変して 振る舞いを確認してみてください。

もちろん drone と同じく PR を作って試行錯誤しても良いです。

::: tip チェックポイント8 🏁
GitHub Actions で テストが実行できましたか  
  `README.md` や `hello_world.rb` を改変し テストに失敗させるなどできましたか
:::

## 3. GitHub Actions の 基本的な設定

drone の設定と同様 複数の step からなる Workflow を作成できるようになっています。

drone のように container image を指定して任意のコマンドを実行させることも可能ですが、最大の特徴は Action と呼ばれる再利用可能なコードを組み合わせることで、簡単にさまざまなことができるようになっている点です。

GitHub Actions にはさまざまな設定項目がありますが、前述した RSpec と textlint の実行に絞って 各項目について解説していきます。

他詳細は[公式ドキュメント](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions) を参照ください

### 3.1. name, on

```yaml
name: CI
on: [push]
```

* `name` - このファイルで実現されるものについての名前です。

  なお、`.drone.yml` の一つしか用意できなかった drone.io とは異なり  
  `.github/workflows` 以下に複数のファイルを置くことが可能です。

* `on` - ワークフローがいつ実行されるかの定義です。  

  特定の branch に対する操作のときだけに限定したりも可能ですが、  
  今回は push すべてを対象にしています。

### 3.2. jobs

```yaml
jobs:
  rspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.6'
          bundler-cache: true
      - run: bundle exec rspec
```

jobs は job の集合体です。job は ワークフローの実行単位で必ず一つ以上含まれます。

* `rspec` というのが この job の 識別子になります。

* `runs-on` - どんなタイプのマシンで このジョブを実行したいかを指定します。  

   自前でランナーを用意する場合は `self-hosted` と指定したり、   
   GitHub.com が用意するものを利用する場合は `ubuntu-latest` などと指定します。  
   ほかにも Windows や macOS を選択することも可能です。

* `steps` - job の実際の操作を記述する部分です。  
  `uses` や `run` などで実際にどんな操作を行うか定義できます。

* `run` - コマンドを実行します。  
   コマンドは、デフォルトでは非ログインシェルを使用して実行されます。  
   yaml の `|` を利用して複数行実行することや、  
   `working-directory` を指定して特定のディレクトリで実行させることも可能です。

* `uses` - action を実行します。
   - `actions/checkout@v2`   
     Git checkout をします。 Git repository の内容について処理する場合はこれが必要です。
   - `ruby/setup-ruby@v1`   
     Ruby をインストールします。 このあとの `run` では Ruby のコマンドを利用できます。

  また、 一部 `with` で パラメータを与えられるものもあります。   
    (Ruby のバージョンを3にしてみるのもよいですね。)

  なお、 この action の @v2 や @v1 は branch や tag などの Git 的 refs を意味します。  
  つまり、 GitHub 上の ある repository の内容を利用しているということです。  
  そのため、 repository 側の更新により、意図せず振る舞いが変わる可能性があります。  

:::tip
  公式でも「リリースされたアクションバージョンのコミットSHAを使用するのが、安定性とセキュリティのうえで最も安全です。」としています。

  https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses
:::


### 4. ほかにも

GitHub Actions の最大の特徴は action を組み合わせて workflow を実現できる点でした。

https://github.com/marketplace では さまざまな action を探すことができます

さらには 自分で action を作ることも可能です。

いろいろ探してみてください。

ちなみに、この資料も GitHub Actions で作られています。

https://github.com/iij/bootcamp/actions  
https://github.com/iij/bootcamp/tree/master/.github/workflows

## 8. 参考情報

- [GitHub Actions](https://docs.github.com/ja/actions)
