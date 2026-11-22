/* 필기/실기 작업공간 선택. 학습 기록과 별도로 마지막 화면 구분만 로컬에 보관합니다.
   직접 링크·뒤로가기는 해당 화면의 구분을 우선하며, 다른 시험에는 적용하지 않습니다. */
(function (root) {
  "use strict";
  const writtenViews = new Set([
    "quiz",
    "daily",
    "game",
    "wrong",
    "theory",
    "keywords",
    "commands",
    "plan",
    "materials",
    "sources",
  ]);
  function classify(view) {
    return ["practical", "lab"].includes(view)
      ? "practical"
      : writtenViews.has(view)
        ? "written"
        : null;
  }
  function create({ document, storage, enabled }) {
    const key = "network-study-stage:v1";
    let stage = "practical";
    try {
      if (storage.getItem(key) === "written") stage = "written";
    } catch {}
    const mobile = document.querySelector(".mobile-nav");
    const writtenMobile = mobile.innerHTML;
    function select(value) {
      if (!["written", "practical"].includes(value) || !enabled) return false;
      stage = value;
      try {
        storage.setItem(key, stage);
      } catch {}
      return true;
    }
    function sync(view) {
      const inferred = classify(view);
      if (inferred) select(inferred);
      const visible = enabled && view !== "exams";
      document.querySelector("#study-stage-switch").hidden = !visible;
      document.body.classList.toggle("stage-practical", visible && stage === "practical");
      document.querySelectorAll("[data-study-stage]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.studyStage === stage));
      });
      if (!enabled) return;
      const practical = stage === "practical";
      document.querySelectorAll("#navigation [data-view]").forEach((link) => {
        link.hidden =
          view === "exams" ||
          (practical
            ? !["dashboard", "practical", "lab"].includes(link.dataset.view)
            : ["practical", "lab"].includes(link.dataset.view));
      });
      const guide = document.querySelector(".sidebar-bottom a");
      if (guide) guide.hidden = practical || view === "exams";
      mobile.innerHTML = practical
        ? '<a href="#dashboard" data-view="dashboard"><span class="mobile-tab-icon" aria-hidden="true">⌂</span><span>실기 홈</span></a><a href="#practical" data-view="practical"><span class="mobile-tab-icon" aria-hidden="true">☷</span><span>따라하기·계획</span></a><a href="#lab" data-view="lab"><span class="mobile-tab-icon" aria-hidden="true">⌨</span><span>실습 실험실</span></a>'
        : writtenMobile;
      if (visible)
        document.querySelector(".breadcrumb").lastChild.textContent = practical
          ? " · 실기"
          : " · 필기";
    }
    return { get: () => (enabled ? stage : "written"), select, sync };
  }
  const api = { create, classify };
  root.StudyStage = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
