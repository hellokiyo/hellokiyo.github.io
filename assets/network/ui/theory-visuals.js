/* 핵심정리의 보조 그림. 검토된 개념을 HTML/CSS로 표현하며 원문·상태·점수를 변경하지 않습니다.
   글자를 이미지로 굳히지 않아 확대·테마·모바일 줄바꿈과 화면 읽기를 지원합니다. */
(function (root) {
  "use strict";
  const charts = {
    0: {
      title: "공부는 작은 네 칸으로",
      intro: "게임의 다음 스테이지처럼 하나씩 해 보세요.",
      kind: "flow",
      steps: [
        ["단서 찾기", "키워드를 보고 정답 용어를 떠올려요."],
        ["직접 풀기", "기출 한 회차나 10문제 연습을 골라요."],
        ["이유 알기", "틀린 문제의 조건을 핵심정리에서 찾아요."],
        ["다시 풀기", "오답노트에서 같은 문제를 확인해요."],
      ],
      key: "2025년 3회차 이후 문제부터 풀고, 이전 문제로 넓혀 가세요.",
    },
    1: {
      title: "DNS와 ARP: 무엇을 알고, 무엇을 찾을까?",
      intro: "친구의 이름으로 집 주소를 찾는 일과, 같은 동네의 실제 문을 찾는 일을 구별해요.",
      kind: "compare",
      steps: [
        ["DNS · 이름 → IP", "www.example.com 같은 이름으로 IP 주소를 찾아요."],
        ["ARP · IPv4 → MAC", "같은 링크에서 IPv4 주소에 맞는 MAC 주소를 찾아요."],
      ],
      key: "다른 네트워크로 보낼 때는 먼 목적지의 MAC이 아니라 다음 홉(보통 게이트웨이)의 MAC을 알아냅니다.",
      question: "도메인 이름을 IP 주소로 바꾸는 것은?",
      answer: "DNS. IPv4 주소로 MAC 주소를 알아내는 것은 ARP입니다.",
    },
    2: {
      title: "OSI 7계층: 택배가 지나가는 일곱 층",
      intro:
        "위쪽은 사람이 쓰는 서비스, 아래쪽은 실제 전달 방법이에요. 계층은 역할을 나눈 약속입니다.",
      kind: "stack",
      steps: [
        ["7 · 응용", "웹·DNS 등 서비스를 이용해요."],
        ["6 · 표현", "표현 형식·암호화·압축을 다뤄요."],
        ["5 · 세션", "대화를 만들고 유지·종료해요."],
        ["4 · 전송", "TCP / UDP · 세그먼트(TCP), 데이터그램(UDP)"],
        ["3 · 네트워크", "IP 주소 · 패킷 · 라우터"],
        ["2 · 데이터 링크", "MAC 주소 · 프레임 · L2 스위치"],
        ["1 · 물리", "비트 · 전기/빛 신호 · 리피터/허브"],
      ],
      key: "IP·라우터는 3층, MAC·프레임·L2 스위치는 2층. 실제 장비는 여러 계층 기능을 가질 수 있어요.",
    },
    3: {
      addresses: true,
      title: "서브넷: 큰 동네를 작은 동네로 나누기",
      intro:
        "192.168.10.0/26을 한 동네라고 생각해 보세요. IPv4 32비트 중 앞 26비트는 동네, 뒤 6비트는 동네 안 번호예요.",
      kind: "flow",
      steps: [
        [".0 · 동네 이름", "네트워크 주소: 장비에 주지 않아요."],
        [".1 ~ .62 · 집", "일반적인 장비에 줄 수 있는 62개 주소예요."],
        [".63 · 모두에게", "브로드캐스트 주소: 전체 알림용이에요."],
      ],
      key: "남은 6비트 → 2⁶ = 64주소 → 보통 호스트 64−2 = 62개. 다음 동네는 .64부터예요. /31·/32는 별도 예외입니다.",
      extra: {
        title: "chmod 754: 세 사람에게 줄 열쇠",
        kind: "compare",
        steps: [
          ["소유자 · 7", "읽기 4 + 쓰기 2 + 실행 1 = rwx"],
          ["그룹 · 5", "읽기 4 + 실행 1 = r-x"],
          ["그 밖 · 4", "읽기 4 = r--"],
        ],
      },
      question: "/26의 일반적인 호스트 주소는 몇 개일까요?",
      answer: "62개입니다. 주소 전체 64개와 장비에 할당할 수 있는 주소 62개를 구별하세요.",
    },
    4: {
      title: "Linux 폴더 정리: 만들기 → 지우기 → 이름 바꾸기",
      intro:
        "명령을 길게 외우기 전에 어떤 일을 하는지 연결해 보세요. 이 그림은 설명이며 실제 명령을 실행하지 않아요.",
      kind: "flow",
      steps: [
        ["만들기 · mkdir", "mkdir backup → backup 폴더를 만들어요."],
        ["안까지 지우기 · rm -rf", "rm -rf old_backup → 하위 내용까지 확인 없이 삭제해요."],
        ["이름 바꾸기 · mv", "mv backup backup_new → 같은 위치에서 이름을 바꿔요."],
      ],
      key: "rmdir은 빈 디렉터리만 지웁니다. rm의 -r은 하위까지, -f는 확인 없이 강제 처리하는 옵션이에요. 실제 자료로 연습하지 마세요.",
    },
    5: {
      title: "ACK는 ‘잘 받았어!’라는 답장",
      intro: "택배를 보낸 뒤 받았다는 답장을 기다리는 방식으로 오류 제어를 떠올려 보세요.",
      kind: "compare",
      steps: [
        ["Stop-and-Wait", "하나 보냄 → ACK 기다림 → 다음 하나. 쉽지만 기다리는 시간이 길어요."],
        ["Go-Back-N", "여러 개 전송. 손실/오류가 나면 그 지점부터 뒤의 것까지 다시 보내요."],
        ["Selective Repeat", "여러 개 전송. 빠지거나 오류 난 것만 골라 다시 보내요."],
      ],
      key: "‘하나 보내고 대기’는 Stop-and-Wait, ‘이후 모두 재전송’은 Go-Back-N, ‘그것만 재전송’은 Selective Repeat입니다.",
      extra: {
        title: "DHCP: 새 기기가 주소를 빌리는 네 번의 대화",
        kind: "flow",
        steps: [
          ["Discover", "기기: 주소를 줄 서버 있나요?"],
          ["Offer", "서버: 이 주소를 제안해요."],
          ["Request", "기기: 그 주소를 쓰고 싶어요."],
          ["ACK", "서버: 사용을 승인해요."],
        ],
      },
      question: "잃어버린 것만 골라 다시 보내는 방식은?",
      answer: "Selective Repeat ARQ. 뒤의 프레임까지 함께 다시 보내는 Go-Back-N과 구별하세요.",
    },
    6: {
      title: "비슷해 보여도 역할이 달라요",
      intro: "같은 단어가 나와도 질문의 조건을 다시 확인해요.",
      kind: "compare",
      steps: [
        ["VLAN · 논리적으로 나누기", "한 스위치 안에서도 브로드캐스트 영역을 나눠요."],
        ["STP · 루프 막기", "이중화된 L2 경로에서 논리적인 루프를 방지해요."],
        ["VTP · VLAN 정보 공유", "지원 장비에서 VLAN 정보를 관리·전달하는 프로토콜이에요."],
      ],
      key: "VLAN을 나누는 것, VLAN 정보를 공유하는 것, L2 루프를 막는 것은 서로 다른 역할입니다.",
    },
    7: {
      title: "복습은 한 바퀴씩",
      intro: "한 번 읽었다고 끝내지 말고 기억을 꺼내 보세요.",
      kind: "flow",
      steps: [
        ["먼저 보기", "핵심 개념을 짧게 읽어요."],
        ["가리고 풀기", "답을 보지 않고 골라요."],
        ["이유 말하기", "왜 그 답인지 내 말로 설명해요."],
        ["다시 만나기", "모름·헷갈림을 골라 복습해요."],
      ],
      key: "오늘의 학습은 끝난 뒤 ‘추가 학습’으로 계속할 수 있어요. 기록은 이 브라우저에 남습니다.",
    },
    8: {
      title: "시험 문제는 세 바퀴로",
      intro: "한 문제에 오래 붙잡히지 않는 연습이에요.",
      kind: "flow",
      steps: [
        ["1바퀴 · 아는 것", "확실한 문제부터 풀어요."],
        ["2바퀴 · 헷갈린 것", "조건을 다시 읽고 틀린 보기를 지워요."],
        ["3바퀴 · 빈칸 확인", "남은 시간과 미응답을 확인해요."],
      ],
      key: "답 번호의 모양이나 빈도보다 지문의 조건과 정답 근거로 판단하세요.",
    },
    9: {
      title: "마지막 점검: 숫자는 용도와 짝지어요",
      intro: "포트 번호만 떼어 외우기보다 어떤 서비스의 문인지 떠올려요.",
      kind: "compare",
      steps: [
        ["웹 · HTTP 80 / HTTPS 443", "일반적인 기본 포트. HTTPS는 TLS로 통신을 보호해요."],
        ["이름 찾기 · DNS 53", "UDP뿐 아니라 TCP도 사용해요."],
        ["주소 빌리기 · DHCP 67 / 68", "IPv4 DHCP 서버 UDP 67, 클라이언트 UDP 68입니다."],
      ],
      key: "시험 직전에는 새 범위를 크게 늘리기보다 오답과 혼동한 조건을 확인해요.",
    },
    10: {
      title: "Cisco 명령 모드는 방을 옮기듯",
      intro:
        "프롬프트 모양이 지금 어느 모드인지 알려 줍니다. 실제 장비/시험 환경에 따라 확인하세요.",
      kind: "flow",
      steps: [
        ["> 사용자 모드", "enable로 특권 모드로 이동해요."],
        ["# 특권 모드", "configure terminal로 전역 설정에 들어가요."],
        ["(config)# 전역 설정", "interface로 특정 인터페이스를 골라요."],
        ["(config-if)# 인터페이스", "선택한 인터페이스의 설정을 바꿔요."],
      ],
      key: "명령의 뜻과 함께 어느 모드에서 실행하는지도 확인하세요. 이 화면은 명령을 실행하지 않습니다.",
    },
    11: {
      title: "정답을 믿기 전에 근거를 확인해요",
      intro: "책에 적힌 답과 누군가의 설명은 확인 상태가 다를 수 있어요.",
      kind: "flow",
      steps: [
        ["문제 원문", "보기·그림·서버 버전이 빠지지 않았는지 봐요."],
        ["답의 근거", "공식 자료와 명령 설명을 확인해요."],
        ["검토 상태", "확인 완료와 학습용 풀이를 구별해요."],
      ],
      key: "2026년 4회차 정답·해설은 학습용 풀이이며 공식 정답표 대조 미완료 상태입니다.",
    },
  };
  function render(id) {
    const chart = charts[String(id)];
    if (!chart) return "";
    const esc = root.PageUI.escapeHTML;
    const steps = (c) =>
      `<div class="concept-cells concept-${c.kind}">${c.steps.map(([label, text], i) => `<div class="concept-cell"><span class="concept-step" aria-hidden="true">${i + 1}</span><strong>${esc(label)}</strong><p>${esc(text)}</p></div>`).join("")}</div>`;
    const addresses = chart.addresses
      ? `<figure class="address-picture"><figcaption>64개의 칸: 첫 칸과 마지막 칸은 집에 주지 않아요.</figcaption><div class="address-dots" aria-hidden="true">${Array.from({ length: 64 }, (_, i) => `<span class="${i === 0 ? "address-edge" : i === 63 ? "address-edge" : ""}">${i === 0 ? "N" : i === 63 ? "B" : ""}</span>`).join("")}</div><p>N = 네트워크 주소 · 가운데 62칸 = 호스트 · B = 브로드캐스트</p></figure>`
      : "";
    return `<section class="theory-visual" aria-label="그림으로 이해하기"><div class="concept-heading"><span class="label-tag">그림으로 먼저 이해해요</span><a href="#theory-text" data-scroll-target="theory-text" class="text-button">본문으로 ↓</a></div><h2>${esc(chart.title)}</h2><p class="concept-intro">${esc(chart.intro)}</p>${addresses}${steps(chart)}${chart.extra ? `<h3>${esc(chart.extra.title)}</h3>${steps(chart.extra)}` : ""}<p class="concept-key"><strong>꼭 기억해요</strong> ${esc(chart.key)}</p>${chart.question ? `<details class="concept-check"><summary>잠깐! 스스로 확인하기 · ${esc(chart.question)}</summary><p>${esc(chart.answer)}</p></details>` : ""}</section>`;
  }
  const api = { render };
  root.TheoryVisuals = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
