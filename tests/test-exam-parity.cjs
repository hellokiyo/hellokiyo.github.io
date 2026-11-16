const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const C = require("../assets/network/domain/core.js");
const R = require("../assets/network/domain/review-core.js");
const W = require("../assets/network/domain/wrong-notebook.js");
const P = require("../assets/network/data/exam-practice.js");
const E = require("../assets/network/data/exam-catalog.js");
const UI = require("../assets/network/ui/page-ui.js");
function setup(exam) {
  const { data: D, questions: Q } = P.get(exam);
  const state = C.cleanState(
    {
      routines: { [C.localDate()]: [0] },
      session: {
        mode: "quick",
        ids: Q.slice(0, 10).map((q) => q.id),
        index: 2,
        answers: {},
        checked: [],
        startedAt: Date.now(),
      },
    },
    D,
    Q,
  );
  const main = { innerHTML: "" };
  const window = {};
  vm.runInNewContext(fs.readFileSync("assets/network/pages/home-pages.js", "utf8"), { window });
  const pages = window.HomePages.create({
    D,
    P: null,
    A: { papers: [] },
    R,
    C,
    W,
    items: R.catalog(D, Q),
    main,
    getState: () => state,
    heading: UI.heading,
    esc: UI.escapeHTML,
    modeName: () => "빠른 연습",
  });
  return { main, pages, D, state };
}
test("모든 확장 시험 홈은 시험일·진행 중 문제·복습 현황·목표·사용법을 제공한다", () => {
  for (const exam of E.exams.slice(1)) {
    const { main, pages, D } = setup(exam);
    pages.dashboard();
    assert.match(main.innerHTML, /data-settings/);
    assert.match(main.innerHTML, /풀던 문제 이어서/);
    assert.match(main.innerHTML, /3 \/ 10/);
    assert.match(main.innerHTML, /오늘 복습/);
    assert.match(main.innerHTML, /href="#help"/);
    assert.match(main.innerHTML, /data-routine="0" checked/);
    assert.ok(main.innerHTML.includes(`${D.keywords.length}개 카드`));
    assert.doesNotMatch(main.innerHTML, /최신 기출 풀기|2022~2026년 기출|54개 카드/);
  }
});
test("확장 시험 계획의 단원 경로는 실제 단원이며 완료 상태가 재렌더링에 반영된다", () => {
  for (const exam of E.exams.slice(1)) {
    const { main, pages, D, state } = setup(exam);
    for (const plan of D.plan) {
      if (plan.view.startsWith("theory/"))
        assert.ok(D.sections.some((s) => s.id === plan.view.split("/")[1]));
    }
    state.plans = [0];
    pages.renderPlan();
    assert.match(main.innerHTML, /data-plan="0"[^>]*checked/);
    assert.match(main.innerHTML, /시험 전 범위 완주 계획이 아닙니다/);
  }
});
test("시험 3일 전 추천은 시험별 연습 시간·기초 범위를 유지한다", () => {
  assert.match(R.plan("2026-11-19", "2026-11-16").goal, /50분 실전/);
  assert.match(
    R.plan("2026-11-19", "2026-11-16", { basicOnly: true, practiceMinutes: 20 }).goal,
    /20분 기초/,
  );
  assert.doesNotMatch(R.plan("2026-11-18", "2026-11-16", { basicOnly: true }).goal, /서브넷/);
});

test("시험별 키워드 번호는 문자열 ID와 검색 필터에도 유효하고 원래 순서를 유지한다", () => {
  for (const exam of E.exams.slice(1)) {
    const { data: D } = P.get(exam);
    const nodes = {};
    const $ = (s) => (nodes[s] ??= { innerHTML: "" });
    const window = {},
      document = { querySelectorAll: () => [], querySelector: () => null };
    vm.runInNewContext(fs.readFileSync("assets/network/pages/reference-pages.js", "utf8"), {
      window,
      document,
    });
    const page = window.ReferencePages.create({
      D,
      getState: () => ({ mastered: [] }),
      getUI: () => ({ filter: "전체", query: D.keywords.at(-1).answer, onlyUnlearned: false }),
      main: {},
      heading: UI.heading,
      empty: () => "",
      $,
      esc: UI.escapeHTML,
    });
    page.keywordResults();
    assert.doesNotMatch($("#keyword-results").innerHTML, /NaN/);
    assert.ok(
      $("#keyword-results").innerHTML.includes(`class="card-index">${D.keywords.length}</span>`),
    );
  }
});
