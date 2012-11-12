// ==UserScript==
// @name         Google Reader Hide Duplicates Entries.
// @namespace    https://github.com/taiju/
// @description	 Its hide duplicates entries
// @version      0.1
// @include      http://reader.google.com/reader/*
// @include      https://reader.google.com/reader/*
// @include      http://www.google.com/reader/*
// @include      https://www.google.com/reader/*
// @include      http://www.google.co.jp/reader/*
// @include      https://www.google.co.jp/reader/*
// ==/UserScript==
(function (global) {
  'use strict';
  global.grhdetimer = 0;
  var entries_container = document.querySelector('#entries');
  entries_container.addEventListener('DOMNodeInserted', function (e) {
    if (grefdtimer) return; // timer残ってたらやめる
    global.grhdetimer = setTimeout(function () { // DOMNodeInsertedで無駄に挿入時に実行されるから、timer使って適当にごまかす
      var entries = Array.prototype.slice.call(document.querySelectorAll('.entry'));
      // URLの取得を1回で済ますためにキャッシュするのが目的
      var urls_entries = entries.map(function (entry) {
        return [entry.querySelector('.entry-original').getAttribute('href'), entry];
      });
      // urls_entriesをループで回すと、重複したURLを見ることになるので、ユニークなURLの一覧を作っておく
      var unique_urls = Object.keys(urls_entries.reduce(function (result, url_entry) {
        result[url_entry[0]] = url_entry[1];
        return result;
      }, {}));
      // 前項で作ったユニークなURLの一覧でループする
      unique_urls.forEach(function (url) {
        var founds = urls_entries.filter(function (url_entry) {
          return url_entry[0] === url;
        });
        if (founds.length > 1) {
          founds.slice(1).forEach(function (url_entry) { // 1件だけ残して、他は非表示（見た目上）にする
            // 削除したり、display:noneするとエラー吐くので苦し紛れなスタイル変更
            url_entry[1].style.height = '0';
            url_entry[1].style.borderBottom = '0';
          });
        }
      });
      global.grhdetimer = 0;
    }, 100);
  }, false);
}(this));
