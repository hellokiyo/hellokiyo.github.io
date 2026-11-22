/* CC BY 4.0 공개 교재의 번역·수정 연습. 실제 시험 기출이 아닙니다.
   원저자: Charles R. Severance, Introduction to Networking (2015), 전자판.
   책임: 원문 위치·이용 조건·수정 내역과 시험별 독립 ID를 제공. 상태는 소유하지 않습니다.
   원문/허가 근거: https://www.net-intro.com/ 및 아래 전자판 p.ii.
   한국어 번역·보기 다듬기·해설 추가: 합격루틴, CC BY 4.0. */
(function (root) {
  "use strict";
  const source = {
    title: "Introduction to Networking",
    author: "Charles R. Severance",
    url: "https://do1.dr-chuck.net/net-intro/EN_us/net-intro.pdf",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    changes: "한국어 번역·보기 표현 수정·해설 추가 (합격루틴)",
    checkedAt: "2026-11-16",
  };
  const examIds = [
    "ccna",
    "information-equipment-craftsman",
    "network-manager-1",
    "internet-security-2",
    "information-security-engineer",
    "information-security-industrial",
  ];
  // key, 원문 절/문항, PDF 실제 페이지(1부터), 분류, 질문, 보기, 정답, 추가 해설.
  const rows = [
    [
      "model",
      "2.7 Q1",
      30,
      "네트워크 구조",
      "복잡한 네트워크 문제를 해결할 때 계층 모델을 사용하는 주된 이유는?",
      [
        "작은 모형을 만들어 풍동 실험을 하기 위해",
        "문제 해결의 시작을 늦추기 위해",
        "문제를 독립적으로 해결할 수 있는 작은 문제로 나누기 위해",
        "홍보 자료를 만들기 위해",
      ],
      2,
      "계층마다 책임을 나누면 각 부분을 별도로 설계하고 확인할 수 있습니다. 모델은 실제 장비를 축소한 물건이라는 뜻이 아닙니다.",
    ],
    [
      "top-layer",
      "2.7 Q2",
      30,
      "네트워크 구조",
      "교재의 TCP/IP 4계층 모델에서 가장 위에 있는 계층은?",
      ["응용 계층", "전송 계층", "인터넷 계층", "링크 계층"],
      0,
      "위에서부터 응용 → 전송 → 인터넷 → 링크입니다. OSI 7계층의 이름과 TCP/IP 모델을 혼동하지 마세요.",
    ],
    [
      "single-link",
      "2.7 Q3",
      31,
      "네트워크 구조",
      "하나의 물리적 연결을 통해 데이터를 전달하는 일을 담당하는 TCP/IP 계층은?",
      ["응용 계층", "전송 계층", "인터넷 계층", "링크 계층"],
      3,
      "링크 계층은 직접 연결된 구간의 전달을 담당합니다. 여러 네트워크를 거쳐 목적지까지 전달하는 것은 인터넷 계층의 역할입니다.",
    ],
    [
      "csma-cd",
      "2.7 Q4",
      31,
      "링크 계층",
      "CSMA/CD의 올바른 영문 풀이는?",
      [
        "Carrier Sense Multiple Access with Collision Detection",
        "Collision Sense Media Access with Continuous Direction",
        "Correlated Space Media Allocation with Constant Division",
        "Constant State Multiple Address Channel Division",
      ],
      0,
      "반송파 감지 다중 접속과 충돌 검출입니다. 공유 매체·반이중 이더넷의 방식이며, 현대의 전이중 스위치 연결에서 충돌 검출이 필요한 것처럼 일반화하지 마세요.",
    ],
    [
      "internetwork",
      "2.7 Q5",
      31,
      "IP",
      "인터넷 계층의 주된 목표는?",
      [
        "전달 중 데이터가 절대로 유실되지 않도록 보장",
        "여러 네트워크를 거쳐 출발지에서 목적지로 패킷 전달",
        "로그인한 사용자만 인터넷을 쓰도록 제한",
        "여러 컴퓨터가 무선 매체를 공평하게 공유하도록 조정",
      ],
      1,
      "IP는 서로 다른 네트워크 사이의 전달을 담당합니다. IP 자체가 신뢰성 있는 전달을 보장하지 않으며, 무선 매체 접근과 사용자 인증은 별개의 역할입니다.",
    ],
    [
      "window",
      "2.7 Q7",
      31,
      "TCP",
      "TCP에서 윈도 크기는 무엇을 뜻하는가?",
      [
        "패킷의 가로 길이와 세로 길이의 합",
        "단일 패킷이 가질 수 있는 최대 크기",
        "하나의 메시지를 구성할 수 있는 최대 패킷 수",
        "확인 응답을 기다리지 않고 보낼 수 있는 데이터의 양",
      ],
      3,
      "윈도는 ACK를 받기 전에 전송할 수 있는 데이터량을 제한하는 개념입니다. MTU나 메시지의 전체 길이와 구별하세요. 실제 송신량에는 수신 윈도와 혼잡 윈도 등 여러 제약이 작용합니다.",
    ],
    [
      "dns",
      "5.5 Q1",
      68,
      "DNS",
      "DNS가 제공하는 대표적인 기능은?",
      [
        "이름으로 호스트의 IP 주소 조회",
        "모든 서버의 GPS 좌표 기록",
        "각 대륙의 IP 주소 할당 기관 관리",
        "Wi-Fi를 옮길 때마다 단말에 새 IP 주소 할당",
      ],
      0,
      "DNS는 이름에 대응하는 레코드를 조회합니다. IP 주소 임대·할당의 대표 프로토콜은 DHCP이며, DNS가 기기의 이동을 관리하는 것은 아닙니다.",
    ],
    [
      "domain",
      "5.5 Q3",
      69,
      "DNS",
      "다음 중 도메인 이름 형식인 것은?",
      ["0f:2a:b3:1f:b3:1a", "192.168.3.14", "www.khanacademy.org", "@drchuck"],
      2,
      "첫 번째는 MAC 주소, 두 번째는 IPv4 주소, 세 번째는 도메인 이름, 네 번째는 계정 핸들 형태입니다. 이름과 숫자 주소를 구별하는 연습입니다.",
    ],
    [
      "tcp-reliability",
      "6.8 Q1",
      79,
      "TCP",
      "TCP 전송 계층이 주로 해결하는 문제는?",
      [
        "여러 라우터를 거쳐 출발지에서 목적지로 패킷 전달",
        "하나의 물리적 연결에서 데이터 전달",
        "유실되거나 순서가 뒤바뀐 데이터 처리",
        "민감한 데이터를 암호화",
      ],
      2,
      "TCP는 순서 번호·확인 응답·재전송 등을 이용해 신뢰성 있는 바이트 스트림을 제공합니다. IP 라우팅이나 TLS 암호화와 역할을 구분하세요.",
    ],
    [
      "flow-control",
      "6.8 Q3",
      79,
      "TCP",
      "윈도 크기로 전송량을 조절하는 이유로 가장 알맞은 것은?",
      [
        "큰 패킷이 광섬유를 물리적으로 막기 때문에",
        "처리 가능한 양을 넘는 데이터가 한꺼번에 보내지는 것을 줄이기 위해",
        "패킷이 통과할 수 있는 라우터 수를 정하기 위해",
        "IP 주소에서 네트워크 부분을 결정하기 위해",
      ],
      1,
      "흐름 제어는 수신 측이 처리할 수 있는 범위에 맞춰 송신량을 조절합니다. 홉 수 제한은 TTL/Hop Limit, 네트워크 부분의 구분은 프리픽스와 관련됩니다.",
    ],
    [
      "https",
      "8.8 Q1",
      105,
      "통신 보안",
      "웹 브라우저에서 암호화된 연결을 요청하는 URL 표시는?",
      [
        "https://",
        "특정 브라우저 제품 이름",
        "시크릿 창 표시",
        "서버 주소를 SHA-1으로 바꾼 문자열",
      ],
      0,
      "HTTPS는 HTTP를 TLS로 보호합니다. 시크릿 모드는 주로 로컬 방문 기록과 관련되며 통신 암호화의 대체 수단이 아닙니다. HTTPS만으로 사이트 운영자의 신뢰성까지 보장하지는 않습니다.",
    ],
    [
      "shared-secret",
      "8.8 Q2",
      105,
      "통신 보안",
      "불특정 다수와 통신할 때 미리 같은 비밀키를 나눠 갖는 방식의 큰 어려움은?",
      [
        "사람이 비밀을 분실할 수 있다는 점만 존재",
        "비밀키를 안전하게 배포해야 하는 문제",
        "대칭키 암호는 언제나 쉽게 해독된다는 점",
        "대칭키 연산이 언제나 공개키보다 느리다는 점",
      ],
      1,
      "핵심은 안전한 키 배포입니다. 대칭키 암호 자체가 인터넷에 부적합한 것은 아닙니다. 현대 TLS도 안전하게 합의한 대칭키로 실제 통신 데이터를 암호화합니다. 원문의 넓은 표현을 키 배포 문제로 좁혀 수정했습니다.",
    ],
  ];
  function get(examId) {
    if (!examIds.includes(examId)) return [];
    return rows.map(([key, reference, page, category, question, options, answer, explanation]) => ({
      id: `oer-${examId}-netintro-${key}`,
      sourceKind: "licensed-adaptation",
      category,
      question,
      options: [...options],
      answer,
      explanation: `${explanation}\n\n원저자: ${source.author} · ${source.title} · ${reference}. ${source.license}. ${source.changes}. 원문: ${source.url}#page=${page} · 이용 조건: ${source.licenseUrl}`,
      attribution: { ...source, reference, page },
    }));
  }
  const api = { get, source, examIds };
  root.LicensedPractice = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
