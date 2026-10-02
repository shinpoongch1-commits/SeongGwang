/* 증언 페이지 공통: 제목 → 증언 여러 개(질문 + 이름 + 증언 블록) (내용은 data/메뉴/하위.js의 window.PAGE, 예: data/sohn/loca.js)
   이름 → 인물 정보 모달, 증언 블록 → 인터뷰 원문 모달(해당 지점으로 이동)
   질문은 원고 자리 그대로 두고, 질문 하나 아래(다음 질문 전까지) 증언자를 이름 가나다순으로 정렬
   같은 증언자가 이어지면 이름은 한 번만, 블록만 이어 붙임 */
(function () {
  var D = window.PAGE;
  function quote(s) {
    return '<a class="quote js-modal" href="#" data-intvw="' + s.who + '" data-find="' + (s.find || "") + '">' + s.text +
      "<small>원문 보기 →</small></a>";
  }
  function items(list) {
    var groups = [], h = "";
    list.forEach(function (s, i) { if (!i || s.ask) groups.push({ ask: s.ask, list: [] }); groups[groups.length - 1].list.push(s); });
    groups.forEach(function (g) {
      if (g.ask) h += '<p class="ask"><b>' + (D.asker || "질문자") + "</b>: " + g.ask + "</p>";
      g.list.sort(function (a, b) { return (a.who || "").localeCompare(b.who || "", "ko"); });
      g.list.forEach(function (s, i) {
        if (i && g.list[i - 1].who === s.who) { h = h.slice(0, -6) + quote(s) + "</div>"; return; }   // 같은 증언자 연속
        if (s.who) h += '<div class="say"><a class="who js-modal" href="#" data-person="' + s.who + '">' + (s.label || s.who) + "</a>" + quote(s) + "</div>";
      });
    });
    return h;
  }
  var secs = D.sections.map(function (s) {
    return '<section class="sec"><h2>' + s.title + "</h2>" + items(s.items) + "</section>";
  }).join("");
  document.getElementById("app").innerHTML =
    '<div class="page-head"><h1 class="eyebrow">' + D.title + "</h1>" + (D.lede ? '<p class="lede">' + D.lede + "</p>" : "") + (D.note ? '<p class="note">' + D.note + "</p>" : "") + "</div>" + secs;
})();
