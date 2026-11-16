/* 키워드 카드의 펼침 높이에 맞춰 grid 행을 배치합니다. 학습 상태는 소유하지 않습니다.
   ResizeObserver는 mount 시 교체하고 페이지 이탈 시 app.js가 unmount로 해제합니다. */
(function (root) {
  "use strict";
  let observer = null;
  function span(height, gap) {
    return Math.max(1, Math.ceil((height + gap) / (1 + gap)));
  }
  function unmount() {
    observer?.disconnect();
    observer = null;
  }
  function mount(grid) {
    unmount();
    if (!grid || !root.ResizeObserver) return;
    grid.classList.add("keyword-masonry");
    const update = (card) => {
      if (!card.isConnected) return;
      const gap = parseFloat(root.getComputedStyle(grid).rowGap) || 12;
      const value = "span " + span(card.getBoundingClientRect().height, gap);
      if (card.style.gridRowEnd !== value) card.style.gridRowEnd = value;
    };
    const cards = Array.from(grid.querySelectorAll(".flash-card"));
    cards.forEach(update);
    observer = new root.ResizeObserver((entries) => entries.forEach((e) => update(e.target)));
    cards.forEach((card) => observer.observe(card));
  }
  const api = { mount, unmount, span };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.KeywordLayout = api;
})(typeof window !== "undefined" ? window : globalThis);
