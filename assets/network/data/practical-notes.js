/* 실기 풀이에 필요한 자체 설명 원본. 복원 시험 원문은 재수록하지 않습니다.
   Windows/라우터 설정은 설명이며 실제 계정·서비스·네트워크를 변경하지 않습니다. */
(function (root) {
  "use strict";
  const lessons = [];
  lessons.push({
    id: "subnet",
    title: "서브넷 계산과 마스크 역산",
    summary: "처음·마지막 호스트와 역으로 마스크 찾기",
    steps: [
      "/27은 마스크255.255.255.224, 블록32, 일반 호스트30개다. /25~30의 마지막 옥텟은128·192·224·240·248·252, 블록은128·64·32·16·8·4다.",
      "네트워크 N의 첫 호스트는 N+1, 마지막은 다음 블록 시작-2, 브로드캐스트는 다음 블록 시작-1이다. 예:203.0.113.32/27은 호스트33~62, 브로드캐스트63이다.",
      "IP와 네트워크 주소만 주면 /1~30 후보마다 IP AND 마스크가 제시 네트워크와 같은지 검사한다. 호스트가 네트워크/브로드캐스트인지도 제외한다. 후보가 여러 개면 지문 추가 조건 없이 한 개로 단정하지 않는다.",
      "예:203.0.113.92와 네트워크88은 /29의88~95구간에 속한다. /30이면 네트워크가92이므로 조건과 다르다. 마스크255.255.255.248.",
      "Windows의 이더넷→IPv4 속성에서 지문이 요구한 IP와 게이트웨이를 각각 계산해 입력한다. 게이트웨이는 첫 주소라고 가정하지 말고 지문의 첫/마지막 지시를 따른다.",
    ],
    sources: [
      {
        title: "Microsoft 주소·서브넷",
        url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting",
      },
    ],
  });
  lessons.push({
    id: "linux-diagnostics",
    title: "Linux 출력에서 명령과 연결 상태 찾기",
    summary: "dig·netstat·ICMP를 출력으로 구별",
    steps: [
      "QUESTION SECTION, ANSWER SECTION, HEADER와 opcode: QUERY 같은 DNS 메시지 구역은 dig의 대표 출력이다. Server/Address 위주의 nslookup 출력과 구별한다. 명령 이름만 물으면 dig만 쓴다.",
      "netstat -nat에서 n은 숫자, a는 전체, t는 TCP다. State가 LISTEN인 행을 세고 ESTABLISHED와 CLOSE_WAIT는 빼야 한다. 같은 서비스여도 서로 다른 주소의 LISTEN 행은 따로 센다.",
      "Local Address는 내 쪽 주소·포트, Foreign Address는 상대 쪽이다. SSH를 찾을 때 상대의 임시 포트 대신 로컬22번과 연결 상태를 함께 확인한다.",
      "예:LISTEN 행3개, 로컬22번 ESTABLISHED 행2개가 있으면 대기 항목3개와 SSH 연결2개를 구별한다. 포트번호가 아닌 프로토콜 이름을 요구하면 SSH로 답한다.",
      "ping의 ICMP Echo Request/Echo Reply에서 공통 이름은 Echo다. Linux echo 명령의 문자열 출력 기능과 같은 단어지만 문맥이 다르다.",
    ],
    sources: [
      {
        title: "ISC BIND dig 설명",
        url: "https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility",
      },
      { title: "RFC792 ICMP", url: "https://www.rfc-editor.org/rfc/rfc792" },
    ],
  });
  lessons.push({
    id: "ipv6",
    title: "IPv6 복수선택 판별",
    summary: "주소·기본 헤더·체크섬·전송 방식",
    steps: [
      "IPv6 주소는128비트, 기본 헤더는 고정40바이트다. 필요한 추가 정보는 확장 헤더로 처리한다. 기본 헤더가 가변이라는 문장은 구별한다.",
      "IPv4에 있던 일부 기본 헤더 필드를 줄였다. IPv6 기본 헤더에는 헤더 체크섬 필드가 없다. 상위 계층 체크섬까지 없다는 뜻은 아니다.",
      "유니캐스트·멀티캐스트·애니캐스트를 구별한다. IPv6에는 브로드캐스트 주소가 없으며 같은 링크의 여러 대상 전달에는 멀티캐스트 등을 쓴다.",
      "모두 고르는 문제는 각 보기의 주소 길이, 고정/가변, 체크섬 존재, 브로드캐스트 여부를 따로 판단한다. 답 번호 순서를 외우지 않는다.",
    ],
    sources: [{ title: "IETF IPv6 규격", url: "https://datatracker.ietf.org/doc/html/rfc8200" }],
  });
  lessons.push({
    id: "web",
    title: "IIS 웹 사이트 조건을 끝까지 적용하기",
    summary: "바인딩 외의 연결 시간·기본 문서·인증도 확인",
    steps: [
      "IIS 관리자→사이트→웹 사이트 추가에서 사이트 이름과 실제 폴더 경로를 구별한다. 바인딩의 IP·프로토콜·포트·호스트 이름은 지문의 값 그대로 옮긴다. 호스트 이름에 http://나 폴더 경로를 넣지 않는다.",
      "선택한 사이트→고급 설정→연결 제한에서 연결 시간 제한을 확인한다. 지문 단위가 초인지 먼저 본다. 예:240초는4분이다. 바인딩의 포트와 다른 항목이다.",
      "사이트→기본 문서에서 요구한 파일을 추가하고, 그 파일만 사용하라고 했으면 나머지 기본 문서 항목을 제거한다. 기본 문서의 순서만 올리는 것과 하나만 남기는 것은 다르다.",
      "사이트→인증→익명 인증을 선택해 사용/사용 안 함을 지문대로 정한다. 익명 인증을 끄라는 지시가 다른 인증 방식을 마음대로 켜도 된다는 뜻은 아니다.",
      "마지막으로 바인딩, 고급 설정, 기본 문서, 인증 화면을 각각 다시 연다. 사이트 생성 성공만으로 모든 조건이 반영됐다고 보지 않는다. 여기의 설명은 실제 운영 서버 생성이 아니다.",
    ],
    sources: [
      {
        title: "IIS 연결 제한",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/sitedefaults/limits",
      },
      {
        title: "IIS 기본 문서",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.webserver/defaultdocument/",
      },
      {
        title: "IIS 익명 인증",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/authentication/anonymousauthentication/",
      },
    ],
  });
  lessons.push({
    id: "dhcp",
    title: "DHCP 범위·제외·임대·옵션",
    summary: "범위 하나를 만들었다고 모든 조건이 끝난 것은 아니다",
    steps: [
      "DHCP 관리→서버→IPv4→새 범위. 범위 이름의 대소문자와 설명을 지문대로 입력한다. 이름과 주소 범위는 서로 다른 조건이다.",
      "시작·끝 주소와 프리픽스 또는 마스크를 입력한다. /25는255.255.255.128이다. 서버 자신에게 줄 고정 IP를 주소 풀 입력칸에 쓰지 않는다.",
      "새 범위 마법사의 제외 주소에서 시작·끝을 추가한다. 예:풀192.0.2.1~126 중50~59를 제외하면 그10개는 동적 분배하지 않는다. 제외 주소를 범위 밖에 추가하지 않는다.",
      "임대 기간의 일·시간·분 칸을 구별한다. 예:3일이면 일3, 나머지0이다. 지문이7일이면 같은 방식으로7을 입력한다.",
      "범위 옵션의003 라우터는 클라이언트의 기본 게이트웨이,006 DNS 서버는 질의 대상이다. 요구하지 않은 DNS/도메인 옵션을 임의 추가하지 않는다.",
      "활성화 지시까지 확인하고 범위 속성·제외 목록·임대·옵션을 각각 다시 연다. 이 사이트는 DHCP 서버나 실제 임대를 실행하지 않는다.",
    ],
    sources: [
      {
        title: "Microsoft DHCP 구성",
        url: "https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server",
      },
    ],
  });
  lessons.push({
    id: "dns-soa",
    title: "DNS 영역과 SOA 값을 관리창에 옮기기",
    summary: "호스트(A) 추가와 SOA 속성은 별도 작업",
    steps: [
      "DNS 관리자→서버→정방향 조회 영역에서 지시한 영역을 만든다. 영역 이름, 영역 파일 이름, 레코드의 호스트 이름은 각각 다르다.",
      "영역→속성→권한 시작(SOA)에서 일련번호, 주 서버, 책임자를 입력한다. 책임자는 DNS 파일에서 메일 주소의 @ 대신 점으로 나타날 수 있다. 예:hostmaster.lab.example.는 hostmaster@lab.example을 뜻한다.",
      "SOA 괄호 안의 숫자는 Serial→Refresh→Retry→Expire→Minimum 순서로 읽는다. 각 숫자의 의미를 이름과 연결한 뒤 칸으로 옮긴다.",
      "예:일련번호20, refresh1800초, retry600초, expire86400초, minimum3600초를 제시하면20 /30분 /10분 /1일 /1시간이다. 입력창이 초 단위면 변환하지 말고 원래 초 값을 넣는다.",
      "레코드 앞 TTL과 SOA MINIMUM은 서로 다른 칸이다. 현대 DNS에서 MINIMUM은 부정 응답 캐시 시간과 관련된다. 시험 도구의 최소TTL 표시를 보고 옮기며 무조건 모든 레코드 TTL이라고 외우지 않는다.",
      "A 레코드는 이름→IPv4, AAAA는 이름→IPv6, CNAME은 별칭이다. SOA 조건과 별도로 호스트 추가 지시가 있으면 새 호스트에서 입력하고 영역 속성과 레코드를 각각 재확인한다.",
    ],
    sources: [
      {
        title: "Microsoft DNS 영역",
        url: "https://learn.microsoft.com/en-us/windows-server/networking/dns/manage-dns-zones",
      },
      { title: "RFC2308 SOA 캐시", url: "https://www.rfc-editor.org/rfc/rfc2308" },
    ],
  });
  lessons.push({
    id: "security-policy",
    title: "로컬 보안 정책의 위치와 단위",
    summary: "암호·계정 잠금·로그온 메시지를 서로 다른 곳에 입력",
    steps: [
      "실습 도구에서 로컬 보안 정책을 연다. 일반 Windows 경로는 secpol.msc이며 사이트가 명령을 실행하지 않는다. 보안 설정→계정 정책→암호 정책에서 최소/최대 암호 사용 기간과 복잡성 설정을 찾는다.",
      "최소 사용 기간은 다시 바꾸기까지의 대기 일수, 최대 사용 기간은 바꿔야 하는 주기다. 최소 길이(글자 수)와 혼동하지 않는다. 최소보다 최대가 커야 하는 관계도 확인한다. 최대0(무기한)은 예외다.",
      "계정 정책→계정 잠금 정책에서 임계값(실패 횟수), 잠금 기간(분), 다음 시간 후 계정 잠금 수를 원래대로 설정(분)을 구별한다. 지문에 없는 값을 임의로 추측하지 않는다.",
      "예:실패4회에15분 잠금이면 임계값4, 기간15분이다. 관리자가 풀 때까지 잠금과 특정 분 후 자동 해제는 다르다. 다른 항목의 자동 제안이 뜨면 적용 뒤 요구값이 유지되는지 확인한다.",
      "로그온 전 경고창은 로컬 정책→보안 옵션→대화형 로그온의 사용자에 대한 메시지 제목과 메시지 텍스트에서 각각 입력한다. 창 제목을 본문 칸에 넣지 않는다.",
      "설정을 적용한 뒤 각 정책을 다시 연다. 설명은 시험용 도구 학습이며 서비스의 로그인·인증 기능이나 실제 PC 보안 정책을 추가/변경하지 않는다.",
    ],
    sources: [
      {
        title: "Microsoft 최소 암호 사용 기간",
        url: "https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/minimum-password-age",
      },
      {
        title: "Microsoft 계정 잠금 기간",
        url: "https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/account-lockout-duration",
      },
      {
        title: "Microsoft 로그온 메시지",
        url: "https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/interactive-logon-message-text-for-users-attempting-to-log-on",
      },
    ],
  });
  lessons.push({
    id: "ftp",
    title: "FTP 사이트와 세부 옵션",
    summary: "바인딩·가상 디렉터리 표시·업로드 파일·외부 주소",
    steps: [
      "IIS 관리자→사이트→FTP 사이트 추가에서 표시 이름과 실제 경로를 입력한다. 바인딩의 IP·제어 포트는 지문을 따른다. 기본21번이 아닌 포트가 주어지면 그 값이 우선이다.",
      "사이트→FTP 디렉터리 검색에서 표시 옵션을 확인한다. 가상 디렉터리를 목록에 표시하는 조건과 별칭으로 실제 가상 디렉터리를 추가하는 작업은 다르다. 지문의 표현과 옵션 이름을 비교한다.",
      "사이트→FTP 요청 필터링이나 승인 규칙을 추측해서 바꾸지 않는다. 업로드 도중 파일 읽기 허용은 FTP 사이트의 고급 설정→파일 처리→업로드하는 동안 파일 읽기 허용(allowReadUploads)에서 찾는다.",
      "사이트→FTP 방화벽 지원에서 방화벽의 외부 IP 주소를 설정한다. FTP 바인딩의 내부 IP, 패시브 데이터 채널 포트 범위와 구별한다. 외부 IP가 제시되면 해당 칸에만 옮긴다.",
      "인증/권한/SSL 조건은 문제에 있는 항목만 설정하고 바인딩·디렉터리 검색·파일 처리·방화벽 지원을 각각 다시 확인한다. 이 사이트는 FTP 서버를 열거나 실제 방화벽을 변경하지 않는다.",
    ],
    sources: [
      {
        title: "IIS FTP 파일 처리",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/site/ftpserver/filehandling/",
      },
      {
        title: "IIS FTP 디렉터리 검색",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/site/ftpserver/directorybrowse/",
      },
      {
        title: "IIS FTP 방화벽 지원",
        url: "https://learn.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/site/ftpserver/firewallsupport",
      },
    ],
  });
  lessons.push({
    id: "services",
    title: "설명으로 Windows 서비스를 찾고 상태 바꾸기",
    summary: "시작 유형과 현재 실행 상태는 별개",
    steps: [
      "서비스 관리 창(일반 Windows에서는 services.msc)에서 이름뿐 아니라 설명을 읽고 대상 서비스를 찾는다. 비슷한 이름의 사용자 서비스와 시스템 서비스를 구별한다.",
      "세션0에서 동작하며 Windows 알림 플랫폼과 WNS 연결을 다룬다는 설명은 Windows Push Notifications System Service, 서비스 이름 WpnService의 단서다. Windows Push Notifications User Service(WpnUserService)와 구별한다.",
      "WNS는 Windows Push Notification Services다. 복원 자료에 WINS라고 적혔다면 오래된 이름 서버로 바로 결론 내리지 말고 세션0·알림 플랫폼이라는 나머지 단서와 실제 서비스 설명을 함께 확인한다.",
      "서비스→속성→일반에서 시작 유형(자동/수동/사용 안 함)을 지문대로 선택한다. 다음 서비스 상태의 시작/중지 버튼을 요구대로 조작하고 적용한다.",
      "사용 안 함은 다음 시작 정책이고 중지는 현재 실행 상태다. 하나를 바꿨다고 다른 조건까지 자동 충족됐다고 보지 않는다. 속성을 다시 열어 시작 유형과 서비스 상태 두 값을 읽는다.",
      "이 안내는 시험용 실습 도구에 적용하는 방법이다. 이 사이트는 실제 서비스를 중지하지 않으며 개인 PC의 알림 기능을 끄라고 요구하지 않는다.",
    ],
    sources: [
      {
        title: "Microsoft Windows 서비스 지침",
        url: "https://learn.microsoft.com/en-us/windows-server/security/windows-services/security-guidelines-for-disabling-system-services-in-windows-server",
      },
    ],
  });
  lessons.push({
    id: "users-sessions",
    title: "사용자·그룹·세션 조건 나누기",
    summary: "그룹 설명·사용자 전체 이름·세션 제한을 각각 확인",
    steps: [
      "실습 도구의 로컬 사용자 및 그룹을 연다. 일반 Windows에서는 컴퓨터 관리→로컬 사용자 및 그룹 또는 lusrmgr.msc에서 찾는다. 그룹→새 그룹에 그룹 이름과 설명을 지문대로 입력한다.",
      "사용자→새 사용자에서 사용자 이름, 전체 이름, 설명을 구별한다. 사용자 이름에 전체 이름이나 설명을 합쳐 쓰지 않는다. 암호 입력이 필요한 연습은 공식 도구의 지시만 따르고 이 사이트에 실제 암호를 입력하지 않는다.",
      "사용자가 암호를 변경할 수 없음, 암호 사용 기간 제한 없음, 다음 로그온 시 변경은 서로 다른 옵션이다. 예를 들어 변경할 수 없음 지시를 무기한 사용으로 대신하지 않는다.",
      "사용자 속성→소속 그룹에서 추가를 눌러 정확한 그룹을 검색/확인한다. 그룹의 구성원 목록에서도 해당 사용자가 보이는지 확인한다. 같은 이름의 다른 그룹이나 기본 그룹만으로 끝내지 않는다.",
      "연결이 끊긴 세션의 종료 제한과 유휴 세션 제한은 다르다. 공식 실습 도구가 제공하는 사용자 속성의 세션 탭에서 각각 입력한다. 예:끊긴 세션2분, 유휴10분을 서로 바꾸지 않는다.",
      "Windows Server 실제 환경은 RDS 역할·버전에 따라 원격 데스크톱 세션 호스트의 세션 시간 제한 정책에서 설정할 수 있다. 이 차이를 시험용 에뮬레이터의 사용자 세션 탭과 혼동하지 않는다. 적용 뒤 사용자 일반/옵션/소속 그룹/세션을 각각 확인한다.",
    ],
    sources: [
      {
        title: "Microsoft 로컬 사용자 그룹",
        url: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-default-user-accounts",
      },
      {
        title: "Microsoft 세션 제한 정책",
        url: "https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver",
      },
    ],
  });
  lessons.push({
    id: "router-users",
    title: "라우터에 접속한 사용자 조회",
    summary: "설정 조회와 접속 세션 조회 구별",
    steps: [
      "관리 모드 Router#에서 show users를 입력한다. 접속 회선·사용자·접속 위치를 확인하는 명령이며 포트 IP 조회인 show ip interface brief와 다르다.",
      "출력의 Line은 con/vty 같은 회선, User는 사용자, Host(s)는 연결 대상, Idle은 유휴 시간, Location은 접속 위치다. 별표는 현재 터미널 세션을 가리킨다.",
      "문제에서 저장도 요구하면 조회 후 copy running-config startup-config를 입력한다. 파일명 질문에 Enter로 기본값을 확인하고 [OK]까지 본다. 조회 명령 자체는 running-config를 바꾸지 않는다.",
      "실험실에서 enable→show users로 출력 모양을 연습할 수 있다. 콘솔 한 개만 있는 모형이며 실제 접속자 탐지 기능은 아니다.",
    ],
    code: "enable\nshow users\ncopy running-config startup-config\n[대상 파일명 확인에서 Enter]",
    sources: [
      {
        title: "Cisco show users",
        url: "https://www.cisco.com/c/en/us/td/docs/ios/termserv/command/reference/tsv_book/tsv_s1.html",
      },
    ],
  });
  lessons.push({
    id: "router-secondary",
    title: "직렬 포트와 보조 IP 주소",
    summary: "두 번째 ip address로 첫 주소를 덮어쓰지 않기",
    steps: [
      "인터페이스 종류와 번호를 먼저 읽는다. FastEthernet0/0과 Serial2/0은 다른 대상이다. interface Serial2/0에서 포트를 고르고 no shutdown으로 관리상 활성화한다.",
      "첫 주소는 ip address 주소 마스크로 지정한다. 두 번째 주소를 같은 명령으로만 입력하면 첫 주소를 바꾼다. 두 주소를 동시에 유지하려면 뒤에 secondary를 붙여 보조 주소로 설정한다.",
      "예:직렬 포트의 기본 주소192.0.2.81/24, 보조 주소192.0.2.82/24라면 아래처럼 각각 넣는다. 실제 장비/프로그램의 지원 조건과 지문이 우선이며 이 모형은 링크·clock rate·동기화를 재현하지 않는다.",
      "show ip interface brief는 주로 기본 주소를 요약한다. 보조 주소까지 확인하려면 show running-config에서 해당 인터페이스의 두 ip address 줄을 확인한다.",
      "지시한 저장 명령이 copy running-config startup-config라면 다른 저장 별칭으로 임의 대체하지 말고 그 명령과 파일명 확인을 마친다.",
    ],
    code: "enable\nconfigure terminal\ninterface Serial2/0\nip address 192.0.2.81 255.255.255.0\nip address 192.0.2.82 255.255.255.0 secondary\nno shutdown\nend\nshow running-config\ncopy running-config startup-config\n[Enter로 저장 파일명 확인]",
    sources: [
      {
        title: "Cisco 기본/보조 IPv4",
        url: "https://www.cisco.com/c/en/us/td/docs/routers/ios-xe/ip-addressing/ip-addressing/m_config-ipv4-addr-0.html",
      },
    ],
  });
  lessons.push({
    id: "router-vty",
    title: "VTY 비밀번호와 login·저장",
    summary: "명령 학습용이며 실제 인증 서버를 만들지 않는다",
    steps: [
      "VTY는 원격 터미널 연결을 받는 가상 회선이다. configure terminal 다음 line vty 0 4로0~4번 회선을 선택하면 (config-line)# 위치가 된다. 지문이 다른 범위를 지정하면 그 범위를 따른다.",
      "password 뒤에는 문제에서 제공한 연습용 문자열을 대소문자 그대로 입력한다. 실제 개인 비밀번호를 이 사이트에 쓰지 않는다.",
      "비밀번호를 설정하는 것과 그 비밀번호로 검사를 하도록 login을 켜는 것은 별개다. 로그인하도록 하라는 지시가 있으면 login이 필요하다. login local은 로컬 사용자 DB를 쓰므로 같은 답이 아니다.",
      "end 후 show running-config에서 line vty 범위와 login을 확인한다. 이 모형은 입력 비밀번호를 조회 출력에서 숨기며 실제 인증·네트워크 접속을 만들지 않는다.",
      "copy running-config startup-config로 저장하고 대상 파일명 질문에 Enter를 입력한다. 지문에서 이 저장 명령만 허용하면 write memory로 대체하지 않는다. Telnet은 평문이므로 실제 운영 권장 설정으로 받아들이지 않는다.",
    ],
    code: "enable\nconfigure terminal\nline vty 0 4\npassword PracticeOnly\nlogin\nend\nshow running-config\ncopy running-config startup-config\n[Enter로 파일명 확인]",
    sources: [
      {
        title: "Cisco 암호·로그인 명령",
        url: "https://www.cisco.com/c/en/us/td/docs/routers/ios-xe/security-vpn/security-vpn/m_sec-cfg-sec-4cli-0.html",
      },
    ],
  });
  lessons.push({
    id: "router-dhcp",
    title: "라우터 DHCP 풀 만들기",
    summary: "Windows 범위 마법사와 IOS DHCP 설정 모드 구별",
    steps: [
      "DHCP 풀 이름은 ip dhcp pool 이름으로 만든다. 입력 뒤 프롬프트가 (dhcp-config)#로 바뀌는지 확인한다. 이름은 지문의 대소문자를 보존한다.",
      "network에는 배포할 대역의 네트워크 주소와 서브넷 마스크를 쓴다. 예:192.0.2.64/26이면 network 192.0.2.64 255.255.255.192이다. 단말에 할당할 호스트 주소를 네트워크 주소 칸에 쓰지 않는다.",
      "기본 게이트웨이 또는 DNS 조건도 있을 때만 해당 풀 모드에서 default-router 주소, dns-server 주소로 지정한다. network만 요구하는 문제에 조건을 임의로 더하지 않는다. 실험실은 각 옵션의 IPv4 한 개만 지원한다.",
      "end로 관리 모드에 돌아와 show running-config의 ip dhcp pool 구역을 확인한다. pool 이름·network·mask가 맞는지 확인하고 copy running-config startup-config와 파일명 Enter까지 마친다.",
      "이 사이트는 설정 모양과 저장만 연습한다. 실제 DHCP 임대·클라이언트 통신, 제외 범위·임대 기간의 전체 IOS 명령은 재현하지 않는다. Windows DHCP 범위 설정은 별도 유형이다.",
    ],
    code: "enable\nconfigure terminal\nip dhcp pool PracticePool\nnetwork 192.0.2.64 255.255.255.192\nend\nshow running-config\ncopy running-config startup-config\n[Enter로 파일명 확인]",
    sources: [
      {
        title: "Cisco IOS XE DHCP 서버 구성",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/xe-2/dhcp-xe-2-book/config-dhcp-server-xe.html",
      },
    ],
  });
  lessons.push({
    id: "link-diagnostics",
    title: "랜카드 링크와 서버 대기 상태 읽기",
    summary: "ethtool의 Speed·Duplex·Link detected와 Listen",
    steps: [
      "ethtool eth0는 eth0 인터페이스의 이더넷 링크 정보를 읽는 예다. 실제 이름은 enp3s0처럼 다를 수 있다. 명령·인터페이스 이름의 대소문자를 그대로 쓴다. 모든 Linux 명령이 항상 소문자라는 규칙은 없다.",
      "Speed는 링크 속도, Duplex는 전이중/반이중, Auto-negotiation은 자동 협상, Link detected는 물리 링크 감지 여부다. Link detected: yes여도 DNS·인터넷·서비스 접속 성공을 보장하지 않는다.",
      "주소/인터페이스 목록은 ip addr, 경로는 ip route, 소켓 연결은 ss 또는 netstat, 링크 상세는 ethtool로 구별한다. ifconfig와 ethtool을 같은 기능이라고 외우지 않는다.",
      "서버의 Listen 지시어는 요청을 받을 주소·포트를 정하는 설정이다. Apache httpd의 Listen 8080은8080포트 수신 대기 설정 예이며, Linux 소켓 상태 LISTEN과 구별한다. 이 사이트는 Apache·Linux 명령 실행기를 제공하지 않는다.",
    ],
    sources: [
      {
        title: "Linux 커널 이더넷 진단",
        url: "https://www.kernel.org/doc/html/latest/networking/diagnostic/twisted_pair_layer1_diagnostics.html",
      },
      {
        title: "Apache Listen 지시어",
        url: "https://httpd.apache.org/docs/2.4/mod/mpm_common.html#listen",
      },
    ],
  });
  root.PracticalNotes = { lessons };
  if (typeof module !== "undefined" && module.exports) module.exports = root.PracticalNotes;
})(typeof window !== "undefined" ? window : globalThis);
