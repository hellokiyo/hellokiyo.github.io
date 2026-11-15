from pathlib import Path
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('href="README.md" download="README.md"','href="docs/study/exam-guide.md" download="network-exam-guide.md"').replace('href="README.md">전체 학습','href="docs/study/exam-guide.md">전체 학습')
a=s.index('  <dialog id="settings-dialog"');b=s.index('</dialog>',a)+len('</dialog>')
old=s[a:b];ta=old.index('<fieldset class="theme-picker">');tb=old.index('</fieldset>',ta)+len('</fieldset>');theme=old[ta:tb]
s=s[:a]+'''  <dialog id="settings-dialog" aria-labelledby="settings-title">
    <form id="settings-form">
      <div class="dialog-heading">
        <h2 id="settings-title">학습 설정</h2>
        <button type="button" class="icon-button" data-close aria-label="설정 닫기">×</button>
      </div>
      <fieldset class="settings-group">
        <legend>시험 일정</legend>
        <p class="muted">시험일을 설정하면 남은 기간과 추천 학습일을 보여드려요.</p>
        <label class="field-label" for="exam-date">시험 날짜</label>
        <input type="date" id="exam-date" name="examDate">
        <button class="button primary full" type="submit">시험일 저장</button>
      </fieldset>
      '''+theme+'''
      <fieldset class="settings-group pwa-settings">
        <legend>앱 설치와 업데이트</legend>
        <button type="button" class="button secondary full" id="pwa-install" hidden>홈 화면에 설치</button>
        <p id="pwa-help" class="fine-print"></p>
        <p id="pwa-offline" class="fine-print"></p>
      </fieldset>
      <fieldset class="settings-group">
        <legend>학습 기록 관리</legend>
        <p class="fine-print">기록은 현재 브라우저에만 저장되며 다른 기기와 동기화되지 않아요. JSON에는 학습·게임 기록이 포함됩니다. 개인 자료 파일과 테마는 별도입니다.</p>
        <div class="data-actions">
          <button type="button" id="export-progress" class="button secondary">학습 기록 내보내기</button>
          <label class="button secondary" for="import-progress">기록 가져오기</label>
          <input type="file" id="import-progress" accept="application/json,.json" hidden>
        </div>
        <button type="button" class="text-button danger" id="reset-progress">학습 기록 초기화</button>
      </fieldset>
    </form>
  </dialog>'''+s[b:];p.write_text(s,encoding='utf-8')
p=Path('assets/network/css/progress-dialogs.css');s=p.read_text(encoding='utf-8');s+='''
/* 설정은 일정·화면·설치·기록 관리로 구분하고 기존 입력 ID/이벤트 계약을 유지합니다. */
.settings-group {
  min-width: 0;
  margin: 22px 0 0;
  padding: 16px 0 0;
  border: 0;
  border-top: 1px solid var(--line);
}
.settings-group legend {
  padding: 0 8px 0 0;
  font-weight: 700;
}
.settings-group .data-actions { flex-wrap: wrap; }
''';p.write_text(s,encoding='utf-8')
p=Path('scripts/build-study-data.py');s=p.read_text(encoding='utf-8').replace('/* README.md에서 생성.','/* docs/study/exam-guide.md에서 생성.');p.write_text(s,encoding='utf-8')
p=Path('_config.yml');p.write_text('''# .nojekyll을 사용하는 현재 정적 호스팅에서는 이 파일을 빌드 설정으로 사용하지 않습니다.
# 추후 Jekyll을 다시 사용할 경우의 메타데이터/개발 폴더 제외 목록입니다.
title: 합격루틴
description: 네트워크관리사 2급 시험 대비 — 기출, 오답 복습, 핵심정리
exclude:
  - scripts
  - tests
  - work
  - audits
  - docs/development
  - .agents
''',encoding='utf-8')
