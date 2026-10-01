/* 증언 페이지 공통: 제목 → 증언 여러 개(질문 + 이름 + 증언 블록) (내용은 data/메뉴/하위.js의 window.PAGE, 예: data/sohn/loca.js)
   이름 → 인물 정보 모달, 증언 블록 → 인터뷰 원문 모달(해당 지점으로 이동) */
(function () {
  var D = window.PAGE;
  function item(s) {
    var h = '<div class="say">';
    if (s.ask) h += '<p class="ask"><b>' + (D.asker || "질문자") + "</b>: " + s.ask + "</p>";
    if (s.who) {
      h += '<a class="who js-modal" href="#" data-person="' + s.who + '">' + (s.label || s.who) + "</a>" +
        '<a class="quote js-modal" href="#" data-intvw="' + s.who + '" data-find="' + (s.find || "") + '">' + s.text +
        "<small>원문 보기 — " + s.who + " 문답 →</small></a>";
    }
    return h + "</div>";
  }
  var secs = D.sections.map(function (s) {
    return '<section class="sec"><h2>' + s.title + "</h2>" + s.items.map(item).join("") + "</section>";
  }).join("");
  document.getElementById("app").innerHTML =
    '<div class="page-head"><h1 class="eyebrow">' + D.title + "</h1>" + (D.lede ? '<p class="lede">' + D.lede + "</p>" : "") + "</div>" + secs;
})();
