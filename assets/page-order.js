/* 착공·준공 순서 (1007 v10: 2열 + 병합 칸 + 눈여겨볼 증언) — 근거 자료 표(메인) + 제목 옆 [연도별] [증언별] 보기 전환(그 자리에서 바뀜), 이름·설명은 data의 PAGE.views
   증언 칩 → 증언 카드: 원문(data/intvw/이름.js)에서 find가 든 답과 바로 앞 질문을 찾아 보여 줌, "원문 보기 →"는 기존 원문 모달 */
(function () {
  var T = window.PAGE.table;
  if (!T) return;
  function chip(x) {   /* 1009: 연혁·문헌 칩(g)도 세 번째 값에 사진 경로를 주면 누를 수 있음(회색 그대로) */
    if (typeof x === "string") return '<span class="yt-sub">' + x.slice(1) + "</span>";
    if (x[0] === "p" || (x[0] === "g" && x[2])) return '<a href="#" class="ch ' + x[0] + ' go photo js-photo" data-src="' + x[2] + '">' + x[1] + "</a>";
    if (!x[2]) return '<span class="ch ' + x[0] + '">' + x[1] + "</span>";
    return '<a href="#" class="ch ' + x[0] + ' go js-card" data-who="' + x[2] + '" data-find="' + x[3] + '"><span class="t">' + x[1] + "</span></a>";
  }
  /* 표: 격자에 칸마다 자리(grid-row/column)를 직접 줌 → 병합 칸(spans)은 여러 줄을 차지. 모바일은 같은 순서로 세로로 쌓임 */
  var Y = T.rows.map(function (r) { return r.y; }), sp = T.spans || [];
  function at(row, col, n) { return ' style="grid-row:' + row + (n > 1 ? " / span " + n : "") + ";grid-column:" + col + '"'; }
  var h = '<div class="yt"><span class="yt-y"' + at(1, 1) + "></span>" + T.cols.map(function (c, i) { return '<b class="yt-h"' + at(1, i + 2) + ">" + c + "</b>"; }).join("");
  T.rows.forEach(function (r, k) {
    var row = k + 2;
    h += '<div class="yt-y"' + at(row, 1) + "><b>" + r.y + "</b>" + (r.ref ? "<small>" + r.ref + "</small>" : "") + "</div>";
    r.c.forEach(function (c, i) {
      var g = sp.filter(function (s) { return s.col === i && Y.indexOf(s.from) <= k && k <= Y.indexOf(s.to); })[0];
      if (g) {
        if (Y.indexOf(g.from) === k) h += '<div class="yt-c yt-span' + (g.mid ? " mid" : "") + (g.clamp ? " clamp" : "") + '" data-col="' + T.cols[i] + '"' + at(row, i + 2, Y.indexOf(g.to) - k + 1) + '><b class="yt-st">' + g.title + "</b>" + g.chips.map(chip).join("") + "</div>";
        return;
      }
      h += '<div class="yt-c' + (c.length ? "" : " empty") + '" data-col="' + T.cols[i] + '"' + at(row, i + 2) + ">" + c.map(chip).join("") + "</div>";
    });
  });
  h += "</div>";
  var lg = '<p class="yt-lg"><span class="ch s">증언</span><span class="ch g">연혁·문헌</span><span class="ch p">사진</span></p>';
  var N = window.PAGE.notable;   // 눈여겨볼 증언 상자
  if (N) lg = '<div class="nb"><b class="nb-t">' + N.title + "</b>" + N.groups.map(function (g) {
    return '<div class="nb-g"><b>' + g.h + "</b>" + (g.d ? '<p class="desc">' + g.d + "</p>" : "") + '<div class="nb-c">' + g.chips.map(chip).join("") + "</div></div>";
  }).join("") + "</div>" + lg;
  var V = window.PAGE.views;   // 보기 전환: [연도별] [증언별] — 누르면 그 자리에서 내용만 바뀜
  document.querySelector(".page-head").insertAdjacentHTML("afterend", '<section class="sec"><div class="vt" role="tablist">' +
    V.map(function (v, i) { return '<button type="button" role="tab" data-v="' + i + '" aria-selected="' + !i + '"' + (i ? "" : ' class="on"') + ">" + v.name + "</button>"; }).join("") +
    '</div><p class="desc vt-desc">' + V[0].desc + '</p><div id="vy">' + lg + h +
    '<div class="notes">' + T.notes.map(function (n) { return '<p class="note">' + n + "</p>"; }).join("") + '</div></div><div id="qs" hidden></div></section>');
  var box = document.getElementById("qs"), gs = document.querySelectorAll("details.grp");   // 증언 묶음을 증언별 보기 칸으로 옮김(처음엔 모두 접힘)
  for (var i = 0; i < gs.length; i++) { box.appendChild(gs[i]); gs[i].open = false; }
  var bs = document.querySelectorAll(".vt button"), panes = [document.getElementById("vy"), box];
  for (var b = 0; b < bs.length; b++) bs[b].addEventListener("click", function () {
    var k = +this.getAttribute("data-v");
    for (var j = 0; j < bs.length; j++) { bs[j].classList.toggle("on", j === k); bs[j].setAttribute("aria-selected", String(j === k)); panes[j].hidden = j !== k; }
    document.querySelector(".vt-desc").textContent = V[k].desc;
  });

  var S = window.SITE, asker = window.PAGE.asker || "질문자";
  function card(who, find) {
    var d = window.INTVW[who], q = "", a = "", next = false;   // 문구가 질문에 있으면 그 질문 + 바로 다음 답
    d.sections.forEach(function (s) { var last = ""; s.qa.forEach(function (x) {
      if (a) return;
      if (x.q !== undefined) { if (!next && x.q.indexOf(find) > -1) { q = x.q; next = true; } last = x.q; return; }
      if (next || x.a.indexOf(find) > -1) { if (!next) q = last; a = x.a; }
    }); });
    var m = '<div class="modal"><div class="modal-box card-box"><button class="modal-x" type="button" aria-label="닫기">×</button><div class="modal-body">' +
      '<div class="say"><a class="who js-modal" href="#" data-person="' + who + '">' + who + "</a>" +
      (q ? '<p class="ask"><b>' + asker + "</b>: " + q + "</p>" : "") +
      '<a class="quote js-modal" href="#" data-intvw="' + who + '" data-find="' + find + '">' + (a ? "“" + a + "”" : "질문 대목") + "<small>원문 보기 →</small></a></div></div></div></div>";
    document.body.insertAdjacentHTML("beforeend", m);
    document.body.classList.add("modal-open");
  }
  document.addEventListener("click", function (e) {   // 기록 칩 → 사진 + 칩 글을 설명으로
    var p = e.target.closest("a.js-photo");
    if (!p) return;
    e.preventDefault();
    document.body.insertAdjacentHTML("beforeend", '<div class="modal"><div class="modal-box card-box"><button class="modal-x" type="button" aria-label="닫기">×</button><div class="modal-body">' +
      '<figure class="photo"><img src="' + p.getAttribute("data-src") + '" alt="" onerror="this.outerHTML=\'<p class=&quot;photo-miss&quot;>사진 파일을 찾지 못했습니다: ' + p.getAttribute("data-src") + '</p>\'"><figcaption>' + p.textContent + "</figcaption></figure></div></div></div>");
    document.body.classList.add("modal-open");
  });
  document.addEventListener("click", function (e) {
    var c = e.target.closest("a.js-card");
    if (!c) return;
    e.preventDefault();
    var who = c.getAttribute("data-who"), find = c.getAttribute("data-find");
    if (window.INTVW && window.INTVW[who]) return card(who, find);
    var js = document.createElement("script");
    js.src = S.source.intvw.replace("{name}", who);
    js.onload = function () { if (window.INTVW && window.INTVW[who]) card(who, find); };
    document.head.appendChild(js);
  });
})();
