# 합격루틴 · 자격시험 공부방

기출 반복 풀이와 오답 복습을 위한 빌드 없는 HTML/CSS/JavaScript 학습 앱입니다. 계정·서버·외부 AI API 없이 현재 브라우저에 기록을 저장합니다.

17개 시험 모두 자체 기초 연습이 가능하며, 네트워크관리사 2급·PC정비사 2급·리눅스마스터 2급·정보처리기사에는 실제 기출이 수록되어 있습니다. 분야 필터와 이름 검색으로 시험을 찾을 수 있습니다. 첫 화면에서 시험을 선택하고, 공부방 상단의 ‘시험 변경’으로 돌아갑니다. 기존 네트워크 직접 링크와 기록은 유지됩니다.

17개 공부방의 **기출 자료** 메뉴에서74회차 출처를 연도·개정 전후로 조회할 수 있습니다. 원문 링크 조회와 사이트 내부 채점은 구분합니다. 출처 데이터 갱신: `node scripts/build-exam-paper-sources.cjs`.

PC정비사14회차700문항, 리눅스마스터9회차720문항, 정보처리기사7회차700문항을 사용자 제공 HWP에서 추가했습니다. [제공 기간·해설·검증·원본 위치](docs/imported-papers.md).

2026-11-23: 오답 번호별 순차 복습과 간단한 입장 코드 화면을 추가했습니다. 화면 가림막이며 공개 파일 접근을 막는 서버 인증은 아닙니다. [사용과 한계](docs/settings.md).

2026-11-23: [실기 준비·가상 실험실](docs/practical-lab.md)을 추가했습니다. 홈에서 단계별 따라하기와 직접 입력 테스트를 시작하세요. 입장 코드는 한국 시간의 당일 날짜(YYMMDD)로 매일 바뀝니다.

## 시작

`index.html`을 열면 기본 학습을 사용할 수 있습니다. 앱 설치와 오프라인은 localhost 또는 HTTPS에서 사용합니다.

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8000/`을 엽니다. 사이트 실행에 npm 설치는 필요하지 않습니다.

## 문서

- [아주 쉬운 사용법](docs/guides/quick-start.md) · 앱에서는 홈의 ‘1분 사용법’
- [전체 문서](docs/README.md) · [새 개발자 인수인계](docs/handoff.md)
- [기능 목록과 사용 흐름](docs/features.md)
- [사용자 설정·저장·백업 범위](docs/settings.md)
- [파일 구조와 수정 위치](docs/architecture.md)
- [검증·운영·복구](docs/operations.md)
- [시험 학습 원문](docs/study/exam-guide.md) · [7일 학습 계획](docs/study/study-plan-7-days.md)
- [개발 의사결정 기록](docs/development/README.md)

## 구조

| 위치 | 역할 |
|---|---|
| `index.html` | 화면 틀과 명시적 자산 로딩 순서 |
| `assets/network/app.js` | 상태·라우팅·기능 조립 |
| `assets/network/data/` | 학습 데이터·자료 목록 |
| `assets/network/domain/` | 채점·복습·상태 정제·오답 규칙 |
| `assets/network/pages/` | 독립 학습 화면 |
| `assets/network/platform/` | 저장·설정·테마·내비게이션·PWA |
| `assets/network/ui/` | 공통 화면 출력·배치·도우미·추천 |
| `assets/network/css/`, `icons/`, `papers/` | 스타일·앱 아이콘·문제 그림 |
| `docs/`, `materials/` | 문서와 원본/공개 학습 자료 |
| `scripts/`, `tests/` | 생성·검사 도구와 회귀 테스트 |
| `audits/`, `work/` | 검증 근거와 작업 중간 산출물 |
| `other-projects/` | 이 앱과 분리된 기존 프로젝트 보관 |

서비스 워커 `sw.js`와 `manifest.webmanifest`는 앱 범위와 상대 주소를 유지하도록 루트에 둡니다. `AGENTS.md`와 서식/호스팅 설정도 작업 도구의 진입점이므로 유지합니다. 숨김 관리 폴더와 기존 프로젝트는 임의 삭제하지 않습니다.

## 유지보수

```powershell
node scripts/check-site.cjs
python scripts/build-study-data.py
```

학습 원문은 `docs/study/exam-guide.md`이며 생성 데이터만 임의 편집하지 않습니다. 문제 ID와 기존 저장 키를 유지합니다. 기록은 기기·브라우저·주소별로 분리되므로 이동 전 JSON 백업을 권장합니다. 개인 자료 파일은 별도 보관입니다.

2026년 4회차 정답·해설의 공식 대조 미완료 등 자료 상태는 화면과 자료 문서에서 확인하세요. 자료 충족도 환산은 실제 예상 점수가 아닙니다.

Git 연결·Git 명령·커밋·푸시·게시·배포는 수행하지 않으며 사용자가 직접 관리합니다.


## 2026-11-16 시험별 학습 업데이트

17개 시험에서 공통 학습 화면을 사용합니다. 네트워크관리사 2급은 기존 기출을 유지하고, 다른 16개는 자체 제작 기초 연습 20~30문항·해설·오늘의 학습·키워드 예시·산성비·기능별 오답·핵심정리·14일 계획을 제공합니다. 실제 기출/전 범위/공식 검수 완료를 뜻하지 않습니다. 상세 경계와 추가 방법은 [시험별 학습 설계](docs/exam-learning.md)를 참고하세요.


로그인·회원가입·사용자 계정·인증 서버는 사용자의 명시적인 변경 요청 전까지 추가하지 않습니다. 학습 기록은 브라우저 로컬 저장을 유지합니다. [맞춤 연습과 북마크 사용법](docs/custom-practice.md).
