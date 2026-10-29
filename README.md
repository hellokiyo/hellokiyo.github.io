# 네트워크관리사 2급 — 시험 2주 전 합격 전략

> **공부 순서: 키워드로 맞히는 문제 → 명령어·숫자 암기 → 서브넷·권한 계산 → 혼동되는 이론.**
>
> 답 번호를 외우지 말고 **지문의 조건과 정답 용어를 연결**한다. 목표는 제한시간 안에 확실한 정답을 늘리는 것이다.

사용자 제공 기출·해설 모음을 주제별로 재구성했다. 자료가 객관식 중심이므로 **본문은 필기 대비**, 실기는 별도 부록으로 구분했다. 실기만 준비 중이면 부록부터 확인한다.

**‘자주 나옴’은 제공 자료에서 반복된다는 뜻이다.** 중복 문항, 누락된 그림·지문, 서로 다른 서버 버전이 섞여 있어 공식 출제 빈도나 다음 시험의 출제 확률로 해석하지 않는다. S/A/B는 반복 양상과 2주간 학습 효율을 고려한 편집상 우선순위다.

확인일: 2026-10-29. 실제 응시일과 관계없이 D-14부터 사용할 수 있게 구성했다.

## 목차

- [1. 목표와 우선순위](#1-목표와-우선순위)
- [2. 키워드로 빠르게 고르는 유형](#2-키워드로-빠르게-고르는-유형)
- [3. 반드시 외울 숫자와 대응표](#3-반드시-외울-숫자와-대응표)
- [4. 계산과 해석이 필요한 유형](#4-계산과-해석이-필요한-유형)
- [5. 필수 명령어](#5-필수-명령어)
- [6. 이해해야 풀리는 이론](#6-이해해야-풀리는-이론)
- [7. 원자료에서 바로잡을 내용](#7-원자료에서-바로잡을-내용)
- [8. 14일 학습 계획](#8-14일-학습-계획)
- [9. 시험장 풀이 전략](#9-시험장-풀이-전략)
- [10. 전날 최종 체크](#10-전날-최종-체크)
- [부록. 실기 준비](#부록-실기-준비)
- [출처와 정리 원칙](#출처와-정리-원칙)

## 1. 목표와 우선순위

### 시험 기준

| 구분 | 2급 기준 |
|---|---|
| 필기 | 50문항, 50분, 택일형 |
| 필기 과목 | 네트워크일반 / TCP·IP / NOS / 네트워크 운용기기 |
| 합격 기준 | 필기·실기 각각 100점 만점에 60점 이상 |
| 실기 | 1세트 1~20문항, 80분, 작업·서술·선택형 |

공식 기준: [ICQA 네트워크관리사 자격안내](https://www.icqa.or.kr/cn/page/network). 필기를 문항당 2점으로 환산하면 30문항이 합격선이다. 연습은 실수 여유를 위해 **40/50문항, 약 80점**을 목표로 한다. 이는 학습 목표이며 합격을 보장하는 수치는 아니다.

### 투자 순서

| 우선순위 | 묶음 | 공부 방법 | 완료 기준 |
|---|---|---|---|
| S | DNS 레코드, OSI·PDU·장비, NAT·VLAN·RAID | 표의 답을 가리고 답하기 | 단서만 듣고 용어를 말함 |
| S | Linux·Windows 명령어·옵션 | 목적 → 명령어 적기 | 유사 옵션까지 구별 |
| S | 포트·사설 IP·TCP/UDP·IPv6 | 숫자와 차이 암기 | 보기 순서가 바뀌어도 판단 |
| S | 서브넷·chmod·passwd | 직접 계산·해석 | 풀이를 재현 |
| A | 라우팅·DHCP·IIS·AD·ARQ | 비교표 후 문제 적용 | 틀린 보기를 고쳐 설명 |
| A | SDN·NFV·클라우드·부하분산·무선 | 키워드 묶음 암기 | 인접 개념과 구별 |
| B | 세부 헤더 길이·구형 기술·버전별 기능 | 실제 오답 중심 보충 | 기본 영역 이후 복습 |

시간이 부족하면 S를 먼저 완성한다. B도 쉬운 정의 문제는 챙기되, 희귀한 숫자 하나 때문에 명령어·DNS 복습을 밀지 않는다.

## 2. 키워드로 빠르게 고르는 유형

이 표는 무작위 찍기보다 **정의에 맞는 답을 빠르게 찾는 도구**다. 질문이 ‘옳은 것’인지 ‘옳지 않은 것’인지 먼저 확인한다.

### 주소·프로토콜·이름 해석

| 지문에서 찾을 말 | 우선 떠올릴 답 | 마지막 확인 |
|---|---|---|
| IPv4 주소 → MAC 주소 | ARP | 이름 → IP는 DNS |
| MAC → IP, 구형 주소 결정 | RARP | 실제 IP 자동 임대는 DHCP |
| IP·마스크·게이트웨이·DNS 자동 임대 | DHCP | 주소 변환은 NAT |
| 사설 주소 ↔ 공인 주소 변환 | NAT | 포트도 구분해 다수가 공유하면 PAT/NAPT |
| 장비 상태·트래픽·원격 관리·MIB | SNMP | 암호화 원격 로그인은 SSH |
| 오류 통지·도달 불가·Echo | ICMP | 데이터 신뢰성 보장 기능 X |
| IPv4 멀티캐스트 그룹 가입·탈퇴 | IGMP | IPv6에서는 MLD |
| 이름 → IPv4 | DNS A | IPv6이면 AAAA |
| IP → 이름·역방향 조회 | DNS PTR | IPv4 역방향 영역은 in-addr.arpa |
| 별칭을 실제 도메인 이름에 연결 | DNS CNAME | IP를 직접 지정하는 A와 구별 |
| 도메인의 메일 교환 서버 | DNS MX | 메일 전송 프로토콜은 SMTP |
| 영역의 권한 정보·일련번호·갱신 주기 | DNS SOA | 이름 서버 지정은 NS |
| 캐시 유효 시간 | DNS TTL | 라우터 홉 제한과 구별 |
| 메일 송신·서버 간 전달 | SMTP | 수신·메일함 접근은 POP3/IMAP |
| 서버의 메일함·폴더 동기화 | IMAP | POP3도 설정에 따라 서버 보관 가능 |
| 제어 연결과 데이터 연결 분리 | FTP | TFTP는 UDP, SFTP는 SSH 기반 |
| HTTP 데이터를 TLS로 보호 | HTTPS | 기본 포트 443 |

### 장비·스위칭·가상화

| 지문에서 찾을 말 | 우선 떠올릴 답 | 헷갈리는 보기 |
|---|---|---|
| 신호 재생·전송 거리 연장 | 리피터, L1 | MAC 학습 X |
| 목적지 MAC으로 프레임 전달 | L2 스위치·브리지 | 목적지 IP 기반이면 L3 |
| 서로 다른 IP 네트워크 사이 경로 선택 | 라우터·L3 스위치 | 단순 L2 전달과 구별 |
| 논리적으로 브로드캐스트 도메인 분리 | VLAN | 루프 방지는 STP |
| 이중화된 L2 경로의 루프 방지 | STP | VLAN 정보 동기화는 VTP |
| 스위치 사이 VLAN 프레임 태그 | IEEE 802.1Q | VTP가 태깅 규격인 것은 아님 |
| 여러 스위치의 VLAN 정보 동기화 | VTP | Cisco 기술, 버전 조건 확인 |
| 여러 링크를 하나로 묶기 | 링크 집성·LACP | VLAN 분리와 구별 |
| IP·TCP/UDP 포트 기반 부하분산 | L4 스위치 | URL·쿠키는 L7 단서 |
| URL·쿠키·응용 내용 기반 분산 | L7 스위치 | HTTPS 내용 판단에는 TLS 처리 조건 필요 |
| HTTP/HTTPS 웹 공격 방어 | WAF | 모든 종류의 공격 방어 X |
| 제어 평면·데이터 평면 분리·컨트롤러 | SDN | 기능 소프트웨어화는 NFV |
| 방화벽·라우터를 범용 서버의 VNF로 제공 | NFV | 물리 서버가 필요 없어지는 것 X |
| 가상 머신·가상 스위치·하이퍼바이저 | Hyper-V | 컨테이너와 동일 개념 X |
| 다수 안테나 송수신 | MIMO | 다중화·변조와 구별 |
| NIC로 네트워크 부팅 | PXE | 원격 전원 켜기는 Wake-on-LAN |
| 코어·클래딩·빛·전반사 | 광케이블 | UTP·동축은 구리 기반 |
| 서로 다른 프로토콜 체계 변환 | 게이트웨이 | 기본 게이트웨이는 보통 다음 홉 라우터 |

### 반복되는 짧은 정의

| 키워드 | 답 | 붙여 외울 조건 |
|---|---|---|
| 미러링 | RAID 1 | 동일 데이터 복제 |
| 분산·회전 패리티 | RAID 5 | 최소 3개, 디스크 1개 장애 허용 |
| 패리티 없는 스트라이핑 | RAID 0 | 장애 복구용 중복성 없음 |
| 순차적으로 돌아가며 분배 | Round Robin | 가중치 조건이면 Weighted Round Robin |
| 연결 수가 가장 적은 서버 | Least Connections | 순번 기준 X |
| 중앙 장비·단말 추가 쉬움 | Star | 중앙 장비 장애와 단말 장애 구별 |
| 모든 노드를 상호 연결 | 완전 Mesh | 회선 수 n(n−1)/2 |
| 하나 보내고 ACK 대기 | Stop-and-Wait ARQ | 대기로 효율 저하 |
| 오류 프레임부터 이후까지 재전송 | Go-Back-N ARQ | 오류 프레임만 보내는 것 X |
| 오류 프레임만 재전송 | Selective Repeat ARQ | 수신 버퍼·재정렬 필요 |
| 채널 상태에 맞춰 블록 길이 변경 | Adaptive ARQ | 제공 자료의 시험용 분류 |
| 고정 시간 슬롯·데이터 없어도 할당 | 동기식 TDM | 통계적 TDM과 구별 |
| 빛의 파장별 다중화 | WDM | FDM은 주파수, TDM은 시간 |
| 토큰을 가진 노드만 전송 | 토큰 패싱 | 충돌 감지 방식 X |
| 무선·백오프·선택적 RTS/CTS | CSMA/CA | 구형 공유 이더넷은 CSMA/CD |
| 명령을 커널에 전달 | Shell | 핵심 자원 관리는 Kernel |
| 부팅 자동 마운트 설정 | /etc/fstab | 현재 상태 조회와 구별 |
| 내부 웹 리소스를 외부에 게시하는 Windows 역할 | Web Application Proxy | VPN 접속 자체와 구별 |
| 도메인 안 부서별 관리 단위 | OU | 도메인 자체를 새로 만드는 것 X |

## 3. 반드시 외울 숫자와 대응표

### 포트 번호

**서비스 ↔ 포트 ↔ TCP/UDP**를 함께 외운다. 대표적인 시험용 기본값이며 모든 배포 구성을 뜻하지 않는다.

| 서비스 | 포트 | 전송 | 단서 |
|---|---:|---|---|
| FTP 제어 | 21 | TCP | 로그인·명령 |
| FTP 능동 데이터 | 통상 서버 출발지 20 | TCP | 수동 모드는 서버가 알린 데이터 포트 |
| SSH·SFTP | 22 | TCP | 암호화 원격 접속·파일 전송 |
| Telnet | 23 | TCP | 평문 원격 접속 |
| SMTP | 25 | TCP | 서버 간 메일 전달 |
| DNS | 53 | UDP·TCP | 일반 질의 주로 UDP, 영역 전송 등 TCP |
| DHCPv4 서버·클라이언트 | 67·68 | UDP | 서버가 67 |
| TFTP | 69 | UDP | 최초 요청 기준 |
| HTTP | 80 | TCP | 전통적인 HTTP/1.1·HTTP/2 기준 |
| POP3 | 110 | TCP | 메일 수신 |
| NTP | 123 | UDP | 시간 동기화 |
| IMAP | 143 | TCP | 서버 메일함 |
| SNMP 조회·Trap | 161·162 | UDP | 관리 요청·이벤트 통지 |
| HTTPS | 443 | TCP | HTTP/3는 QUIC, UDP 443 |
| SMB | 445 | TCP | 파일·프린터 공유 |
| RDP | 3389 | TCP·UDP | Windows 원격 데스크톱 |

‘TCP와 UDP를 모두 사용하는 응용 프로토콜’의 전형적인 답은 DNS다. 다른 보기에도 양쪽 전송을 지원하는 서비스가 있으면 문항의 조건을 확인한다.

### OSI·PDU·장비

| 계층 | 이름 | 핵심 | 데이터 단위·장비 |
|---:|---|---|---|
| 7 | 응용 | HTTP·DNS·FTP·SMTP | 데이터 |
| 6 | 표현 | 형식 변환·압축·암호화 | 데이터 |
| 5 | 세션 | 대화 제어·동기점·세션 관리 | 데이터 |
| 4 | 전송 | TCP·UDP·포트·종단 간 전달 | TCP 세그먼트·UDP 데이터그램 |
| 3 | 네트워크 | IP·라우팅·논리 주소 | 패킷·라우터 |
| 2 | 데이터링크 | MAC·프레임·인접 구간 오류 검출 | 프레임·브리지·L2 스위치 |
| 1 | 물리 | 비트·신호·매체 | 비트·허브·리피터 |

암기: **1 신호, 2 MAC, 3 IP, 4 포트. 비트 → 프레임 → 패킷 → 세그먼트.**

TCP/IP 4계층은 `응용=OSI 5~7`, `전송=4`, `인터넷=3`, `네트워크 접근=1~2`에 대응한다. 실제 프로토콜은 암호화라는 단어 하나만으로 무조건 표현 계층에 배치하지 않는다.

### IPv4 대역

| 구분 | 범위·값 | 함정 |
|---|---|---|
| 사설 | 10.0.0.0/8 | 10으로 시작 |
| 사설 | 172.16.0.0/12 | 두 번째 옥텟 16~31만 |
| 사설 | 192.168.0.0/16 | 192 전체가 사설 X |
| 루프백 | 127.0.0.0/8 | 대표 127.0.0.1 |
| 링크 로컬·APIPA | 169.254.0.0/16 | 사설 3대 대역과 구별 |
| 멀티캐스트 | 224.0.0.0/4 | 첫 옥텟 224~239 |
| 제한 브로드캐스트 | 255.255.255.255 | 서브넷별 브로드캐스트와 구별 |

클래스를 묻는 문제는 첫 옥텟으로 판단한다. A는 일반 호스트 기준 1~126, B는 128~191, C는 192~223, D는 224~239. 0·127은 특별 용도다. 실제 네트워크 범위는 클래스보다 **주어진 CIDR 프리픽스**를 우선한다.

### TCP·UDP·ICMP

| 항목 | 암기 |
|---|---|
| TCP 연결 수립 | SYN → SYN+ACK → ACK |
| 서버 상태 | LISTEN → SYN-RECEIVED → ESTABLISHED |
| 정상 종료 요청·연결 초기화 | FIN·RST |
| TCP 기본 헤더 | 20바이트, 옵션 포함 최대 60바이트 |
| UDP 헤더 | 8바이트 |
| UDP 필드 | 출발지 포트·목적지 포트·길이·체크섬, 각각 16비트 |
| TCP 포트 필드 | 각각 16비트 |
| TCP 순서·확인응답 번호 | 각각 32비트 |
| ICMPv4 Echo Request·Reply | Type 8·0 |
| ICMPv4 Destination Unreachable | Type 3 |
| ICMPv4 Time Exceeded | Type 11 |

UDP 보기의 순서 번호·ACK 번호·Window는 TCP 필드인지 확인한다. 위 ICMP 타입은 IPv4 기준이다.

### IPv6·무선·이더넷

| 항목 | 암기 |
|---|---|
| IPv4·IPv6 주소 | 32·128비트 |
| IPv6 기본 헤더 | 고정 40바이트 |
| IPv4 TTL에 대응 | IPv6 Hop Limit |
| IPv6 트래픽 구분 | Traffic Class; 흐름 식별은 Flow Label |
| IPv6 브로드캐스트 | 없음, 멀티캐스트 등 사용 |
| IPv6 루프백·미지정 | ::1·:: |
| IPv6 링크 로컬·멀티캐스트 | fe80::/10·ff00::/8 |
| 802.3·802.11 | 이더넷·무선 LAN |
| 802.1Q·802.1X | VLAN 태깅·포트 기반 접근 인증 |
| 802.11a | 5GHz, 최대 물리 속도 54Mbps |
| 802.11b | 2.4GHz, 최대 물리 속도 11Mbps |
| 802.11g | 2.4GHz, 최대 물리 속도 54Mbps |
| 802.11n | 2.4·5GHz, MIMO, 이론상 최대 600Mbps |
| 802.11ac | 5GHz, 넓은 채널·고차 변조·MU-MIMO |
| 802.11ax | OFDMA·고밀도 효율; 6GHz 활용은 Wi-Fi 6E 문맥 |
| 100BASE-TX | 100Mbps, 구리 |
| 1000BASE-T | 1Gbps, 구리, 802.3ab |
| 1000BASE-SX·LX | 1Gbps 광 규격, 802.3z |

무선 최대 속도는 채널 폭·공간 스트림 등에 따른 이론값이다. **SX=주로 단파장·다중모드, LX=장파장·단일모드 중심**으로 구별한다. 전송 거리는 모듈·광섬유 조건을 함께 본다.

## 4. 계산과 해석이 필요한 유형

### 서브넷: 표 암기 후 직접 계산

마지막 옥텟에서 나누는 일반 IPv4 LAN 문제 기준이다.

| 프리픽스 | 마스크 | 블록 크기 | 사용 가능 호스트 |
|---:|---|---:|---:|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |

**호스트 수**

1. 필요한 호스트 수 N을 확인한다. 게이트웨이·서버도 포함하라는 조건에 주의한다.
2. `2^h−2 ≥ N`인 가장 작은 h를 찾는다.
3. 프리픽스는 `32−h`다.

예: 호스트 5개면 `2^3−2=6`, 따라서 `/29`, `255.255.255.248`이다.

**네트워크·브로드캐스트**

예: `192.168.10.77/27`

- 블록 크기: `256−224=32`
- 경계: 0, 32, 64, 96, …
- 77은 64~95 블록에 포함.
- 네트워크: `192.168.10.64`
- 브로드캐스트: `192.168.10.95`
- 사용 가능: `192.168.10.65~94`, 30개.

자료에 등장하는 형태인 `210.212.100.0/27`의 첫 블록 브로드캐스트는 `.31`이다. `/24`로 착각해 `.255`를 고르지 않는다.

**서브넷 수**

- `/24 → /26`: 2비트를 빌렸으므로 `2^2=4개`.
- `/24`에서 최소 6개 필요: 3비트 차용 → `/27`, 실제 8개.
- `/16`에서 최소 6개 필요: `/19`, `255.255.224.0`.
- 출발 프리픽스가 다르면 같은 ‘6개’라도 답이 다르다.

일반적인 현재 문제는 subnet zero를 포함해 `2^s`를 쓴다. 구형 문제에 제외 조건이 명시되면 그 조건을 따른다. 호스트 수의 `−2`는 모든 프리픽스에 무조건 적용하지 않는다. /31 점대점 링크·/32 호스트 경로는 별도다. [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html)

### chmod: 대상과 변경 방식부터

`r=4, w=2, x=1`. 순서는 **소유자(u) → 소유그룹(g) → 기타(o)**다.

| 권한 | 숫자 |
|---|---:|
| rwx | 7 |
| rw- | 6 |
| r-x | 5 |
| r-- | 4 |
| --x | 1 |
| --- | 0 |

`-rwxr-x--x`는 일반 파일, 권한 `751`. 맨 앞 `-`는 파일 유형이다.

| 요구 | 명령 | 판별 |
|---|---|---|
| 전체를 rw-r--r--로 지정 | `chmod 644 sample` | 세 집단 모두 재지정 |
| 기타 사용자만 읽기, 쓰기·실행 불가 | `chmod o=r sample` | u·g 보존 |
| 전원 쓰기 추가 | `chmod a+w sample` | 기존 읽기·실행 보존 |
| 전원 쓰기 제거 | `chmod a-w sample` | 읽기·실행 유지 |
| 소유자 변경 | `chown user sample` | chmod 아님 |
| 소유자·그룹 변경 | `chown user:group sample` | 둘 다 변경 |
| 그룹만 변경 | `chgrp group sample` | 소유자 유지 |

**기존 권한 유지 → `+`·`-` 확인.** `chmod 222`는 쓰기만 남기므로 `a+w`와 다르다. 파일의 읽기와 디렉터리의 목록 조회·탐색 권한도 구별한다.

### /etc/passwd: 7칸 순서

```text
study:x:1001:1001:Study User:/home/study:/bin/bash
이름 : 암호표시 : UID : GID : 설명 : 홈디렉터리 : 로그인셸
```

- x: 일반적으로 `/etc/shadow`에 암호 해시가 있다는 표시. 실제 비밀번호가 x라는 뜻 X.
- UID: 사용자 식별자, 0은 root 권한과 연결.
- GID: 기본 그룹 식별자.
- `/home/study`: 해당 계정 홈, `/bin/bash`: 로그인 셸.

### IPv6 축약

1. 각 블록의 **앞쪽 0**을 생략할 수 있다.
2. 연속된 0 블록은 `::`로 줄일 수 있다.
3. 한 주소 안에서 `::`는 한 번만 쓴다.
4. 복원하면 8블록이어야 한다.

```text
2001:0db8:0000:0000:0000:0010:0000:0001
→ 2001:db8::10:0:1
```

`0010 → 10`은 가능, `1000 → 1`은 불가능. 정규 표기에서는 가장 긴 0 구간을 줄이고 길이가 같으면 앞 구간을 선택한다.

### RAID 용량·장애 조건

동일 용량 D인 디스크 N개를 쓰는 전형적 구성 기준이다.

| 레벨 | 최소 디스크 | 사용 용량 | 장애 허용 | 구조 |
|---|---:|---|---|---|
| RAID 0 | 2 | N×D | 없음 | 스트라이핑 |
| RAID 1 | 2 | 2개 미러 기준 D | 2개 미러 기준 1개 | 미러링 |
| RAID 5 | 3 | (N−1)×D | 1개 | 분산 패리티 |
| RAID 6 | 4 | (N−2)×D | 2개 | 이중 패리티 |
| RAID 10 | 4 | 통상 N×D/2 | 장애 위치에 따라 다름 | 미러 쌍 스트라이핑 |

‘미러링’은 RAID 1 단서지만 ‘최고 성능’만으로 답을 고르지는 않는다. RAID 10도 같은 미러 쌍의 두 디스크가 모두 고장 나면 문제가 생긴다. RAID는 백업을 대체하지 않는다.

## 5. 필수 명령어

**목적 → 명령 → 옵션 의미** 순으로 외운다. 아래는 학습용 예시이며 문서 작성 중 실행한 명령이 아니다. 삭제·종료·네트워크 변경은 의미를 암기하거나 실습 환경에서 연습한다.

### Windows 네트워크 — 최우선

| 요구 | 명령 | 단서 |
|---|---|---|
| IP·마스크·DNS·MAC 등 상세 | `ipconfig /all` | 상세 설정 |
| DHCP 임대 갱신 | `ipconfig /renew` | 갱신 |
| DHCP 임대 해제 | `ipconfig /release` | 반환 |
| DNS 클라이언트 캐시 삭제 | `ipconfig /flushdns` | DNS 서버 영역 삭제 X |
| DNS 클라이언트 캐시 조회 | `ipconfig /displaydns` | 조회 |
| 연결 응답 확인 | `ping 192.0.2.1` | ICMP Echo |
| 중단할 때까지 ping | `ping -t 192.0.2.1` | Windows -t |
| 목적지까지 홉 확인 | `tracert 192.0.2.1` | 경로 |
| 경로·홉별 손실·지연 통계 | `pathping 192.0.2.1` | 집계 시간 필요 |
| DNS 질의 | `nslookup example.com` | 이름 해석 |
| ARP 캐시 | `arp -a` | IP–MAC |
| 라우팅 테이블 | `route print` / `netstat -r` | r=route |
| 연결·대기 포트·PID | `netstat -ano` | a=전체, n=숫자, o=PID |
| 관련 실행 파일 | `netstat -b` | 관리자 권한 필요 가능 |

`LISTENING`은 접속 대기, `ESTABLISHED`는 연결 수립이다. 로컬·외부 주소를 반대로 읽지 않는다. **netstat는 현재 상태 조회이며 과거 모든 침입 시도의 감사 로그가 아니다.**

옵션 출처: [Microsoft ipconfig](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig), [netstat](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat).

### Linux 네트워크·프로세스

| 요구 | 대표 명령 | 구별 |
|---|---|---|
| 프로세스 목록 | `ps -ef` / `ps aux` | 순간 목록 |
| 프로세스·자원 실시간 | `top` | 실시간 갱신 |
| 이름으로 프로세스 검색 | `pgrep sshd` | ps와 함께 보기 출제 가능 |
| 메모리·스왑 사용량 | `free -h` | 디스크 여유는 df |
| 포트·소켓 | `ss -tulnp` | 현대 환경의 대표 도구 |
| 포트의 구형 기출 명령 | `netstat -tulnp` | 별도 패키지일 수 있음 |
| 인터페이스·주소 | `ip addr` | 구형 기출은 ifconfig |
| 라우팅 테이블 | `ip route` | 구형 기출은 route -n |
| 경로 | `traceroute example.com` | Windows는 tracert |
| 통신 응답 | `ping 192.0.2.1` | Linux는 보통 계속 반복 |
| DNS 조회 | `dig example.com` / `nslookup example.com` | 설치 여부 확인 |
| 프로세스 종료 신호 | `kill PID` | 기본 TERM, -9는 강제 KILL |

Linux `netstat -tulnp`: **t=TCP, u=UDP, l=대기, n=숫자, p=프로세스**. Windows `netstat -p`는 프로토콜 선택이다. Linux `ping -t`도 Windows의 반복 옵션으로 외우면 틀린다.

### Linux 파일·계정·시스템

| 요구 | 명령·파일 | 단서 |
|---|---|---|
| 현재 절대경로 | `pwd` | 이동 X |
| 자신의 홈으로 이동 | `cd` / `cd ~` | 홈 |
| 숨김 포함 상세 목록 | `ls -al` | 권한·소유자 |
| 페이지씩 보기 | `more file` / `less file` | cat과 구별 |
| 끝부분·추가 내용 추적 | `tail file` / `tail -f file` | 로그 |
| 문자열 검색 | `grep pattern file` | 이름 검색 find와 구별 |
| 이동·덮어쓰기 확인 | `mv -i file1 file2` | i=확인 |
| 생성·기본 그룹 지정 | `useradd -g icqa network` | icqa 그룹 존재 전제 |
| 암호 설정 | `passwd network` | passwd 파일과 구별 |
| 만료 10일 전 경고 | `chage -W 10 network` | 대문자 W |
| 로그인 실패 | `lastb` | 전통적 btmp 환경 |
| 로그인 성공 이력 | `last` | lastb와 구별 |
| 커널 메시지 | `dmesg` / `journalctl -k` | 환경·권한 조건 |
| 파일시스템 사용량 | `df -h` | 파일별 사용량 du |
| 디렉터리 사용량 | `du -sh /var/log` | 합계 |
| 디스크·파티션 목록 | `lsblk` | 생성·마운트와 구별 |
| 마운트 상태 | `mount` / `findmnt` | 자동 설정 /etc/fstab |
| GPT 파티션 도구 | `parted` / `gdisk` | fdisk는 버전 차이 있음 |
| 예약 작업 조회·편집·삭제 | `crontab -l` / `-e` / `-r` | -r은 해당 사용자 전체 crontab 삭제 |
| 종료·재부팅 | `shutdown -h now` / `shutdown -r now` | h와 r |

옵션 참고: [chage 매뉴얼](https://man7.org/linux/man-pages/man1/chage.1.html), [crontab 매뉴얼](https://man7.org/linux/man-pages/man1/crontab.1.html).

### systemctl·vi·설정 파일

| 명령 | 뜻 |
|---|---|
| `systemctl start httpd` | 지금 시작 |
| `systemctl stop httpd` | 지금 정지 |
| `systemctl restart httpd` | 재시작 |
| `systemctl status httpd` | 현재 상태 |
| `systemctl enable httpd` | 부팅 자동 시작 설정 |
| `systemctl disable httpd` | 자동 시작 설정 해제 |
| `systemctl enable --now httpd` | 자동 시작 설정 + 지금 시작 |

**enable과 start는 다르다.** 서비스 이름은 배포판별로 httpd·apache2처럼 다르다. [systemd 공식 매뉴얼](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)

| vi 명령 | 뜻 |
|---|---|
| `i` / `a` | 현재 위치 앞·뒤 입력 |
| `Esc` | 일반 모드 |
| `x` / `dd` | 문자 하나·한 줄 삭제 |
| `yy` / `p` | 한 줄 복사·붙여넣기 |
| `:w` | 저장 |
| `:q` | 종료, 미저장 변경 시 거부 가능 |
| `:q!` | 저장하지 않고 종료 |
| `:wq` | 저장 후 종료 |

| 파일·설정 | 연결 키워드 |
|---|---|
| /etc | 시스템 설정 |
| /home | 일반 사용자 홈의 일반적 위치 |
| /root | root 홈 |
| /usr | 명령·라이브러리 등, 사용자 홈 X |
| /var·/var/log | 가변 데이터·로그 |
| /tmp·/boot | 임시 파일·부팅 관련 |
| /proc | 프로세스·커널 정보의 가상 파일시스템 |
| /dev | 장치 파일 |
| /etc/passwd·/etc/shadow·/etc/group | 사용자 정보·암호 해시·그룹 |
| /etc/fstab | 마운트 설정 |
| /etc/named.conf | BIND 대표 설정 경로, 배포판 차이 |
| BIND zone 내부 file | 영역 데이터 파일 지정 |
| Apache `Listen 8081` | 수신 포트 |
| Apache `LimitRequestBody` | 요청 본문 크기 제한 |
| Apache `DirectoryIndex` | 기본 문서 |
| Apache `Options Indexes` | 디렉터리 목록 생성 허용 |

### Windows 관리 도구

| 목적 | 실행 명령·도구 |
|---|---|
| IIS 관리자 | `inetmgr` |
| 이벤트 뷰어 | `eventvwr.msc` |
| 성능 모니터 | `perfmon` |
| 리소스 모니터 | `resmon` |
| 서비스 | `services.msc` |
| 컴퓨터 관리 | `compmgmt.msc` |
| 로컬 사용자·그룹 | `lusrmgr.msc`, 서버 역할·환경 조건 확인 |
| AD 사용자·컴퓨터 | `dsa.msc`, 관리 도구 필요 |
| AD 계정 명령 계열 | `dsadd`, `dsmod`, `dsrm`, `dsquery` |
| PowerShell AD 사용자 생성 예 | `New-ADUser`, ActiveDirectory 모듈 필요 |

PowerShell Cmdlet은 동사-명사 형태다. 외부 실행 파일도 호출할 수 있지만 CMD 내부 명령·배치 문법 전체가 동일한 것은 아니다.

## 6. 이해해야 풀리는 이론

### TCP·UDP·오류 제어

| 비교 | TCP | UDP |
|---|---|---|
| 연결 | 연결 지향 | 비연결 |
| 신뢰성 | 순서·재전송·중복 처리 등 제공 | 자체 전달·순서 보장 없음 |
| 흐름·혼잡 제어 | 제공 | TCP와 같은 기본 기능 없음 |
| 데이터 경계 | 바이트 스트림 | 데이터그램 단위 |

- 흐름 제어: **수신자의 처리 능력**에 맞춘다.
- 혼잡 제어: **네트워크 혼잡**에 맞춘다.
- 오류 검출: 체크섬·CRC 등으로 손상 확인.
- 재전송: ACK·타이머 등에 따라 다시 전송.
- FEC: 추가 부호로 수신 측에서 오류 복구. ARQ의 다른 이름 X.

UDP도 체크섬 필드가 있으므로 ‘오류 검출 기능이 전혀 없다’는 오답이다. UDP를 쓰더라도 응용 프로그램이 별도 신뢰성을 구현할 수 있다.

### DNS 질의·캐시

- 재귀 질의: 받은 서버에 최종 결과 또는 오류까지 구하는 처리를 요청.
- 반복 질의: 현재 서버가 아는 답 또는 다음에 물어볼 서버 정보 반환.
- TTL: 캐시 유효 시간. 낮으면 변경 반영이 빨라질 수 있지만 질의량 증가 가능.
- SOA Serial: 영역 버전 판단.
- Refresh·Retry·Expire: 보조 서버 갱신 주기·실패 후 재시도·갱신 불가 시 만료.
- DNSSEC: 데이터 출처 인증·무결성 검증. 질의 내용 암호화와 구별.

**DNS TTL=시간, IP TTL·Hop Limit=홉 제한.**

### 라우팅

| 구분 | RIP | OSPF | BGP |
|---|---|---|---|
| 방식 | Distance Vector | Link State | Path Vector |
| 범위·용도 | AS 내부 | AS 내부 | AS 간 정책 라우팅 중심 |
| 단서 | 홉 수·Bellman-Ford | SPF·Dijkstra·Cost·Area | AS_PATH·정책 |
| 추가 암기 | 최대 유효 15홉, 16은 도달 불가 | 백본 Area 0 | TCP 179 |

IGRP는 구형 Distance Vector, EIGRP는 고급 Distance Vector다. 교재에서 EIGRP를 하이브리드로 표현하기도 하므로 보기의 분류 체계를 확인한다.

라우팅 테이블은 **최장 프리픽스 일치**를 먼저 본다. `/24`와 `/16` 모두 목적지를 포함하면 `/24`가 더 구체적이다. Metric을 항상 홉 수로 외우면 OSPF 등의 문제에서 틀린다.

### DHCP·FTP·진단

**DHCPv4 초기 임대: Discover → Offer → Request → ACK, DORA.**

- Scope: 배포 주소 범위.
- Exclusion: 동적 배포에서 제외.
- Reservation: 특정 클라이언트에 특정 주소 배정.
- 옵션: 게이트웨이·DNS 등.
- 릴레이: 다른 서브넷의 서버에 DHCP 메시지 전달.
- MCLT: Failover 파트너가 아는 만료 시점보다 추가로 임대를 연장할 수 있는 시간 상한과 관련. 장애 감지 시간·전체 임대 시간과 동일하지 않다.

**FTP 연결 방향**

- 능동: 서버가 클라이언트 데이터 포트로 연결 시작.
- 수동: 서버가 데이터 포트를 알리고 클라이언트가 그 포트로 연결.
- 제어 연결 TCP 21은 공통. 수동 모드까지 ‘항상 20·21만 연다’고 외우지 않는다.

| 상황 | 도구 | 주의 |
|---|---|---|
| IP·DNS 설정 확인 | ipconfig /all | 값이 올바른지도 확인 |
| IP 응답 확인 | ping | 실패=서버 장애로 단정 X |
| IP는 되는데 이름이 안 됨 | nslookup | DNS 설정·질의 점검 |
| 경로·홉 지연 | tracert·pathping | 응답 제한으로 중간 홉만 * 가능 |
| 대기 포트·현재 접속 | netstat·ss | 응용 서비스 정상 응답까지 보장 X |

### Windows Server·IIS·AD

| 항목 | 이해 | 전형적 오답 |
|---|---|---|
| IIS 바인딩 | IP·포트·호스트 이름 등으로 구별 | 사이트마다 반드시 별도 IP |
| 물리 경로 | 실제 파일 위치, 변경 가능 | 반드시 C:\inetpub\wwwroot |
| 기본 문서 | 기본 제공 문서 목록 | 문서 추가 불가 |
| 가상 디렉터리 | URL 별칭과 실제 경로 연결 | 별칭이 실제 폴더명과 같아야 함 |
| 디렉터리 검색 | 목록 노출, 접근 정책 고려 | 항상 켜는 것이 안전 |
| AD DS | 도메인 계정·인증·자원 관리 | 로컬 계정과 완전히 동일 |
| OU·그룹 정책 | 관리 단위·정책 적용 | OU가 별도 도메인 |
| Hyper-V | 하이퍼바이저 기반 VM | 모든 VM이 호스트 커널 공유 |
| EFS | NTFS 파일 단위 암호화 | 볼륨 암호화 BitLocker와 혼동 |

이벤트 뷰어는 사건 기록, 리소스 모니터는 CPU·메모리·디스크·네트워크 사용, 성능 모니터는 카운터 수집·분석에 연결한다. Windows 로그 개수를 모든 환경에서 동일하게 외우지 않는다.

### 보안·클라우드·통신

- IPsec: IP 계층 보안. AH는 인증·무결성 중심이며 암호화 제공 X. ESP는 암호화 등을 제공.
- 전송 모드: 원래 IP 헤더 유지, 상위 페이로드 보호. 터널 모드: 원래 IP 패킷을 새 IP 패킷에 넣음.
- L2TP: 터널링과 기밀성 제공을 구별, 보통 IPsec과 결합.
- 방화벽: 정책 기반 허용·차단. IDS는 탐지 중심, IPS는 탐지·차단 중심, WAF는 웹 응용 방어.
- 서비스 모델: IaaS=인프라, PaaS=개발·실행 플랫폼, SaaS=완성된 응용 서비스.
- 배포 모델: Public·Private·Community·Hybrid. On-premises는 설치 위치·운영 방식 표현으로 구별.
- 회선 교환: 회선 자원 확보. 패킷 교환: 패킷 단위 전달·공유, 가변 지연 가능.
- Simplex·Half Duplex·Full Duplex: 단방향·번갈아 양방향·동시 양방향.
- 프로토콜 기본 요소: Syntax=형식, Semantics=의미·제어, Timing=속도·순서·시간 조건.

## 7. 원자료에서 바로잡을 내용

정답 번호가 있어도 해설 전체가 정확하다고 가정하지 않는다.

| 주의할 설명 | 수정해서 외울 내용 |
|---|---|
| passwd의 x가 실제 암호 | shadow에 해시가 있다는 표시 |
| /usr가 사용자 홈 | 일반 사용자 홈은 보통 /home/사용자 |
| L2TP 자체가 암호화 제공 | 자체 기밀성 제공 X, IPsec 등 결합 |
| SSTP의 명칭이 Simple Symmetric… | Secure Socket Tunneling Protocol |
| IPsec이면 무조건 암호화 | AH·ESP와 선택 기능 구분 |
| 1000BASE 전부 광·802.3z | T는 구리·802.3ab, SX·LX는 광·802.3z |
| 1000BASE-BX는 없는 규격 | BX10 등 실제 표준 존재, 문항 자체 모호 가능 |
| SX는 조건 없이 수 km 전송 | 일반적 SX는 수백 m, 모듈·광섬유 조건 확인 |
| 전반사는 낮은 굴절률 → 높은 굴절률 | 높은 코어 → 낮은 클래딩 경계, 임계각 초과 |
| Metric은 항상 게이트웨이 수 | 프로토콜마다 다름, RIP는 홉 수 |
| RAID 1은 무조건 최고 성능 | 미러링 구조로 판단 |
| fdisk는 항상 GPT 불가 | 버전 차이, GPT 도구 문제는 gdisk·parted 확인 |
| IPv6면 모든 통신 자동 암호화 | IPv6 도입과 실제 IPsec 사용은 별개 |
| PowerShell은 기존 명령을 전혀 못 씀 | 외부 실행 파일 호출 가능, 셸 문법 차이 존재 |
| 부팅 로그는 항상 /var/log/dmesg | 전통적 파일 문제와 현대 journal 환경 구분 |

특히 SX와 BX를 함께 두고 ‘기가비트 규격 하나’를 고르게 하는 문항은 정답 번호만 보고 BX를 가짜로 외우지 않는다. [Cisco 기가비트 SFP 규격표](https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html)

L2TP 기밀성은 별도 보안 프로토콜과 구분한다. [RFC 2661](https://www.rfc-editor.org/rfc/rfc2661.html), [L2TP와 IPsec: RFC 3193](https://www.rfc-editor.org/rfc/rfc3193.html)

## 8. 14일 학습 계획

### 매일 2~3시간 기준

1. 20분: 전날 오답과 포트·레코드·옵션을 보지 않고 답하기.
2. 40~60분: 오늘 주제 학습, 답을 가리고 재시험.
3. 40~50분: 주제별 문제 또는 50문항 모의.
4. 20~40분: 틀린 문제·찍어서 맞힌 문제 복습.

하루 1시간이면 복습 10분+S영역 20분+문제·오답 30분으로 줄인다. 전체 모의는 별도 50분을 확보한다.

| 시점 | 할 일 | 결과 |
|---|---|---|
| D-14 | 50문항 50분 진단, 해설 전 확신 표시 | 기준 점수·약점 3개 |
| D-13 | DNS·포트·메일·FTP | 빈 표 채우기 |
| D-12 | OSI·PDU·장비·NAT·VLAN·RAID | 단서만 보고 답하기 |
| D-11 | IPv4·사설 대역·서브넷 | 호스트·네트워크·브로드캐스트 각 5문제 |
| D-10 | TCP·UDP·ICMP·IPv6 | 연결·헤더·축약 재시험 |
| D-9 | Windows 명령·진단 | 목적 보고 명령·옵션 작성 |
| D-8 | Linux 명령·디렉터리·로그 | 유사 명령 차이 설명 |
| D-7 | chmod·passwd·systemctl·vi, 중간 모의 | 권한 풀이 재현 |
| D-6 | DHCP·DNS 질의·라우팅 | RIP·OSPF·BGP 비교 |
| D-5 | IIS·AD·Hyper-V·Apache·BIND | 목적과 설정 연결 |
| D-4 | ARQ·다중화·무선·SDN·클라우드·보안 | 비슷한 용어 구별 |
| D-3 | 처음 보는 회차 50분, 약점 학습 | 찍은 정답도 오답장 |
| D-2 | 다른 회차 50분, 명령·계산 재시험 | 목표 40/50, 미달 시 S 보강 |
| D-1 | 체크리스트·짧은 오답·응시 안내 확인 | 새 장문 이론 확장 중단 |

### 오답장: 문제 전체보다 판별 기준

```text
분류: K 키워드 / M 암기 / C 계산 / T 이론 / R 읽기 실수
주제: DNS 역방향 조회
내 답: A / 정답: PTR
판별 기준: 이름→IPv4는 A, IP→이름은 PTR
틀린 이유: 역방향 조건 누락
복습: 다음날 / 3일 뒤 / 전날
```

| 오답 분류 | 처방 |
|---|---|
| K | 키워드 표를 가리고 재시험 |
| M | 숫자·옵션을 빈칸으로 만들어 답하기 |
| C | 해설을 덮고 계산 다시 하기 |
| T | 인접 개념과 차이 한 문장 |
| R | 부정형·기존 유지·기타 사용자·최소 조건 표시 |

**외운 회차와 처음 보는 회차의 점수를 따로 기록한다.** 정답 번호를 기억해서 맞힌 점수는 실전 판단력과 다르다.

## 9. 시험장 풀이 전략

| 구간 | 시간 | 할 일 |
|---|---:|---|
| 1차 | 0~25분 | 정의·명령·숫자처럼 바로 판단되는 문제 |
| 2차 | 25~40분 | 계산·권한·출력·이론 비교 |
| 최종 | 40~50분 | 부정형·보류·답안 누락 확인 |

60~90초 동안 진전이 없으면 표시하고 이동한다. 확실한 문제를 먼저 확보한다.

### 소거 순서

1. 무엇을 묻는가? 프로토콜·장비·명령·옵션·숫자 확인.
2. 어느 환경인가? Windows/Linux, IPv4/IPv6, TCP/UDP 확인.
3. 방향은? IP→MAC, IP→이름, 송신/수신, 로컬/원격 확인.
4. 조건은? 기존 유지·특정 집단만·최소 호스트 수 확인.
5. 정의와 모순되는 보기부터 제거한다.

### 잘못된 찍기 규칙

| 위험한 판단 | 대체 판단 |
|---|---|
| 항상·반드시는 무조건 오답 | 정의상 필수 조건인지 확인 |
| 긴 보기가 정답 | 길이보다 조건 일치 |
| 지난 회차 ③이니 이번에도 ③ | 용어와 이유로 선택 |
| UDP는 빠르니 실시간이면 전부 UDP | 연결·재전송·헤더 조건 확인 |
| 암호화면 HTTPS | SSH·IPsec 등 계층과 용도 확인 |
| 브로드캐스트 도메인 분리는 VLAN만 | 라우터·L3도 가능, 논리 VLAN 구성 문맥 확인 |

답 변경은 불안감보다 **잘못 읽은 조건·새로 확인한 근거**를 기준으로 한다. 종료 전 모든 문항의 답 선택을 확인한다.

## 10. 전날 최종 체크

- [ ] A·AAAA·PTR·CNAME·MX·NS·SOA를 구별한다.
- [ ] DNS TTL과 IP TTL·Hop Limit을 구별한다.
- [ ] 주요 서비스의 포트·TCP/UDP를 연결한다.
- [ ] 사설 10/8·172.16/12·192.168/16을 구별한다.
- [ ] SYN → SYN+ACK → ACK와 SYN-RECEIVED를 안다.
- [ ] UDP 헤더 4필드를 말한다.
- [ ] /25~ /30 마스크·블록·호스트 수를 계산한다.
- [ ] 네트워크·브로드캐스트를 직접 구한다.
- [ ] chmod 644·o=r·a+w·a-w를 구별한다.
- [ ] passwd 7필드와 x를 안다.
- [ ] ipconfig /all·/renew·/release·/flushdns를 안다.
- [ ] Windows netstat -r·-ano·-b와 Linux -tulnp를 구별한다.
- [ ] ps·top·free·df·du·last·lastb·pwd를 안다.
- [ ] systemctl start와 enable을 구별한다.
- [ ] VLAN·STP·VTP·LACP·SDN·NFV를 구별한다.
- [ ] RAID 0·1·5의 구조·장애 허용을 안다.
- [ ] RIP·OSPF·BGP를 구별한다.
- [ ] IIS 바인딩·물리 경로, Apache Listen을 안다.
- [ ] 틀린 문제뿐 아니라 찍어서 맞힌 문제도 다시 풀었다.
- [ ] 수험표·신분증·시험장·입실 시간을 응시 안내에서 확인했다.

## 부록. 실기 준비

**원자료의 필기 정리에 추가한 실기 준비용 보충**이다. 원자료만으로 실기의 실제 구성·배점·최신 에뮬레이터 동작을 확정할 수 없다. [ICQA 공식 사이트](https://www.icqa.or.kr/cn/)의 고객지원 → 자료실에서 적용 안내·공개 도구를 확인하고 실제 화면에서 반복한다.

### 실기 2주 운영

| 기간 | 연습 | 완료 기준 |
|---|---|---|
| D-14~D-11 | 환경·공개 안내, 주소·서브넷·케이블 | 요구 확인 방법 습득 |
| D-10~D-7 | 라우터 조회·설정·경로·저장 | 입력→검증→저장 |
| D-6~D-4 | Windows 네트워크·DNS·DHCP·IIS·계정 | 실제 화면에서 완료 |
| D-3~D-2 | 80분 전체 연습 | 시간·저장 누락 보완 |
| D-1 | 실패 작업·단답 복습 | 새 기능보다 실수 제거 |

당장 응시하는 시험이 실기라면 위 연습에 대부분의 시간을 쓰고 본문은 단답형 보조로 활용한다.

### Cisco IOS 계열 흐름 예시

**일반적인 IOS 문법 학습 예시**다. 시험 도구의 지원 명령·인터페이스 이름·저장 방식·지시문이 우선이다. 주소와 이름을 그대로 외워 넣지 않는다.

```text
Router> enable
Router# show ip interface brief
Router# show running-config
Router# show ip route
Router# configure terminal
Router(config)# hostname StudyRouter
StudyRouter(config)# interface FastEthernet0/0
StudyRouter(config-if)# ip address 192.168.10.1 255.255.255.0
StudyRouter(config-if)# no shutdown
StudyRouter(config-if)# exit
StudyRouter(config)# ip route 192.168.20.0 255.255.255.0 192.168.10.2
StudyRouter(config)# end
StudyRouter# show ip interface brief
StudyRouter# show ip route
StudyRouter# copy running-config startup-config
```

| 명령·상태 | 의미 |
|---|---|
| > / # / (config)# / (config-if)# | 사용자·특권·전역·인터페이스 모드 |
| enable | 특권 모드 |
| configure terminal | 전역 설정 |
| interface ... | 대상 선택 |
| ip address ... ... | 주소·마스크 |
| no shutdown | 관리상 비활성 해제 |
| ip route 목적지 마스크 다음홉 | 정적 경로 |
| exit·end | 한 단계 나가기·특권 모드 복귀 |
| show ... | 결과 조회 |
| copy running-config startup-config | 실행 설정을 시작 설정으로 저장 |

검증: **인터페이스 이름·IP·마스크·관리 상태·목적지·다음 홉·저장 여부**. 입력 성공과 요구 상태 충족은 구별한다.

### 케이블·GUI

- T568B: 흰주황 → 주황 → 흰초록 → 파랑 → 흰파랑 → 초록 → 흰갈색 → 갈색.
- T568A: 흰초록 → 초록 → 흰주황 → 파랑 → 흰파랑 → 주황 → 흰갈색 → 갈색.
- 다이렉트: 양 끝 같은 결선. 전통적 크로스: 한쪽 A·다른 쪽 B. Auto MDI-X와 시험 제작 요구를 구별한다.
- 커넥터 접점·클립 방향을 보고 핀 1부터 확인한다. 글자 순서 암기만으로 제작 연습을 대신하지 않는다.
- Windows는 주소·마스크·게이트웨이·DNS, DHCP 범위·제외·예약, DNS 정방향·역방향, IIS 바인딩·경로, 계정·권한을 화면에서 연습한다.
- 적용·저장·확인까지 반복한다. 화면을 연 것과 요구 설정을 마친 것을 구별한다.

## 출처와 정리 원칙

- 기반: 사용자 제공 `붙여넣은 텍스트.txt`. 문항·해설·댓글이 섞였고 일부 지문·그림·회차 정보가 빠져 있다. 전체를 검증된 공식 기출로 간주하지 않았다.
- 같은 개념은 합쳤으며, 원문 전체·댓글·게시자 개인정보 대신 설명과 예제를 새로 작성했다.
- 서버 버전 혼재와 오래된 도구 설명에 조건을 붙였다. 공식 출제 확률·연도별 통계를 만들지 않았다.
- RAID 6·10, 최신 명령 대안, 실기 예시는 보충이다. 원자료의 정답 번호를 암기 대상으로 삼지 않았다.

### 확인 자료

- [ICQA 자격안내](https://www.icqa.or.kr/cn/page/network): 과목·시간·문항·합격 기준.
- [Microsoft Windows 명령](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands), [ipconfig](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig), [netstat](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat).
- [systemd systemctl](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html).
- [Linux chage](https://man7.org/linux/man-pages/man1/chage.1.html), [crontab](https://man7.org/linux/man-pages/man1/crontab.1.html).
- [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html): /31 예외.
- [RFC 2661](https://www.rfc-editor.org/rfc/rfc2661.html), [RFC 3193](https://www.rfc-editor.org/rfc/rfc3193.html): L2TP와 IPsec.
- [Cisco 기가비트 SFP 데이터시트](https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html): SX·LX·BX 등.

개인 학습용 정리이며 ICQA 공식 교재·출제 예고가 아니다. 저장소에는 이 README를 사용할 수 있도록 구성했다. 원본 기출·해설 전체의 재배포 권한까지 부여하는 문서는 아니다.
