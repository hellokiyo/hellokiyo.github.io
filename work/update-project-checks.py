from pathlib import Path
p=Path('scripts/check-site.cjs');s=p.read_text(encoding='utf-8');a=s.index('for (const file of fs\n');b=s.index('const tests =',a)
s=s[:a]+'''// 하위 모듈도 검사해야 폴더 재배치 이후 구문 검사가 조용히 누락되지 않습니다.
function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}
for (const file of filesUnder(path.join(root, "assets/network"))) {
  if (file.endsWith(".js")) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) failures.push(path.relative(root, file) + ": " + result.stderr);
  }
  if (file.endsWith(".css")) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/url\\(["']?([^"')]+)["']?\\)/g)) {
      if (/^(?:data:|https?:|#)/.test(match[1])) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), match[1])))
        failures.push("CSS 참조 누락: " + path.relative(root, file) + " → " + match[1]);
    }
  }
}
// 워커의 문서·아이콘을 포함해 설치 시 addAll을 실패시킬 누락 경로를 점검합니다.
for (const match of worker.matchAll(/["']((?:assets|materials|docs)\\/[^"']+|README\\.md|index\\.html|manifest\\.webmanifest)["']/g)) {
  if (!fs.existsSync(path.join(root, match[1]))) failures.push("캐시 파일 누락: " + match[1]);
}
''' +s[b:]
s=s.replace('path.join(root, "scripts")','path.join(root, "tests")').replace('path.join(root, "scripts", f)','path.join(root, "tests", f)');p.write_text(s,encoding='utf-8')
Path('README.md').write_text('''# 합격루틴 · 네트워크관리사 2급

기출 반복 풀이와 오답 복습을 위한 빌드 없는 HTML/CSS/JavaScript 학습 앱입니다. 계정·서버·외부 AI API 없이 현재 브라우저에 기록을 저장합니다.

## 시작

`index.html`을 열면 기본 학습을 사용할 수 있습니다. 앱 설치와 오프라인은 localhost 또는 HTTPS에서 사용합니다.

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8000/`을 엽니다. 사이트 실행에 npm 설치는 필요하지 않습니다.

## 문서

- [전체 문서](docs/README.md)
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
''',encoding='utf-8')
