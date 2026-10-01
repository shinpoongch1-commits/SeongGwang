/* 메인: 소개 + 박스 4개 (내용은 data/site.js의 home) */
(function () {
  var H = window.SITE.home;
  var cards = H.cards.map(function (c) {
    return '<a class="card" href="' + c.href + '"><strong>' + c.title + "</strong><span>" + c.desc + "</span><em>" + c.more + " →</em></a>";
  }).join("");
  document.getElementById("app").innerHTML =
    '<div class="hero"><div><p class="eyebrow">' + H.eyebrow + "</p><h1>" + H.title + '</h1><p class="lede">' + H.lede +
    '</p></div><figure><img src="' + H.photo + '" alt="' + H.photoCaption + '"><figcaption>' + H.photoCaption +
    "</figcaption></figure></div>" + '<div class="cards">' + cards + "</div>";
})();
