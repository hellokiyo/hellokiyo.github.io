from pathlib import Path
import re
notes={
'app.js':'상태·저장·경로 전환·이벤트 조립. 독립 화면 로직을 추가하지 않는다.',
'core.js':'서브넷/날짜/셔플과 학습 JSON 정제.', 'review-core.js':'복습 카탈로그·선택·일정·학습 결과.', 'wrong-notebook.js':'기능별 오답 중복 방지·출처 유지·집계.',
'home-pages.js':'홈과 14일 계획. getState로 최신 상태를 읽는다.', 'quiz-page.js':'회차 필터·풀이 세션·채점·시간 제한.', 'reference-pages.js':'키워드·명령어·핵심정리와 검색.', 'wrong-notebook-page.js':'기능별 오답 표시·재풀이.', 'daily-study.js':'오늘의 학습 세션과 평가. 이탈 시 리스너·타이머 해제.', 'keyword-game.js':'산성비·정답 목록·GP·배지와 게임 백업.', 'materials-page.js':'자료 목록·편집·미리보기·파일 입력. 저장은 어댑터에 위임.',
'settings-controller.js':'공통 설정 다이얼로그·시험일·기록 입출력·초기화 확인.', 'materials-store.js':'IndexedDB·파일 검증·ZIP. 키/DB명 호환 유지.', 'pwa.js':'설치·업데이트·루트 서비스 워커 등록.', 'themes.js':'테마 선택·저장·OS 변경 반영.', 'navigation.js':'해시 이동·뒤로가기·페이지 상태 복원.',
'page-ui.js':'공통 제목·빈 화면·문자열 HTML 이스케이프.', 'keyword-layout.js':'키워드 카드 높이 배치와 관찰 해제.', 'feature-helper.js':'외부 요청 없는 기능 검색과 링크.', 'study-coach.js':'최근 활성 시간 기반 학습 방법 제안.',
'study-data.js':'exam-guide.md와 keyword-examples.json에서 생성. 직접 편집 금지.', 'questions.js':'자체 연습 문제. 기존 ID/정답 유지.', 'latest-paper.js':'최신 2026년 4회 문제. 공식 정답 대조 상태 확인.', 'past-papers.js':'기출 원본에서 생성한 회차 데이터.', 'paper-archive.js':'최신/과거 회차를 조합하는 인덱스 API.', 'public-materials.js':'공개 자료 목록. 자료 ZIP 내보내기 경로도 이 위치 사용.', 'keyword-examples.json':'키워드 문제 예시 원본. 생성 시 study-data에 합침.',
'foundation.css':'테마 기본 변수·기본 레이아웃.', 'reference.css':'키워드/명령어/핵심정리.', 'assessment.css':'문제·답안·결과.', 'progress-dialogs.css':'진도·공통 대화상자·설정 그룹.', 'responsive.css':'기존 공통 반응형.', 'study-layout.css':'학습 화면 공통 배치.', 'keyword-examples.css':'키워드 예시 문제.', 'materials.css':'자료 목록·드롭 영역·미리보기.', 'latest-paper.css':'최신 회차 카드.', 'daily-pwa.css':'오늘의 학습·평가 고정 바·기존 PWA/반응형 규칙.', 'navigation-layout.css':'반응형 내비게이션.', 'keyword-disclosure.css':'키워드 접이식 상세.', 'paper-library.css':'연도/회차 라이브러리.', 'home.css':'홈 배너와 기능 진입.', 'themes.css':'선택 테마 덮어쓰기.', 'keyword-game.css':'산성비 게임.', 'study-coach.css':'학습 방법 추천.', 'feature-helper.css':'공부 도우미.', 'styles.css':'기존 공통 CSS 경로의 호환 import 진입점.', 'mobile.css':'기존 모바일 CSS 경로의 호환 import 진입점.'}
lines=['# 파일 지도와 수정 위치','', '현재 기준: 2026-11-13. 전체 기능은 [기능 목록](features.md), 설정 값과 키는 [설정](settings.md)을 참조한다. 아래 경로는 프로젝트 루트 기준이다.','', '## 앱 코드와 스타일','', '| 파일 | 책임/주의 |','|---|---|']
for p in sorted(Path('assets/network').rglob('*')):
 if p.is_file() and p.suffix in ['.js','.css','.json']:
  lines.append(f'| `{p.as_posix()}` | {notes.get(p.name,"학습 앱 자산")} |')
lines+=['','## 개발 도구와 테스트','','생성기는 원본을 수정한 뒤 필요할 때 실행한다. 다운로드 스크립트는 네트워크 접근이 있는 별도 작업이며 이 정리 과정에서는 실행하지 않았다. 검사 스크립트는 Git/배포를 실행하지 않는다.','','| 파일 | 역할 |','|---|---|']
scriptnotes={'build-study-data.py':'학습 원문 → 카드·명령어·이론 데이터 생성', 'build-paper-archive.py':'확보한 PDF → 회차 문제·그림·워커 회차 목록 생성', 'download-paper-archive.py':'공개 자료 원본 확보 도구 (네트워크)', 'create-app-icons.py':'아이콘 생성 (icons 폴더)', 'audit-exam-coverage.cjs':'문항별 수동 판정표 집계. 실제 성적 예측 아님', 'check-site.cjs':'자산·CSS 상대 참조·워커 목록·재귀 JS 구문·전체 테스트 검사'}
for p in sorted(Path('scripts').glob('*')):
 if p.is_file():lines.append(f'| `{p.as_posix()}` | {scriptnotes.get(p.name,"개발 도구")} |')
for p in sorted(Path('tests').rglob('*.cjs')):
 if p.name=='browser-path.cjs':desc='테스트 공통 모듈 경로 탐색·중복 파일명 거부'
 else:
  tests=re.findall(r'test\([\s]*[\'\"]([^\'\"]+)',p.read_text(encoding='utf-8'))
  desc=' / '.join(tests[:2]) or '회귀 검증'
 lines.append(f'| `{p.as_posix()}` | {desc} |')
lines+=['','## 코드 외 파일','','- 루트: README/index, 앱 설치 manifest, 루트 범위 sw.js, AGENTS와 도구 설정만 둔다.','- `docs`: 현재 기능·설정·구조·운영, 학습 원본, 과거 근거, 개발 일지. 문서 목록은 [진입점](README.md).','- `materials`: 원본/공개 PDF·HWP와 `.show` 원본 보관. 서버 업로드 자동화와 무관하다.','- `assets/network/icons`: 앱 이미지. `assets/network/papers`: 회차에서 추출한 표/그림이며 문제 데이터의 경로와 함께 관리한다.','- `audits`: 검증 로그·수동 판정·구조 이전 대응표. 과거 로그는 덮어써 현재 결과로 위장하지 않는다.','- `work`: 작업용 스크립트와 중간 자료. 사이트가 이 폴더를 import하면 안 된다.','- `other-projects`: 이전 별도 프로젝트 보관. 이 앱의 자동 검사/리팩토링 범위에서 제외했다.','- 숨김 관리 폴더 `.git`, `.idea`, `.agents`는 임의 삭제하지 않았다. Git 명령은 사용하지 않았다.','']
Path('docs/file-map.md').write_text('\n'.join(lines),encoding='utf-8')
