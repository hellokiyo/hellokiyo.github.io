# 네트워크관리사 2급 실기 준비·가상 실험실 (v35)

## 어디서 시작하나요?

홈 → **실기 준비 시작**은 단계별 따라하기와 로드맵이다. 홈 → **가상 실험실 열기**는 직접 조작하는 데모다.

- 실기 준비: `#practical`
- 가상 실험실: `#lab`
- 기본 응시일: 사용자 제공2026-12-19. 2026-11-23 기준26일 남았다. 공식 정기시험 일정이라고 가정하지 않는다.

## 가상 실험실 사용법

1. **Windows 설정** → 이더넷의 속성 → TCP/IPv4 → 속성(R)을 연다. 수동 IP·DNS를 선택하고 네 옥텟씩 입력한다. IPv4 창의 확인 후, 이더넷 속성의 적용(A) 또는 확인을 눌러 반영한다. 취소하면 미적용 변경을 버린다.
2. **라우터 콘솔**에서 `?`로 지원 명령을 본다. `enable` → `configure terminal`로 모드를 바꾸고 인터페이스 주소와 정적 경로를 설정한다. `show`로 조회하고 `copy running-config startup-config` 입력 후 대상 파일명 질문에서 Enter를 눌러 가상 저장한다.
3. **케이블 작업대**에서 색을 핀으로 드래그한다. 꽂힌 선을 다른 핀으로 옮기면 두 선을 교환한다. A·B 양 끝을 모두 배치한다. 휴대폰은 색 선택 → 핀 터치로도 배치할 수 있다.
4. **실습 테스트**로 예제6조건을 확인한다. 틀린 입력·포트 비활성·저장 누락·양끝 결선 누락을 구별한다.
5. 모르는 조작은 ‘따라하기·로드맵’으로 이동해 예제를 연습하고 돌아온다.

직접 입력하는 주소는 모두 학습 예제다. 사용자의 실제 PC나 라우터에 적용하지 않는다. CLI는 문자열을 정해진 문법으로만 해석하며 OS명령/파일/네트워크를 실행하지 않는다. 원문 시험 복제나 공식 에뮬레이터 포장은 아니다.

### 지원 범위

- Windows: 네트워크 연결 → 이더넷 속성 → IPv4 속성, 자동/수동 선택, 옥텟별 입력/형식 검사, 확인/적용/취소. 대체 DNS와 고급 옵션은 미구현이다. DNS/DHCP/IIS 전체 관리 콘솔은 구현하지 않았다.
- 라우터: user/privileged/config/interface 모드, enable, configure terminal, interface FastEthernet0/0·0/1, ip address, shutdown/no shutdown, hostname, ip route, end/exit, show ip interface brief, show ip route, show running-config, copy running-config startup-config, write memory, 가상 reload. 고유한 명령 접두어 축약과 ? 도움말, do 조회, description/no description, no ip address, no ip route, show startup-config 지원. 오타/모드 오류는 캐럿 오류, 누락 인자는 Incomplete, 중복 축약은 Ambiguous로 표시한다. 문법상 유효하지만 과제와 다른 값은 입력되며 실습 테스트에서 미충족으로 나온다. 알려진 미구현 명령은 시뮬레이터 지원 한계로 구별한다. 모든 IOS 명령을 판별하는 것은 아니다.
- 케이블: T568B 직결 예제 양끝의8핀 색 배치. 실물 압착·배선 품질·테스터 결과를 재현하지 않는다.
- 실제 패킷 전달, ping, DHCP 임대, DNS 질의, 가상 OS 부팅, 디스크 이미지, 모든 Cisco명령은 지원하지 않는다. 표시되는 경로는 설정 목록이고 물리 링크 상태는 구현하지 않는다.

### 저장의 두 의미

실험실의 running과 startup은 독립된 메모리 구성이다. 저장 후 값을 바꾸면 저장 조건이 다시 미충족이 된다. 실험실의 reload는 startup을 불러오고 저장하지 않은 수정은 사라진다. **브라우저 새로고침은 장비 전체를 초기화한다.**

별도로 ‘따라하기’에서 누른 예제 복습 완료와 실기 응시일은 학습 JSON에 저장·백업된다. 가상 장비와 콘솔 이력은 백업하지 않는다. 기존 필기 점수·산성비GP·오답에 가상 실험실 결과를 섞지 않는다.

## 따라하기 8개

| 예제 | 조작 |
|---|---|
| 처음 시작 | 두 공식 프로그램을 구별해서 열기 |
| 라우터 IP | 프롬프트·모드→포트→주소→활성화→조회→저장 |
| IPv4 | 속성창 진입→네 칸 입력→적용 후 대조 |
| DNS | 정방향 영역→A레코드→목록 확인 |
| DHCP | 주소풀→제외/임대→옵션→활성화 확인 |
| IIS | 사이트 이름→실제 경로→바인딩→재확인 |
| 정적 경로 | 목적지·마스크·다음홉→조회→저장 |
| 케이블 | 방향→색 순서→삽입/압착→양끝 확인 |

명령/주소 입력이 있는 단계는 예제 조건을 확인해야 다음으로 진행한다. 순서를 읽고 누르는 완료는 자가체크이며 실제 도구 연습 확인이나 합격 예상 점수가 아니다. 계정·서비스·보안 설정 및 추가 실기 항목은 공식 연습 자료로 보충한다.

## 26일 로드맵

- 11/23~11/29: 도구 실행, 라우터 IP, IPv4. 케이블 실물 연습 시작.
- 11/30~12/06: Windows DNS·DHCP·IIS, 계정·서비스 등 공식 항목 보충.
- 12/07~12/13: 정적 경로와 여러 설정을 섞어 반복. 단답·서브넷도 복습.
- 12/14~12/18: 공식 도구로80분 모의 연습, 저장/제출 누락과 실패 작업 재연습.

이 로드맵은 사용자 일정에 맞춘 학습 제안이다. 실제 문항 구성·지원 명령·저장 방식·도구 허용은 응시 안내와 지시문을 우선한다. 프로그램 설치/실행은 사용자가 공식 안내에 따라 수행하며 이번 작업에서 설치하거나 OS설정을 변경하지 않았다.

## 공식·기술 근거

- [ICQA 실습용 에뮬레이터64bit](https://www.icqa.or.kr/cn/board/dataroom/18)
- [ICQA Router Emulator](https://www.icqa.or.kr/cn/board/dataroom/21)
- [ICQA 출제기준 변경](https://www.icqa.or.kr/cn/board/notice/463): Windows Server2022 기준과 기존 실기 에뮬레이터 방식 안내.
- [ICQA 검정 안내](https://www.icqa.or.kr/cn/page/network)
- [Microsoft ipconfig](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig)
- [Microsoft DNS 설치/설정](https://learn.microsoft.com/en-us/windows-server/networking/dns/quickstart-install-configure-dns-server?tabs=gui)
- [Cisco 인터페이스 설정/저장](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst3850/software/release/3e/consolidated_guide/configuration_guide/b_consolidated_3850_3e_cg/b_consolidated_3850_3e_cg_chapter_0100.html)
- [TRENDnet 결선 순서/방향](https://www.trendnet.com/support/faqs/?ToDo=view&catId=967&questId=399)

공식 프로그램은 링크로 안내하고 바이너리나 공식 문항을 재수록하지 않았다. 기술 문법은 자체 예제로 설명한다. 확인일2026-11-23.

## 구조와 검증

- data/practical-study.js: 예제8개·로드맵·출처·자가체크 정제.
- domain/practical-lab.js: 순수 상태 전이·IPv4/마스크 검사·가상 running/startup·6조건 검사.
- pages/practical-page.js: 따라하기/응시일/완료 화면.
- pages/practical-lab-page.js: 콘솔·케이블 입력 UI와 드래그 전달, 장비 메모리 소유.
- ui/lab-windows.js: Windows 모형의 창 이동·초안/대기/적용 상태와 입력 검증. css/lab-windows.css: 창/옥텟/반응형 표현.
- app.js: 화면 조립/이벤트 위임. core.js: 실기 응시일·완료백업 정제. css/practical.css: 반응형 화면.

`node scripts/check-site.cjs`: 정적참조65개·JS구문·126테스트 통과. 새검증은 모드 전이/원본불변/오입력/저장과재시작/입력이스케이프/예제조건/완료정제/시험격리/따라하기 진행 경계를 포함한다.

브라우저에서 Windows 오입력 거절→적용(1/6), 라우터 IP·포트·정적경로·저장(5/6), 케이블 양끝 배치(6/6)를 직접 조작했다. IPv4따라하기 완료 후 새로고침에서1/8자가체크 복원을 확인했다. 1280px데스크톱과412x915모바일에서 콘솔/입력 표시·가로넘침 없음, 브라우저오류 없음 확인. 실제 기기·실제 ICQA프로그램 설치실행·공개배포·공식채점 검증은 미실행이다.

[가상설정 화면](../audits/practical-lab-windows-v34.jpg) · [전체조건 통과 화면](../audits/practical-lab-desktop-v34.jpg) · [모바일 콘솔](../audits/practical-lab-mobile-v34.jpg)

## v35 추가 검증과 한계

`node scripts/check-site.cjs`: 정적 참조67개·전체 JS 구문·131테스트 통과. 새 회귀는 명령 축약/모드/오류/저장 확인, 잘못된 경로, 드래그 데이터 전달/선 교환/오염·오래된 입력 거절, Windows 적용·취소·자동 모드를 확인한다.

브라우저에서 Windows 잘못된 IP 거절 → IPv4 확인만으로 미적용 → 부모 적용 후1/6, CLI 오타/모드/누락/중복 축약 오류와 유효하지만 과제와 다른 주소의 입력, copy 후 Enter 저장을 확인했다. 412×915에서 Windows 속성과 케이블 터치 대체 조작을 확인했고 IPv4 문서 너비412px로 가로 넘침이 없었다. 데스크톱 네이티브 마우스 드래그 끝까지의 조작 검증은 완료하지 못했다. 드래그 이벤트 전달은 자동 회귀 검사로 확인했으며 실제 터치 드래그는 구현하지 않았다. 실제 기기·공식 도구와의 동일성 검증이 아니다.

[Windows 속성 데스크톱](../audits/lab-windows-v35.jpg) · [Windows 속성 모바일](../audits/lab-windows-mobile-v35.jpg)

추가 근거: [Cisco CLI 오류와 도움말](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9600/software/release/17-15/command_reference/b_1715_9600_cr/using_the_command-line_interface.html), [Microsoft IPv4 속성 설명](https://download.microsoft.com/download/9/4/6/946958ef-7b86-4ddc-bfdb-c7ed2af4ce51/tcpip_fund.pdf), [MDN 드래그 전달](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations). 공식 이미지를 복제하지 않고 HTML/CSS로 학습 모형을 작성했다. 직접 개발자 관찰을 근거로 했으며 사용자 후기 조사·사용자 과제 시험을 수행했다고 주장하지 않는다.

## v36 검사 결과와 홈 정리

홈에서는 실기 준비/실험실을 먼저 선택하고, 필기 복습은 접힌 ‘필기 복습 도구’를 연다. 필기 14일 계획과 실기 로드맵을 구별해 안내한다. 검사에서 미충족이면 실제 적용값, 확인할 명령 또는 어긋난 핀 번호를 보고 ‘해당 설정으로 이동’을 누른다. 라우터 위에는 현재 모드와 저장 상태가 보인다. 설정을 바꿨다면 이전 검사 결과임을 표시하며 다시 테스트한다. show 조회만으로는 변경 경고를 띄우지 않는다.

정적 참조67개·JS 구문·132테스트 통과. 브라우저에서 홈 펼침, 검사→라우터 이동→IP/포트/저장3조건 충족, 변경 경고와 조회 구별을 확인했다. 412×915 모바일에서 홈/케이블 가로 넘침 없음과 브라우저 오류 로그 없음을 확인했다. 실제 기기나 공식 성적 검증은 아니다. [홈 화면](../audits/home-mobile-v36.jpg) · [검사 결과](../audits/lab-feedback-v36.jpg).

## v37 필기와 실기 구분

상단의 실기를 선택하면 실기 전용 홈/준비/실험실 메뉴로 전환한다. 필기를 누르면 기출·오답·암기 화면으로 돌아간다. 실습 과제는 자체 예제이며 공식 실기 기출이나 객관식 필기 점수와 섞지 않는다. 직접 링크는 해당 화면의 단계를 선택하며 홈에서는 마지막 선택을 기억한다.

## v38 따라하기와 자유 콘솔 선택

처음이라면 실기 준비 → 라우터 IP 예제에서 순서대로 읽는다. 각 단계의 ‘왜 이걸 하나요?’와 ‘여기를 보세요’, 입력 뒤 모습 예시를 확인하고 명령을 입력해 다음으로 이동한다. 이 출력은 설명용이며 입력에 따라 실행된 결과가 아니다. 자유롭게 명령을 실행하고 결과를 보려면 실험실 콘솔을 사용한다. 라우터 IP 8단계의 단어·프롬프트·포트 상태·저장 확인 설명을 보강했다.

## v40 추가 범위
실기 메뉴→풀이 사전에서13개 주제의 절차·명령·공식 출처를 읽는다. 콘솔은 Serial2/0의 secondary, show users, line vty/password/login과 저장을 추가 지원한다. 실제 원격 연결은 하지 않는다. 다이렉트/크로스 결선과 단답5단계도 제공한다. [반복 검토와 미검증 범위](audits/practical-exam-review-2026-11-25.md)를 확인한다.

## v40.1 DHCP 연습
풀이 사전→라우터 DHCP 풀 만들기에서 자체 명령 예제를 보고 실험실 콘솔에 입력한다. network에는 호스트 IP가 아닌 네트워크 주소를 쓴다. 풀 모드의 exit는 전역 설정으로, end는 관리 모드로 돌아온다. show run 확인 후 copy run start와 파일명 Enter로 가상 저장한다. 임대·패킷은 발생하지 않는다.
