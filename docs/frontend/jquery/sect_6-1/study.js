(function($) {
  'use strict';

  $(function() {
    work1();
  });

  work2();

  function work1() {
    console.log('==== work1 が実行されました ====');
    // $() メソッドに CSS のセレクタを与えると、それにマッチする要素を取得します
    var $desc = $('.description');
    console.log('class="description" の要素は %d 個ありました', $desc.length)
  }

  function work2() {
    console.log('==== work2 が実行されました ====');
    var $desc = $('.description');
    console.log('class="description" の要素は %d 個ありました', $desc.length)
  }
}(jQuery));
