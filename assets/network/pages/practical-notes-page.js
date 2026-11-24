/* 실기 풀이 사전: 설명과 공식 근거를 표시하며 상태/계정/실제 장비는 소유하지 않습니다. */
(function (root) {
  "use strict";
  function create({ main, esc, enabled = true }) {
    function render(id) {
      if (!enabled) {
        main.innerHTML =
          '<section class="panel"><h1>네트워크관리사 2급 실기 전용 설명입니다.</h1><a href="#exams">시험 선택</a></section>';
        return;
      }
      const lessons = root.PracticalNotes.lessons,
        selected = lessons.find((item) => item.id === id);
      main.innerHTML = `<div class="page-heading"><div><h1>실기 풀이 사전</h1><p>조건을 읽고 → 설정 위치를 찾고 → 적용 결과 확인하기</p></div><a class="button secondary" href="#practical">따라하기·계획</a></div><p class="inline-note">직접 작성한 유형 설명입니다. 공식 기출 원문·전체 Windows 모형이 아닙니다. 실제 조작은 공식 도구에서 연습하고, 개인 암호는 입력하지 마세요.</p>${selected ? `<article class="panel practical-note"><a class="text-button" href="#practicalnotes">← 전체 유형</a><h2>${esc(selected.title)}</h2><p>${esc(selected.summary)}</p><ol>${selected.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>${selected.code ? `<div class="practical-terminal"><div>자체 명령 예제 · 실제 실행 아님</div><pre>${esc(selected.code)}</pre></div><a class="button secondary" href="#lab">실험실에서 명령 연습 →</a>` : ""}<details><summary>공식 기술 근거</summary>${selected.sources.map((source) => `<p><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)} ↗</a></p>`).join("")}</details></article>` : `<div class="practical-tasks">${lessons.map((item) => `<a class="panel practical-note-link" href="#practicalnotes/${item.id}"><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><span>설정 위치와 확인 방법 →</span></a>`).join("")}</div>`}`;
    }
    return { render };
  }
  root.PracticalNotesPage = { create };
})(typeof window !== "undefined" ? window : globalThis);
