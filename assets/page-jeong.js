/* 정양순 사모: 사진 → 본문 → 각주 (내용은 data/jeong/index.js) */
(function () {
  var D = window.JEONG;
  function fn(t) { return t.replace(/\[(\d+)\]/g, '<sup><a href="#fn$1">$1</a></sup>'); }
  var photos = D.photos.map(function (p) {
    return '<figure><img class="zoom" src="' + p.src + '" alt=""><figcaption>' + p.cap + "</figcaption></figure>";
  }).join("");
  var story = D.story.map(function (s) {
    return "<h3>" + s.title + "</h3><p>" + s.body.map(fn).join("</p><p>") + "</p>";
  }).join("");
  var notes = D.notes.map(function (n, i) { return '<li id="fn' + (i + 1) + '">' + n + "</li>"; }).join("");
  document.getElementById("app").innerHTML =
    '<div class="page-head">' + (D.title ? '<h1 class="eyebrow">' + D.title + "</h1>" : "") + (D.lede ? '<p class="lede">' + D.lede + "</p>" : "") +
    '<div class="photos">' + photos + "</div></div>" +
    '<section class="sec story">' + story + '<ol class="fn">' + notes + "</ol></section>";
})();
