# 합격루틴 문서

현재 구조 기준: 2026-11-15(v23). 기능을 찾거나 코드를 수정할 때 이 문서에서 시작한다.

## 현재 기능과 운영

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

- [메인 허브와 서비스 분리](hub-plan.md): 미구현 설계 제안
