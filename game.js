const screens = {
  intro: document.getElementById("introScreen"),
  setup: document.getElementById("setupScreen"),
  investment: document.getElementById("firstInvestmentScreen"),
  game: document.getElementById("gameScreen"),
  ending: document.getElementById("endingScreen")
};

const state = {
  mayorName: "박수빈",
  cityName: "행복시",
  money: 500000000,
  debt: 500000000,
  initialDebt: 500000000,
  economy: 45,
  happiness: 55,
  growth: 25,
  population: 200,
  seasonIndex: 0,
  secondsLeft: 300,
  paused: false,
  selectedField: "",
  eventIndex: 0,
  currentEvent: null,
  timerId: null
};

const seasons = [
  { name: "봄", theme: "벚꽃이 피고 새 입주민이 몰려옵니다.", color: "#ff9eb7" },
  { name: "여름", theme: "더위와 비 사이에서 도시가 바쁘게 움직입니다.", color: "#5da9e9" },
  { name: "가을", theme: "수확과 축제가 도시의 표정을 바꿉니다.", color: "#f28f45" },
  { name: "겨울", theme: "추위 속에서 마지막 평가가 다가옵니다.", color: "#98dfc6" }
];

const dialogueLines = [
  "(내가 이 도시의 시장이 된다고...?)",
  "지원자가 아무도 없었습니다.",
  "당신을 신도시의 시장으로 임명하겠습니다.",
  "당신에게 1년을 드리겠습니다.",
  "이 도시를 성공시키십시오.",
  "실패하면 도시는 폐쇄됩니다."
];

const events = {
  "봄": [
    {
      mark: "산",
      title: "기업 입주 제안",
      description: "새 기업들이 사무실과 공장을 찾고 있습니다. 얼마나 투자하시겠습니까?",
      options: [
        { label: "산업단지를 크게 확장한다", cost: 350000000, economy: 13, happiness: -2, growth: 12 },
        { label: "조금만 확장한다", cost: 160000000, economy: 7, happiness: 0, growth: 6 },
        { label: "이번에는 거절한다", cost: 0, economy: -4, happiness: 1, growth: -2 }
      ]
    },
    {
      mark: "축",
      title: "벚꽃 축제 준비",
      description: "시민들이 봄 축제를 기대합니다. 축제 규모를 정해 주세요.",
      options: [
        { label: "크게 개최한다", cost: 220000000, economy: 5, happiness: 12, growth: 4 },
        { label: "작게 개최한다", cost: 90000000, economy: 2, happiness: 6, growth: 2 },
        { label: "개최하지 않는다", cost: 0, economy: 1, happiness: -7, growth: -1 }
      ]
    },
    {
      mark: "학",
      title: "학교 부족",
      description: "새 가족이 늘어나면서 학교가 부족해졌습니다.",
      options: [
        { label: "학교를 여러 곳 건설한다", cost: 300000000, economy: -2, happiness: 12, growth: 9 },
        { label: "학교를 1곳만 건설한다", cost: 130000000, economy: -1, happiness: 6, growth: 4 },
        { label: "건설하지 않는다", cost: 0, economy: 1, happiness: -10, growth: -4 }
      ]
    },
    {
      mark: "불",
      title: "산불 위험",
      description: "건조한 날씨 때문에 산불 위험이 커졌습니다.",
      options: [
        { label: "소방 인력을 크게 늘린다", cost: 240000000, economy: -1, happiness: 10, growth: 2 },
        { label: "순찰만 늘린다", cost: 90000000, economy: 0, happiness: 5, growth: 1 },
        { label: "대응하지 않는다", cost: 0, economy: 1, happiness: -12, growth: -5, instantFail: "초기 진화가 늦어져 산불이 주거지 가까이 번졌습니다. 정부는 안전 관리 실패로 도시 운영을 즉시 중단했습니다." }
      ]
    }
  ],
  "여름": [
    {
      mark: "비",
      title: "폭우 경보",
      description: "하천 수위가 빠르게 오르고 있습니다.",
      options: [
        { label: "배수 시설을 대폭 보강한다", cost: 320000000, economy: -1, happiness: 11, growth: 6 },
        { label: "위험 구역만 보강한다", cost: 140000000, economy: 0, happiness: 5, growth: 3 },
        { label: "예산을 아낀다", cost: 0, economy: 2, happiness: -13, growth: -6, instantFail: "폭우가 쏟아진 뒤 저지대가 침수되었습니다. 시민 대피가 늦어지며 시장은 즉시 해임되었습니다." }
      ]
    },
    {
      mark: "열",
      title: "폭염 발생",
      description: "노약자와 야외 근로자를 위한 대책이 필요합니다.",
      options: [
        { label: "무더위 쉼터를 많이 연다", cost: 180000000, economy: -1, happiness: 10, growth: 2 },
        { label: "쉼터를 일부만 연다", cost: 70000000, economy: 0, happiness: 5, growth: 1 },
        { label: "홍보 문자만 보낸다", cost: 0, economy: 1, happiness: -8, growth: -2 }
      ]
    },
    {
      mark: "물",
      title: "물 부족",
      description: "인구 증가로 물 사용량이 예상보다 빠르게 늘었습니다.",
      options: [
        { label: "정수 시설을 확장한다", cost: 260000000, economy: 2, happiness: 9, growth: 7 },
        { label: "절수 장비를 보급한다", cost: 100000000, economy: 1, happiness: 5, growth: 3 },
        { label: "물 사용을 제한한다", cost: 0, economy: -1, happiness: -9, growth: -3 }
      ]
    },
    {
      mark: "관",
      title: "관광객 증가",
      description: "도시 홍보가 입소문을 타면서 관광객이 늘었습니다.",
      options: [
        { label: "관광 코스를 크게 개발한다", cost: 250000000, economy: 11, happiness: 3, growth: 7 },
        { label: "안내소만 설치한다", cost: 90000000, economy: 5, happiness: 2, growth: 3 },
        { label: "그대로 둔다", cost: 0, economy: 2, happiness: -3, growth: 0 }
      ]
    }
  ],
  "가을": [
    {
      mark: "농",
      title: "풍년",
      description: "농산물 생산량이 크게 늘었습니다. 판매 전략이 필요합니다.",
      options: [
        { label: "유통센터를 크게 짓는다", cost: 240000000, economy: 12, happiness: 4, growth: 7 },
        { label: "직거래 장터를 연다", cost: 80000000, economy: 5, happiness: 5, growth: 3 },
        { label: "민간에 맡긴다", cost: 0, economy: 2, happiness: -2, growth: 0 }
      ]
    },
    {
      mark: "태",
      title: "태풍 접근",
      description: "강한 바람과 비가 예보되었습니다.",
      options: [
        { label: "도시 전체를 사전 점검한다", cost: 300000000, economy: -1, happiness: 10, growth: 5 },
        { label: "주요 시설만 점검한다", cost: 120000000, economy: 0, happiness: 5, growth: 2 },
        { label: "지켜본다", cost: 0, economy: 2, happiness: -12, growth: -6, instantFail: "태풍 대비를 하지 않은 밤, 하천이 넘치고 도로가 끊겼습니다. 정부는 즉시 도시 운영 중단을 명령했습니다." }
      ]
    },
    {
      mark: "축",
      title: "가을 축제",
      description: "주민과 관광객이 함께 즐길 행사를 열 수 있습니다.",
      options: [
        { label: "도시 대표 축제로 키운다", cost: 260000000, economy: 8, happiness: 11, growth: 5 },
        { label: "동네 축제로 연다", cost: 100000000, economy: 3, happiness: 6, growth: 2 },
        { label: "열지 않는다", cost: 0, economy: 1, happiness: -8, growth: -1 }
      ]
    },
    {
      mark: "인",
      title: "인구 증가",
      description: "새 아파트 입주가 시작되며 인구가 늘고 있습니다.",
      options: [
        { label: "교통과 복지를 동시에 확충한다", cost: 330000000, economy: 3, happiness: 12, growth: 10 },
        { label: "버스 노선만 늘린다", cost: 130000000, economy: 1, happiness: 6, growth: 4 },
        { label: "기존 시설로 버틴다", cost: 0, economy: 2, happiness: -10, growth: -3 }
      ]
    }
  ],
  "겨울": [
    {
      mark: "눈",
      title: "폭설",
      description: "도로와 학교 주변에 눈이 쌓이고 있습니다.",
      options: [
        { label: "제설 장비를 대량 투입한다", cost: 220000000, economy: -1, happiness: 10, growth: 3 },
        { label: "주요 도로만 치운다", cost: 80000000, economy: 0, happiness: 5, growth: 1 },
        { label: "자연 해동을 기다린다", cost: 0, economy: 2, happiness: -12, growth: -4, instantFail: "출근길 도로가 얼어붙고 학교 주변 사고가 잇따랐습니다. 정부는 겨울 안전 실패로 도시를 폐쇄했습니다." }
      ]
    },
    {
      mark: "병",
      title: "독감 유행",
      description: "병원과 보건소가 바빠졌습니다.",
      options: [
        { label: "무료 예방접종을 크게 시행한다", cost: 240000000, economy: -1, happiness: 12, growth: 2, resultScene: { title: "보건소 앞의 인사", text: "예방접종을 마친 아이가 작은 목소리로 말했습니다. \"시장님 고마워요. 이제 학교에 갈 수 있어요.\"" } },
        { label: "저소득층 아이부터 지원한다", cost: 90000000, economy: 0, happiness: 6, growth: 1, resultScene: { title: "아이의 편지", text: "다음 날 시장실에 삐뚤빼뚤한 편지가 도착했습니다. \"아프지 않게 도와줘서 고맙습니다.\"" } },
        { label: "개인 예방에 맡긴다", cost: 0, economy: 1, happiness: -13, growth: -3, instantFail: "독감이 학교와 복지시설로 빠르게 퍼졌습니다. 보건 대응 실패로 긴급 운영 중단 명령이 내려졌습니다." }
      ]
    },
    {
      mark: "난",
      title: "난방비 증가",
      description: "주민들이 겨울 난방비 부담을 호소합니다.",
      options: [
        { label: "난방비를 넓게 지원한다", cost: 280000000, economy: -2, happiness: 13, growth: 2 },
        { label: "저소득층만 지원한다", cost: 110000000, economy: 0, happiness: 7, growth: 1, resultScene: { title: "따뜻한 밤", text: "오래된 임대주택 창문에 불이 켜졌습니다. 한 주민이 난방비 고지서 옆에 감사 쪽지를 남겼습니다." } },
        { label: "지원하지 않는다", cost: 0, economy: 2, happiness: -11, growth: -2 }
      ]
    },
    {
      mark: "평",
      title: "연말 평가 준비",
      description: "정부 평가단이 곧 방문합니다. 마지막 정비를 선택하세요.",
      options: [
        { label: "도시 전 분야를 정비한다", cost: 300000000, economy: 5, happiness: 8, growth: 8 },
        { label: "핵심 자료만 준비한다", cost: 90000000, economy: 2, happiness: 3, growth: 4 },
        { label: "있는 그대로 평가받는다", cost: 0, economy: 0, happiness: -3, growth: 0 }
      ]
    }
  ]
};

const extraEvents = {
  "봄": [
    {
      mark: "길",
      title: "통학로 정비",
      description: "아이들이 다니는 길에 횡단보도와 가로등이 부족합니다.",
      options: [
        { label: "통학로 전체를 정비한다", cost: 170000000, economy: 0, happiness: 9, growth: 5 },
        { label: "위험 구간만 정비한다", cost: 70000000, economy: 0, happiness: 5, growth: 2 },
        { label: "안내 표지만 세운다", cost: 0, economy: 1, happiness: -5, growth: -1 }
      ]
    },
    {
      mark: "도",
      title: "도서관 요청",
      description: "주민들이 공부하고 쉴 수 있는 작은 도서관을 원합니다.",
      options: [
        { label: "복합 도서관을 만든다", cost: 190000000, economy: 1, happiness: 10, growth: 6 },
        { label: "작은 도서관을 만든다", cost: 80000000, economy: 0, happiness: 5, growth: 3 },
        { label: "나중으로 미룬다", cost: 0, economy: 1, happiness: -6, growth: -1 }
      ]
    },
    {
      mark: "꽃",
      title: "가로수 심기",
      description: "새 도로가 조금 삭막해 보입니다. 거리 환경을 꾸밀 수 있습니다.",
      options: [
        { label: "가로수와 화단을 많이 만든다", cost: 120000000, economy: 1, happiness: 8, growth: 4 },
        { label: "가로수만 조금 심는다", cost: 50000000, economy: 0, happiness: 4, growth: 2 },
        { label: "그대로 둔다", cost: 0, economy: 1, happiness: -4, growth: -1 }
      ]
    }
  ],
  "여름": [
    {
      mark: "전",
      title: "전력 사용 급증",
      description: "에어컨 사용이 늘면서 전력 공급이 불안정해졌습니다.",
      options: [
        { label: "변전 설비를 보강한다", cost: 180000000, economy: 4, happiness: 7, growth: 5 },
        { label: "공공시설부터 절전한다", cost: 60000000, economy: 2, happiness: 3, growth: 2 },
        { label: "주의 방송만 한다", cost: 0, economy: 1, happiness: -7, growth: -2, instantFail: "대정전이 발생했습니다. 병원과 교통망이 멈추며 시민 안전이 크게 위협받아 시장직이 즉시 해임되었습니다." }
      ]
    },
    {
      mark: "수",
      title: "수영장 민원",
      description: "아이들과 가족들이 여름에 갈 수 있는 물놀이 시설을 요청합니다.",
      options: [
        { label: "공공 수영장을 짓는다", cost: 170000000, economy: 3, happiness: 10, growth: 4 },
        { label: "임시 물놀이장을 연다", cost: 70000000, economy: 1, happiness: 5, growth: 2 },
        { label: "운영하지 않는다", cost: 0, economy: 1, happiness: -6, growth: -1 }
      ]
    },
    {
      mark: "청",
      title: "하천 청소",
      description: "비가 온 뒤 하천 주변에 쓰레기가 쌓였습니다.",
      options: [
        { label: "하천 공원까지 정비한다", cost: 130000000, economy: 1, happiness: 9, growth: 5, resultScene: { title: "깨끗해진 산책로", text: "청소가 끝난 저녁, 주민들이 하천 사진과 함께 감사 편지를 보냈습니다. \"시장님, 아이와 걷는 길이 다시 좋아졌어요.\"" } },
        { label: "청소 인력만 보낸다", cost: 50000000, economy: 0, happiness: 4, growth: 2 },
        { label: "자원봉사에 맡긴다", cost: 0, economy: 1, happiness: -4, growth: -1 }
      ]
    }
  ],
  "가을": [
    {
      mark: "시",
      title: "전통시장 개장",
      description: "상인들이 지역 농산물을 팔 수 있는 시장 공간을 원합니다.",
      options: [
        { label: "상설 시장을 만든다", cost: 170000000, economy: 10, happiness: 5, growth: 5 },
        { label: "주말 장터를 연다", cost: 60000000, economy: 5, happiness: 3, growth: 2 },
        { label: "허가하지 않는다", cost: 0, economy: -3, happiness: -4, growth: -1 }
      ]
    },
    {
      mark: "예",
      title: "문화 공연 제안",
      description: "예술 단체가 광장에서 무료 공연을 열고 싶다고 합니다.",
      options: [
        { label: "공연 주간을 지원한다", cost: 120000000, economy: 4, happiness: 9, growth: 3 },
        { label: "하루 공연만 지원한다", cost: 40000000, economy: 2, happiness: 4, growth: 1 },
        { label: "지원하지 않는다", cost: 0, economy: 1, happiness: -5, growth: 0 }
      ]
    },
    {
      mark: "버",
      title: "버스 혼잡",
      description: "출퇴근 시간 버스가 너무 붐빈다는 불만이 늘었습니다.",
      options: [
        { label: "버스와 정류장을 확충한다", cost: 160000000, economy: 3, happiness: 9, growth: 6 },
        { label: "출퇴근 시간만 증차한다", cost: 60000000, economy: 1, happiness: 5, growth: 2 },
        { label: "현행 유지한다", cost: 0, economy: 1, happiness: -7, growth: -2 }
      ]
    }
  ],
  "겨울": [
    {
      mark: "빛",
      title: "겨울 조명 거리",
      description: "상가들이 겨울 거리 조명으로 방문객을 늘리고 싶어 합니다.",
      options: [
        { label: "조명 거리를 크게 조성한다", cost: 130000000, economy: 7, happiness: 7, growth: 4 },
        { label: "중심가만 장식한다", cost: 50000000, economy: 3, happiness: 4, growth: 2 },
        { label: "장식하지 않는다", cost: 0, economy: 0, happiness: -4, growth: 0 }
      ]
    },
    {
      mark: "온",
      title: "온기 쉼터",
      description: "추운 날씨에 잠시 쉴 수 있는 공공 쉼터가 필요합니다.",
      options: [
        { label: "쉼터를 여러 곳 운영한다", cost: 120000000, economy: -1, happiness: 10, growth: 3 },
        { label: "청사 로비만 개방한다", cost: 30000000, economy: 0, happiness: 4, growth: 1 },
        { label: "운영하지 않는다", cost: 0, economy: 1, happiness: -8, growth: -1 }
      ]
    },
    {
      mark: "새",
      title: "새해 준비",
      description: "주민들이 새해를 맞아 도시의 방향을 알고 싶어 합니다.",
      options: [
        { label: "새해 비전 행사를 연다", cost: 100000000, economy: 4, happiness: 8, growth: 5 },
        { label: "온라인 발표만 한다", cost: 30000000, economy: 2, happiness: 3, growth: 2 },
        { label: "발표하지 않는다", cost: 0, economy: 0, happiness: -5, growth: -1 }
      ]
    }
  ]
};

Object.entries(extraEvents).forEach(([season, seasonEvents]) => {
  events[season].push(...seasonEvents);
});

const moreSeasonEvents = {
  "봄": [
    {
      mark: "청",
      title: "청년 창업 공간",
      description: "청년들이 작은 가게와 회사를 시작할 수 있는 공간을 요청합니다.",
      options: [
        { label: "창업 허브를 조성한다", cost: 160000000, economy: 10, happiness: 4, growth: 7 },
        { label: "공유 사무실만 연다", cost: 60000000, economy: 5, happiness: 2, growth: 3 },
        { label: "민간에 맡긴다", cost: 0, economy: -2, happiness: -3, growth: -1 }
      ]
    },
    {
      mark: "의",
      title: "동네 의원 부족",
      description: "새 입주민들이 가까운 병원과 약국이 부족하다고 말합니다.",
      options: [
        { label: "보건센터를 크게 세운다", cost: 180000000, economy: 1, happiness: 11, growth: 5 },
        { label: "의원 유치를 지원한다", cost: 70000000, economy: 1, happiness: 6, growth: 2 },
        { label: "기다려 본다", cost: 0, economy: 1, happiness: -8, growth: -2, instantFail: "응급 환자가 멀리 있는 병원으로 이송되다 위험에 빠졌습니다. 의료 공백 책임으로 도시 사업이 중단되었습니다." }
      ]
    },
    {
      mark: "주",
      title: "주차 공간 민원",
      description: "상가 주변 주차 공간이 부족해 주민 불만이 생겼습니다.",
      options: [
        { label: "공영주차장을 건설한다", cost: 150000000, economy: 5, happiness: 7, growth: 5 },
        { label: "노상 주차만 정비한다", cost: 50000000, economy: 2, happiness: 3, growth: 2 },
        { label: "단속만 강화한다", cost: 0, economy: 1, happiness: -6, growth: -1 }
      ]
    }
  ],
  "여름": [
    {
      mark: "음",
      title: "음식물 쓰레기 증가",
      description: "더운 날씨에 음식물 쓰레기 냄새 민원이 늘었습니다.",
      options: [
        { label: "수거 시스템을 개선한다", cost: 130000000, economy: 1, happiness: 9, growth: 4 },
        { label: "수거 횟수만 늘린다", cost: 50000000, economy: 0, happiness: 5, growth: 2 },
        { label: "홍보만 진행한다", cost: 0, economy: 1, happiness: -5, growth: -1 }
      ]
    },
    {
      mark: "야",
      title: "야간 치안 요청",
      description: "여름밤 외출이 늘면서 가로등과 순찰 요청이 많아졌습니다.",
      options: [
        { label: "가로등과 순찰을 모두 늘린다", cost: 150000000, economy: 0, happiness: 10, growth: 4 },
        { label: "가로등부터 설치한다", cost: 60000000, economy: 0, happiness: 5, growth: 2 },
        { label: "신고 대응만 한다", cost: 0, economy: 1, happiness: -7, growth: -2, instantFail: "야간 범죄가 연달아 발생했습니다. 시민들이 대규모로 떠나며 정부가 시장 권한을 회수했습니다." }
      ]
    },
    {
      mark: "냉",
      title: "냉방 취약 시설",
      description: "작은 어린이집과 복지관의 냉방 시설이 낡았습니다.",
      options: [
        { label: "취약 시설 전체를 교체한다", cost: 160000000, economy: -1, happiness: 11, growth: 3 },
        { label: "가장 낡은 곳부터 교체한다", cost: 60000000, economy: 0, happiness: 6, growth: 1 },
        { label: "선풍기만 지원한다", cost: 0, economy: 1, happiness: -4, growth: -1 }
      ]
    }
  ],
  "가을": [
    {
      mark: "길",
      title: "자전거 도로",
      description: "선선한 날씨에 자전거 이용자가 늘며 전용 도로 요구가 생겼습니다.",
      options: [
        { label: "자전거 도로망을 만든다", cost: 170000000, economy: 3, happiness: 8, growth: 7 },
        { label: "강변 구간만 만든다", cost: 70000000, economy: 1, happiness: 4, growth: 3 },
        { label: "표지판만 세운다", cost: 0, economy: 1, happiness: -4, growth: -1 }
      ]
    },
    {
      mark: "관",
      title: "전망대 제안",
      description: "언덕 위에 도시를 내려다볼 수 있는 전망대를 만들자는 제안이 나왔습니다.",
      options: [
        { label: "전망대와 카페 거리를 만든다", cost: 180000000, economy: 9, happiness: 5, growth: 6 },
        { label: "작은 전망대만 만든다", cost: 70000000, economy: 4, happiness: 3, growth: 3 },
        { label: "자연 그대로 둔다", cost: 0, economy: -1, happiness: 1, growth: -1 }
      ]
    },
    {
      mark: "안",
      title: "어린이 안전 교육",
      description: "학교와 주민센터에서 재난 안전 교육을 해 달라는 요청이 있습니다.",
      options: [
        { label: "도시 전체 안전 캠페인을 연다", cost: 120000000, economy: 0, happiness: 9, growth: 3 },
        { label: "학교 중심으로 진행한다", cost: 40000000, economy: 0, happiness: 5, growth: 1 },
        { label: "자료만 배포한다", cost: 0, economy: 1, happiness: -3, growth: 0 }
      ]
    }
  ],
  "겨울": [
    {
      mark: "제",
      title: "제설 창고 확충",
      description: "제설 장비와 염화칼슘을 보관할 공간이 부족합니다.",
      options: [
        { label: "제설 기지를 만든다", cost: 150000000, economy: 0, happiness: 8, growth: 5 },
        { label: "임시 창고를 빌린다", cost: 50000000, economy: 0, happiness: 4, growth: 2 },
        { label: "현재 창고로 버틴다", cost: 0, economy: 1, happiness: -6, growth: -2, instantFail: "제설 물자가 부족해 주요 도로가 며칠 동안 막혔습니다. 물류와 응급 대응이 멈추며 조기 실패가 확정되었습니다." }
      ]
    },
    {
      mark: "상",
      title: "상가 매출 감소",
      description: "추위 때문에 거리 상권 매출이 떨어졌습니다.",
      options: [
        { label: "겨울 상권 지원금을 푼다", cost: 170000000, economy: 9, happiness: 6, growth: 4 },
        { label: "홍보 행사만 지원한다", cost: 60000000, economy: 4, happiness: 3, growth: 2 },
        { label: "시장에 맡긴다", cost: 0, economy: -4, happiness: -3, growth: -1 }
      ]
    },
    {
      mark: "집",
      title: "노후 주택 단열",
      description: "오래된 임대주택 주민들이 추위를 호소합니다.",
      options: [
        { label: "단열 공사를 지원한다", cost: 180000000, economy: -1, happiness: 12, growth: 4 },
        { label: "창문 보수만 지원한다", cost: 70000000, economy: 0, happiness: 6, growth: 2 },
        { label: "담요만 배포한다", cost: 0, economy: 1, happiness: -5, growth: -1 }
      ]
    }
  ]
};

Object.entries(moreSeasonEvents).forEach(([season, seasonEvents]) => {
  events[season].push(...seasonEvents);
});

Object.values(events).flat().forEach((event) => {
  event.options.forEach((option) => {
    option.cost = Math.round(option.cost * 0.55);
  });
});

const won = new Intl.NumberFormat("ko-KR");
let dialogueIndex = 0;
let selectedLoan = 500000000;
let selectedInvestment = "";
let selectedAvatar = "1";

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function formatEok(amount) {
  const eok = amount / 100000000;
  if (Math.abs(eok) >= 10 || Number.isInteger(eok)) return `${Math.round(eok)}억`;
  return `${eok.toFixed(1)}억`;
}

function clampIncome(amount) {
  return Math.max(10000000, Math.min(200000000, Math.round(amount)));
}

function applyChange(change) {
  const canPay = state.money >= change.cost;
  if (!canPay && change.cost > 0) {
    state.debt += change.cost - state.money;
    state.money = 0;
  } else {
    state.money -= change.cost;
  }

  state.economy = clamp(state.economy + change.economy);
  state.happiness = clamp(state.happiness + change.happiness);
  state.growth = clamp(state.growth + change.growth);
  const populationChange = Math.round((Math.max(0, change.growth) * 9) + (Math.max(0, change.happiness) * 4) + Math.max(0, state.growth - 25) * 0.8);
  const populationLoss = Math.round((Math.max(0, -change.growth) * 5) + (Math.max(0, -change.happiness) * 3));
  state.population = Math.max(80, state.population + populationChange - populationLoss);

  const seasonalIncome = 18000000 + (state.economy * 620000) + (state.growth * 440000);
  state.money += clampIncome(seasonalIncome);
  state.debt += Math.round(state.debt * 0.006);
  renderStats();
}

function renderStats() {
  document.getElementById("moneyValue").textContent = formatEok(state.money);
  document.getElementById("cashBadgeValue").textContent = formatEok(state.money);
  document.getElementById("happyValue").textContent = Math.round(state.happiness);
  document.getElementById("growthValue").textContent = Math.round(state.growth);
  document.getElementById("debtValue").textContent = formatEok(state.debt);
  document.getElementById("economyMeter").value = state.economy;
  document.getElementById("happyMeter").value = state.happiness;
  document.getElementById("growthMeter").value = state.growth;
  document.getElementById("debtMeter").value = clamp((state.debt / Math.max(state.initialDebt, 1)) * 100);
  document.getElementById("mapLabel").textContent = `인구 ${won.format(Math.round(state.population))}명, 발전도 ${Math.round(state.growth)}`;
}

function renderTimer() {
  const minutes = String(Math.floor(state.secondsLeft / 60)).padStart(2, "0");
  const seconds = String(state.secondsLeft % 60).padStart(2, "0");
  document.getElementById("seasonTimer").textContent = `${minutes}:${seconds}`;
}

function renderSeason() {
  const season = seasons[state.seasonIndex];
  document.getElementById("seasonName").textContent = season.name;
  document.getElementById("eventSeason").textContent = `${season.name} 사건`;
  document.documentElement.style.setProperty("--pink", season.color);
  renderTimer();
}

function renderSeasonWrapUp(season) {
  const total = events[season].length;
  state.currentEvent = null;
  document.getElementById("eventMark").textContent = "✓";
  document.getElementById("eventTitle").textContent = `${season} 주요 사건 ${total}개 완료`;
  document.getElementById("eventDescription").textContent = `이번 계절의 중요한 사건 ${total}개를 모두 처리했습니다. 남은 시간에는 빚을 갚거나 다음 계절로 넘어갈 수 있습니다.`;
  document.getElementById("eventSeason").textContent = `${season} 마무리`;

  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  const button = document.createElement("button");
  button.className = "choice-btn";
  button.type = "button";
  button.innerHTML = `
    <span>
      <strong>다음 계절로 넘어간다</strong>
      <small>현재 계절의 사건은 다시 반복되지 않습니다.</small>
    </span>
    <em>이동</em>
  `;
  button.addEventListener("click", advanceSeason);
  choices.appendChild(button);
}

function renderEvent() {
  clearMapResultScene();
  const season = seasons[state.seasonIndex].name;
  const list = events[season];
  if (state.eventIndex >= list.length) {
    renderSeasonWrapUp(season);
    return;
  }

  state.currentEvent = list[state.eventIndex];
  document.getElementById("eventMark").textContent = state.currentEvent.mark;
  document.getElementById("eventTitle").textContent = state.currentEvent.title;
  document.getElementById("eventDescription").textContent = state.currentEvent.description;
  document.getElementById("eventSeason").textContent = `${season} 사건 ${state.eventIndex + 1}/${list.length}`;

  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  state.currentEvent.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    if (option.instantFail) button.classList.add("danger-choice");
    button.type = "button";
    button.innerHTML = `
      <span>
        <strong>${index + 1}. ${option.label}</strong>
        <small>경제 ${signed(option.economy)} / 만족도 ${signed(option.happiness)} / 발전도 ${signed(option.growth)}${option.instantFail ? " / 조기 실패 위험" : ""}</small>
      </span>
      <em>${option.cost ? formatEok(option.cost) : "0원"}</em>
    `;
    button.addEventListener("click", () => {
      applyChange(option);
      if (option.instantFail) {
        triggerInstantFailure(option.instantFail);
        return;
      }
      state.eventIndex += 1;
      if (option.resultScene) {
        renderResultScene(option.resultScene);
        return;
      }
      renderEvent();
    });
    choices.appendChild(button);
  });
}

function renderResultScene(scene) {
  state.currentEvent = null;
  showMapResultScene(scene);
  document.getElementById("eventMark").textContent = "✓";
  document.getElementById("eventTitle").textContent = "선택 결과 확인";
  document.getElementById("eventDescription").textContent = "도시 지도에 나타난 결과를 확인한 뒤 다음 사건으로 넘어가세요.";
  document.getElementById("eventSeason").textContent = "선택 결과";

  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  const button = document.createElement("button");
  button.className = "choice-btn result-continue";
  button.type = "button";
  button.innerHTML = `
    <span>
      <strong>도시 운영을 계속한다</strong>
      <small>결과를 확인했습니다. 다음 사건으로 넘어갑니다.</small>
    </span>
    <em>계속</em>
  `;
  button.addEventListener("click", () => {
    clearMapResultScene();
    renderEvent();
  });
  choices.appendChild(button);
}

function showMapResultScene(scene) {
  const resultScene = document.getElementById("mapResultScene");
  resultScene.innerHTML = `
    <strong>${scene.title}</strong>
    <span>${scene.text}</span>
  `;
  resultScene.classList.add("is-visible");
}

function clearMapResultScene() {
  const resultScene = document.getElementById("mapResultScene");
  resultScene.classList.remove("is-visible");
  resultScene.innerHTML = "";
}

function triggerInstantFailure(message) {
  clearInterval(state.timerId);
  state.money = 0;
  state.happiness = clamp(state.happiness - 25);
  state.growth = clamp(state.growth - 20);
  renderStats();
  document.getElementById("finalScore").textContent = "0";
  document.getElementById("finalEconomy").textContent = Math.round(state.economy);
  document.getElementById("finalHappy").textContent = Math.round(state.happiness);
  document.getElementById("finalGrowth").textContent = Math.round(state.growth);
  document.getElementById("finalDebt").textContent = formatEok(state.debt);
  document.getElementById("endingTitle").textContent = "조기 실패";
  document.getElementById("endingMessage").textContent = message;
  renderFireworks(false);
  showScreen("ending");
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function startGame() {
  state.seasonIndex = 0;
  state.secondsLeft = 300;
  state.paused = false;
  state.eventIndex = 0;
  document.getElementById("cityTitle").textContent = state.cityName;
  document.getElementById("mayorBadge").textContent = `${state.mayorName} 시장`;
  showScreen("game");
  renderSeason();
  renderStats();
  renderEvent();

  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    if (state.paused) return;
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 0) advanceSeason();
    renderTimer();
  }, 1000);
}

function advanceSeason() {
  const bonus = 30000000 + (state.economy * 800000) + (state.growth * 520000);
  state.money += clampIncome(bonus);
  state.debt += Math.round(state.debt * 0.018);
  state.seasonIndex += 1;
  state.eventIndex = 0;

  if (state.seasonIndex >= seasons.length) {
    finishGame();
    return;
  }

  state.secondsLeft = 300;
  renderSeason();
  renderStats();
  renderEvent();
}

function finishGame() {
  clearInterval(state.timerId);
  let autoRepaid = 0;
  if (state.debt > 0 && state.money >= state.debt) {
    autoRepaid = state.debt;
    state.money -= state.debt;
    state.debt = 0;
    renderStats();
  }
  const baseAverage = (state.economy + state.happiness + state.growth) / 3;
  const weakestStat = Math.min(state.economy, state.happiness, state.growth);
  const strongestStat = Math.max(state.economy, state.happiness, state.growth);
  const balancePenalty = Math.max(0, strongestStat - weakestStat - 22) * 0.55;
  const debtPenalty = state.debt > 0 ? Math.min(55, Math.round((state.debt / Math.max(state.initialDebt, 1)) * 38)) : 0;
  const lowStatPenalty = Math.max(0, 55 - weakestStat) * 0.45;
  const cashAfterDebtBonus = state.debt <= 0 ? Math.min(8, Math.floor(state.money / 250000000)) : 0;
  const rawScore = clamp(Math.round((baseAverage * 0.82) + (weakestStat * 0.18) + cashAfterDebtBonus - debtPenalty - balancePenalty - lowStatPenalty));
  const perfectStats = state.economy >= 95 && state.happiness >= 95 && state.growth >= 95;
  const score = state.debt <= 0 && perfectStats ? 100 : Math.min(99, rawScore);
  const failed = state.money < 0 || state.debt > 0 || score < 90;
  const excellent = !failed && score === 100;

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalEconomy").textContent = Math.round(state.economy);
  document.getElementById("finalHappy").textContent = Math.round(state.happiness);
  document.getElementById("finalGrowth").textContent = Math.round(state.growth);
  document.getElementById("finalDebt").textContent = formatEok(state.debt);

  if (excellent) {
    document.getElementById("endingTitle").textContent = "최고 시장";
    document.getElementById("endingMessage").textContent = `${autoRepaid ? `남은 빚 ${formatEok(autoRepaid)}을 자동 상환했습니다. ` : ""}당신은 대한민국 최고의 시장입니다. 도시는 크게 성장했고 빚도 모두 갚았습니다.`;
  } else if (failed) {
    document.getElementById("endingTitle").textContent = "실패 엔딩";
    document.getElementById("endingMessage").textContent = "정부는 도시 폐쇄를 결정했습니다. 다음 도전에서는 빚과 균형을 더 조심해 보세요.";
  } else {
    document.getElementById("endingTitle").textContent = "성공 엔딩";
    document.getElementById("endingMessage").textContent = `${autoRepaid ? `남은 빚 ${formatEok(autoRepaid)}을 자동 상환했습니다. ` : ""}도시는 안정적으로 성장했습니다. 시민들은 새로운 신도시의 내일을 기대하고 있습니다.`;
  }
  renderFireworks(!failed);
  showScreen("ending");
}

function renderFireworks(active) {
  const ending = document.getElementById("endingScreen");
  ending.querySelectorAll(".fireworks").forEach((node) => node.remove());
  ending.classList.toggle("has-fireworks", active);
  if (!active) return;

  const fireworks = document.createElement("div");
  fireworks.className = "fireworks";
  fireworks.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 28; i += 1) {
    const spark = document.createElement("span");
    spark.style.setProperty("--x", `${8 + Math.random() * 84}%`);
    spark.style.setProperty("--y", `${8 + Math.random() * 50}%`);
    spark.style.setProperty("--delay", `${Math.random() * 1.6}s`);
    spark.style.setProperty("--hue", `${20 + Math.random() * 300}`);
    fireworks.appendChild(spark);
  }
  ending.appendChild(fireworks);
}

function resetGame() {
  Object.assign(state, {
    mayorName: "박수빈",
    cityName: "행복시",
    money: 500000000,
    debt: 500000000,
    initialDebt: 500000000,
    economy: 45,
    happiness: 55,
    growth: 25,
    population: 200,
    seasonIndex: 0,
    secondsLeft: 300,
    paused: false,
    selectedField: "",
    eventIndex: 0,
    currentEvent: null
  });
  selectedLoan = 500000000;
  selectedInvestment = "";
  selectedAvatar = "1";
  dialogueIndex = 0;
  renderDialogueLine();
  renderFireworks(false);
  updateSelectedAvatar("1");
  document.getElementById("posterStep").style.display = "block";
  document.getElementById("dialogueBox").classList.remove("is-active");
  document.getElementById("confirmInvestmentBtn").disabled = true;
  document.querySelectorAll(".investment-card").forEach((card) => card.classList.remove("is-selected"));
  showScreen("intro");
}

document.getElementById("skipIntroBtn").addEventListener("click", () => showScreen("setup"));

function renderDialogueLine() {
  const text = dialogueLines[dialogueIndex];
  const dialogueText = document.getElementById("dialogueText");
  dialogueText.textContent = text;
  dialogueText.classList.toggle("is-thought", text.startsWith("("));
  updateDialogueProgress();
}

function advanceDialogue() {
  dialogueIndex += 1;
  if (dialogueIndex >= dialogueLines.length) {
    showScreen("setup");
    return;
  }
  renderDialogueLine();
}

function updateDialogueProgress() {
  const dotWrap = document.querySelector(".dialogue-dots");
  if (dotWrap.children.length !== dialogueLines.length) {
    dotWrap.innerHTML = "";
    dialogueLines.forEach(() => dotWrap.appendChild(document.createElement("span")));
  }
  dotWrap.querySelectorAll("span").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === dialogueIndex);
  });
}

document.getElementById("nextDialogueBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  advanceDialogue();
});

document.getElementById("posterStep").addEventListener("click", () => {
  document.getElementById("posterStep").style.display = "none";
  document.getElementById("dialogueBox").classList.add("is-active");
  renderDialogueLine();
});

document.getElementById("dialogueBox").addEventListener("click", advanceDialogue);

function updateSelectedAvatar(avatar) {
  selectedAvatar = avatar;
  const portrait = document.getElementById("mayorPortrait");
  portrait.classList.remove("avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5");
  portrait.classList.add(`avatar-${avatar}`);
  document.querySelectorAll(".candidate-option").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.avatar === avatar);
  });
}

document.querySelectorAll(".candidate-option").forEach((button) => {
  button.addEventListener("click", () => {
    updateSelectedAvatar(button.dataset.avatar);
  });
});

document.querySelectorAll(".loan-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".loan-chip").forEach((item) => item.classList.remove("is-selected"));
    chip.classList.add("is-selected");
    selectedLoan = Number(chip.dataset.loan);
    document.getElementById("customLoan").value = "";
  });
});

document.getElementById("customLoan").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  if (value > 0) {
    selectedLoan = value * 100000000;
    document.querySelectorAll(".loan-chip").forEach((item) => item.classList.remove("is-selected"));
  }
});

document.getElementById("setupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.mayorName = document.getElementById("mayorName").value.trim() || "이름없는";
  state.cityName = document.getElementById("cityName").value.trim() || "새빛시";
  state.money = selectedLoan;
  state.debt = selectedLoan;
  state.initialDebt = selectedLoan;
  showScreen("investment");
});

document.querySelectorAll(".investment-card").forEach((card) => {
  card.addEventListener("click", () => {
    selectedInvestment = card.dataset.field;
    document.querySelectorAll(".investment-card").forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    document.getElementById("confirmInvestmentBtn").disabled = false;
  });
});

document.getElementById("firstBudget").addEventListener("input", (event) => {
  document.getElementById("firstBudgetOutput").textContent = formatEok(Number(event.target.value) * 50000000);
});

document.getElementById("confirmInvestmentBtn").addEventListener("click", () => {
  const budget = Number(document.getElementById("firstBudget").value) * 50000000;
  const effects = {
    education: { economy: 2, happiness: 10, growth: 7 },
    agriculture: { economy: 8, happiness: 5, growth: 6 },
    industry: { economy: 12, happiness: -2, growth: 10 }
  };
  const effect = effects[selectedInvestment];
  applyChange({ cost: budget, ...effect });
  startGame();
});

document.getElementById("loanBtn").addEventListener("click", () => {
  state.money += 300000000;
  state.debt += 300000000;
  state.happiness = clamp(state.happiness - 1);
  renderStats();
});

document.getElementById("repayBtn").addEventListener("click", () => {
  const amount = Math.min(300000000, state.money, state.debt);
  state.money -= amount;
  state.debt -= amount;
  if (amount > 0) state.happiness = clamp(state.happiness + 1);
  renderStats();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  state.paused = !state.paused;
  document.getElementById("pauseBtn").textContent = state.paused ? "계속하기" : "일시정지";
});

document.getElementById("restartBtn").addEventListener("click", resetGame);
