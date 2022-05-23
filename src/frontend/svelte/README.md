---
footer: CC BY-SA Licensed | Copyright (c) 2021, Internet Initiative Japan Inc.
---

# Svelte を触ってみよう

## 事前準備

- [CodeSandbox](https://codesandbox.io/)というサービスを利用することで、適当なブラウザーさえ動けば学習できるようにします
    - CodeSandboxならローカルにエクスポートしたプロジェクトをそのまま動作させることができる。「後で自分の環境にNode.jsをちゃんと入れて試したい！」という時も安心
    - 万が一利用できない状況だった場合は[StackBlitz](https://stackblitz.com/)か[Svelte公式のREPL](https://svelte.jp/repl/)を利用します

## Svelte とは

[日本語の公式サイト](https://svelte.jp/)

> Svelteはユーザーインタフェースを構築する先鋭的で新しいアプローチです。ReactやVueのような 従来のフレームワークがその作業の大部分を ブラウザ で行うのに対し、 Svelteはその作業を アプリをビルドする際の コンパイル時 に行います。

- HTML・CSS・JavaScriptプラスアルファの構文で`.svelte`というファイルを書くと、いい感じなHTML・CSS・JavaScriptを生成してくれる！
- 生成したJavaScriptに含まれるランタイムライブラリーが少ない！
    - ユーザーがダウンロードするJavaScriptが軽い！
- 生成したHTML・CSS・JavaScriptはSvelte以外のフレームワークの中でも使える！
    - 「ちょっとずつSvelteに移植しよう！」「新しく追加する機能だけSvelte試してみよ！」みたいなことができる！
- 他のフレームワークよりも短く簡潔に書けることを重視
    - <https://svelte.jp/blog/write-less-code>

## 早速書こう

<!-- TODO: 特に他の開発環境を使った場合の説明は本文では行いませんが、万が一CodeSandboxが使えない場合でも頑張ってカバーできるよう、手順くらいは確認すること！ -->

[CodeSandboxのプロジェクト作成ページ](https://codesandbox.io/s)に移動します:

![CodeSandboxのプロジェクト作成画面](create-project.png)

少しスクロールすると出てくる、下記のような「Svelte by CodeSandbox」と書かれた箇所をクリックすると、テンプレートから動作するアプリがすぐに作成されます！

![Svelte by CodeSandbox](item-svelte.png)

CodeSandboxのSvelteテンプレートで作成したプロジェクト（初期状態）:

![](initial-project.png)

利用した開発環境にもよって変わりますが、CodeSandboxを使って上記👆のスクリーンショットにした状態について、画面上にあるものを解説します:

- 画面左上にあるのが、プロジェクトにあるファイルの一覧です。CodeSandboxもStackBlitzも、おなじみVisual Studio Codeをブラウザー上で動かすことで実現しています
- 画面真ん中上に表示されているのが、今開いているファイルを編集する画面です。今開いているファイル（index.jsかmain.js）では、`App.svelte`というファイルに書かれたコンポーネント（後述）を指定した要素に適用しています
    - ※Svelte REPLの場合初期状態で開かれているのはApp.svelte
- 画面真ん中下に表示されているのが、作成したアプリケーションを実行している画面です。編集画面でファイルを変更・保存する度に更新され、都度動作確認できます

## チェックポイント

- CodeSandboxなどのブラウザー上で動く開発環境を利用して、Svelte製のアプリケーションをテンプレートから作成できた
- CodeSandboxなどのブラウザー上で動く開発環境について、画面にあるものを大まかに理解できた

話したい:

- [ ] ローカル変数を紐付けられること（on-way binding）
    - <https://svelte.jp/tutorial/reactive-assignments>
    - <https://svelte.jp/tutorial/reactive-declarations>
    - <https://svelte.jp/tutorial/reactive-statements>
- [ ] `<style>`タグがローカルに
    - <https://svelte.jp/tutorial/styling>
- [ ] two-way binding
    - <https://svelte.jp/tutorial/text-inputs>
- [ ] コンポーネントの分割
    - <https://svelte.jp/tutorial/declaring-props>
- [ ] ロジック
    - <https://svelte.jp/tutorial/if-blocks>
    - <https://svelte.jp/tutorial/else-blocks>

クリックした回数が3の倍数の時だけComic Sansになるとかいいかもね

3以外の数も指定できればtwo-way binding
