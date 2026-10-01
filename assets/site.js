/* 전 페이지 공통: header·footer 그리기 (body의 data-page로 현재 메뉴 표시) */
(function () {
  var S = window.SITE, cur = document.body.getAttribute("data-page");
  var nav = S.menu.map(function (m) {
    return '<a href="' + m.href + '"' + (m.id === cur ? ' class="on"' : "") + ">" + m.name + "</a>";
  }).join("");
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="head"><div class="wrap"><header class="top"><nav>' + nav + "</nav></header></div></div>");
  document.body.insertAdjacentHTML("beforeend",
    '<footer>주소 : ' + S.footer.addr + '<span class="sep">|</span>대표 이메일 : <a href="mailto:' +
    S.footer.email + '">' + S.footer.email + "</a></footer>");
  /* 0930 추가: 이미지 크게 보기 (class="zoom" 이미지를 누르면 크게, 아무 데나 누르면 닫힘) */
  document.addEventListener("click", function (e) {
    var box = document.querySelector(".zoom-box");
    if (box) { box.remove(); return; }
    if (e.target.classList.contains("zoom"))
      document.body.insertAdjacentHTML("beforeend", '<div class="zoom-box"><img src="' + e.target.src + '" alt=""></div>');
  });
  /* 0930 추가: 좌측 메뉴 (현재 상단 메뉴에 side가 있을 때만 그림, 내용은 data/site.js) */
  var side = (S.menu.filter(function (m) { return m.id === cur; })[0] || {}).side;
  if (side) {
    var app = document.getElementById("app"), box = document.createElement("div");
    box.className = "wrap with-side";
    box.innerHTML = '<button class="side-btn" type="button">목차 ▾</button><aside class="side">' + side.map(function (g) {
      return "<p>" + (g.href ? '<a href="' + g.href + '">' + g.title + "</a>" : g.title) + "</p>" + g.items.map(function (i) {
        return i.href ? '<a href="' + i.href + '">' + i.name + "</a>" : "<span>" + i.name + "</span>";
      }).join("");
    }).join("") + "</aside>";
    app.parentNode.insertBefore(box, app);
    app.className = ""; box.appendChild(app);
    box.firstChild.onclick = function () { box.classList.toggle("side-open"); }; /*0930 모바일 목차 열기·닫기*/
  }
})();
/* 1001 추가: 원문·인물 모달
   <a class="js-modal" href="#" data-intvw="이름" data-find="찾을 문구"> → 인터뷰 원문 (data/intvw/이름.js)
   <a class="js-modal" href="#" data-person="이름">                  → 인물 정보 (data/people/이름.js)
   어느 페이지든 붙이기만 하면 작동. 파일 위치 규칙은 data/site.js의 source */
(function () {
  var S = window.SITE;
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fn(t) { return esc(t).replace(/\[(\d+)\]/g, "<sup>$1</sup>"); } /* [1] → 각주 번호 */
  function flat(t) { return (t || "").replace(/\s+/g, " ").trim(); }
  function load(kind, name, done) { /* 한 번 불러온 자료는 다시 받지 않음 */
    var box = kind === "intvw" ? "INTVW" : "PEOPLE";
    if (window[box] && window[box][name]) return done(window[box][name]);
    var js = document.createElement("script");
    js.src = S.source[kind].replace("{name}", name);
    js.onload = function () { done(window[box] && window[box][name]); };
    js.onerror = function () { done(null); };
    document.head.appendChild(js);
  }
  function intvw(d) {
    return "<h1>" + esc(d.title) + "</h1>" + (d.note ? '<p class="doc-note">' + esc(d.note) + "</p>" : "") +
      d.sections.map(function (s, i) {
        return '<h2><span class="sec-num">' + (i + 1) + ".</span> " + esc(s.title) + "</h2>" + s.qa.map(function (x) {
          var q = x.q !== undefined;
          return '<p class="' + (q ? "q" : "a") + '"><span class="tag">' + (q ? "문" : "답") + "</span>" + esc(q ? x.q : x.a) + "</p>";
        }).join("");
      }).join("");
  }
  function step(s) { /* 시기 "1941년경(8세)" → 큰 글씨 1941년경 + 작은 글씨 (8세) / 내용 "제목 — 설명 — 설명" → 제목 + 불릿 */
    var m = s.y.match(/^([^(]*)\(([^)]*)\)(.*)$/), big = m ? m[1] + m[3] : s.y, small = m ? "(" + m[2] + ")" : "";
    if (m && !m[1].trim()) { big = m[2] + m[3]; small = ""; }
    var t = s.t.split(" — ");
    return '<li><div class="t-when"><b>' + fn(big.trim()) + "</b>" + (small ? "<small>" + fn(small) + "</small>" : "") + "</div>" +
      '<div class="t-what"><strong>' + fn(t[0]) + "</strong>" +
      t.slice(1).map(function (x) { return '<span class="t-pt">' + fn(x) + "</span>"; }).join("") + "</div></li>";
  }
  function person(d) {
    return "<h1>" + esc(d.name) + '</h1><p class="role-line">' + esc(d.group) + " · 녹취일: " + esc(d.recorded) + "</p>" +
      '<p class="lede">' + esc(d.lede) + '</p><h2>신앙 걸음</h2><ul class="timeline-list">' +
      d.steps.map(step).join("") + "</ul>" +
      (d.notes.length ? '<h2>참고</h2><div class="notes">' + d.notes.map(function (n) { return "<p>" + fn(n) + "</p>"; }).join("") + "</div>" : "");
  }
  function close() {
    var m = document.querySelector(".modal");
    if (m) m.remove();
    document.body.classList.remove("modal-open");
  }
  function show(html, find) {
    close();
    document.body.insertAdjacentHTML("beforeend",
      '<div class="modal"><div class="modal-box"><button class="modal-x" type="button" aria-label="닫기"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button><div class="modal-body">' + html + "</div></div></div>");
    document.body.classList.add("modal-open");
    var body = document.querySelector(".modal-body");
    if (!find) return;
    var ps = body.querySelectorAll("p"), f = flat(find);
    for (var i = 0; i < ps.length; i++) {
      if (flat(ps[i].textContent).indexOf(f) > -1) {
        ps[i].classList.add("hit");
        body.scrollTop = ps[i].offsetTop - body.clientHeight / 3;
        return;
      }
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.js-modal");
    if (a) {
      e.preventDefault();
      var kind = a.hasAttribute("data-intvw") ? "intvw" : "people";
      var name = a.getAttribute(kind === "intvw" ? "data-intvw" : "data-person");
      load(kind, name, function (d) {
        if (!d) return show('<p class="note">자료를 찾지 못했습니다. (' + S.source[kind].replace("{name}", name) + ")</p>");
        show(kind === "intvw" ? intvw(d) : person(d), a.getAttribute("data-find"));
      });
      return;
    }
    if (e.target.classList.contains("modal") || e.target.closest(".modal-x")) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
