/* 사이트 공통 설정: 로고·메뉴·footer·메인 문구는 여기서만 고칩니다 */
window.SITE = {
  
  menu: [
    { id: "home",     name: "홈",               href: "index.html" },
    { id: "sohn",     name: "손양원 목사",       href: "sohn.html",
      side: [
        { title: "손양원 목사", href: "sohn.html", items: [{ name: "사택 위치", href: "sohn_loca.html" }, { name: "사택 경제", href: "sohn_economy.html" }, { name: "설교 현장", href: "sohn_sermon.html" }] }
      ] },
    { id: "jeong",    name: "정양순 사모",       href: "jeong.html",
      /* 좌측 메뉴(side): 이 메뉴에 속한 페이지(data-page="jeong")에 나타남. href 없는 항목은 흐리게 표시 */
      side: [
        { title: "손양원 목사 순교 이후", href: "jeong.html", items: [{ name: "애양원", href: "jeong_aeyang.html" }, { name: "경제", href: "jeong_economy.html" }] },
        { title: "정양순 사모 개척", items: [{ name: "사택 위치", href: "jeong_loca.html" }, { name: "가정예배" }, { name: "전국모금" }, { name: "에피소드", href: "jeong_episodes.html" }] }
      ] },
    { id: "timeline", name: "연대기",            href: "timeline.html" },
    { id: "people",   name: "인물",              href: "people.html" },
    { id: "archive",  name: "자료실",            href: "archive.html" }
  ],
  /* 1001 추가: 모달이 읽는 자료 위치 ({name} 자리에 이름이 들어감) */
  source: { intvw: "data/intvw/{name}.js", people: "data/people/{name}.js" },
  footer: { addr: "전남 여수 여순로 419-5", email: "pkist.net@gmail.com" },
  home: {
    eyebrow: "구술사료로 되짚는 성광교회의 시작",
    title: "정양순 사모와 성광교회 그리고 신풍교회",
    lede: "손양원 목사 순교 이후, 정양순 사모는 세상과 타협하지 않고 오직 진리 중심의 신앙 노선을 지키며 소리없이 가정 예배를 출발했고 이것이 성광교회로 발전하게 됩니다. 손양원 목사, 정양순 사모의 신앙 걸음을 지금 신풍교회가 이어가고 있습니다.",
    photo: "images/church.png",
    photoCaption: "성광교회 돌 예배당",
    /* 메인 박스 4개: 제목 / 한줄 설명 / 링크 문구 / 이동할 주소 */
    cards: [
      { title: "손양원 목사", desc: "애양원, 순교",                   more: "자세히 보기",     href: "sohn.html" },
      { title: "정양순 사모", desc: "애양원과 분리, 가정예배와 개척", more: "관련 증언 보기", href: "jeong.html" },
      { title: "성광 교회",   desc: "정양순 사모의 개척 교회",        more: "관련 증언 보기", href: "history.html?id=4" },
      { title: "신풍 교회",   desc: "예수교장로회한국총공회 소속",    more: "관련 증언 보기", href: "history.html?id=7" }
    ]
  }
};
