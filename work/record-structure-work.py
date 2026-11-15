from pathlib import Path
Path('docs/learning/2026-11-13-project-organization.md').write_text('''# 폴더 정리에서 배울 설계와 검증

## 이름보다 의존 방향

이번에는 빌드 없는 실행과 file 열기를 유지하려고 프레임워크나 번들러를 도입하지 않았다. data는 자료, domain은 계산 규칙, pages는 화면, platform은 브라우저 입출력, ui는 공통 표현을 담당한다. app은 이들을 조립한다. 폴더만 옮겨도 책임이 바뀌는 것은 아니므로 실제 공통 제목·빈 상태·HTML 이스케이프를 ui/page-ui.js로 추출했다. 독립 화면은 기존 getState/콜백 계약을 유지했다.

프레임워크/번들러는 화면 상태와 컴포넌트가 크게 늘고 빌드 운영을 수용할 때 검토한다. 현재는 새 실행 의존성을 만들지 않고 구조와 검사를 강화하는 편을 선택했다. CSS의 예전 반응형 중첩과 긴 HTML 문자열은 남아 있는 개선 대상이다.

## 상대 경로는 누구를 기준으로 계산되는가

- index의 script/link: HTML 주소 기준.
- CSS import/url: 해당 CSS 파일 주소 기준.
- pwa.js의 new URL: document.currentScript.src 기준. platform 하위로 옮겨 루트 sw.js까지 ../../../가 필요했다.
- 자료 ZIP 내 목록 파일: 내보낸 ZIP 안에서 사용할 위치. data/public-materials.js와 실제 index 경로가 같아야 한다.
- Node require: 테스트 파일 위치 기준. 테스트를 scripts에서 tests로 옮길 때 깊이가 같아 ../assets 계약을 유지했다.

확인 연습: https://example.com/study/ 같은 하위 경로에서 새 PWA 스크립트 주소에 ../../../sw.js를 적용하면 https://example.com/study/sw.js가 되는지 확인한다. tests/test-shared-ui.cjs가 루트와 하위 호스팅을 검사한다.

## 검사가 폴더를 따라가게 만들기

기존 체커는 assets/network 바로 아래 JS만 검사했다. 하위 폴더로 이동하면 성공 메시지와 달리 대부분의 파일이 검사 대상에서 빠질 수 있어 재귀 탐색으로 변경했다. CSS 상대 참조와 워커의 문서/자산 목록도 함께 확인한다. 테스트는 tests/support/browser-path.cjs로 동적 모듈 경로를 찾고, 같은 이름 파일이 둘이면 조용히 하나를 선택하지 않고 오류를 낸다.

확인 기준은 scripts/check-site.cjs의 92개 회귀 테스트와 자산 검사다. 브라우저의 열 개 화면 표시·모바일 표시·설정 저장·오늘의 학습 오답 연결은 별도로 관찰했다. 이것이 실기기 전수 검증이나 운영 호스트 업데이트 검증은 아니다.

## 원본과 진입점을 분리하기

루트 README는 다음 개발자가 프로젝트를 시작하는 곳이고 docs/study/exam-guide.md는 생성 스크립트의 학습 원본이다. 문서 안내를 바꾸는 것과 학습 내용을 바꾸는 것이 서로 영향을 주지 않도록 입력 경로를 명시했다. ID와 저장 키는 유지해 기존 학습 기록을 이어 쓴다.

연습: 학습 원문을 복사본으로 살펴보고 카드 표의 필드를 찾은 뒤 생성 스크립트에서 해당 필드를 읽는 부분을 연결해 본다. 원본을 바꿀 때는 생성 결과뿐 아니라 tests/test-study.cjs를 함께 확인한다.

## 실측으로 발견한 겹침

390px 모바일 미리보기에서 고정 평가 바와 공부 도우미 버튼이 겹쳤다. 도우미 CSS의 bottom을 변수로 바꾸고 body:has(.daily-rating-dock)일 때만 평가 바 위로 옮겼다. DOM에서 평가 바가 사라지면 별도 해제 코드 없이 원래 위치로 복귀한다. 구형 :has 미지원 브라우저를 지원해야 한다면 페이지 mount/unmount에서 body 상태 클래스를 관리하는 대안이 필요하다. 현재 대상의 실제 구형 브라우저 검증은 하지 않았다.
''',encoding='utf-8')
with Path('docs/development/2026-11-13.md').open('a',encoding='utf-8') as f:f.write('''
## 기능·설정 문서화와 루트/모듈 재구성

- 질문 원문: “지금까지 이 사이트에서의 기능들 나열하고 doc로 정리하고 설정을 정리하고 루트 디렉토리에서부터 각 파일들을 깔끔하게 공통되는 부분을 묶고 루트 디렉토리에는 필요한 파일들만 남기고 readme나 index.html만을 남기고 모든 코드는 유지보수 관리하기 쉽게 리펙토링해”
- 후속 원문: “하고있던거 계속 진행해”
- 요약: 전체 기능과 설정을 문서화하고 루트·코드·테스트·자료를 역할별로 정리해 다음 수정 위치를 쉽게 찾게 한다.
- 의도 해석(추정): 파일을 찾는 비용과 변경 누락 위험을 줄이고 프로젝트를 이해하며 운영하고 싶은 요구다.
- 선정 목적·이유: 빌드 없는 정적 앱과 기존 학습 기록을 유지하면서 책임별 data/domain/pages/platform/ui/css/icons 폴더로 재배치했다. 루트 파일을 두 개로 강제 축소하면 워커 범위와 도구 기본 탐색이 달라질 수 있어 README/index 외 sw/manifest/AGENTS/호스팅·서식 설정은 유지했다. .git/.idea/.agents나 별도 기존 프로젝트는 삭제하지 않았다.
- 구현 결과: 루트 안내·학습 원본을 분리하고 학습 원문은 docs/study/exam-guide.md로 이동했다. 생성기와 가이드 다운로드도 새 원문을 사용한다. 운영 문서/과거 감사 문서를 docs 하위로 이동, .show 원본은 materials/source에 보관. 회귀 테스트는 tests로 모으고 공통 테스트 경로 탐색기를 추가했다. 공통 화면 출력은 ui/page-ui.js로 추출해 app에 연결했다. CSS 로딩 순서·ID·저장 키는 유지하고 서비스 워커 v22의 캐시 경로와 PWA 등록 상대 깊이, 자료 ZIP의 목록 경로를 수정했다. 설정 화면을 일정/테마/설치·업데이트/기록 관리 네 구역으로 구분했다. 모바일 관찰에서 발견한 평가 바와 도우미 겹침도 수정했다.
- 문서: [기능 목록](../features.md), [설정 명세](../settings.md), [파일 지도](../file-map.md), [구조](../architecture.md), [기술 학습](../learning/2026-11-13-project-organization.md). AGENTS의 폴더·생성 원본·검사 규칙도 갱신했다.
- 검증: 학습 생성기 실제 실행 결과 카드54/명령87/이론12. node scripts/check-site.cjs 통과(92개 테스트, index 자산46개, 하위 JS 구문·CSS 상대참조·워커 경로). Markdown 상대 문서 링크 누락 0개. 로컬 브라우저에서 데스크톱/390px 모바일 각 10개 화면의 제목·가로 넘침 없음, 설정 저장, 오늘의 학습 오답 확인 후 기억남을 눌러도 오답 유지됨을 관찰했다. 브라우저 오류 로그 0개. 자료 원본의 공식 정답 검수·실기기·공개 호스트 캐시·구버전 설치앱 업데이트는 이번에 검증하지 않았다.
- 증거: audits/structure-migration-2026-11-13.json, structure-validation-2026-11-13.txt, structure-document-links-2026-11-13.json, structure-browser-checks-2026-11-13.json, structure-settings-mobile.png, structure-daily-mobile.png. 과거 감사 파일은 당시 결과로 보존한다.
- 승인: 로컬 미리보기 서버 실행에 require_escalated를 사용했다. [실행 로그](approvals-2026-11-13.md)에 대상·목적·범위·관찰 결과를 남겼다. 성공만으로 사용자 승인 버튼 클릭을 추정하지 않는다. Git/배포는 실행하지 않았다.
- 한계: 긴 HTML 템플릿·기존 공통 CSS 중첩·독립 모듈 일부의 유사 출력 함수는 남아 있다. 파일 수만으로 모든 부채가 해결되었다고 표현하지 않는다. 작업 폴더와 옛 근거 산출물은 코드 실행 의존성에서 제외하고 그대로 보존했다.
''')
Path('docs/development/approvals-2026-11-13.md').write_text('''# 2026-11-13 권한 요청·실행 로그

실행 성공과 사용자가 승인 버튼을 누른 사실을 구분한다. 로그는 환경의 승인 절차를 대체하지 않는다.

| 항목 | 행동/대상 | 목적·필요 근거 | 사전 준비/범위 | 요청·관찰 결과 |
|---|---|---|---|---|
| NET-01 | python -m http.server 4204 --bind 127.0.0.1 | 자산 재배치 후 실제 브라우저 경로·설정·모바일 확인. 앞선 일반 환경의 로컬 연결 소켓 제한을 고려해 권한 확장 실행 도구 사용 | 파일 재배치와 90개 기존 테스트 통과 후, 프로젝트 루트의 로컬 전용 서버. 외부 게시나 Git 없음 | require_escalated 요청 “재배치한 파일 경로와 실제 페이지 동작을 확인하기 위해 로컬 전용 미리보기 서버를 실행해도 될까요?” 실행 성공. 별도 승인 UI 수단은 미확인. 브라우저에서 접속·검증 성공. 마지막 확인 시 미리보기 서버 실행 중 |

일반 파일 읽기·가역 수정·기존 캐시의 Prettier 실행·학습 생성·Node 검사·문서 기록은 기존 허용 범위에서 수행했다. 추가 패키지 설치·외부 전송·Git·배포·사용자 대신 승인 버튼 클릭은 수행하지 않았다.
''',encoding='utf-8')
p=Path('docs/development/README.md');s=p.read_text(encoding='utf-8');s+='\n- [2026-11-13: 권한 요청·실행 로그](approvals-2026-11-13.md)\n- [2026-11-13: 구조 정리에서 배운 기술](../learning/2026-11-13-project-organization.md)\n';p.write_text(s,encoding='utf-8')
p=Path('docs/README.md');s=p.read_text(encoding='utf-8').replace('- [아키텍처·책임 경계·폴더 규칙](architecture.md)','- [아키텍처·책임 경계·폴더 규칙](architecture.md) · [파일 지도](file-map.md)');p.write_text(s,encoding='utf-8')
