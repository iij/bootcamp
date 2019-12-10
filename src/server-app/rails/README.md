---
footer: CC BY-SA Licensed | Copyright (c) 2019, Internet Initiative Japan Inc.
description: Railsによるサーバーアプリ実装の基礎についてハンズオンしてみましょう
time: 1h
prior_knowledge: 特になし
---

<header-table/>

# Ruby on RailsでWebアプリを作る

## Ruby on Railsとは

1. 略称はRoR、または単にRails
2. Rubyで書かれたフルスタックWebアプリケーションフレームワーク
  - 哲学
    - DRY (Don't Repeat Yoursef. 同じコードは二度書かない)
    - 設定よりも規約 (規約にしたがって開発するかぎり、設定ファイル不
      要...Rails以前に有力だったStrutsは、きまりきったことを設定ファイ
      ルに書く必要があった)
  - フルスタック(必要な機能はほとんどなんでもRailsが提供)
  - プロジェクト管理(プロトジェクトの立ち上げ、ライブラリのインストー
    ル、データベース上のテーブルの定義/マイグレーション、テスト、リリー
    ス等をコマンドで実行できるようにしている)
  - Scaffold (プログラム開発の足場) の提供 (数分でWebアプリケーション
    が立ち上がる! 的なデモで一世を風靡した)
  - MVCアーキテクチャ (ここは、何の変哲もない感じです)
  - ActiveRecord (ほとんどコードを書かずにデータベースを操作できる)
3. 爆発的に成功し、Rubyのキラーアプリケーションとなった。
  - Railsを使いたくてRubyを学習する、という人が大量に出現した。

### Railsの強み/弱み

1. 強み
  1. 少ないコード量で多くの仕事
  2. 作法が決まっているので、共同作業しやすい
  3. 豊富なリソース (教材、サンプル、コミュニティ)
2. 弱み
  1. 学習コストが高い
  2. 約束事が多い
  3. 性能面の問題を抱えやすい

これらの特性から、スタートアップが少数精鋭チームで初期バージョンを開発
し、成功した後で他の言語/フレームワークで書き直す、というスタイルでよ
く利用されています。

## Railsのインストール

1. 事前準備
2. rbenvのインストール
3. Rubyのインストール
4. Rails環境の準備
5. Railsプロジェクトの作成

## 事前準備

```
$ sudo yum update
$ sudo yum install -y git
$ sudo yum install -y bzip2 gcc openssl-devel readline-devel zlib-devel sqlite-devel
```

## rbenvのインストール

Railsで開発を行なうと、プロジェクト毎に異なるバージョンのRubyを使うこ
とがよくあります。そのため、yumでOSにインストールしたRubyを使うのでは
なく、プロジェクト毎に特定のバージョンのRubyを使えるように、rbenvとい
うツールを使うことが一般的です。

```
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
$ git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
```

~/.bash_profileに以下を追記

```
# rbenv
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

```

反映と確認

```
$ source ~/.bash_profile
$ rbenv -v # バージョンが表示される。
```

### Rubyのインストール

Rubyのインストール可能なバージョンを確認

```
$ rbenv install --list
```

任意のバージョンのRubyをインストール。(今回は2.6.3を指定）

```
$ rbenv install 2.6.3 # 少しかかります(数分程度)
```

インストールしたバージョンのRubyをrbenvに設定し、確認します。

```
$ rbenv global 2.6.3
$ ruby -v # Rubyが実行できることを確認
```

ちなみに...

```
$ ruby -v
(rbenv管理のRubyのバージョン)
$ which ruby
(rbenv管理のRubyの場所)
$ /usr/bin/ruby -v
(OS管理のRubyのバージョン)
```

### Rails環境の準備

bundlerをインストール

```
$ gem install bundler
```

bundlerというのは、プロジェクト毎にgemを管理するためのツールです。

gemというのは、Rubyのライブラリを管理するためのツールです。

rbenvでプロジェクト毎に異なるバージョンのRubyを使えるようにするように、
bundlerでプロジェクト毎に異なるバージョンのライブラリを使えるようにす
るのです。

Railsの利用可能なバージョンを確認します。

```
$ gem query -ra -n  "^rails$"
```

Railsの任意のバージョンの環境をディレクトリにまとめます。
(今回は5.2.1を指定しました）

```
$ mkdir rails_v5.2.1 # お好きな名前を
$ cd rails_v5.2.1
$ bundle init # カレントディレクトリにGemfileを作成
$ echo 'gem "rails", "5.2.1"' >> Gemfile # ※ 任意のバージョンを指定
$ bundle install --path vendor/bundle # ./vendor/bundleにRails関連のGemが入る
```

以下の表示が出ることがあります。

```
HEADS UP! i18n 1.1 changed fallbacks to exclude default locale.
But that may break your application.

Please check your Rails app for 'config.i18n.fallbacks = true'.
If you're using I18n (>= 1.1.0) and Rails (< 5.2.2), this should be
'config.i18n.fallbacks = [I18n.default_locale]'.
If not, fallbacks will be broken in your app by I18n 1.1.x.

For more info see:
https://github.com/svenfuchs/i18n/releases/tag/v1.1.0
```

これについては、さしあたり無視しておきます。(i18nを使うときまで。)

### Railsプロジェクトの作成

Railsのプロジェクトを、上記で作成したRailsディレクトリの中に作成します。

```
$ cd ~/rails_v5.2.1 # 上記で作成したRailsディレクトリに移動
$ bundle exec rails new bootcamp --skip-bundle # プロジェクトの作成
```

bundle execはbundlerが~/rails_v5.2.1にインストールしたrailsコマンドを
実行することを指示しています。

bootcampはプロジェクト名です。好きなように決めることができます。

--skip-bundleはbundle installを自動で実行しないようにしています。こう
することで、このプロジェクトに必要なgemを、プロジェクト内の
vendor/bundle以下にインストールするようにしています。

ここでbootcampディレクトリが作られるのですが、その中にあるGemfileの末
尾の方にある以下の部分を修正してください。

```
group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of chromedriver to run system tests with Chrome
  #gem 'chromedriver-helper' ここをコメントアウトして
  gem 'webdrivers' # この行を追加します。
end
```

この修正は何かというと、chromedriver-helperがEnd supportになったことへ
の対処です。


```
$ cd bootcamp
$ bundle install --path vendor/bundle # ./vendor/bundleにGemをインストール
$ echo '/vendor/bundle' >> .gitignore # Gitの管理対象から外す
```

ここまで実行すると、すでにRailsの開発サーバを起動可能です。

```
$ bundle exec rails server
```

ブラウザを起動して http://localhost:3000 にアクセスしてみましょう。

Yay! You’re on Rails! と表示されていれば、インストールは完了です。

## まずはHello

新しいプログラミング言語を覚えるときは、最初にHelloするものです。

（先程のサーバを起動しているターミナルはそのままにしておいて）もうひとつターミナルを開いて、以下を実行します。

```
$ bundle exec rails generate controller Welcome index
```

こんな感じにコントローラ、テンプレート等が生成されます。

```
      create  app/controllers/welcome_controller.rb
       route  get 'welcome/index'
      invoke  erb
      create    app/views/welcome
      create    app/views/welcome/index.html.erb
      invoke  test_unit
      create    test/controllers/welcome_controller_test.rb
      invoke  helper
      create    app/helpers/welcome_helper.rb
      invoke    test_unit
      invoke  assets
      invoke    coffee
      create      app/assets/javascripts/welcome.coffee
      invoke    scss
      create      app/assets/stylesheets/welcome.scss
```

app/controllers/welcome_controller.rbには、WelcomeControllerクラスが定
義されています。

```ruby
class WelcomeController < ApplicationController
  def index
  end
end
```

ほとんど空っぽです。indexメソッドはindexアクションのためのメソッドです。

welcomeコントローラのindexアクションに対応するテンプレートは、
app/views/welcome/index.html.erbにあります。

```erb
<h1>Welcome#index</h1>
<p>Find me in app/views/welcome/index.html.erb</p>
```

このファイルを以下のように修正しましょう。

```erb
<h1>Hello, Rails!</h1>
```

ブラウザで http://localhost:3000/welcome/index にアクセスしてみましょ
う。どうなりましたか。

（開発サーバの再起動が不要だったことに注目しましょう!）


## Scaffold

最後にScaffoldを試してみましょう。

Scaffoldは、データベースを使った、list(一覧表示)、add(追加)、remove(削
除)、edit(編集)、view(表示)の足場を提供してくれるものです。

以下を実行しましょう。

```
bundle exec rails generate scaffold idea name:string description:text
bundle exec rails db:migrate
```

1行目で、ideaという名前のscaffoldを作ります。name:stringと
description:textはデータベースに作成するideasテーブルに定義するカラムで
す。

（Railsの「規約」では、テーブル名は複数形になります。）

2行目で、データベース定義を実際にデータベースに反映させます。
（現在の設定では、sqlite3を使っています。）

ブラウザで http://localhost:3000/ideas にアクセスしてみましょう。

まだテーブルにデータが入っていので空の状態です。

New Ideaリンクをクリックして、新しいデータを追加してみましょう。

すでにデータの一覧表示、追加、編集、削除、表示ができるようになっている
のがわかると思います。

おめでとうございます! これで、あなたはWebアプリケーションを作ることに
成功しました。

実際のコードも読んでみましょうか。

まずはIdeasコントローラを見てみましょう。

app/controller/ideas_controller.rbです。

```ruby
class IdeasController < ApplicationController
  before_action :set_idea, only: [:show, :edit, :update, :destroy]

  # GET /ideas
  # GET /ideas.json
  def index
    @ideas = Idea.all
  end

  # GET /ideas/1
  # GET /ideas/1.json
  def show
  end

  # GET /ideas/new
  def new
    @idea = Idea.new
  end

  # GET /ideas/1/edit
  def edit
  end

  # POST /ideas
  # POST /ideas.json
  def create
    @idea = Idea.new(idea_params)

    respond_to do |format|
      if @idea.save
        format.html { redirect_to @idea, notice: 'Idea was successfully created.' }
        format.json { render :show, status: :created, location: @idea }
      else
        format.html { render :new }
        format.json { render json: @idea.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ideas/1
  # PATCH/PUT /ideas/1.json
  def update
    respond_to do |format|
      if @idea.update(idea_params)
        format.html { redirect_to @idea, notice: 'Idea was successfully updated.' }
        format.json { render :show, status: :ok, location: @idea }
      else
        format.html { render :edit }
        format.json { render json: @idea.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ideas/1
  # DELETE /ideas/1.json
  def destroy
    @idea.destroy
    respond_to do |format|
      format.html { redirect_to ideas_url, notice: 'Idea was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_idea
      @idea = Idea.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def idea_params
      params.require(:idea).permit(:name, :description, :picture)
    end
end
```

驚くほど簡潔です。

たとえば `index` メソッドは、インスタンス変数 `@ideas`に`Idea.all`の戻値を
代入しているだけです。

`Idea.all`は、何をしているかというと、データベースに定義したideasテー
ブルから全部の行を取得してその内容を返すというものです。

`show` メソッドに至っては中身が空ですが、こちらは冒頭に宣言されている
`before_action` によって、 `showメソッド` を実行する前に `set_idea` メ
ソッドが実行されます。その `set_idea` メソッドはというと...

```ruby
    def set_idea
      @idea = Idea.find(params[:id])
    end
```

これまたたった一行です。これはリクエストパラメータ `id` で `ideas`テー
ブルの主キーを検索し、SELECTできた行をインスタンス変数 `@idea` に格納
しているだけです。

`show` メソッドのviewはどうなっていますか。

app/view/idea/show.html.erb

```erb
<p id="notice"><%= notice %></p>

<p>
  <strong>Name:</strong>
  <%= @idea.name %>
</p>

<p>
  <strong>Description:</strong>
  <%= @idea.description %>
</p>


<%= link_to 'Edit', edit_idea_path(@idea) %> |
<%= link_to 'Back', ideas_path %>
```

ほとんど一目瞭然ではないでしょうか。

`<%= @idea.name %>` の箇所で、インスタンス変数 `@idea` のnameメソッド
を用いて `ideas`テーブルの `name`列を表示しています。

## 最後に

ここまででRailsを使ったアプリケーション開発のはじめの一歩を体験しまし
た。

ほとんどコードを書かずに最低限の足場まで進むことができ、ここからアプリ
ケーションを育てていけることがなんとなくわかったのではないかと思います。

Railsに関しては、参考になる書籍も、Webサイトも非常にたくさんあります。

短期間でRailsを習得するためのコースもあるので、業務上必要な場合は上長
に相談して受講するのも手です。

ただし、Railsは最初にも申し上げましたが、それなりに学習コストの高いフ
レームワークで、本格的なアプリケーションをひととおり作れるようになるた
めには数百時間の学習と実践が必要になると思われます。

Railsは、しかし、その後のWebアプリケーション開発のお手本になった部分が
多々あり、Railsを学んでおくと、後発のWebアプリケーション開発フレームワー
クの習得が容易になるという側面もあります。

機会を見つけて、Railsにチャレンジしてみることは、現在でも意義のあるこ
とだと思います。

<credit-footer/>
