/* 제공된 A형 시험지 원문. 정답·해설은 학습용 풀이입니다. */
window.LATEST_PAPER = {
  "id": "nw2-2026-04-a",
  "title": "2026년 4회 네트워크관리사 2급 필기",
  "date": "2026-11-01",
  "source": "https://www.icqa.or.kr/cn/board/dataroom/263",
  "answerStatus": "학습용 풀이 · 공식 정답표 미확인",
  "pendingNumbers": [],
  "questions": [
    {
      "id": "nw2-2026-04-a-01",
      "number": 1,
      "category": "TCP/IP",
      "question": "웹 서비스 관리자가 서버의 HTTP 및 HTTPS 통신 설정을 점검하고 있다. HTTP와 HTTPS의 보안 기능 및 기본 포트 번호에 대한 설명으로 옳은 것은?",
      "options": [
        "HTTP는 기본적으로 TLS 암호화를 적용하며, TCP 80번 포트를 사용한다.",
        "HTTPS는 서버 인증서를 사용하지만, 클라이언트와 서버 간의 통신 내용은 암호화하지 않는다.",
        "HTTP는 일반적으로 TCP 80번 포트를 사용하며, HTTPS는 TCP 기반 통신에서 기본적으로 443번 포트를 사용한다.",
        "HTTPS는 TLS를 사용하므로 별도의 서버 인증서 검증 없이도 서버의 신원을 신뢰할 수 있다."
      ],
      "answer": 2,
      "explanation": "HTTP는 TCP 80, HTTPS는 TLS를 사용하는 TCP 443이 기본이다."
    },
    {
      "id": "nw2-2026-04-a-02",
      "number": 2,
      "category": "TCP/IP",
      "question": "다음과 같은 특징을 가진 라우팅 프로토콜로 옳은 것은?\n\n한 기업에서는 여러 라우터를 통해 사내 네트워크를 연결하고 있다. 네트워크 관리자는 라우터 간 경로를 자동으로 학습하도록 동적 라우팅 프로토콜을 설정하였다. 해당 프로토콜은 홉 수(Hop Count)를 경로 선택 기준으로 사용하고, 최대 유효 홉 수는 15이다. 또한 기본적으로 약 30초마다 라우팅 정보를 교환하며, 네트워크 장애 발생 시 잘못된 경로 정보로 인해 라우팅 루프가 발생할 수 있다.",
      "options": [
        "OSPF (Open Shortest Path First)",
        "RIP (Routing Information Protocol)",
        "EIGRP (Enhanced Interior Gateway Routing Protocol)",
        "BGP (Border Gateway Protocol)"
      ],
      "answer": 1,
      "explanation": "홉 수·최대 15홉·약 30초 갱신은 RIP의 단서다."
    },
    {
      "id": "nw2-2026-04-a-03",
      "number": 3,
      "category": "TCP/IP",
      "question": "기업의 네트워크 관리자가 파일 전송 서버를 구축하면서 FTP의 연결 방식과 포트 번호를 점검하고 있다. FTP 프로토콜의 동작 방식에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "FTP는 TCP 기반의 프로토콜로, 일반적으로 서버의 TCP 21번 포트를 통해 제어 연결을 설정한다.",
        "FTP의 능동 모드에서는 일반적으로 서버가 TCP 20번 포트를 출발지 포트로 사용하여 클라이언트에 데이터 연결을 시도한다.",
        "FTP의 수동 모드에서는 클라이언트가 서버에서 지정한 데이터 포트로 연결을 시도하므로 서버의 TCP 20번 포트를 반드시 사용할 필요는 없다.",
        "FTP는 파일 전송 지연을 줄이기 위해 UDP를 사용하며, 기본적으로 UDP 69번 포트를 통해 파일을 송수신한다."
      ],
      "answer": 3,
      "explanation": "UDP 69는 TFTP이며 FTP는 TCP를 사용한다."
    },
    {
      "id": "nw2-2026-04-a-04",
      "number": 4,
      "category": "TCP/IP",
      "question": "정적 라우팅(Static Routing)의 특징에 대한 설명으로 옳은 것은?",
      "options": [
        "라우팅 경로를 수동으로 설정하며, 네트워크 환경의 변화에 따라 경로를 직접 수정한다.",
        "라우터 간 주기적인 경로 정보 교환을 통해 최적 경로를 자동으로 계산하고 갱신한다.",
        "네트워크 장애가 발생하면 별도의 설정 없이 다른 라우터로부터 새로운 경로를 자동으로 학습한다.",
        "정적 경로는 관리 거리(Administrative Distance) 설정과 관계없이 모든 동적 라우팅 경로보다 항상 우선한다."
      ],
      "answer": 0,
      "explanation": "정적 라우팅은 관리자가 직접 경로를 설정하고 수정한다."
    },
    {
      "id": "nw2-2026-04-a-05",
      "number": 5,
      "category": "TCP/IP",
      "question": "IPv6 주소 ′a184:0a01:0000:0000:cd8c:1000:317b:00ff′ 를 표준 축약 표기법에 따라 나타낸 것으로 옳은 것은?",
      "options": [
        "a184:a1::cd8c:1:317b:ff",
        "a184:a01::cd8c:1000:317b:ff",
        "a184:a01:0:0:cd8c:10:317b:0ff",
        "a184:a01:cd8c:1000:317b:ff"
      ],
      "answer": 1,
      "explanation": "각 블록의 선행 0만 생략한다. 1000의 뒤쪽 0은 생략할 수 없다."
    },
    {
      "id": "nw2-2026-04-a-06",
      "number": 6,
      "category": "TCP/IP",
      "question": "TCP/IP 프로토콜 스택에서 SNMP(Simple Network Management Protocol)의 주요 기능에 대한 설명으로 옳은 것은?",
      "options": [
        "호스트 간 파일을 전송하고 원격 디렉터리의 파일을 관리한다.",
        "IP 패킷의 전달 오류를 알리고 네트워크 연결 상태를 진단한다.",
        "네트워크 장비의 상태 및 성능 정보를 수집하고 장비를 관리·감시한다.",
        "도메인 이름을 IP 주소로 변환하여 호스트의 위치를 확인한다."
      ],
      "answer": 2,
      "explanation": "SNMP는 네트워크 장비의 상태와 성능을 관리·감시한다."
    },
    {
      "id": "nw2-2026-04-a-07",
      "number": 7,
      "category": "TCP/IP",
      "question": "네트워크 담당자는 네트워크 통신 장애를 점검하던 중, IPv4 패킷의 크기가 전송 경로의 최대 전송 단위(MTU)를 초과하는 상황을 확인했다. 이때 IPv4 프로토콜의 기능과 동작 방식에 대한 설명으로 옳은 것은?",
      "options": [
        "패킷이 손실되면 수신 여부를 확인하고 자동으로 재전송하여 신뢰성을 보장한다.",
        "송신 호스트와 수신 호스트 간의 데이터 전송 속도를 조절하는 흐름 제어 기능을 제공한다.",
        "목적지에 도착하는 패킷의 순서를 보장하고, 순서가 변경된 패킷을 자동으로 재정렬한다.",
        "패킷 크기가 전송 경로의 MTU를 초과하고 DF 플래그가 0인 경우, 라우터에서 패킷을 단편화할 수 있다."
      ],
      "answer": 3,
      "explanation": "IPv4는 DF=0이면 경로의 MTU에 맞춰 라우터에서 단편화할 수 있다."
    },
    {
      "id": "nw2-2026-04-a-08",
      "number": 8,
      "category": "TCP/IP",
      "question": "네트워크 관리자는 기업 내부 네트워크에서 여러 장치가 제한된 공인 IPv4 주소를 공유하여 인터넷에 접속할 수 있도록 구성하려고 한다. 이때 사설 IP 주소를 공인 IP 주소로 변환하는 기술로 가장 적절한 것은?",
      "options": [
        "SSL",
        "NAT",
        "VPN",
        "IDS"
      ],
      "answer": 1,
      "explanation": "사설 주소를 공인 주소로 변환하는 기술은 NAT다."
    },
    {
      "id": "nw2-2026-04-a-09",
      "number": 9,
      "category": "TCP/IP",
      "question": "네트워크 주소가 ′192.168.100.128′이고 서브넷 마스크가 ′255.255.255.192′인 IPv4 네트워크에서 사용 가능한 마지막 호스트 IP 주소는?",
      "options": [
        "192.168.100.129",
        "192.168.100.190",
        "192.168.100.191",
        "192.168.100.255"
      ],
      "answer": 1,
      "explanation": "/26의 블록 크기는 64. 네트워크 .128, 브로드캐스트 .191, 마지막 호스트 .190."
    },
    {
      "id": "nw2-2026-04-a-10",
      "number": 10,
      "category": "TCP/IP",
      "question": "TCP/IP 프로토콜 중 나머지 세 프로토콜과 동작하는 계층이 다른 것은?",
      "options": [
        "IP",
        "NTP",
        "ICMP",
        "IGMP"
      ],
      "answer": 1,
      "explanation": "NTP는 응용 계층, IP·ICMP·IGMP는 인터넷 계층이다."
    },
    {
      "id": "nw2-2026-04-a-11",
      "number": 11,
      "category": "TCP/IP",
      "question": "네트워크 담당자는 기업의 DNS(Domain Name System) 서버를 구성하면서 도메인 이름 관리 방식과 호스트 이름의 작성 규칙을 점검하고 있다. DNS의 기능과 특징에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "DNS는 도메인 이름을 이용하여 IP 주소 등의 네트워크 정보를 조회할 수 있도록 지원한다.",
        "DNS는 분산된 서버를 통해 도메인 이름과 관련된 정보를 관리한다.",
        "DNS는 계층적인 이름 공간을 사용하며, 하나의 도메인 아래에 여러 하위 도메인을 구성할 수 있다.",
        "일반적인 인터넷 호스트 이름에는 영문자와 숫자 외에도 @, # 등의 특수 문자를 자유롭게 사용할 수 있다."
      ],
      "answer": 3,
      "explanation": "일반적인 인터넷 호스트 이름에 @와 #를 자유롭게 사용할 수 없다."
    },
    {
      "id": "nw2-2026-04-a-12",
      "number": 12,
      "category": "TCP/IP",
      "question": "TCP/IP 네트워크에서 멀티캐스트(Multicast) 통신 방식에 대한 설명으로 옳은 것은?",
      "options": [
        "하나의 송신 호스트가 특정 그룹에 속한 여러 수신 호스트에 데이터를 전송하는 방식이다.",
        "하나의 송신 호스트가 동일한 네트워크의 모든 호스트에 데이터를 전송하는 방식이다.",
        "하나의 송신 호스트가 특정한 하나의 수신 호스트에 데이터를 전송하는 방식이다.",
        "하나의 호스트가 자기 자신의 네트워크 인터페이스로 데이터를 전송하는 방식이다."
      ],
      "answer": 0,
      "explanation": "특정 그룹에 전송하면 멀티캐스트다."
    },
    {
      "id": "nw2-2026-04-a-13",
      "number": 13,
      "category": "TCP/IP",
      "question": "IPv4 네트워크에서 서브넷 마스크(Subnet Mask)의 기능과 특징에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "IP 주소에서 네트워크 부분과 호스트 부분을 구분하는 데 사용된다.",
        "출발지와 목적지 IP 주소가 동일한 서브넷에 속하는지 판단하는 데 사용된다.",
        "클래스 기반 IPv4 주소 체계에서 Class A의 기본 서브넷 마스크는 254.0.0.0이다.",
        "서브넷 마스크는 네트워크 부분을 나타내는 1이 연속되고, 그 뒤에 호스트 부분을 나타내는 0이 연속되는 구조이다."
      ],
      "answer": 2,
      "explanation": "Class A의 기본 마스크는 255.0.0.0이다."
    },
    {
      "id": "nw2-2026-04-a-14",
      "number": 14,
      "category": "TCP/IP",
      "question": "다음 IPv4 주소 중 사설 IP 주소에 해당하지 않는 것은?",
      "options": [
        "10.100.12.5",
        "128.52.10.6",
        "172.25.30.5",
        "192.168.200.128"
      ],
      "answer": 1,
      "explanation": "사설 범위는 10/8, 172.16/12, 192.168/16이다."
    },
    {
      "id": "nw2-2026-04-a-15",
      "number": 15,
      "category": "TCP/IP",
      "question": "HTTPS 통신에서 TLS 1.3 핸드셰이크가 시작될 때 가장 먼저 수행되는 동작으로 옳은 것은?",
      "options": [
        "서버가 선택한 암호 스위트와 키 교환 정보를 클라이언트에 전송한다.",
        "클라이언트가 지원하는 TLS 버전, 암호 스위트 및 키 교환 관련 정보를 포함한 ClientHello 메시지를 서버에 전송한다.",
        "클라이언트가 서버로부터 전달받은 인증서의 유효성과 신뢰성을 검증한다.",
        "클라이언트와 서버가 핸드셰이크 완료를 확인하는 Finished 메시지를 교환한다."
      ],
      "answer": 1,
      "explanation": "TLS 핸드셰이크는 클라이언트의 ClientHello로 시작한다."
    },
    {
      "id": "nw2-2026-04-a-16",
      "number": 16,
      "category": "TCP/IP",
      "question": "IPv6의 주소 체계와 헤더 구조에 대한 설명으로 옳은 것은?",
      "options": [
        "IPv6 주소의 길이는 128비트(16바이트)이다.",
        "IPv6의 기본 헤더 길이는 20바이트로, IPv4의 기본 헤더와 동일하다.",
        "IPv6 주소에서 연속된 0을 생략하는 ′::′ 표기는 하나의 주소에 여러 번 사용할 수 있다.",
        "IPv6 주소의 서브넷 프리픽스(Subnet Prefix)는 개별 네트워크 인터페이스를 식별하는 데 사용된다."
      ],
      "answer": 0,
      "explanation": "IPv6 주소 길이는 128비트이며 기본 헤더는 40바이트다."
    },
    {
      "id": "nw2-2026-04-a-17",
      "number": 17,
      "category": "TCP/IP",
      "question": "IPv4 네트워크에서 ICMP(Internet Control Message Protocol)의 기능과 동작 방식에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "ICMP 에코 요청(Echo Request)과 에코 응답(Echo Reply)은 목적지 호스트의 네트워크 도달 가능성을 확인하는 데 사용된다.",
        "ICMP 에코 요청 및 에코 응답 메시지의 형식과 동작은 RFC 792에 정의되어 있다.",
        "ICMP는 전송 계층에서 동작하며, TCP와 같이 데이터의 신뢰성 있는 전송을 보장한다.",
        "ICMP 에코 요청 및 에코 응답 메시지는 일반적으로 ping 명령어를 이용하여 테스트할 수 있다."
      ],
      "answer": 2,
      "explanation": "ICMP는 인터넷 계층에서 오류·진단 정보를 전달하며 신뢰성 있는 데이터 전송을 보장하지 않는다."
    },
    {
      "id": "nw2-2026-04-a-18",
      "number": 18,
      "category": "네트워크 일반",
      "question": "통신 프로토콜의 기본 구성요소 중 통신 실체(Entity) 간 데이터의 전송 시점과 속도 및 메시지의 전송 순서를 제어하는 요소로 옳은 것은?",
      "options": [
        "타이밍(Timing)",
        "의미(Semantics)",
        "구문(Syntax)",
        "처리(Process)"
      ],
      "answer": 0,
      "explanation": "전송 시점·속도·순서는 타이밍이다."
    },
    {
      "id": "nw2-2026-04-a-19",
      "number": 19,
      "category": "네트워크 일반",
      "question": "무선 LAN에서 충돌 회피를 위한 CSMA/CA(Carrier Sense Multiple Access with Collision Avoidance) 방식을 사용하는 IEEE 표준으로 옳은 것은?",
      "options": [
        "IEEE 802.1",
        "IEEE 802.2",
        "IEEE 802.3",
        "IEEE 802.11"
      ],
      "answer": 3,
      "explanation": "무선 LAN은 IEEE 802.11, 유선 이더넷은 IEEE 802.3이다."
    },
    {
      "id": "nw2-2026-04-a-20",
      "number": 20,
      "category": "네트워크 일반",
      "question": "네트워크 담당자는 데이터 전송 중 오류가 발생했을 때 사용하는 ARQ(Automatic Repeat reQuest) 방식의 동작을 확인하고 있다. ARQ 방식 중 오류가 발생한 프레임부터 이후에 전송된 미확인 프레임까지 다시 전송하므로, 불필요한 재전송량이 증가할 수 있는 방식으로 옳은 것은?",
      "options": [
        "Selective ARQ",
        "Go-Back-N ARQ",
        "Stop-and-Wait ARQ",
        "Adaptive ARQ"
      ],
      "answer": 1,
      "explanation": "오류 프레임 이후의 미확인 프레임까지 재전송하면 Go-Back-N이다."
    },
    {
      "id": "nw2-2026-04-a-21",
      "number": 21,
      "category": "네트워크 일반",
      "question": "LAN의 네트워크 구성 형태 중 각 장치가 중앙의 스위치나 허브와 개별적인 점대점(Point-to-Point) 링크로 연결되는 방식은?",
      "options": [
        "링형(Ring) 구성",
        "스타형(Star) 구성",
        "버스형(Bus) 구성",
        "트리형(Tree) 구성"
      ],
      "answer": 1,
      "explanation": "중앙 장비에 개별 연결하는 형태는 스타형이다."
    },
    {
      "id": "nw2-2026-04-a-22",
      "number": 22,
      "category": "네트워크 일반",
      "question": "OSI 7계층 중 세션 계층(Session Layer)의 주요 기능에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "대화 제어",
        "데이터 전송 오류 검출 및 재전송 제어",
        "응용 프로그램 간 대화의 설정 및 종료",
        "동기화"
      ],
      "answer": 1,
      "explanation": "오류 검출·재전송 제어는 세션 계층의 주요 기능이 아니다."
    },
    {
      "id": "nw2-2026-04-a-23",
      "number": 23,
      "category": "네트워크 일반",
      "question": "다음 설명의 (A)에 들어갈 기술로 옳은 것은?\n\n(A)은/는 기존의 전용 하드웨어에서 수행하던 방화벽, 라우팅 등의 네트워크 기능을 소프트웨어로 구현하여 가상화된 인프라에서 실행하는 기술이다. 가상 머신(VM)이나 컨테이너 기반으로 네트워크 기능을 배포할 수 있으며, ETSI의 관리 및 오케스트레이션(MANO) 구조를 활용하여 네트워크 서비스의 배포와 운영을 효율적으로 관리할 수 있다.",
      "options": [
        "NFV (Network Functions Virtualization)",
        "WMN (Wireless Mesh Network)",
        "SDN (Software-Defined Networking)",
        "MEC (Multi-access Edge Computing)"
      ],
      "answer": 0,
      "explanation": "전용 하드웨어의 네트워크 기능을 소프트웨어로 가상화하고 VM·컨테이너에 배포하는 기술은 NFV다. ETSI MANO가 핵심 단서다. SDN의 제어 평면·데이터 평면 분리와 구별한다."
    },
    {
      "id": "nw2-2026-04-a-24",
      "number": 24,
      "category": "네트워크 일반",
      "question": "네트워크 담당자는 인터넷을 통해 본사와 지사 간 VPN을 구축하려고 한다. 공중망을 이용하면서 원본 패킷을 다른 패킷으로 캡슐화하여 논리적인 통신 경로를 형성하는 기술로 옳은 것은?",
      "options": [
        "터널링",
        "접근 제어 목록(ACL)",
        "MAC 필터링",
        "포트 포워딩"
      ],
      "answer": 0,
      "explanation": "원본 패킷을 다른 패킷으로 감싸 논리 경로를 만들면 터널링이다."
    },
    {
      "id": "nw2-2026-04-a-25",
      "number": 25,
      "category": "네트워크 일반",
      "question": "클라우드 컴퓨팅에서 PaaS(Platform as a Service)의 주된 사용 목적으로 가장 옳은 것은?",
      "options": [
        "개발자가 가상 서버, 스토리지, 네트워크 등 인프라 자원을 직접 구성하고 관리한다.",
        "개발자가 인프라 관리 부담을 줄이고 애플리케이션 개발, 테스트, 배포에 집중할 수 있도록 실행 플랫폼을 제공한다.",
        "사용자가 물리 네트워크 장비를 직접 설치하고 데이터센터 네트워크 환경을 구축한다.",
        "사용자가 전력, 냉각, 랙 구성 등 물리 데이터센터 운영 전반을 직접 담당한다."
      ],
      "answer": 1,
      "explanation": "PaaS는 애플리케이션 개발·테스트·배포용 실행 플랫폼을 제공한다."
    },
    {
      "id": "nw2-2026-04-a-26",
      "number": 26,
      "category": "네트워크 일반",
      "question": "OSI 7계층을 하위 계층부터 상위 계층 순서로 올바르게 나열한 것은?",
      "options": [
        "물리 → 데이터 링크 → 전송 → 네트워크 → 세션 → 표현 → 응용",
        "데이터 링크 → 물리 → 전송 → 네트워크 → 세션 → 응용 → 표현",
        "전송 → 데이터 링크 → 네트워크 → 물리 → 세션 → 표현 → 응용",
        "물리 → 데이터 링크 → 네트워크 → 전송 → 세션 → 표현 → 응용"
      ],
      "answer": 3,
      "explanation": "물리 → 데이터 링크 → 네트워크 → 전송 → 세션 → 표현 → 응용 순서다."
    },
    {
      "id": "nw2-2026-04-a-27",
      "number": 27,
      "category": "네트워크 일반",
      "question": "데이터 전송 과정에서 송신 측이 생성 다항식을 이용한 연산으로 검사값을 생성하여 데이터에 추가하고, 수신 측이 동일한 생성 다항식으로 오류 여부를 확인하는 방식으로 옳은 것은?",
      "options": [
        "순환 중복 검사(CRC)",
        "패리티 검사(Parity Check)",
        "블록합 검사(Block Sum Check)",
        "체크섬(Checksum)"
      ],
      "answer": 0,
      "explanation": "생성 다항식으로 검사값을 계산하는 방식은 CRC다."
    },
    {
      "id": "nw2-2026-04-a-28",
      "number": 28,
      "category": "NOS",
      "question": "서버 관리자가 Windows Server 2022 환경에서 여러 서버가 중앙의 스토리지 자원에 접근할 수 있도록 시스템을 구축하려고 한다. 다음 조건을 충족하는 스토리지 구성 방식으로 가장 적절한 것은?\n\n<조건>\n- 여러 서버가 네트워크를 통해 중앙의 스토리지 자원에 접근할 수 있다.\n- 서버에 저장 공간을 블록 단위의 장치로 제공한다.\n- Fibre Channel 또는 iSCSI 등의 연결 방식을 사용할 수 있다.\n- 대규모 서버 환경에서 고성능 스토리지 구성을 지원한다.",
      "options": [
        "NAS (Network Attached Storage)",
        "SAN (Storage Area Network)",
        "RAID (Redundant Array of Independent Disks)",
        "SSD (Solid-State Drive)"
      ],
      "answer": 1,
      "explanation": "블록 단위 저장 장치 제공, Fibre Channel·iSCSI는 SAN의 단서다. NAS의 파일 단위 접근과 구별한다."
    },
    {
      "id": "nw2-2026-04-a-29",
      "number": 29,
      "category": "NOS",
      "question": "Windows Server 2022에서 사용하는 NTFS와 ReFS 파일 시스템의 특징에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "NTFS는 ACL을 이용하여 파일 및 폴더의 접근 권한을 사용자 또는 그룹별로 설정할 수 있다.",
        "NTFS는 EFS(Encrypting File System)를 이용하여 파일 시스템 수준의 암호화 기능을 지원한다.",
        "ReFS는 체크섬을 이용하여 메타데이터 손상을 감지하며, 적절한 복원력 있는 스토리지 구성에서는 손상된 데이터를 자동으로 복구할 수 있다.",
        "ReFS는 FAT32와의 호환성을 최대한 유지하는 것을 주요 목적으로 설계되었다."
      ],
      "answer": 3,
      "explanation": "ReFS는 복원력과 무결성을 위한 파일 시스템이며 FAT32 호환성이 주요 목적이 아니다."
    },
    {
      "id": "nw2-2026-04-a-30",
      "number": 30,
      "category": "NOS",
      "question": "Linux 환경에서 Apache HTTP Server 2.4의 기본 HTTP 서비스 포트를 80번에서 다른 포트로 변경하려고 한다. Apache 설정 파일에서 수정해야 할 지시어로 옳은 것은?",
      "options": [
        "KeepAlive",
        "DocumentRoot",
        "StartServers",
        "Listen"
      ],
      "answer": 3,
      "explanation": "Apache의 수신 포트 설정 지시어는 Listen이다."
    },
    {
      "id": "nw2-2026-04-a-31",
      "number": 31,
      "category": "NOS",
      "question": "Windows 환경에서 DNS 레코드를 변경한 후에도 특정 컴퓨터에서 이전 IP 주소로 접속되는 문제가 발생하였다. 로컬에 저장된 DNS 캐시가 원인으로 의심되는 경우, 이를 초기화하기 위한 명령어로 옳은 것은?",
      "options": [
        "ipconfig /displaydns",
        "ipconfig /flushdns",
        "ipconfig /release",
        "ipconfig /renew"
      ],
      "answer": 1,
      "explanation": "DNS 캐시 초기화는 ipconfig /flushdns이다."
    },
    {
      "id": "nw2-2026-04-a-32",
      "number": 32,
      "category": "NOS",
      "question": "Linux 시스템에서 사용 중인 물리 메모리와 사용 가능한 메모리의 용량, 공유 메모리 및 스왑 메모리의 사용 현황을 확인하는 명령어로 옳은 것은?",
      "options": [
        "mem",
        "free",
        "du",
        "df"
      ],
      "answer": 1,
      "explanation": "메모리와 스왑 사용량은 free로 확인한다."
    },
    {
      "id": "nw2-2026-04-a-33",
      "number": 33,
      "category": "NOS",
      "question": "서버 관리자는 Linux 시스템에서 vi 편집기로 설정 파일을 수정하고 있다. 일반 모드(Normal Mode)에서 커서가 위치한 문자 한 개만 삭제하고자 할 때 사용하는 명령어로 옳은 것은?",
      "options": [
        "dd",
        "x",
        "D",
        "dw"
      ],
      "answer": 1,
      "explanation": "vi 일반 모드에서 문자 하나 삭제는 x, 줄 삭제는 dd다."
    },
    {
      "id": "nw2-2026-04-a-34",
      "number": 34,
      "category": "NOS",
      "question": "서버 관리자는 Windows Server 2022에서 원격 시스템 관리에 필요한 사용자 권한을 설정하려고 한다. 관리자 권한 전체를 부여하지 않고 WinRM(Windows Remote Management)을 이용한 원격 관리 권한을 제공하기 위해 사용자를 추가할 기본 제공 로컬 그룹으로 옳은 것은?",
      "options": [
        "Power Users",
        "RDS Endpoint Servers",
        "Remote Management Users",
        "Performance Monitor Users"
      ],
      "answer": 2,
      "explanation": "WinRM 원격 관리에는 Remote Management Users 그룹을 사용한다."
    },
    {
      "id": "nw2-2026-04-a-35",
      "number": 35,
      "category": "NOS",
      "question": "서버 관리자는 Linux 시스템에서 웹 서비스 접속 장애가 발생하여 네트워크 상태를 점검하고 있다. 현재 서버에서 수신 대기(LISTEN) 중인 TCP 포트와 해당 포트를 사용하는 프로세스의 PID 및 이름을 확인하려고 한다. 이때 관리자 권한으로 실행할 명령어로 가장 적절한 것은?",
      "options": [
        "ps -ef | grep tcp",
        "ss -lntp",
        "ip route show",
        "cat /etc/services"
      ],
      "answer": 1,
      "explanation": "ss의 -l은 LISTEN, -n은 숫자, -t는 TCP, -p는 프로세스 정보다."
    },
    {
      "id": "nw2-2026-04-a-36",
      "number": 36,
      "category": "NOS",
      "question": "서버 관리자는 Windows Server 2022의 IIS(Internet Information Services)에서 FTP 서버를 운영하고 있다. 외부 사용자가 방화벽을 통해 FTP 서버에 접속할 때 수동 모드(Passive Mode)의 데이터 연결이 정상적으로 이루어지도록 설정하려고 한다. 이때 IIS의 FTP 방화벽 지원(FTP Firewall Support) 기능에 대한 설명으로 옳은 것은?",
      "options": [
        "FTP 서버의 사설 IP 주소를 외부 IP 주소 항목에 입력하여 클라이언트의 직접 접속을 허용한다.",
        "FTP 서비스의 방화벽 기능을 활성화하면 Windows Defender 방화벽에 필요한 포트가 자동으로 개방된다.",
        "FTP 서버가 NAT(Network Address Translation)를 우회하여 외부 클라이언트와 직접 데이터 연결을 수행하도록 설정한다.",
        "수동 모드에서 사용할 데이터 채널 포트 범위와 방화벽의 외부 IP 주소를 설정하여 외부 클라이언트의 데이터 연결을 지원한다."
      ],
      "answer": 3,
      "explanation": "FTP 방화벽 지원에서 수동 데이터 포트 범위와 외부 IP를 설정한다. 방화벽 규칙도 별도로 맞춰야 한다."
    },
    {
      "id": "nw2-2026-04-a-37",
      "number": 37,
      "category": "NOS",
      "question": "서버 관리자는 Windows Server 2022의 로컬 사용자 계정과 인증 정보에 대한 보안 점검을 수행하고 있다. 이 과정에서 SAM(Security Account Manager) 데이터베이스의 저장 위치와 관리 방식에 대해 확인하려고 한다. SAM 데이터베이스에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "SAM 데이터베이스는 로컬 사용자 계정의 암호를 평문으로 저장하므로 별도의 해시 처리가 필요하지 않다.",
        "SAM 데이터베이스는 기본적으로 %SystemRoot%\\System32\\Config\\SAM 경로에 저장된다.",
        "SAM 데이터베이스에는 로컬 사용자 계정 및 그룹 정보가 포함되므로 무단 접근을 방지하기 위한 접근 권한 관리가 필요하다.",
        "SAM 데이터베이스는 Windows 레지스트리 하이브 형태로 관리되며, 로컬 사용자 계정의 인증 정보를 관리하는 데 사용된다."
      ],
      "answer": 0,
      "explanation": "SAM은 암호를 평문으로 저장하지 않는다."
    },
    {
      "id": "nw2-2026-04-a-38",
      "number": 38,
      "category": "NOS",
      "question": "서버 관리자는 Linux 시스템에서 배포 스크립트 config.sh의 접근 권한을 설정하기 위해 ′chmod 754 config.sh′ 명령어를 실행했다. 명령어가 정상적으로 실행되었을 때, 해당 파일의 접근 권한을 기호 형식으로 올바르게 표현한 것은?",
      "options": [
        "rwxr-xr--",
        "rwxrw-r--",
        "rwxr-x--x",
        "rw-rwxr--"
      ],
      "answer": 0,
      "explanation": "7=rwx, 5=r-x, 4=r--이므로 rwxr-xr--이다."
    },
    {
      "id": "nw2-2026-04-a-39",
      "number": 39,
      "category": "NOS",
      "question": "서버 관리자는 Linux 시스템에서 디렉터리를 정리하기 위해 다음 작업을 순서대로 수행하려고 한다. 각 작업에 사용할 명령어가 순서대로 올바르게 나열된 것은? (단, 명령어 실행에 필요한 권한은 모두 가지고 있다고 가정한다.)\n\n(1) backup이라는 새 디렉터리를 생성한다.\n(2) 파일과 하위 디렉터리가 포함된 old_backup 디렉터리를 재귀적으로 삭제하되, 쓰기 방지된 파일에 대해서도 확인 메시지를 표시하지 않도록 한다.\n(3) backup 디렉터리의 이름을 backup_new로 변경한다.",
      "options": [
        "mkdir, rmdir, mv",
        "mkdir, rm -r, rename",
        "mkdir, rm -rf, mv",
        "mkdir, rm -f, mv"
      ],
      "answer": 2,
      "explanation": "생성은 mkdir, 하위 항목을 포함한 재귀 삭제와 확인 메시지 생략은 rm -rf, 디렉터리 이름 변경은 mv다. -r은 재귀 처리, -f는 강제 처리 옵션이다."
    },
    {
      "id": "nw2-2026-04-a-40",
      "number": 40,
      "category": "NOS",
      "question": "서버 관리자는 Windows Server 2022에서 서버의 성능 저하 원인을 분석하고 있다. 이를 위해 특정 성능 카운터를 선택하여 실시간 그래프로 확인하고, 데이터 수집기 집합(Data Collector Sets)을 구성하여 성능 정보를 일정 기간 기록하려고 한다. 이때 실행해야 할 관리 도구의 명령어로 옳은 것은?",
      "options": [
        "perfmon.exe",
        "resmon.exe",
        "eventvwr.exe",
        "taskmgr.exe"
      ],
      "answer": 0,
      "explanation": "성능 카운터 그래프와 데이터 수집기 집합은 성능 모니터 perfmon이다."
    },
    {
      "id": "nw2-2026-04-a-41",
      "number": 41,
      "category": "NOS",
      "question": "서버 관리자는 Linux 기반 웹 서버에서 네트워크 통신 장애를 점검하고 있다. 원격 서버의 특정 TCP 포트에 연결하여 서비스의 접근 가능 여부를 확인하려고 한다. 이때 사용하는 명령어에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "′telnet′은 원격 서버의 특정 TCP 포트에 연결을 시도할 수 있다.",
        "′nc′는 원격 서버의 TCP 포트에 연결하여 통신 상태를 점검할 수 있다.",
        "′curl′은 HTTP 또는 HTTPS 서비스를 대상으로 요청을 보내 응답 상태를 확인할 수 있다.",
        "′ip addr show′는 원격 서버의 특정 TCP 포트에 연결하여 서비스의 접근 가능 여부를 확인한다."
      ],
      "answer": 3,
      "explanation": "ip addr show는 로컬 인터페이스 주소 조회 명령이다."
    },
    {
      "id": "nw2-2026-04-a-42",
      "number": 42,
      "category": "NOS",
      "question": "서버 관리자는 Linux 서버의 ′/root′ 디렉터리를 점검하던 중 ′/etc/passwd′ 파일이 ′/root′ 디렉터리에 복사된 것을 발견했다. ′/root/passwd′ 파일을 삭제하려 했으나 삭제되지 않았다. (A) 명령어로 파일 속성을 확인한 결과, 해당 파일에 ′i′ 속성이 설정되어 쓰기 및 삭제가 불가한 것을 확인했다. 해당 명령어 (A)는?",
      "options": [
        "file",
        "stat",
        "lsattr",
        "lsblk"
      ],
      "answer": 2,
      "explanation": "파일의 i(immutable) 속성 조회는 lsattr이다."
    },
    {
      "id": "nw2-2026-04-a-43",
      "number": 43,
      "category": "NOS",
      "question": "서버 관리자는 여러 대의 웹 서버에 클라이언트의 요청을 분산하기 위해 로드 밸런서를 구성하고 있다. 서버별 가중치는 동일하게 설정하고, 현재 활성 연결 수나 응답 시간에 관계없이 미리 정해진 순서에 따라 각 서버에 요청을 순차적으로 분배하려고 한다. 이때 사용하는 부하 분산 알고리즘으로 옳은 것은?",
      "options": [
        "Round Robin",
        "Least Connections",
        "IP Hash",
        "Weighted Response Time"
      ],
      "answer": 0,
      "explanation": "활성 연결 수와 무관한 순차 배분은 Round Robin이다."
    },
    {
      "id": "nw2-2026-04-a-44",
      "number": 44,
      "category": "NOS",
      "question": "서버 관리자는 Linux 시스템에 신규 디스크를 추가한 후, 현재 마운트된 파일 시스템과 마운트 지점을 확인하려고 한다. 이때 사용할 명령어에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "′fdisk -l′은 현재 마운트된 파일 시스템의 마운트 지점과 마운트 옵션을 확인하는 명령어이다.",
        "′mount′는 현재 마운트된 파일 시스템과 마운트 지점 및 마운트 옵션을 확인할 수 있다.",
        "′findmnt′는 현재 마운트된 파일 시스템과 마운트 지점을 트리 형태로 확인할 수 있다.",
        "′df -h′는 마운트된 파일 시스템의 디스크 사용량과 마운트 지점을 확인할 수 있다."
      ],
      "answer": 0,
      "explanation": "fdisk -l은 파티션 정보를 조회한다. 마운트 상태·옵션 조회는 mount·findmnt이다."
    },
    {
      "id": "nw2-2026-04-a-45",
      "number": 45,
      "category": "NOS",
      "question": "서버 관리자는 UEFI 기반 컴퓨터에 Windows와 RHEL 9을 설치하여 멀티 부팅 환경을 구성하고 있다. 부팅 시 운영체제를 선택할 수 있는 메뉴를 제공하고, 선택한 Linux의 커널을 로드하거나 다른 운영체제의 부트로더로 제어를 전달하는 기능이 필요하다. 이때 RHEL 9에서 사용하는 부트로더로 옳은 것은?",
      "options": [
        "systemd-boot",
        "Windows Boot Manager",
        "shim",
        "GRUB 2"
      ],
      "answer": 3,
      "explanation": "RHEL 9의 부트 메뉴와 커널 로드는 GRUB 2가 담당한다."
    },
    {
      "id": "nw2-2026-04-a-46",
      "number": 46,
      "category": "네트워크 운용기기",
      "question": "다음 중 빛이 전달되는 코어(Core)와 이를 둘러싼 클래딩(Cladding)으로 구성되며, 두 층의 굴절률 차이를 이용해 신호를 전송하는 매체는?",
      "options": [
        "꼬임선 케이블(Twisted-Pair Cable)",
        "동축 케이블(Coaxial Cable)",
        "2선식 개방 선로(Two-Wire Open Lines)",
        "광섬유 케이블(Optical Fiber Cable)"
      ],
      "answer": 3,
      "explanation": "코어·클래딩·굴절률 차이는 광섬유의 단서다."
    },
    {
      "id": "nw2-2026-04-a-47",
      "number": 47,
      "category": "네트워크 운용기기",
      "question": "RAID 시스템 중 한 드라이브에 기록되는 모든 데이터를 다른 드라이브에 복사해 놓는 방법으로 복구 능력을 제공하며, ′Mirroring′으로 불리는 것은?",
      "options": [
        "RAID 0",
        "RAID 1",
        "RAID 3",
        "RAID 4"
      ],
      "answer": 1,
      "explanation": "미러링은 RAID 1이다."
    },
    {
      "id": "nw2-2026-04-a-48",
      "number": 48,
      "category": "네트워크 운용기기",
      "question": "네트워크 관리자는 기업 내부의 하나의 물리적 스위치 네트워크를 부서별로 논리적으로 분리하려고 한다. 이를 통해 서로 다른 부서의 장치를 별도의 브로드캐스트 도메인으로 구성하고자 할 때 사용하는 기술로 옳은 것은?",
      "options": [
        "NAC",
        "VLAN",
        "IPS",
        "IDS"
      ],
      "answer": 1,
      "explanation": "물리 스위치를 논리적 브로드캐스트 도메인으로 나누는 기술은 VLAN이다."
    },
    {
      "id": "nw2-2026-04-a-49",
      "number": 49,
      "category": "네트워크 운용기기",
      "question": "네트워크 담당자는 네트워크 장애를 분석하기 위해 OSI 7계층에서 사용하는 프로토콜 데이터 단위(PDU, Protocol Data Unit)를 확인하고 있다. 각 계층에서 사용하는 PDU의 명칭을 연결한 것으로 옳지 않은 것은?",
      "options": [
        "물리 계층(1계층) – 비트(Bit)",
        "데이터 링크 계층(2계층) – 프레임(Frame)",
        "네트워크 계층(3계층) – 패킷(Packet)",
        "전송 계층(4계층) – 데이터(Data)"
      ],
      "answer": 3,
      "explanation": "전송 계층 PDU는 TCP 세그먼트 또는 UDP 데이터그램이다."
    },
    {
      "id": "nw2-2026-04-a-50",
      "number": 50,
      "category": "네트워크 운용기기",
      "question": "네트워크 관리자는 L2 스위치로 구성된 네트워크에서 STP(Spanning Tree Protocol) 설정 오류로 프레임 루프가 발생한 것을 확인했다. 이때 프레임 루프로 인해 나타나는 현상에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "브로드캐스트 프레임이 반복적으로 전달되어 브로드캐스트 스톰(Broadcast Storm)이 발생할 수 있다.",
        "동일한 MAC 주소가 서로 다른 포트에서 반복적으로 학습되어 MAC 주소 테이블이 불안정해질 수 있다.",
        "동일한 프레임이 여러 경로를 통해 전달되어 수신 장치가 중복 프레임을 수신할 수 있다.",
        "다수의 위조된 출발지 MAC 주소를 가진 프레임을 대량으로 전송하여 스위치의 MAC 주소 테이블을 고갈시키는 현상이 일반적으로 발생한다."
      ],
      "answer": 3,
      "explanation": "위조 MAC 대량 전송으로 테이블을 고갈시키는 것은 MAC flooding 공격이며 일반적인 루프 증상과 구별한다."
    }
  ]
};
