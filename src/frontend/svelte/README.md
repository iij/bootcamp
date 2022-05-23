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

<!-- TODO: 特に他の開発環境を使った場合の説明は行いませんが、万が一CodeSandboxが使えない場合でも頑張ってカバーできるよう、手順くらいは確認すること！ -->

[CodeSandboxのプロジェクト作成ページ](https://codesandbox.io/s)に移動します:

![CodeSandboxのプロジェクト作成画面](create-project.png)

少しスクロールすると出てくる![Svelte by CodeSandbox](item-svelte.png)と書かれた箇所をクリックすると、テンプレートからすでに動作するアプリが作成されます！

![CodeSandboxのSvelteテンプレートで作成したプロジェクト（初期状態）](initial-project.png)


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
