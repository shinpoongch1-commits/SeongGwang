/* 설명 페이지 공통 (손양원 목사·정양순 사모·성광교회, 앞으로 신풍교회): 제목 → 사진 → 본문 → 각주 (내용은 data/메뉴/index.js의 window.STORY)
   번호 체계 1. → (1) → ① : 번호는 데이터에 직접 씁니다 (코드는 번호를 만들지 않음)
   - 큰 제목: story의 title에 "1. 제목"
   - 본문 한 줄이 "(1) "로 시작하면 중간 제목, "① "로 시작하면 작은 제목 → 그 아래 단락은 제목을 따라 들여쓰기
   사진(photos)·각주(notes)는 없으면 생략. 손양원 목사의 표는 assets/page-sohn.js가 아래에 덧붙임 */
(function () {
  var D = window.STORY;
  function fn(t) { return t.replace(/\[(\d+)\]/g, '<sup><a href="#fn$1">$1</a></sup>'); }
  function body(lines) {
    var lv = 1;
    return lines.map(function (t) {
      if (/^\(\d+\) /.test(t)) { lv = 2; return '<h4 class="lv2">' + fn(t) + "</h4>"; }
      if (/^[①-⑳] /.test(t)) { lv = 3; return '<h5 class="lv3">' + fn(t) + "</h5>"; }
      return "<p" + (lv > 1 ? ' class="lv' + lv + '"' : "") + ">" + fn(t) + "</p>";
    }).join("");
  }
  var photos = (D.photos || []).map(function (p) {
    return '<figure><img class="zoom" src="' + p.src + '" alt=""><figcaption>' + p.cap + "</figcaption></figure>";
  }).join("");
  var story = D.story.map(function (s) {
    return "<h3>" + fn(s.title) + "</h3>" + body(s.body);
  }).join("");
  var notes = (D.notes || []).map(function (n, i) { return '<li id="fn' + (i + 1) + '">' + n + "</li>"; }).join("");
  document.getElementById("app").innerHTML =
    '<div class="page-head">' + (D.title ? '<h1 class="eyebrow">' + D.title + "</h1>" : "") + (D.lede ? '<p class="lede">' + D.lede + "</p>" : "") +
    (photos ? '<div class="photos">' + photos + "</div>" : "") + "</div>" +
    '<section class="sec story">' + story + (notes ? '<ol class="fn">' + notes + "</ol>" : "") + "</section>";
})();
