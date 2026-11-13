const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm");
function setup() {
  const window = {},
    nodes = {};
  const node = (s) =>
    (nodes[s] ??= { textContent: "", classList: { toggle() {} }, addEventListener() {} });
  const c = { window, location: { hash: "#quiz" }, Date, document: { querySelectorAll: () => [] } };
  for (const name of [
    "study-data",
    "questions",
    "latest-paper",
    "past-papers",
    "paper-archive",
    "review-core",
    "wrong-notebook",
    "core",
    "quiz-page",
    "home-pages",
  ])
    vm.runInNewContext(fs.readFileSync("assets/network/" + name + ".js", "utf8"), c);
  const D = window.STUDY_DATA,
    B = window.STUDY_QUESTIONS,
    P = window.LATEST_PAPER,
    A = window.PaperArchive.create(P, window.PAST_PAPERS),
    Q = [...B, ...A.papers.flatMap((p) => p.questions)],
    C = window.StudyCore,
    R = window.ReviewCore,
    W = window.WrongNotebook,
    items = R.catalog(D, Q),
    main = { innerHTML: "" };
  let state = C.cleanState({}, D, Q),
    saved = 0;
  const deps = {
    D,
    B,
    P,
    A,
    Q,
    C,
    R,
    W,
    items,
    main,
    getState: () => state,
    getNavigation: () => ({ go() {} }),
    getView: () => "quiz",
    persist: () => saved++,
    toast() {},
    heading: () => "",
    empty: (t) => t,
    esc: (v) => String(v),
    $: node,
    confirmAction: (_t, _m, fn) => fn(),
    onResult() {},
    onWrongChange() {},
  };
  const page = window.QuizPage.create(deps);
  return {
    page,
    deps,
    main,
    get state() {
      return state;
    },
    swap: (s) => (state = s),
    get saved() {
      return saved;
    },
    home: window.HomePages.create({ ...deps, modeName: page.modeName }),
  };
}
test("분리한 문제풀이 컨트롤러가 답 확인·제출·기능별 오답을 유지한다", () => {
  const g = setup();
  g.page.startQuiz("quick");
  assert.equal(g.state.session.ids.length, 10);
  const id = g.state.session.ids[0],
    q = g.deps.Q.find((q) => q.id === id);
  g.page.handleClick({ id: "", dataset: { answer: String(q.answer) } });
  g.page.handleClick({ id: "check-answer", dataset: {} });
  assert.equal(g.state.session.checked.length, 1);
  g.page.handleClick({ id: "submit-quiz", dataset: {} });
  assert.equal(g.state.session, null);
  assert.equal(g.state.records.at(-1).correct, 1);
  assert.equal(g.state.wrongByFeature.practice.length, 9);
  assert.ok(g.saved > 0);
});
test("실전 시간 만료가 다른 페이지 상태와 독립적으로 제출된다", () => {
  const g = setup();
  g.page.startQuiz("exam");
  g.state.session.endsAt = Date.now() - 1;
  g.page.tick();
  assert.equal(g.state.session, null);
  assert.equal(g.state.records.at(-1).total, 50);
  assert.equal(g.state.wrongByFeature.practice.length, 50);
});
test("새 상태로 교체해도 회차 필터와 홈 메타데이터가 정상 렌더링된다", () => {
  const g = setup();
  g.page.filterCurrent();
  g.page.renderQuiz();
  assert.match(g.main.innerHTML, /2025.08 개정 이후만 보기/);
  g.page.filterAll();
  g.page.handleChange({ target: { id: "paper-year", value: "2022" } });
  g.swap(g.deps.C.cleanState({}, g.deps.D, g.deps.Q));
  g.home.dashboard();
  assert.match(g.main.innerHTML, /2026년 4회 · 최신 기출 50문항/);
  assert.doesNotMatch(g.main.innerHTML, /undefined년/);
});
