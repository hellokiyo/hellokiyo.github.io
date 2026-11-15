/* 참고 학습 화면: 가져오기·초기화로 상태가 교체되어도 getter로 최신 상태를 읽습니다. */
(() => {
  "use strict";
  function create({ D, getState, getUI, main, heading, empty, $, esc }) {
    // 키워드: 공개/예시/암기 상태와 masonry 재배치를 함께 갱신합니다.
    function searchBar(placeholder, categories) {
      const { filter, query } = getUI();
      return `<div class="toolbar"><label class="sr-only" for="search">검색</label><input class="search-input" id="search" type="search" placeholder="${placeholder}" value="${esc(query)}" autocomplete="off"></div><div class="filter-group">${categories.map((c) => `<button type="button" class="filter ${filter === c ? "active" : ""}" data-filter="${esc(c)}" aria-pressed="${filter === c}">${esc(c)}</button>`).join("")}</div>`;
    }
    function keywords() {
      const state = getState();
      const { filter, query, onlyUnlearned } = getUI();

      main.innerHTML =
        heading(
          "KEYWORD FLASHCARDS",
          "단서를 보면, 답이 떠오르도록.",
          "키워드를 읽고 정답을 떠올린 뒤 카드를 열어 보세요.",
        ) +
        `` +
        searchBar("ARP, 미러링, 역방향 조회…", [
          "전체",
          ...new Set(D.keywords.map((k) => k.category)),
        ]) +
        `<div class="toolbar"><button type="button" class="filter ${onlyUnlearned ? "active" : ""}" id="unlearned-toggle" aria-pressed="${onlyUnlearned}">미암기만 보기</button><span class="quiz-status" id="mastery-count">암기 완료 ${state.mastered.length} / ${D.keywords.length}</span></div><div id="keyword-results"></div>`;
      keywordResults();
    }
    function keywordExample(k) {
      const e = k.example;
      if (!e) return "";
      return `<details class="keyword-example" data-example="${k.id}"><summary><svg class="example-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4" y="2.5" width="12" height="15" rx="2"/><path d="M7 7h6M7 10h6M7 13h3"/></svg><b>문제 예시</b><span class="example-count">4지선다</span><svg class="example-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg></summary><div class="example-body"><div class="example-label">출제 형태를 참고한 자체 변형 예시</div><p class="example-question">${esc(e.question)}</p><ol class="example-options">${e.options.map((option, i) => `<li><span>${i + 1}</span>${esc(option)}</li>`).join("")}</ol><details class="example-solution" data-solution="${k.id}"><summary>정답 · 판별 근거</summary><div class="example-feedback"><strong>정답 ${e.answer + 1}번 · ${esc(e.options[e.answer])}</strong><div class="example-clues">${e.clues.map((clue) => `<mark>${esc(clue)}</mark>`).join("")}</div><p>${esc(e.explanation)}</p><p class="example-trap"><b>구별할 점</b> ${esc(e.trap)}</p></div></details></div></details>`;
    }
    function keywordResults() {
      const state = getState();
      const { filter, query, onlyUnlearned } = getUI();
      const matches = D.keywords.filter(
        (k) =>
          (filter === "전체" || k.category === filter) &&
          (!onlyUnlearned || !state.mastered.includes(k.id)) &&
          [k.cue, k.answer, k.hint, k.example?.question || "", ...(k.example?.options || [])].some(
            (t) => t.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      const openExamples = new Set(
          Array.from(document.querySelectorAll("[data-example][open]"), (e) => e.dataset.example),
        ),
        openSolutions = new Set(
          Array.from(document.querySelectorAll("[data-solution][open]"), (e) => e.dataset.solution),
        );
      $("#keyword-results").innerHTML =
        `<p class="results-meta">${matches.length}개 카드</p><div class="flash-grid">${matches
          .map(
            (k) =>
              `<article class="flash-card ${state.mastered.includes(k.id) ? "mastered" : ""}"><div class="flash-top"><span class="category">${esc(k.category)}</span><button class="reveal" type="button" data-reveal="${k.id}" aria-controls="keyword-answer-${k.id}" aria-expanded="false">정답 보기</button></div><h3>${esc(k.cue)}</h3><p class="keyword-answer" id="keyword-answer-${k.id}" hidden>${esc(k.answer)}</p><p>${esc(k.hint)}</p><div class="memory-actions" hidden>${[
                ["remember", "기억남"],
                ["unsure", "헷갈림"],
                ["unknown", "모름"],
              ]
                .map(
                  ([rating, label]) =>
                    `<button class="button secondary" data-memory="${k.id}" data-rating="${rating}">${label}</button>`,
                )
                .join(
                  "",
                )}</div>${keywordExample(k)}<div class="flash-actions"><span class="card-index">${String(Number(k.id.slice(1)) + 1).padStart(2, "0")}</span><button class="master-button" data-master="${k.id}" aria-pressed="${state.mastered.includes(k.id)}">${state.mastered.includes(k.id) ? "✓ 암기 완료" : "암기 체크"}</button></div></article>`,
          )
          .join("")}</div>` +
        (matches.length ? "" : empty("해당하는 카드가 없어요.", "검색어나 필터를 바꿔 보세요."));
      document.querySelectorAll("[data-example]").forEach((e) => {
        e.open = openExamples.has(e.dataset.example);
      });
      document.querySelectorAll("[data-solution]").forEach((e) => {
        e.open = openSolutions.has(e.dataset.solution);
      });
      window.KeywordLayout?.mount(document.querySelector(".flash-grid"));
    }
    // 명령어 화면: 검색/분류만 담당하며 명령을 실제 실행하지 않습니다.
    function commands() {
      const state = getState();
      const { filter, query, onlyUnlearned } = getUI();
      main.innerHTML =
        heading(
          "COMMAND REFERENCE",
          "상황을 명령어로 바꾸는 연습.",
          "조회인지 변경인지, Windows인지 Linux인지 먼저 확인해요.",
        ) +
        `<p class="inline-note">변경·삭제 명령은 실습 환경에서 사용하세요.</p>` +
        searchBar("DNS 캐시, netstat, 부팅 자동 시작…", [
          "전체",
          "Windows",
          "Linux",
          "systemctl·vi·설정 파일",
        ]) +
        `<div id="command-results"></div>`;
      commandResults();
    }
    function commandResults() {
      const state = getState();
      const { filter, query, onlyUnlearned } = getUI();
      let matches = D.commands.filter(
        (c) =>
          (filter === "전체" ||
            (filter === "Windows"
              ? c.category.startsWith("Windows")
              : filter === "Linux"
                ? c.category.startsWith("Linux")
                : c.category === "systemctl·vi·설정 파일")) &&
          [c.purpose, c.command, c.hint].some((t) => t.toLowerCase().includes(query.toLowerCase())),
      );
      $("#command-results").innerHTML =
        `<p class="results-meta">${matches.length}개 명령·설정</p><div class="command-list">${matches.map((c) => `<article class="command-card"><div class="command-top"><span class="category">${esc(c.category)}</span><button type="button" class="copy-button" data-copy="${c.id}" aria-label="${esc(c.command)} 복사">복사 ↗</button></div><h3>${esc(c.purpose)}</h3><pre><code>${esc(c.command)}</code></pre>${c.hint ? `<p>${esc(c.hint)}</p>` : ""}</article>`).join("")}</div>` +
        (matches.length
          ? ""
          : empty("검색 결과가 없어요.", "명령어나 목적을 다른 단어로 찾아보세요."));
    }
    // 핵심정리: 검토된 생성 HTML을 표시하고 읽기 상태는 최신 상태에서 읽습니다.
    function theory(id) {
      const state = getState();
      const { filter, query, onlyUnlearned } = getUI();
      const compactMenu = !!window.matchMedia?.("(max-width: 1024px)").matches;
      const section = D.sections.find((s) => s.id === id) || D.sections[0];
      main.innerHTML =
        heading(
          "CORE CONCEPTS",
          "외울 것과 이해할 것을 나눠요.",
          "기출·해설 모음을 정리한 가이드. 틀리기 쉬운 설명은 바로잡았어요.",
        ) +
        `<div class="reader-layout"><details class="reader-menu" ${compactMenu ? "" : "open"}><summary>목차 · ${esc(section.title)}</summary><nav class="reader-nav" aria-label="이론 목차">${D.sections.map((s) => `<a href="#theory/${s.id}" class="${s.id === section.id ? "active" : ""}" ${s.id === section.id ? 'aria-current="page"' : ""}>${state.read.includes(s.id) ? "✓ " : ""}${esc(s.title)}</a>`).join("")}</nav></details><article class="reader"><div class="reader-section-count">STUDY GUIDE · ${Number(section.id) + 1} / ${D.sections.length}</div>${window.TheoryVisuals?.render(section.id) || ""}<div id="theory-text">${section.html}</div>${section.title.startsWith("4.") ? calculator() : ""}<div class="read-complete"><button class="button ${state.read.includes(section.id) ? "secondary" : "primary"}" type="button" data-read="${section.id}">${state.read.includes(section.id) ? "✓ 읽기 완료 · 해제" : "이 단원 읽기 완료"}</button>${Number(section.id) < D.sections.length - 1 ? `<a class="text-button" href="#theory/${Number(section.id) + 1}">다음 단원 →</a>` : '<a class="text-button" href="#quiz">문제로 확인하기 →</a>'}</div></article></div>`;
    }
    function calculator() {
      return `<section class="calculator"><div class="eyebrow">TRY IT YOURSELF</div><h3>서브넷 계산 연습장</h3><p class="muted">먼저 직접 풀고, 계산 결과와 비교해 보세요.</p><form id="subnet-form"><div class="calc-fields"><label for="ip-input">IPv4 주소<input id="ip-input" name="ip" type="text" value="192.168.10.77" inputmode="decimal" required></label><label for="prefix-input">프리픽스<select id="prefix-input" name="prefix">${Array.from({ length: 33 }, (_, i) => `<option value="${i}" ${i === 27 ? "selected" : ""}>/${i}</option>`).join("")}</select></label><button type="submit" class="button primary">결과 비교하기</button></div></form><div id="subnet-result" aria-live="polite"></div></section>`;
    }

    return { keywords, keywordResults, commands, commandResults, theory };
  }
  window.ReferencePages = { create };
})();
