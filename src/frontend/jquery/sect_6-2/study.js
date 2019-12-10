(function($) {
  'use strict';

  $(function() {
    work1();
  });

  function work1() {
    var $main = $('#page-main');

    var $desc1 = $('.description');
    // 実際に $desc1 としてどの要素がマッチして取得できたのかをコンソールに出力します
    console.log('desc1 の状態', $desc1);

    // $desc1 に含まれる全ての要素に、赤文字を適用します
    $desc1.css({'color': '#f00'});

    var $desc2 = $('#page-main .description');
    console.log('desc2 の状態', $desc2);
    // $desc2 に含まれる全ての要素に、黄色背景、黒い枠線を適用します
    $desc2.css({'background': '#ff0', 'border': '1px solid #000'});

    add_paragraph();
    // 関数にして、変数のスコープ（影響範囲）が関数内だけになるようにしています
    function add_paragraph() {
      // $() メソッドに CSS セレクタではなくタグ文字列を与えると、要素の取得ではなく、新しい要素の生成が行われます。
      // これは $(document.createElememt('p')) と等価です。

      var $p = $('<p>').addClass('new_p');
      $p.addClass('hogehoge'); // さらにクラスを追加
      $p.text('こんにちは！').css({'background': '#0f0'});

      // メソッドチェーンがサポートされているので、上記は
      // $('<p>').addClass('new_p').addClass('hogehoge').text('こんにちは！');
      // のようにも書けます。

      // $main の中の末尾に $p を追加（移動）します。これで $p は DOM ツリーに追加されます。
      $main.append($p);
    }

    // 3000 ミリ秒後（3秒後）に add_images() を実行します
    setTimeout(function() {
      add_image();
    }, 3000);

    function add_image() {
      var $animals = $('.animals');
      var $li = $('<li>');
      var $img = $('<img>').attr({
        src: 'https://placeimg.com/300/300/nature',
        alt: 'a random nature image'
      }).appendTo($li);

      // class="bob" はもともと HTML に出力されている「2個目の li 要素」です
      var $bob = $animals.find('.bob');

      // $bob の直前に $li を追加（移動）します。
      $bob.before($li);
    }
  }
}(jQuery));
