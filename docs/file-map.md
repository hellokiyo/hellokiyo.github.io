# 파일 지도와 수정 위치

현재 기준: 2026-11-15. 전체 기능은 [기능 목록](features.md), 설정 값과 키는 [설정](settings.md)을 참조한다. 아래 경로는 프로젝트 루트 기준이다.

## 앱 코드와 스타일

| 파일 | 책임/주의 |
|---|---|
| `assets/network/ui/theory-visuals.js` | 단원별 HTML/CSS 개념 그림. 원본·점수와 분리. |
| `assets/network/pages/user-guide-page.js` | #help의 쉬운 사용법. 새 저장소 없음. |
| `assets/network/css/theory-visuals.css` | 도식·사용법·접이식 이론 목차와 반응형/테마. |
| `assets/network/app.js` | 상태·저장·경로 전환·이벤트 조립. 독립 화면 로직을 추가하지 않는다. |
| `assets/network/css/assessment.css` | 문제·답안·결과. |
| `assets/network/css/daily-pwa.css` | 오늘의 학습·평가 고정 바·기존 PWA/반응형 규칙. |
| `assets/network/css/feature-helper.css` | 공부 도우미. |
| `assets/network/css/foundation.css` | 테마 기본 변수·기본 레이아웃. |
| `assets/network/css/home.css` | 홈 배너와 기능 진입. |
| `assets/network/css/keyword-disclosure.css` | 키워드 접이식 상세. |
| `assets/network/css/keyword-examples.css` | 키워드 예시 문제. |
| `assets/network/css/keyword-game.css` | 산성비 게임. |
| `assets/network/css/latest-paper.css` | 최신 회차 카드. |
| `assets/network/css/materials.css` | 자료 목록·드롭 영역·미리보기. |
| `assets/network/css/navigation-layout.css` | 반응형 내비게이션. |
| `assets/network/css/paper-library.css` | 연도/회차 라이브러리. |
| `assets/network/css/progress-dialogs.css` | 진도·공통 대화상자·설정 그룹. |
| `assets/network/css/reference.css` | 키워드/명령어/핵심정리. |
| `assets/network/css/responsive.css` | 기존 공통 반응형. |
| `assets/network/css/study-coach.css` | 학습 방법 추천. |
| `assets/network/css/study-layout.css` | 학습 화면 공통 배치. |
| `assets/network/css/themes.css` | 선택 테마 덮어쓰기. |
| `assets/network/data/keyword-examples.json` | 키워드 문제 예시 원본. 생성 시 study-data에 합침. |
| `assets/network/data/latest-paper.js` | 최신 2026년 4회 문제. 공식 정답 대조 상태 확인. |
| `assets/network/data/paper-archive.js` | 최신/과거 회차를 조합하는 인덱스 API. |
| `assets/network/data/past-papers.js` | 기출 원본에서 생성한 회차 데이터. |
| `assets/network/data/public-materials.js` | 공개 자료 목록. 자료 ZIP 내보내기 경로도 이 위치 사용. |
| `assets/network/data/questions.js` | 자체 연습 문제. 기존 ID/정답 유지. |
| `assets/network/data/study-data.js` | exam-guide.md와 keyword-examples.json에서 생성. 직접 편집 금지. |
| `assets/network/domain/core.js` | 서브넷/날짜/셔플과 학습 JSON 정제. |
| `assets/network/domain/review-core.js` | 복습 카탈로그·선택·일정·학습 결과. |
| `assets/network/domain/wrong-notebook.js` | 기능별 오답 중복 방지·출처 유지·집계. |
| `assets/network/mobile.css` | 기존 모바일 CSS 경로의 호환 import 진입점. |
| `assets/network/pages/daily-study.js` | 오늘의 학습 세션과 평가. 이탈 시 리스너·타이머 해제. |
| `assets/network/pages/home-pages.js` | 홈과 14일 계획. getState로 최신 상태를 읽는다. |
| `assets/network/pages/keyword-game.js` | 산성비·정답 목록·GP·배지와 게임 백업. |
| `assets/network/pages/materials-page.js` | 자료 목록·편집·미리보기·파일 입력. 저장은 어댑터에 위임. |
| `assets/network/pages/quiz-page.js` | 회차 필터·풀이 세션·채점·시간 제한. |
| `assets/network/pages/reference-pages.js` | 키워드·명령어·핵심정리와 검색. |
| `assets/network/pages/wrong-notebook-page.js` | 기능별 오답 표시·재풀이. |
| `assets/network/platform/materials-store.js` | IndexedDB·파일 검증·ZIP. 키/DB명 호환 유지. |
| `assets/network/platform/navigation.js` | 해시 이동·뒤로가기·페이지 상태 복원. |
| `assets/network/platform/pwa.js` | 설치·업데이트·루트 서비스 워커 등록. |
| `assets/network/platform/settings-controller.js` | 공통 설정 다이얼로그·시험일·기록 입출력·초기화 확인. |
| `assets/network/platform/themes.js` | 테마 선택·저장·OS 변경 반영. |
| `assets/network/styles.css` | 기존 공통 CSS 경로의 호환 import 진입점. |
| `assets/network/ui/feature-helper.js` | 외부 요청 없는 기능 검색과 링크. |
| `assets/network/ui/keyword-layout.js` | 키워드 카드 높이 배치와 관찰 해제. |
| `assets/network/ui/page-ui.js` | 공통 제목·빈 화면·문자열 HTML 이스케이프. |
| `assets/network/ui/study-coach.js` | 최근 활성 시간 기반 학습 방법 제안. |

## 개발 도구와 테스트

생성기는 원본을 수정한 뒤 필요할 때 실행한다. 다운로드 스크립트는 네트워크 접근이 있는 별도 작업이며 이 정리 과정에서는 실행하지 않았다. 검사 스크립트는 Git/배포를 실행하지 않는다.

| 파일 | 역할 |
|---|---|
| `scripts/audit-exam-coverage.cjs` | 문항별 수동 판정표 집계. 실제 성적 예측 아님 |
| `scripts/build-paper-archive.py` | 확보한 PDF → 회차 문제·그림·워커 회차 목록 생성 |
| `scripts/build-study-data.py` | 학습 원문 → 카드·명령어·이론 데이터 생성 |
| `scripts/check-site.cjs` | 자산·CSS 상대 참조·워커 목록·재귀 JS 구문·전체 테스트 검사 |
| `scripts/create-app-icons.py` | 아이콘 생성 (icons 폴더) |
| `scripts/download-paper-archive.py` | 공개 자료 원본 확보 도구 (네트워크) |
| `tests/support/browser-path.cjs` | 테스트 공통 모듈 경로 탐색·중복 파일명 거부 |
| `tests/test-daily-study.cjs` | 답안 확인·기억 평가 순서 준수와 중복 집계 방지 / 모름은 당일 한 번 재출제하고 두 번째 오답도 무한 반복하지 않는다 |
| `tests/test-feature-helper.cjs` | 일상 표현으로 연도별 기출·테마·파일 보관을 찾는다 / 산성비만 사용하는 질문은 근거의 한계와 보완 기능을 알려준다 |
| `tests/test-keyword-game.cjs` | 정답 점수·오답 복습·종료·다시 시작 / 선택한 오답과 정답, 시간 초과·건너뛰기를 문항별로 구분한다 |
| `tests/test-latest-paper.cjs` | 최신 회차 50문항과 보완된 표 지문이 원문 번호 순서대로 제공된다 / 최신 회차 진행·답안·오답·완료 기록이 새로고침 후에도 복원된다 |
| `tests/test-materials-page.cjs` | 파일 dragover만 브라우저 기본 열기를 막고 복사를 표시 / 실제 drop 이벤트가 Blob·회차 메타데이터를 저장 어댑터로 전달 |
| `tests/test-materials.cjs` | 허용 확장자·파일 크기를 제한하고 MIME은 확장자로 결정 / 한글 회차 파일명에서 제목·연도·분류 추론 |
| `tests/test-navigation.cjs` | 메뉴 반복 이동은 방문기록 한 칸 사용, 뒤로 홈·앞으로 마지막 화면 / 직접 링크와 재실행은 홈 기반을 중복 생성하지 않는다 |
| `tests/test-page-controllers.cjs` | 분리한 문제풀이 컨트롤러가 답 확인·제출·기능별 오답을 유지한다 / 실전 시간 만료가 다른 페이지 상태와 독립적으로 제출된다 |
| `tests/test-paper-archive.cjs` | 최근 5개 연도·최신 회차 우선·개정 경계 및 누락 회차를 명시한다 / 모든 회차의 50문항·보기·정답·원본·그림·ID 무결성 |
| `tests/test-pwa.cjs` | PWA 리소스·상대 경로·아이콘 크기 / 캐시 설치·오프라인 응답·안전한 업데이트 및 범위 격리 |
| `tests/test-reference-pages.cjs` | 분리한 명령어 화면이 새 검색·분류 상태를 매번 읽는다 / 키워드·이론 화면은 가져오기로 교체한 상태를 참조한다 |
| `tests/test-review.cjs` | 기억남은 1·3·7일로 증가, 모름·헷갈림은 다음날 / 시험 전날 상한·시험일 변경 재계산·시험 후 지속 사용 |
| `tests/test-settings-controller.cjs` | 가져오기는 확인 전 상태를 바꾸지 않고 확인 후 게임/학습 기록을 연결한다 / 잘못된 앱 백업은 가져오기 확인조차 열지 않고 기존 기록을 보존한다 |
| `tests/test-shared-ui.cjs` | 공통 HTML 출력은 특수 문자와 빈 입력을 안전하게 처리한다 / 이동한 PWA 스크립트가 루트/하위 호스팅에서 같은 범위의 워커를 등록한다 |
| `tests/test-study-coach.cjs` | 기록이 적을 때 이용 성향을 단정하지 않는다 / 장시간 읽기와 기출 집중을 서로 다른 다음 행동으로 안내한다 |
| `tests/test-study.cjs` | 서브넷 경계와 일반 호스트 범위 / 옥텟을 넘는 /19 계산 |
| `tests/test-themes.cjs` | 기본은 화이트이며 이전 화이트·블랙 선택을 유지한다 / 시스템 테마만 OS 변경을 실시간으로 따른다 |
| `tests/test-wrong-notebook.cjs` | 기존 오답을 보존해 이전 기록으로 옮기고 알 수 없는 ID를 제거한다 / 기능별 중복 저장 방지와 해당 기능만 복습 완료 처리 |

## 코드 외 파일

- 루트: README/index, 앱 설치 manifest, 루트 범위 sw.js, AGENTS와 도구 설정만 둔다.
- `docs`: 현재 기능·설정·구조·운영, 학습 원본, 과거 근거, 개발 일지. 문서 목록은 [진입점](README.md).
- `materials`: 원본/공개 PDF·HWP와 `.show` 원본 보관. 서버 업로드 자동화와 무관하다.
- `assets/network/icons`: 앱 이미지. `assets/network/papers`: 회차에서 추출한 표/그림이며 문제 데이터의 경로와 함께 관리한다.
- `audits`: 검증 로그·수동 판정·구조 이전 대응표. 과거 로그는 덮어써 현재 결과로 위장하지 않는다.
- `work`: 작업용 스크립트와 중간 자료. 사이트가 이 폴더를 import하면 안 된다.
- `other-projects`: 이전 별도 프로젝트 보관. 이 앱의 자동 검사/리팩토링 범위에서 제외했다.
- 숨김 관리 폴더 `.git`, `.idea`, `.agents`는 임의 삭제하지 않았다. Git 명령은 사용하지 않았다.
# v25 추가 파일

- `assets/network/pages/exam-workspace.js`: 두 시험 선택, 공통 셸의 시험명·선택 상태, PC정비사 준비 화면. 저장 없음.
- `assets/network/css/exam-workspace.css`: 시험 카드·모바일1열·선택 중 공통 메뉴 숨김.
- `tests/test-exam-workspace.cjs`: 이전 주소 해석과 PC 진입 시 네트워크 상태/저장 조립 방지.

## v26 추가 파일

- `assets/network/data/exam-catalog.js`:17개 시험의 이름·ID·분야·공식 경로·준비 상태와 순수 필터. 문제·개인 기록과 분리.
- `tests/test-exam-workspace.cjs`:17개ID 왕복·별칭/분야 복합 검색·16개 준비 화면의 네트워크 저장 접근 방지.


## v27 기출 출처 화면

- `docs/research/paper-inventory-2022-2026.json`: 조사 원본.
- `scripts/build-exam-paper-sources.cjs`: 원본 검증 후 공개 출처 데이터 생성. 네트워크 호출 없음.
- `assets/network/data/exam-paper-sources.js`: 생성 자산, 직접 수정 금지.
- `assets/network/pages/paper-sources-page.js`: 공통 외부 출처 필터·상태 출력, 이탈 시 이벤트 해제.
- `assets/network/css/paper-sources.css`: 회차 카드·필터·모바일 배치.
- `tests/test-paper-sources.cjs`: 종목/연도/개정 복합 필터·자료 유형 분리·리스너 정리.


## 2026-11-16 시험별 학습 업데이트

17개 시험에서 공통 학습 화면을 사용합니다. 네트워크관리사 2급은 기존 기출을 유지하고, 다른 16개는 자체 제작 기초 연습 20~30문항·해설·오늘의 학습·키워드 예시·산성비·기능별 오답·핵심정리·14일 계획을 제공합니다. 실제 기출/전 범위/공식 검수 완료를 뜻하지 않습니다. 상세 경계와 추가 방법은 [시험별 학습 설계](exam-learning.md)를 참고하세요.


## v30 맞춤 연습과 로그인 금지 원칙

문제풀이에서 단원/검색/출처/미학습/오답/북마크/문제 수를 고르고 동일 문제를 다시 풀 수 있다. `core.js`는 선택 규칙과 북마크/연습 종류의 가져오기 정제를, `quiz-page.js`는 입력/시작/반복/표시를 담당한다. 북마크는 시험별 학습 JSON에 포함된다. 로그인·회원가입·계정·인증 서버 및 학습 기록 외부 업로드는 사용자 명시 재지시 전까지 추가하지 않는다. [사용법·구조·범위](custom-practice.md) 참고.

## 사용자 제공 HWP 수록

- `scripts/hwp_reader.py`: CFB/HWP5 읽기 전용 파서.
- `scripts/build-user-papers.py`: 교사용/학생용 대조·생성.
- `assets/network/data/exam-papers.js`: 시험별 날짜순 기출 레지스트리.
- `assets/network/papers/imported/`: 원본 비트맵.
- `docs/test/`: 사용자가 제공한 원본.
- `tests/test-imported-papers.cjs`: 문항 무결성·저장 격리·복수 정답 회귀.

- `assets/network/data/licensed-practice.js`: CC BY4.0 교재 번역·수정 보충문항의 원본/허가 정보와 시험별 ID.
- `tests/test-licensed-practice.cjs`: 공개/자체/기출 필터와 조립·채점·저장 격리 회귀.

- `platform/screen-lock.js`, `css/screen-lock.css`: 로컬탭화면가림막·6자리코드비교. 서버인증아님.
- `tests/test-screen-lock.cjs`, `tests/test-notebook-navigation.cjs`: 코드비교경계·오답출처/번호/포커스회귀.

- `data/practical-study.js`: 8실기예제·4기간로드맵·출처·완료정제.
- `domain/practical-lab.js`: 가상라우터 상태전이·저장/재시작·6조건검사.
- `pages/practical-page.js`, `pages/practical-lab-page.js`: 따라하기와가상실험실.
- `css/practical.css`: 실기화면반응형스타일.
- `tests/test-practical-lab.cjs`: 입력·저장·재시작·진행·백업·시험격리 회귀.

### v35 추가 파일

- `assets/network/ui/lab-windows.js`: 속성창 단계와 적용/취소 상태.
- `assets/network/css/lab-windows.css`: Windows 모형과 드래그 대상 표현.
- `tests/test-lab-fidelity.cjs`: CLI 오류·저장 확인·케이블 드래그·Windows 취소/적용 회귀.
