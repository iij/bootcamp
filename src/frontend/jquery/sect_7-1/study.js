(function($) {
  'use strict';

  var Util = {
    clamp: function(val, min, max) {
      if (val < min) return min;
      if (max < val) return max;
      return val;
    },
    sprintf: function(format, args) {
      var p = 1, params = arguments;
      return format.replace(/%./g, function(m) {
        if (m === '%%') return '%';
        if (m === '%s') return params[p++];
        return m;
      });
    }
  };

  $(function() {
    jquery_sample1();
  });

  function jquery_sample1() {
    var $head = $(document.head);
    var $animals = $('.animals');

    // CSS を JavaScript から動的に追加
    addDynamicStyles();

    // 操作用のボタン類を追加
    addController();

    // イベント処理のサンプル
    addEventSample();

    function addDynamicStyles() {
      var styles = [
        '.controller { padding: 4px; border: 1px solid #999; background: #eee; }',
        '.controller li { list-style: none; }',
        '.controller label input { margin-left: 4px; }',
        '.controller .error_message { display: block; color: red; font-size: 14px; }',
        '.eventSample { padding: 4px; border: 1px solid #f00; background: #cff; }',
        '.eventSample .sample-input { width: 500px; height: 100px; }',
        '.eventSample .sample-output { min-height: 1em; border: 1px solid #090; background: #cfc; }'
      ];
      var $style = $('<style id="custom-style">').text(styles.join('\n'));
      $head.append($style);
    }

    function addController() {
      var $controller = $('<ul class="controller">');

      // width の入力欄
      var $li_width = $('<li class="item-input_width">').appendTo($controller);
      var $label_width = $('<label>').text('width(100〜500)').appendTo($li_width);
      var $input_width = $('<input class="input_width">').attr({
        type: 'text'
      }).appendTo($label_width);

      // height の入力欄
      var $li_height = $('<li class="item-input_height">').appendTo($controller);
      var $label_height = $('<label>').text('height(100〜500)').appendTo($li_height);
      var $input_height = $('<input class="input_height">').attr({
        type: 'text'
      }).appendTo($label_height);

      // prepend ボタン
      var $li_prepend = $('<li class="item-prepend">').appendTo($controller);
      var $button_prepend = $('<button>').text('リストの先頭に追加する').appendTo($li_prepend);
      var $error_message = $('<span class="error_message">').appendTo($li_prepend);

      // ボタンがクリックされたら
      $button_prepend.on('click', function() {
        var width = $input_width.val();
        var height = $input_height.val();

        var error = '';
        if (!/^[0-9]+$/.test(width)) error += 'width は整数値で入力してください。';
        if (!/^[0-9]+$/.test(height)) error += 'height は整数値で入力してください。';

        $error_message.text(error);

        // エラーがある場合
        if (error !== '') {
          $error_message.css({'display': 'block'});
          return;
        }

        // エラーがなければエラーメッセージを非表示にする
        $error_message.css({'display': 'none'});

        // 100以下は100に、500以上は500として扱う（例）
        width = Util.clamp(Number(width), 100, 500);
        height = Util.clamp(Number(height), 100, 500);

        prependImage(width, height);
      });

      function prependImage(width, height) {
        var src = Util.sprintf('https://placekitten.com/%s/%s', width, height);
        var $li = $('<li>');
        var $img = $('<img>').attr({src: src, alt: ''}).appendTo($li);
        // class="animals" の先頭に新たな画像を追加する
        $li.prependTo($animals);
      }

      // <ul class="controller"> を <ul class="animals"> の直前に追加
      $animals.before($controller);
    }

    function addEventSample() {
      var $wrapper = $('<div class="eventSample">');
      var $textarea = $('<textarea class="sample-input">').appendTo($wrapper);
      var $output = $('<pre class="sample-output">').appendTo($wrapper);

      $textarea.on('keyup', function() {
        var value = $textarea.val();
        $output.html(value);
      });

      $animals.before($wrapper);
    }
  }
}(jQuery));
