# 합격루틴 문서

현재 구조 기준: 2026-11-23(v38). 기능을 찾거나 코드를 수정할 때 이 문서에서 시작한다.

## 현재 기능과 운영

- [네트워크관리사와 다른 시험 화면 비교·수정 검증](exam-parity-2026-11-16.md)
- [17개 시험의 학습 기능·콘텐츠 범위·저장 분리](exam-learning.md)

- [새 개발자 인수인계: 실행 → 수정 위치 → 완료 기준](handoff.md)

- [처음 쓰는 사람을 위한 아주 쉬운 사용법](guides/quick-start.md)
- [이론 그림·전체 화면 점검 결과](review-2026-11-15.md)

- [기능 전체 목록·화면·담당 코드](features.md)
- [설정·저장소·백업 범위](settings.md)
- [아키텍처·책임 경계·폴더 규칙](architecture.md) · [파일 지도](file-map.md)
- [검증·운영·복구](operations.md)
- [사용과 자료 관리 안내](guides/site-guide.md)

## 학습 콘텐츠

- [시험 학습 원문](study/exam-guide.md): 생성 스크립트의 입력 원본
- [7일 학습 계획과 기능 조합 근거](study/study-plan-7-days.md)

## 개발 근거와 성장 기록

- [질문·판단·실행 일지](development/README.md)
- [승인 흐름과 기술 학습](learning/2026-11-05-approvals-and-development.md)
- [이전 검토 결과](review-2026-11-05.md) · [사용자 후기 근거](research-2026-11-05.md)
- 과거 구현 기록: [PWA](history/pwa-2026-11-03.md), [UI](history/ui-audit.md), [자료 충족도](history/feature-coverage.md)

과거 문서와 audits의 경로·테스트 수는 당시 기록이다. 현재 수정 위치는 architecture와 features를 우선한다. Markdown으로 관리해 코드와 함께 비교하고 갱신할 수 있다.

루트에서 `node scripts/check-site.cjs`로 자산·캐시·구문·테스트를 확인한다. Git·게시·배포는 실행하지 않는다.

## 검토 중인 제안

- [최근3~5개년 기출·개정 경계 조사](research/past-papers-2022-2026.md) · [74회차 출처 링크](research/paper-round-links-2022-2026.md): 원문 다운로드/문항 수록 완료와 구분

- [메인 허브와 서비스 분리](hub-plan.md): 미구현 설계 제안
- [다른 자격시험 문제 추가 준비 조사](research/exam-expansion-2026-11-15.md): 17개 후보의 공식 자료 경로·이용 조건·기존 구조 분석. 신규 문제와 화면은 미추가

- [기출 전체 수록 요청:17시험 이용 조건과 미완료 범위](research/past-paper-reuse-2026-11-16.md)

- [맞춤 연습·북마크·같은 문제 반복](custom-practice.md)
- [COMCBT9개 게시판:최근5년/실제5개 시험연도 조사](research/comcbt-nine-boards.md)

- [시험별 실제 수록량·기출 수집 단계·기능 부족 보고](exam-readiness-2026-11-16.md)
- [사용자 제공 3시험 기출 수록·추출·검증](imported-papers.md) — v31, 30회차 2,120문항.

- [공개 라이선스 보충 연습: 원문·허가·적용 범위](licensed-practice.md) — v32, 고유12문항을6시험에 연결.

- [v33 오답 이동·간단 화면 잠금과 검증](development/2026-11-23.md) — 2026-11-23.

- [실기 로드맵·가상 실험실 사용법과 검증](practical-lab.md) — v38.
