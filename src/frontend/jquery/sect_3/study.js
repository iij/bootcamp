(function() {
  'use strict';

  section3_works();

  function section3_works() {
    console.log(animals_info());
    console.log(message_info());

    function animals_info() {
      var ul = document.getElementsByClassName('animals')[0];
      if (ul == null) return 'class="animals" の要素が見つかりません';
      var li_elems = ul.getElementsByTagName('li');
      if (li_elems == null) return 'li 要素が見つかりません';
      return '動物の画像は ' + li_elems.length + ' 枚あります';
    }

    function message_info() {
      var p = document.getElementsByClassName('message')[0];
      if (p == null) return 'class="message" の要素が見つかりません';
      return 'メッセージは "' + p.textContent + '" です';
    }
  }
}());
