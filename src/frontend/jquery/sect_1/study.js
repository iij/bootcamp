(function($) {
  'use strict';

  alert('study.js を呼び出した（コンソールを開いてください）');

  console.log('console.log は開発者ツールのコンソール欄に出力される');
  console.log(['apple', 'orange', 'peach'], 'hoge', 123, {'border': '1px solid red'}, 'console.log の引数は何個でも書ける');
  console.log('jQuery のバージョンは %c%s%c です', 'color: red; background: #ff0;', $.fn.jquery, '');
  console.log('object や function の値をデバッグ出力をしたいときに、console.log だと文字列になってしまう場合は console.dir を使う');
  console.log($);
  console.dir($);
}(jQuery))
