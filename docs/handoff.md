# 새 개발자 인수인계

2026-11-15 기준. 먼저 [기능 목록](features.md)으로 실제 구현 범위를 확인하고, [파일 지도](file-map.md)로 수정 위치를 찾는다. 자유 대화 AI·계정·기기간 동기화는 구현하지 않았다.

## 처음 30분

1. 루트 `README.md`와 `AGENTS.md`를 읽는다. Git·게시·배포는 사용자가 관리한다.
2. `index.html`을 열어 홈 → 사용법 → 오늘의 학습 → 오답노트를 확인한다. 테스트용 기록은 사용자 기록과 다른 localhost 포트에서 만든다. 주소가 다르면 저장 기록도 다르다.
3. `node scripts/check-site.cjs`로 기준 동작을 확인한다. Node는 개발 검사에만 필요하고, 사이트 실행에는 npm 설치가 필요 없다.
4. `index.html`의 script/link 순서 → `assets/network/app.js`의 모듈 조립 → 담당 화면의 `create` 또는 `mount` 순서로 읽는다.
5. 작은 수정 후 검사와 해당 화면의 실제 조작을 확인하고, 개발 일지에 결과·한계를 남긴다.

## 한 동작이 저장되기까지

오늘의 학습은 `pages/daily-study.js`가 답을 판정하고 콜백을 호출한다. `app.js`가 `WrongNotebook.update`에 기능 출처를 전달하고 `persist()`로 저장한다. 오답노트는 `pages/wrong-notebook-page.js`가 최신 상태를 읽어 표시한다. 화면마다 별도 오답 배열을 만들지 않는다.

가져오기는 `platform/settings-controller.js` → `domain/core.js`의 `cleanState` → 조립부 `setState` 순서다. 상태 객체가 교체되므로 장기 유지 화면은 `getState()`로 다시 읽는다. 타이머·리스너를 가진 화면은 경로 이탈 시 `unmount()`한다.

## 자주 맡게 되는 수정

| 요청 | 먼저 볼 파일 | 함께 확인할 계약 |
|---|---|---|
| 홈 버튼·학습 계획 | `pages/home-pages.js` | 목적지 경로·진행 중 세션 보존 |
| 키워드·명령어·이론 | `pages/reference-pages.js`, `ui/theory-visuals.js` | 학습 원문과 생성 데이터, 검색·펼침 |
| 채점·회차 선택 | `pages/quiz-page.js` | 미응답·시간 만료·복원·기능별 오답 |
| 설정·백업 | `platform/settings-controller.js` | 구버전 JSON·게임 기록·백업 제외 항목 |
| 모바일 배치 | `css/`의 담당 파일과 index 로딩 순서 | 세로/가로·하단바·테마·고정 버튼 가림 |
| 새 자산 | `index.html`, `sw.js` | 캐시 목록과 버전, 기존 기록 보존 |
| 새 문제·정답 수정 | `materials/papers/catalog.json`, 해당 생성 스크립트 | 출처·보기·정답·그림·안정적인 ID |

표의 코드 경로는 `assets/network/` 기준이다. 학습 원문은 `docs/study/exam-guide.md`이며 `python scripts/build-study-data.py`로 생성한다. 생성 결과만 고치면 다음 생성에서 변경이 사라진다. 자세한 회차별 도구는 [파일 지도](file-map.md)를 따른다.

## 변경 완료 기준

- 저장·동작 변경은 `node scripts/check-site.cjs`를 통과한다. 필요한 테스트는 경계값·복원·출처 보존 같은 동작을 확인한다.
- UI는 해당 화면에서 실제 선택·확인·이탈·재진입을 수행한다. 모바일 가로 넘침, 평가 버튼 가림, 흰색/어두운 테마를 확인한다.
- 자산 변경은 워커 캐시 버전을 갱신한다. 개인 기록을 지우는 방식으로 업데이트 문제를 해결하지 않는다.
- 기능/설정/구조가 달라지면 관련 현재 문서와 개발 일지를 함께 고친다. 전체 점검은 [운영 절차](operations.md)를 따른다.

## 먼저 알아둘 부채

`app.js`의 D/B/Q/C 등의 짧은 별칭과 긴 화면 템플릿, 일부 인라인 스타일·겹치는 CSS 규칙이 남아 있다. 큰 화면 모듈을 한 번에 다시 쓰기보다 실제 수정 단위에서 책임을 줄이고 회귀를 확인한다. 공통 출력은 `ui/page-ui.js`를 먼저 확인한다. 제목 함수가 kicker에 따라 문구를 치환하는 기존 계약도 주의한다.

기출 800문항은 상세 해설이 부족하며 2026년 4회차 공식 정답 대조도 미완료다. UI 개선과 콘텐츠 검수는 별도 작업이다. 현재 92개 자동 검사는 실기기·설치 앱·공식 정답 검증을 대신하지 않는다.
