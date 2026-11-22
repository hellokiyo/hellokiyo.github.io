const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const L = require("../assets/network/data/licensed-practice.js");
const P = require("../assets/network/data/exam-practice.js");
const C = require("../assets/network/domain/core.js");
const R = require("../assets/network/domain/review-core.js");
const W = require("../assets/network/domain/wrong-notebook.js");
const A = require("../assets/network/data/paper-archive.js");

test("공개 연습은 출처·허가·변경 사실을 보존하고 자체/기출과 따로 고른다", () => {
  const ids = new Set();
  for (const examId of L.examIds) {
    const qs = L.get(examId);
    const own = P.get({ id: examId, name: examId }).questions;
    assert.equal(qs.length, 12);
    for (const q of qs) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.equal(q.sourceKind, "licensed-adaptation");
      assert.equal(q.paperId, undefined);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(R.isCorrect(q, q.answer));
      assert.equal(q.attribution.licenseUrl, "https://creativecommons.org/licenses/by/4.0/");
      assert.ok(q.explanation.includes(q.attribution.author));
      assert.ok(q.explanation.includes(q.attribution.changes));
      assert.ok(q.attribution.reference && q.attribution.page);
    }
    const state = { wrong: [], bookmarks: [], adaptive: { entries: {} } };
    assert.deepEqual(
      C.selectPractice([...own, ...qs], state, { source: "own", count: 50, shuffle: false }).ids,
      own.map((q) => q.id),
    );
    assert.deepEqual(
      C.selectPractice([...own, ...qs], state, { source: "licensed", count: 50, shuffle: false })
        .ids,
      qs.map((q) => q.id),
    );
    assert.equal(C.selectPractice(qs, state, { source: "past" }).available, 0);
  }
  assert.deepEqual(L.get("network"), []);
  assert.deepEqual(L.get("unknown"), []);
});

test("공개 연습 버튼은 채점·저장·북마크·오답과 연결되고 다른 시험 기록과 격리한다", () => {
  const examId = "ccna";
  const pack = P.get({ id: examId, name: "CCNA" });
  const licensed = L.get(examId),
    Q = [...pack.questions, ...licensed];
  let state = C.cleanState({}, pack.data, Q);
  const main = { innerHTML: "" },
    window = {};
  vm.runInNewContext(fs.readFileSync("assets/network/pages/quiz-page.js", "utf8"), {
    window,
    location: { hash: "#quiz" },
  });
  const page = window.QuizPage.create({
    practiceOnly: true,
    B: pack.questions,
    P: null,
    A: A.create(null),
    Q,
    C,
    R,
    W,
    main,
    getState: () => state,
    getNavigation: () => ({ go() {} }),
    getView: () => "quiz",
    persist() {},
    toast() {},
    heading: () => "",
    empty: () => "",
    esc: String,
    $: () => ({}),
    confirmAction: (_title, _text, action) => action(),
    onResult() {},
    onWrongChange() {},
  });
  page.quizLanding();
  assert.ok(main.innerHTML.includes('id="start-licensed-practice"'));
  page.handleClick({ id: "start-licensed-practice", dataset: {} });
  assert.equal(state.session.ids.length, 12);
  assert.equal(state.session.paperId, undefined);
  assert.ok(main.innerHTML.includes("공개 교재 번역·수정 연습"));
  assert.ok(main.innerHTML.includes("실제 기출 아님"));
  const first = licensed[0];
  page.handleClick({ dataset: { answer: String((first.answer + 1) % 4) } });
  page.handleClick({ id: "check-answer", dataset: {} });
  assert.deepEqual(state.wrongByFeature.practice, [first.id]);
  assert.deepEqual(state.wrongByFeature.past, []);
  page.handleClick({ dataset: { questionBookmark: first.id }, setAttribute() {} });
  state = C.cleanState(JSON.parse(JSON.stringify(state)), pack.data, Q);
  assert.deepEqual(state.bookmarks, [first.id]);
  assert.equal(state.session.ids.length, 12);
  assert.deepEqual(state.wrongByFeature.practice, [first.id]);
  const other = P.get({ id: "information-equipment-craftsman", name: "정보기기운용기능사" });
  const isolated = C.cleanState(state, other.data, [
    ...other.questions,
    ...L.get("information-equipment-craftsman"),
  ]);
  assert.equal(isolated.session, null);
  assert.deepEqual(isolated.bookmarks, []);
  assert.deepEqual(isolated.wrong, []);
});
