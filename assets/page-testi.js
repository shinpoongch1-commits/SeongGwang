/* 증언 페이지 공통: 제목 → 증언 여러 개(질문 + 이름 + 증언 블록) (내용은 data/메뉴/하위.js의 window.PAGE, 예: data/sohn/loca.js)
   이름 → 인물 정보 모달, 증언 블록 → 인터뷰 원문 모달(해당 지점으로 이동)
   질문은 원고 자리 그대로 두고, 질문 하나 아래(다음 질문 전까지) 증언자를 이름 가나다순으로 정렬
   같은 증언자가 이어지면 이름은 한 번만, 블록만 이어 붙임
   (1006) 묶음 머리 { group, desc, ask } → 눌러서 접고 펼침(처음엔 모두 접힘) / 묶음 안내 desc·확인 note / 대화 세트 { who, set: [ {ask, text, find}, {note} ] } → 이름 한 번 + 질문·증언이 한 덩어리 */
(function () {
  var D = window.PAGE, asker = D.asker || "질문자";
  function quote(s) {
    return '<a class="quote js-modal" href="#" data-intvw="' + s.who + '" data-find="' + (s.find || "") + '">' + s.text +
      "<small>원문 보기 →</small></a>";
  }
  function ask(t) { return '<p class="ask"><b>' + asker + "</b>: " + t + "</p>"; }
  function who(s) { return '<a class="who js-modal" href="#" data-person="' + s.who + '">' + (s.label || s.who) + "</a>"; }
  function set(s) {   // 대화 세트: 질문과 답이 오간 순서 그대로 한 덩어리
    return '<div class="say">' + who(s) + s.set.map(function (x) {
      if (x.note) return '<p class="note">' + x.note + "</p>";
      return (x.ask ? ask(x.ask) : "") + quote({ who: s.who, text: x.text, find: x.find });
    }).join("") + "</div>";
  }
  function items(list) {
    var groups = [], h = "";
    list.forEach(function (s, i) { if (!i || s.ask) groups.push({ ask: s.ask, list: [] }); groups[groups.length - 1].list.push(s); });
    groups.forEach(function (g) {
      if (g.ask) h += ask(g.ask);
      g.list.sort(function (a, b) { return (a.who || "").localeCompare(b.who || "", "ko"); });
      g.list.forEach(function (s, i) {
        if (s.set) { h += set(s); return; }
        var p = g.list[i - 1];
        if (p && !p.set && p.who === s.who) { h = h.slice(0, -6) + quote(s) + "</div>"; return; }   // 같은 증언자 연속
        if (s.who) h += '<div class="say">' + who(s) + quote(s) + "</div>";
      });
    });
    return h;
  }
  var g = 0;   // 묶음 머리가 있으면 접기·펼치기: 처음엔 모두 접힘
  var secs = D.sections.map(function (s) {
    if (s.group) return (g++ ? "</details>" : "") + '<details class="grp"' + (s.id ? ' id="' + s.id + '"' : "") + '><summary><h2>' + s.group + "</h2></summary>" +
      (s.desc ? '<p class="desc">' + s.desc + "</p>" : "") + (s.ask ? ask(s.ask) : "");
    return '<section class="sec"' + (s.id ? ' id="' + s.id + '"' : "") + ">" + (s.title ? "<h2>" + s.title + "</h2>" : "") + (s.desc ? '<p class="desc">' + s.desc + "</p>" : "") +
      items(s.items) + (s.note ? '<p class="note">' + s.note + "</p>" : "") + "</section>";
  }).join("") + (g ? "</details>" : "");
  document.getElementById("app").innerHTML =
    '<div class="page-head"><h1 class="eyebrow">' + D.title + "</h1>" + (D.lede ? '<p class="lede">' + D.lede + "</p>" : "") + (D.note ? '<p class="note">' + D.note + "</p>" : "") + "</div>" + secs;
})();
