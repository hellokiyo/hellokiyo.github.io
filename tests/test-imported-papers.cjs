const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const Papers = require("../assets/network/data/exam-papers.js");
const Archive = require("../assets/network/data/paper-archive.js");
const Practice = require("../assets/network/data/exam-practice.js");
const C = require("../assets/network/domain/core.js");
const R = require("../assets/network/domain/review-core.js");
const W = require("../assets/network/domain/wrong-notebook.js");
const cases = [
  ["pc", 14, 700],
  ["linux-master-2", 9, 720],
  ["information-processing-engineer", 7, 700],
];

test("제공 HWP 회차는 중복 없이 원문 번호·보기·그림·정답 근거를 보존한다", () => {
  const ids = new Set();
  for (const [id, count, questions] of cases) {
    const papers = Papers.get(id);
    assert.equal(papers.length, count);
    assert.equal(papers.flatMap((p) => p.questions).length, questions);
    const archive = Archive.create(papers[0], papers.slice(1));
    assert.equal(archive.papers.length, count);
    assert.equal(archive.get(papers[0].id).original, papers[0].original);
    for (const paper of papers) {
      assert.ok(fs.existsSync(paper.original));
      assert.ok(fs.existsSync(paper.source));
      assert.equal(paper.questions.length, paper.expectedCount);
      paper.questions.forEach((q, index) => {
        assert.equal(q.number, index + 1);
        assert.equal(q.paperId, paper.id);
        assert.ok(!ids.has(q.id));
        ids.add(q.id);
        assert.equal(q.options.length, 4);
        assert.ok(q.options.every((option) => option.trim()));
        assert.ok(R.isCorrect(q, q.answer));
        assert.ok(!R.isCorrect(q, undefined));
        assert.ok(q.images.every((src) => fs.existsSync(src)));
        assert.ok(q.explanation.trim());
      });
    }
  }
  assert.deepEqual(Papers.get("unknown"), []);
});

test("80·100문항 회차의 저장 왕복은 답안·회차·기출 오답을 보존하고 타 시험 ID를 거부한다", () => {
  for (const [id] of cases) {
    const pack = Practice.get({ id, name: id });
    const papers = Papers.get(id),
      paper = papers[0];
    const questions = [...pack.questions, ...papers.flatMap((p) => p.questions)];
    let state = C.cleanState({}, pack.data, questions);
    state.session = {
      mode: "paper",
      paperId: paper.id,
      ids: paper.questions.map((q) => q.id),
      index: paper.questions.length - 1,
      answers: { [paper.questions.at(-1).id]: 2 },
      checked: [],
      startedAt: Date.now(),
    };
    W.update(state, "past", paper.questions[0].id, false);
    state.bookmarks = [paper.questions[0].id];
    const restored = C.cleanState(JSON.parse(JSON.stringify(state)), pack.data, questions);
    assert.equal(restored.session.paperId, paper.id);
    assert.equal(restored.session.ids.length, paper.expectedCount);
    assert.equal(restored.session.index, paper.expectedCount - 1);
    assert.equal(restored.session.answers[paper.questions.at(-1).id], 2);
    assert.deepEqual(restored.wrongByFeature.past, [paper.questions[0].id]);
    assert.deepEqual(restored.bookmarks, [paper.questions[0].id]);
    const other = Practice.get({ id: "ccna", name: "CCNA" });
    const isolated = C.cleanState(state, other.data, other.questions);
    assert.equal(isolated.session, null);
    assert.deepEqual(isolated.wrong, []);
  }
});

test("제공 해설집의 복수 정답은 두 보기 모두 채점·오답 연결에서 정답이다", () => {
  const papers = Papers.get("linux-master-2");
  const paper = papers.find((p) => p.date === "2021-03-13");
  const q = paper.questions[40];
  assert.ok(R.isCorrect(q, 2));
  assert.ok(R.isCorrect(q, 3));
  assert.ok(!R.isCorrect(q, 1));
  assert.ok(!R.isCorrect(q, 4));
  assert.equal(R.answerNumbers(q), "3·4");
  const pack = Practice.get({ id: paper.examId, name: "리눅스마스터 2급" });
  const Q = [...pack.questions, ...papers.flatMap((p) => p.questions)];
  const A = Archive.create(papers[0], papers.slice(1));
  const state = C.cleanState({}, pack.data, Q);
  const main = { innerHTML: "" };
  const window = {};
  vm.runInNewContext(fs.readFileSync("assets/network/pages/quiz-page.js", "utf8"), {
    window,
    location: { hash: "#quiz" },
  });
  const page = window.QuizPage.create({
    practiceOnly: true,
    B: pack.questions,
    P: papers[0],
    A,
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
  page.startQuiz("quick", undefined, [q.id], "custom");
  page.handleClick({ dataset: { answer: "2" } });
  page.handleClick({ id: "check-answer", dataset: {} });
  assert.ok(main.innerHTML.includes("✓ 정답입니다."));
  assert.equal(state.wrongByFeature.past.length, 0);
  page.handleClick({ id: "submit-quiz", dataset: {} });
  assert.equal(state.records.at(-1).score, 100);
  assert.equal(state.wrongByFeature.past.length, 0);
});
