/* 기능별 오답 화면. 저장 규칙은 WrongNotebook, 화면/사용자 입력은 이 모듈이 담당합니다. */
(() => {
  "use strict";
  function create({
    getState,
    W,
    D,
    items,
    main,
    heading,
    empty,
    paperNote,
    questionFigures,
    esc,
    persist,
    toast,
  }) {
    let wrongSource = "all";
    let review = null;
    function entriesForFilter() {
      const groups = getState().wrongByFeature;
      return Object.keys(W.labels)
        .filter((source) => wrongSource === "all" || wrongSource === source)
        .flatMap((source) =>
          groups[source]
            .filter((id) => items.some((q) => q.id === id))
            .map((id) => ({ source, id })),
        );
    }
    function renderReview() {
      const entry = review.entries[review.index];
      const q = items.find((item) => item.id === entry.id);
      const result = review.answers[review.index];
      const R = window.ReviewCore;
      main.innerHTML =
        heading("REVIEW YOUR MISTAKES", "오답노트", "") +
        `<section class="question-box notebook-question"><div class="quiz-meta"><span>${esc(W.labels[entry.source])} · ${esc(q.category)}</span><strong>${review.index + 1} / ${review.entries.length}</strong></div><h2>${q.number ? `[원문 ${q.number}번] ` : ""}${esc(q.question)}</h2>${paperNote(q)}${questionFigures(q)}<div class="answers" role="group" aria-label="오답 순서대로 풀기">${q.options.map((option, index) => `<button type="button" class="answer ${result?.selected === index ? "selected" : ""} ${result && R.isCorrect(q, index) ? "correct" : ""} ${result?.selected === index && !result.correct ? "incorrect" : ""}" data-notebook-answer="${index}" data-notebook-id="${esc(entry.id)}" data-notebook-source="${esc(entry.source)}" ${result?.correct ? "disabled" : ""}><span>${index + 1}</span>${esc(option)}</button>`).join("")}</div>${result ? `<div class="explanation" role="status"><strong>${result.correct ? "정답! 이 기능의 오답에서 제외했어요." : "오답이에요. 해설을 확인하고 다시 골라 보세요."} 정답 ${R.answerNumbers(q)}번</strong><p>${esc(q.explanation)}</p></div>` : `<p class="fine-print">답을 고르면 바로 확인해요. 맞혀도 다음 버튼을 누르기 전까지 이 문제에 머물러요.</p>`}<div class="quiz-controls"><button type="button" class="button secondary" data-notebook-step="${review.index - 1}" ${review.index === 0 ? "disabled" : ""}>← 이전</button><span>${review.index + 1}번</span><button type="button" class="button primary" data-notebook-step="${review.index + 1}" ${review.index === review.entries.length - 1 ? "disabled" : ""}>다음 문제 →</button></div><div class="notebook-jump"><label for="notebook-number">문제 번호<input id="notebook-number" type="number" inputmode="numeric" min="1" max="${review.entries.length}" value="${review.index + 1}"></label><button type="button" class="button secondary" data-notebook-jump>이 번호로 이동</button></div><button type="button" class="text-button" data-notebook-list>오답 목록으로</button></section>`;
    }
    function render() {
      if (review) {
        renderReview();
        return;
      }
      const state = getState();
      const groups = state.wrongByFeature,
        total = W.count(state),
        shown = Object.keys(W.labels).filter((source) =>
          wrongSource === "all" ? groups[source].length > 0 : wrongSource === source,
        );
      main.innerHTML =
        heading("REVIEW YOUR MISTAKES", "오답노트", "") +
        `<p class="inline-note">기능별 오답과 모름·헷갈림을 모았어요. 총 ${total}개 항목 · 같은 항목이 여러 기능에 나타날 수 있어요. 다시 맞히면 해당 기능 목록에서 제외됩니다.</p><div class="filter-group" style="display:flex;flex-wrap:wrap;overflow:visible">${[["all", "전체"], ...Object.entries(W.labels)].map(([source, label]) => `<button class="filter ${wrongSource === source ? "active" : ""}" data-notebook-filter="${source}" aria-pressed="${wrongSource === source}">${label} ${source === "all" ? total : groups[source].length}</button>`).join("")}</div>` +
        (wrongSource === "all" && !total
          ? empty(
              "오답노트가 비어 있어요.",
              "각 기능에서 틀리거나 모름·헷갈림으로 표시한 항목이 여기에 모여요.",
            )
          : "") +
        (entriesForFilter().length
          ? `<p><button class="button primary" type="button" data-notebook-start>오답 ${entriesForFilter().length}문제 차례로 풀기 →</button></p>`
          : "") +
        shown
          .map(
            (source) =>
              `<section class="notebook-group"><div class="section-heading"><h2>${W.labels[source]} <small>${groups[source].length}개</small></h2></div>${source === "legacy" ? '<p class="fine-print">이전 기록은 학습 기능을 확인할 수 없어 별도로 보존했어요.</p>' : ""}${
                groups[source].length
                  ? groups[source]
                      .map((id) => {
                        const q = items.find((q) => q.id === id),
                          k = D.keywords.find((k) => k.id === id);
                        if (!q) return "";
                        return `<details class="review-item"><summary><span class="label-tag">${esc(q.category)}</span> ${esc(k?.cue || q.question)}</summary><div class="review-detail"><button type="button" class="button secondary" data-notebook-start="${esc(id)}" data-notebook-source="${esc(source)}">이 문제부터 차례로 풀기 →</button>${paperNote(q)}${questionFigures(q)}${k ? `<p><b>키워드 문제 예시로 다시 확인하기</b><br>${esc(q.question)}</p>` : ""}<div class="answers" role="group" aria-label="오답 다시 풀기">${q.options.map((option, i) => `<button class="answer" data-notebook-answer="${i}" data-notebook-id="${id}" data-notebook-source="${source}"><span>${i + 1}</span>${esc(option)}</button>`).join("")}</div><p class="notebook-feedback" role="status"></p><details><summary>정답과 판별 근거 보기</summary><strong>정답 ${window.ReviewCore.answerNumbers(q)}번 · ${esc(q.options[q.answer])}</strong><p>${esc(q.explanation)}</p>${k ? `<p>${esc(k.hint)}</p>` : ""}</details><button class="text-button" data-notebook-remove="${id}" data-notebook-source="${source}">이 기능에서 복습 완료 · 제외하기</button></div></details>`;
                      })
                      .join("")
                  : '<p class="section-description">아직 이 기능의 오답이 없어요.</p>'
              }</section>`,
          )
          .join("");
    }

    function handle(target) {
      const state = getState();
      if (target.hasAttribute?.("data-notebook-start")) {
        const entries = entriesForFilter();
        if (!entries.length) return true;
        const start = entries.findIndex(
          (entry) =>
            entry.id === target.dataset.notebookStart &&
            entry.source === target.dataset.notebookSource,
        );
        review = { entries, index: Math.max(0, start), answers: {} };
        renderReview();
        window.PageUI?.focusQuestion?.(main);
        return true;
      }
      if (target.hasAttribute?.("data-notebook-list")) {
        review = null;
        render();
        return true;
      }
      if (
        review &&
        (target.dataset.notebookStep !== undefined || target.hasAttribute?.("data-notebook-jump"))
      ) {
        const index =
          target.dataset.notebookStep !== undefined
            ? Number(target.dataset.notebookStep)
            : Number(main.querySelector("#notebook-number").value) - 1;
        if (Number.isInteger(index) && index >= 0 && index < review.entries.length) {
          review.index = index;
          renderReview();
          window.PageUI?.focusQuestion?.(main);
        }
        return true;
      }
      if (target.dataset.notebookFilter) {
        review = null;
        wrongSource = target.dataset.notebookFilter;
        render();
        return true;
      }
      if (target.dataset.notebookRemove) {
        W.update(state, target.dataset.notebookSource, target.dataset.notebookRemove, true);
        persist();
        render();
        return true;
      }
      if (target.dataset.notebookAnswer !== undefined) {
        const id = target.dataset.notebookId,
          source = target.dataset.notebookSource,
          q = items.find((q) => q.id === id);
        if (!q) return;
        const selected = Number(target.dataset.notebookAnswer);
        if (!Number.isInteger(selected) || selected < 0 || selected >= q.options.length)
          return true;
        const correct = window.ReviewCore.isCorrect(q, selected);
        if (review) {
          const entry = review.entries[review.index];
          if (entry.id !== id || entry.source !== source || review.answers[review.index]?.correct)
            return true;
          review.answers[review.index] = { selected, correct };
          if (correct) {
            W.update(state, source, id, true);
            persist();
          }
          renderReview();
          return true;
        }
        if (correct) {
          W.update(state, source, id, true);
          persist();
          render();
          toast("정답! " + W.labels[source] + " 오답에서 제외했어요.");
        } else {
          target.classList.add("incorrect");
          target.closest(".review-detail").querySelector(".notebook-feedback").textContent =
            "오답 · 정답 " + (q.answer + 1) + "번 · " + q.options[q.answer] + " · " + q.explanation;
        }
        return true;
      }

      return false;
    }
    return { render, handle };
  }
  window.WrongNotebookPage = { create };
})();
