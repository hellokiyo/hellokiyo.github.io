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
    function render() {
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
                        return `<details class="review-item"><summary><span class="label-tag">${esc(q.category)}</span> ${esc(k?.cue || q.question)}</summary><div class="review-detail">${paperNote(q)}${questionFigures(q)}${k ? `<p><b>키워드 문제 예시로 다시 확인하기</b><br>${esc(q.question)}</p>` : ""}<div class="answers" role="group" aria-label="오답 다시 풀기">${q.options.map((option, i) => `<button class="answer" data-notebook-answer="${i}" data-notebook-id="${id}" data-notebook-source="${source}"><span>${i + 1}</span>${esc(option)}</button>`).join("")}</div><p class="notebook-feedback" role="status"></p><details><summary>정답과 판별 근거 보기</summary><strong>정답 ${q.answer + 1}번 · ${esc(q.options[q.answer])}</strong><p>${esc(q.explanation)}</p>${k ? `<p>${esc(k.hint)}</p>` : ""}</details><button class="text-button" data-notebook-remove="${id}" data-notebook-source="${source}">이 기능에서 복습 완료 · 제외하기</button></div></details>`;
                      })
                      .join("")
                  : '<p class="section-description">아직 이 기능의 오답이 없어요.</p>'
              }</section>`,
          )
          .join("");
    }

    function handle(target) {
      const state = getState();
      if (target.dataset.notebookFilter) {
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
        const correct = Number(target.dataset.notebookAnswer) === q.answer;
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
