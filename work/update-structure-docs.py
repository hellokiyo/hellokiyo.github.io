from pathlib import Path
import json
moves=json.loads(Path('audits/structure-migration-2026-11-13.json').read_text(encoding='utf-8'))
p=Path('docs/architecture.md');s=p.read_text(encoding='utf-8')
for old,new in moves.items():
 if old.startswith('assets/network/') and old.endswith('.js'):
  s=s.replace('`'+Path(old).name+'`','`'+new.removeprefix('assets/network/')+'`')
s=s.replace('학습 내용은 루트 README','학습 내용은 docs/study/exam-guide.md')
s+='''
## 2026-11-13 폴더 경계 정리

루트 README는 사용/개발 진입점이고 학습 원문은 `docs/study/exam-guide.md`다. 생성 스크립트 입력을 새 원문으로 바꿨으며 기존 문항 ID·저장 키를 유지한다. `docs/features.md`는 기능 인벤토리, `docs/settings.md`는 설정·저장 계약이다.

```text
assets/network/
  app.js       공통 상태·라우팅·이벤트 연결
  data/        학습 데이터·회차 인덱스·공개 자료 목록
  domain/      순수 계산·복습·상태 정제·오답 규칙
  pages/       화면 렌더링과 해당 화면의 상호작용
  platform/    브라우저 저장·대화상자 설정·테마·경로·PWA
  ui/          공통 출력·키워드 배치·기능 검색·학습 추천
  css/         공통/기능별 스타일 (로드 순서 보존)
  icons/       앱 아이콘
  papers/      원본 문제의 표·그림
scripts/       생성·다운로드·검사 도구
tests/         Node 회귀 테스트
  support/     브라우저 스크립트 경로 탐색 등 테스트 공통 코드
docs/          현재 기능·설정·구조·운영 문서
  guides/      사용 안내
  study/       학습 원문과 공부 계획
  history/     당시 구현 기록
  development/ 질문·실행·승인 일지
  learning/    기술 개념·선택 이유
materials/     공개 자료·원본 (source 포함)
audits/        당시 검증 증거
work/          일회 작업과 중간 결과 (런타임 의존 금지)
```

루트의 `sw.js`는 서비스 워커 범위를, manifest는 앱 시작 경로를 유지한다. `.nojekyll`, `_config.yml`, 포매터 파일, AGENTS는 도구가 찾는 진입점이므로 루트에 남긴다. 루트 파일을 두 개만 남기기 위해 이 파일을 옮기면 설치/오프라인이나 도구 설정이 달라질 수 있다. `.git`, `.idea`, `.agents`와 다른 프로젝트 보관 폴더는 임의 삭제하지 않는다.

공통 제목·빈 상태·HTML 이스케이프는 `ui/page-ui.js`로 분리하고 app이 페이지에 필요한 함수를 주입한다. 도메인 모듈은 UI에 의존하지 않는다. VM 테스트의 `tests/support/browser-path.cjs`는 실제 파일명을 재귀 탐색하고 중복 파일명을 오류로 처리해 테스트에 폴더 맵을 반복 복제하지 않는다.

체커는 자산 하위 폴더의 JS를 재귀 검사하며 index 참조·서비스 워커 문서/자산·CSS import/url을 확인한다. PWA 등록 스크립트는 `platform/` 이동에 맞춰 루트 워커까지의 상대 깊이를 갱신했다. 자료 ZIP도 새 `data/public-materials.js` 경로를 사용한다.

상세 파일별 수정 위치는 [파일 지도](file-map.md)를 참조한다. 옛 경로와 새 경로 대응은 `audits/structure-migration-2026-11-13.json`에 기록했다. HTML 템플릿의 길이와 이전 반응형 스타일 중첩은 남아 있는 부채이며 프레임워크 전환이나 모든 중복 제거를 완료했다고 해석하지 않는다.
''';p.write_text(s,encoding='utf-8')
p=Path('AGENTS.md');s=p.read_text(encoding='utf-8').replace('`assets/network/study-data.js`','`assets/network/data/study-data.js`');s+='''
## 2026-11-13 구조와 문서 진입점

- 루트 `README.md`는 프로젝트 안내다. 학습 원본은 `docs/study/exam-guide.md`이며 `scripts/build-study-data.py`로 `assets/network/data/study-data.js`를 생성한다. 개발 회고를 이 원문에 넣지 않는다.
- `assets/network/`의 새 코드는 data(학습 자료), domain(규칙), pages(화면), platform(저장·설정·PWA), ui(공통 출력·도우미), css, icons로 배치한다. app.js만 조립 진입점으로 둔다. 이름만 다른 공통 함수를 화면마다 복제하기 전에 ui/page-ui.js를 확인한다.
- 테스트는 `tests/`, 생성·검사 도구는 `scripts/`에 둔다. 루트에서 `node scripts/check-site.cjs`를 실행한다. 신규 자산은 재귀 검사와 서비스 워커 목록에 포함되어야 한다.
- 새 기능/설정은 docs/features.md와 docs/settings.md를 갱신한다. 현재 파일 지도는 docs/file-map.md다. 옛 감사 산출물은 당시 기록으로 유지하고 현재 경로로 오해하지 않는다.
- 서비스 워커·manifest·호스팅/포매터 설정·AGENTS는 필요한 루트 진입점이다. 루트 파일 수만 줄이려고 해당 범위/기본 탐색 동작을 바꾸지 않는다.
''';p.write_text(s,encoding='utf-8')
p=Path('docs/guides/site-guide.md');s=p.read_text(encoding='utf-8').replace('최신 안내 기준은 2026-11-05','최신 안내 기준은 2026-11-13').replace('`SITE-GUIDE.md`, `STUDY-PLAN-7-DAYS.md`,','`docs/`,');p.write_text(s,encoding='utf-8')
p=Path('docs/operations.md');s=p.read_text(encoding='utf-8');s+='''
## 폴더 재배치 뒤 확인

현재 기능·설정은 [기능 목록](features.md)과 [설정 명세](settings.md), 루트와 하위 파일은 [파일 지도](file-map.md)에서 확인한다. 학습 원문은 `docs/study/exam-guide.md`, 테스트는 `tests/`다. 체커는 하위 JS·CSS 참조와 워커의 문서 목록까지 검사한다. 실행 주소와 저장 키를 바꾸지 않는 자산 폴더 이동은 학습 기록 이관을 요구하지 않는다. v22에서는 새 자산 경로를 모두 올려야 하며 index만 교체하지 않는다. 옛 URL의 캐시 갱신과 실제 설치 앱 확인은 별도 수행한다.
''';p.write_text(s,encoding='utf-8')
