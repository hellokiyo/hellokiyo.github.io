/* 네트워크관리사 2급 실기 입문용 자체 예제·출처·로드맵 원본.
   시험 원문/공식 에뮬레이터 복제물이 아닙니다. 명령/설정을 실제로 실행하지 않습니다. */
(function (root) {
  "use strict";
  const examDate = "2026-12-19"; // 사용자가 알려 준 응시일. 정기 일정으로 단정하지 않습니다.
  const sources = {
    gui: {
      title: "ICQA 실습용 에뮬레이터(64bit)",
      url: "https://www.icqa.or.kr/cn/board/dataroom/18",
    },
    router: { title: "ICQA Router Emulator", url: "https://www.icqa.or.kr/cn/board/dataroom/21" },
    standard: {
      title: "ICQA 출제기준 변경 안내",
      url: "https://www.icqa.or.kr/cn/board/notice/463",
    },
    exam: { title: "ICQA 검정 안내", url: "https://www.icqa.or.kr/cn/page/network" },
    ip: {
      title: "Microsoft ipconfig 설명",
      url: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig",
    },
    dns: {
      title: "Microsoft DNS 설치·설정",
      url: "https://learn.microsoft.com/en-us/windows-server/networking/dns/quickstart-install-configure-dns-server?tabs=gui",
    },
    ios: {
      title: "Cisco 인터페이스 설정·저장",
      url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst3850/software/release/3e/consolidated_guide/configuration_guide/b_consolidated_3850_3e_cg/b_consolidated_3850_3e_cg_chapter_0100.html",
    },
  };
  const step = (title, action, check, extra = {}) => ({ title, action, check, ...extra });
  const tasks = [
    {
      id: "setup",
      title: "처음 시작 · 어떤 프로그램을 열까요?",
      kind: "guide",
      minutes: 20,
      source: "gui",
      goal: "Windows 설정용과 라우터용 프로그램을 구분해서 열기",
      steps: [
        step(
          "공식 자료실에서 준비",
          "아래 공식 링크에서 실습용 에뮬레이터(64bit)와 Router Emulator를 각각 확인하세요. 브라우저 안의 이 예제는 준비 설명입니다.",
          "파일 이름·설치 안내·PC 운영체제 조건을 공식 글에서 확인했다.",
        ),
        step(
          "설정 화면을 여는 프로그램",
          "64bit 실습용 에뮬레이터는 Windows 설정 메뉴를 연습할 때 사용합니다. 공식 안내에 따라 설치한 뒤 프로그램에서 연습 항목을 선택하세요.",
          "연습하려는 네트워크/서비스 항목을 열 수 있다. 버전별 메뉴 이름이 다르면 실제 프로그램의 안내를 따른다.",
        ),
        step(
          "검은 명령창을 여는 프로그램",
          "Router Emulator의 공식 압축파일을 풀고 router.exe를 실행합니다. Router> 같은 프롬프트는 입력하는 글자가 아니라 현재 위치 표시예요.",
          "명령을 입력하는 칸과 실행 후 나타나는 결과를 구별할 수 있다.",
        ),
        step(
          "오늘의 첫 연습",
          "아래에서 ‘라우터 IP 설정’과 ‘IPv4 주소 설정’을 한 번씩 따라가세요. 모르는 메뉴는 답만 외우지 말고 같은 화면을 다시 여는 연습을 합니다.",
          "프로그램 실행 → 문제 요구 확인 → 설정 → 검증 → 저장 흐름을 설명할 수 있다.",
        ),
      ],
    },
    {
      id: "router-ip",
      title: "라우터 · IP 넣고 포트 켜기",
      kind: "cli",
      minutes: 20,
      source: "router",
      goal: "FastEthernet0/0에 192.168.10.1/24를 넣고 활성화한 뒤 저장",
      steps: [
        step("관리 모드로 들어가기", "enable을 입력합니다. >가 #로 바뀌는지 봅니다.", "Router#", {
          prompt: "Router>",
          command: "enable",
          aliases: ["en"],
        }),
        step("설정 모드로 들어가기", "configure terminal을 입력합니다.", "Router(config)#", {
          prompt: "Router#",
          command: "configure terminal",
          aliases: ["conf t"],
        }),
        step(
          "설정할 포트 고르기",
          "이 예제의 포트는 FastEthernet0/0입니다. 실제 문제의 포트 이름을 먼저 확인하세요.",
          "Router(config-if)#",
          {
            prompt: "Router(config)#",
            command: "interface FastEthernet0/0",
            aliases: ["int fa0/0", "interface fa0/0"],
          },
        ),
        step(
          "주소와 마스크 넣기",
          "IP 주소 다음에 서브넷 마스크를 적습니다. /24를 그대로 쓰는 예제가 아닙니다.",
          "IP 192.168.10.1, 마스크 255.255.255.0",
          { prompt: "Router(config-if)#", command: "ip address 192.168.10.1 255.255.255.0" },
        ),
        step(
          "포트 켜기",
          "주소를 넣어도 포트가 꺼져 있으면 통신하지 못합니다.",
          "관리적으로 꺼진 상태를 해제했다. 실제 링크 상태는 연결 조건에 따라 다르다.",
          { prompt: "Router(config-if)#", command: "no shutdown", aliases: ["no shut"] },
        ),
        step("관리 모드로 돌아가기", "end는 설정 모드에서 빠져나옵니다.", "Router#", {
          prompt: "Router(config-if)#",
          command: "end",
        }),
        step(
          "내가 넣은 값 확인",
          "show ip interface brief로 주소와 상태를 확인합니다. 이 사이트는 실제 장비 결과를 생성하지 않아요.",
          "선택한 포트의 IP를 확인한다. up/down의 이유를 실제 에뮬레이터에서 살펴본다.",
          { prompt: "Router#", command: "show ip interface brief", aliases: ["sh ip int brief"] },
        ),
        step(
          "저장까지 마무리",
          "copy running-config startup-config로 현재 설정을 저장합니다. 실제 시험 도구의 저장 지시가 우선입니다.",
          "저장 확인 질문/완료 메시지를 실제 프로그램에서 확인했다.",
          { prompt: "Router#", command: "copy running-config startup-config" },
        ),
      ],
    },
    {
      id: "ipv4",
      title: "Windows · IPv4 주소 설정",
      kind: "fields",
      minutes: 20,
      source: "ip",
      goal: "IP·마스크·게이트웨이·DNS 네 칸을 구별해서 입력",
      steps: [
        step(
          "문제에서 숫자 네 묶음 찾기",
          "예제 조건은 IP 192.168.10.10, 마스크 255.255.255.0, 게이트웨이 192.168.10.1, DNS 192.168.10.2입니다.",
          "IP와 게이트웨이를 서로 바꿔 쓰지 않았다.",
        ),
        step(
          "네트워크 어댑터 속성 열기",
          "실습용 프로그램의 네트워크 설정 항목에서 대상 어댑터 속성 → Internet Protocol Version 4(TCP/IPv4) 속성으로 이동합니다. Windows의 일반 진입 예는 네트워크 연결(ncpa.cpl)입니다.",
          "설정 대상 어댑터와 IPv4 창을 확인했다. 이 설명을 따라 실제 사용 중인 PC의 연결 설정을 바꾸지는 마세요.",
        ),
        step(
          "네 칸 직접 채우기",
          "다음 IP 주소 사용과 다음 DNS 서버 주소 사용을 선택한 상황의 예제입니다. 아래 네 칸에 조건을 옮겨 적어 보세요.",
          "네 값이 예제 조건과 일치한다.",
          {
            fields: [
              { label: "IP 주소", value: "192.168.10.10" },
              { label: "서브넷 마스크", value: "255.255.255.0" },
              { label: "기본 게이트웨이", value: "192.168.10.1" },
              { label: "기본 설정 DNS 서버", value: "192.168.10.2" },
            ],
          },
        ),
        step(
          "적용 후 다시 확인",
          "실제 에뮬레이터에서는 확인/적용한 뒤 속성을 다시 열어 저장된 값을 봅니다. 일반 Windows의 확인 명령 예는 ipconfig /all입니다.",
          "입력값뿐 아니라 적용 후 값도 대조했다. 이 사이트가 Windows 설정을 변경한 것은 아니다.",
        ),
      ],
    },
    {
      id: "dns",
      title: "Windows · DNS 호스트 레코드",
      kind: "guide",
      minutes: 20,
      source: "dns",
      goal: "lab.example 영역에 www → 192.168.10.20 연결 예제",
      steps: [
        step(
          "DNS 도구 찾기",
          "실습용 프로그램의 DNS 관리 항목을 엽니다. 일반 Windows Server에서는 서버 관리자 → 도구 → DNS 경로를 확인합니다.",
          "DNS 서버와 DNS 클라이언트 주소 설정을 구별한다.",
        ),
        step(
          "영역 고르기",
          "정방향 조회 영역에서 예제 영역 lab.example을 선택합니다. 영역이 없는 과제라면 지시한 영역 종류·이름부터 만듭니다.",
          "문제의 영역 이름과 생성 위치를 확인한다.",
        ),
        step(
          "새 호스트(A) 추가",
          "호스트 이름 www와 IPv4 주소 192.168.10.20을 입력해 추가합니다. 전체 이름은 www.lab.example이 됩니다.",
          "별칭(CNAME)이 아니라 IP를 가리키는 A 레코드임을 확인한다.",
        ),
        step(
          "목록과 결과 확인",
          "실제 프로그램에서 레코드 목록을 다시 확인합니다. 일반 환경에서는 nslookup www.lab.example로 질의 결과를 확인할 수 있습니다.",
          "기대 주소와 질의 대상 DNS 서버를 함께 확인한다. 캐시/실제 프로그램 지원 범위에 따라 확인 방법이 다를 수 있다.",
        ),
      ],
    },
    {
      id: "dhcp",
      title: "Windows · DHCP 주소 범위",
      kind: "guide",
      minutes: 20,
      source: "gui",
      goal: "주소 풀과 마스크·제외 주소·옵션을 나누어 읽기",
      steps: [
        step(
          "범위 조건 표시",
          "예제 풀은 192.168.10.100~192.168.10.150, /24입니다. 서버의 고정 IP 자체를 이 주소 풀로 바꾸는 작업이 아니에요.",
          "시작 주소·끝 주소·마스크를 따로 적었다.",
        ),
        step(
          "새 범위 마법사",
          "실습용 DHCP 관리 항목 → 대상 서버 → IPv4 → 새 범위의 흐름을 찾습니다. 예제 이름은 LabScope입니다.",
          "서버/IPv4/범위의 위치를 구별했다.",
        ),
        step(
          "범위·제외·임대 시간",
          "시작/끝/마스크를 넣고 지문에 있는 제외 주소와 임대 시간을 따로 설정합니다. 예제에 없는 값을 임의로 시험 답으로 넣지 않습니다.",
          "포함 범위와 제외 범위가 뒤바뀌지 않았다.",
        ),
        step(
          "옵션과 활성화 확인",
          "문제에서 요구한 라우터 옵션·DNS 옵션을 입력하고 활성화 지시를 확인합니다. 예제의 게이트웨이는 .1, DNS는 .2입니다.",
          "실제 프로그램에서 저장된 범위와 옵션을 다시 열어 확인했다.",
        ),
      ],
    },
    {
      id: "iis",
      title: "Windows · IIS 웹 사이트 설정",
      kind: "guide",
      minutes: 20,
      source: "gui",
      goal: "사이트 이름·실제 경로·바인딩을 구별하기",
      steps: [
        step(
          "요구를 세 칸으로 나누기",
          "예제 사이트 이름은 LabWeb, 실제 경로는 C:\\LabWeb, 바인딩은 http/80입니다. 실제 운영 사이트를 만드는 작업이 아니라 연습 설명이에요.",
          "사이트 표시 이름·폴더·포트를 서로 구별했다.",
        ),
        step(
          "IIS 관리자에서 사이트 추가",
          "실습 도구에서 IIS 관리 항목 → 서버 → 사이트 → 웹 사이트 추가 흐름을 찾습니다.",
          "응용 프로그램 풀과 웹 사이트를 구별했다.",
        ),
        step(
          "바인딩 옮겨 쓰기",
          "지문에 제시된 IP·포트·호스트 이름만 해당 칸에 입력합니다. 예제의 호스트 이름은 www.lab.example입니다.",
          "호스트 이름 칸에 URL 전체나 폴더 경로를 쓰지 않았다.",
        ),
        step(
          "저장 후 다시 열기",
          "실제 실습 도구에서 사이트와 바인딩 설정을 다시 열어 조건과 비교합니다. 실제 서비스 생성·외부 접속은 이 사이트에서 하지 않습니다.",
          "바인딩 조건과 사이트 시작 상태를 확인했다.",
        ),
      ],
    },
    {
      id: "router-route",
      title: "라우터 · 정적 경로 설정",
      kind: "cli",
      minutes: 20,
      source: "router",
      goal: "192.168.20.0/24로 가는 다음 홉 192.168.10.2 설정 예제",
      steps: [
        step("관리 모드", "enable로 이동합니다.", "Router#", {
          prompt: "Router>",
          command: "enable",
          aliases: ["en"],
        }),
        step("설정 모드", "configure terminal로 이동합니다.", "Router(config)#", {
          prompt: "Router#",
          command: "configure terminal",
          aliases: ["conf t"],
        }),
        step(
          "목적지·마스크·다음 홉",
          "ip route 다음은 목적지 네트워크, 마스크, 다음 홉 순서입니다. 내 인터페이스 주소를 다음 홉에 적지 않도록 구별하세요.",
          "192.168.20.0 / 255.255.255.0 / 192.168.10.2",
          {
            prompt: "Router(config)#",
            command: "ip route 192.168.20.0 255.255.255.0 192.168.10.2",
          },
        ),
        step("설정 모드 종료", "end를 입력합니다.", "Router#", {
          prompt: "Router(config)#",
          command: "end",
        }),
        step(
          "경로 확인",
          "show ip route로 설정을 확인합니다. 실제 라우팅 표 반영은 다음 홉 도달 가능성과 링크 조건도 영향을 줍니다.",
          "명령 입력과 실제 경로 반영을 구별한다.",
          { prompt: "Router#", command: "show ip route", aliases: ["sh ip route"] },
        ),
        step(
          "저장 확인",
          "현재 설정을 저장하고 시험 프로그램의 제출/저장 안내까지 확인합니다.",
          "저장 확인을 누락하지 않았다.",
          { prompt: "Router#", command: "copy running-config startup-config" },
        ),
      ],
    },
    {
      id: "cable",
      title: "케이블 · 순서와 손작업",
      kind: "guide",
      minutes: 20,
      source: "exam",
      goal: "결선 지시·핀 방향·양 끝·검증을 순서대로 확인",
      steps: [
        step(
          "제작 조건부터 읽기",
          "시험에서 지시한 케이블 규격과 양 끝 결선 조건을 먼저 확인합니다. 여기서는 T568B 양끝의 직결 예제로 색 순서를 설명합니다.",
          "어떤 문제든 무조건 같은 케이블을 만들겠다고 외우지 않았다.",
        ),
        step(
          "접점 방향을 고정하기",
          "금속 접점이 보이고 걸쇠는 뒤, 케이블이 아래로 내려가는 방향에서 왼쪽1번→오른쪽8번을 확인합니다.",
          "돌려 잡았을 때 좌우가 뒤집히는 것을 확인했다.",
          { cable: true },
        ),
        step(
          "정렬·절단·삽입·압착",
          "실물 연습에서는 피복을 벗기고 선을 정렬한 뒤 길이를 맞춰 삽입합니다. 각 선이 끝까지 들어갔는지, 바깥 피복도 고정되는지 보고 압착합니다.",
          "사이트에서 색을 본 것과 실제 손으로 제작하는 것은 별개다.",
        ),
        step(
          "양 끝 다시 보기",
          "양 끝의 방향을 같게 두고 핀 순서와 삽입 상태를 다시 확인합니다. 시험장에서 허용되는 도구·검사 방법은 해당 안내를 따릅니다.",
          "반드시 실물 케이블·커넥터·도구로 반복 연습했다. 허용 도구를 이 예제로 단정하지 않는다.",
        ),
      ],
    },
  ];
  const roadmap = [
    {
      from: "2026-11-23",
      to: "2026-11-29",
      title: "1주 · 프로그램과 라우터 기초",
      taskIds: ["setup", "router-ip", "ipv4"],
      goal: "설명 보며1회 → 설명 덮고1회. 케이블 실물 연습 시작.",
    },
    {
      from: "2026-11-30",
      to: "2026-12-06",
      title: "2주 · Windows 설정 손에 익히기",
      taskIds: ["dns", "dhcp", "iis"],
      goal: "메뉴 위치를 기억하고 입력→적용→재확인을 반복. 계정·서비스 등 공식 연습 항목도 추가.",
    },
    {
      from: "2026-12-07",
      to: "2026-12-13",
      title: "3주 · 섞어서 반복",
      taskIds: ["router-route", "cable"],
      goal: "라우터·Windows·케이블을 섞고, 단답·서브넷도 짧게 복습.",
    },
    {
      from: "2026-12-14",
      to: "2026-12-18",
      title: "마지막5일 · 80분 모의 연습",
      taskIds: tasks.map((task) => task.id),
      goal: "공식 도구의 과제를 시간 재고 수행. 마지막에는 저장·제출·못한 작업만 재확인.",
    },
  ];
  function clean(raw = {}) {
    raw = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const allowed = new Set(tasks.map((task) => task.id));
    const date =
      typeof raw.examDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(raw.examDate) &&
      !Number.isNaN(Date.parse(raw.examDate)) &&
      new Date(raw.examDate).toISOString().slice(0, 10) === raw.examDate
        ? raw.examDate
        : examDate;
    return {
      examDate: date,
      completed: Array.isArray(raw.completed)
        ? [...new Set(raw.completed.filter((id) => allowed.has(id)))]
        : [],
    };
  }
  function commandMatches(value, currentStep) {
    const normalize = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");
    return [currentStep.command, ...(currentStep.aliases || [])]
      .filter(Boolean)
      .some((command) => normalize(value) === normalize(command));
  }
  const api = { examDate, sources, tasks, roadmap, clean, commandMatches };
  root.PracticalStudy = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
