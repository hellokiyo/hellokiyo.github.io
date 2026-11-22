const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm");
const W = require("../assets/network/domain/wrong-notebook.js");
const R = require("../assets/network/domain/review-core.js");
const C = require("../assets/network/domain/core.js");
const pack = require("../assets/network/data/exam-practice.js").get({ id: "pc", name: "PC정비사" });
const UI = require("../assets/network/ui/page-ui.js");
test("오답 순차 복습은 맞힌 문제의 위치를 유지하고 출처별 완료·번호 이동을 분리한다", () => {
  const state = C.cleanState({}, pack.data, pack.questions);
  const [first, second] = pack.questions;
  W.update(state, "daily", first.id, false);
  W.update(state, "practice", first.id, false);
  W.update(state, "practice", second.id, false);
  let focusCount = 0,
    enteredNumber = "2",
    saves = 0;
  const window = {
    ReviewCore: R,
    PageUI: {
      focusQuestion() {
        focusCount++;
      },
    },
  };
  const main = { innerHTML: "", querySelector: () => ({ value: enteredNumber }) };
  vm.runInNewContext(fs.readFileSync("assets/network/pages/wrong-notebook-page.js", "utf8"), {
    window,
  });
  const page = window.WrongNotebookPage.create({
    getState: () => state,
    W,
    D: pack.data,
    items: pack.questions,
    main,
    heading: () => "",
    empty: () => "",
    paperNote: () => "",
    questionFigures: () => "",
    esc: UI.escapeHTML,
    persist() {
      saves++;
    },
    toast() {},
  });
  const target = (dataset, attrs = []) => ({
    dataset,
    hasAttribute: (name) => attrs.includes(name),
  });
  page.render();
  page.handle(target({}, ["data-notebook-start"]));
  assert.ok(main.innerHTML.includes("1 / 3"));
  page.handle(
    target({ notebookAnswer: String(first.answer), notebookId: first.id, notebookSource: "daily" }),
  );
  assert.deepEqual(state.wrongByFeature.daily, []);
  assert.deepEqual(state.wrongByFeature.practice, [first.id, second.id]);
  assert.ok(main.innerHTML.includes(first.question));
  assert.ok(main.innerHTML.includes("1 / 3"));
  assert.equal(saves, 1);
  page.handle(target({ notebookStep: "1" }));
  assert.ok(main.innerHTML.includes("2 / 3"));
  enteredNumber = "3";
  page.handle(target({}, ["data-notebook-jump"]));
  assert.ok(main.innerHTML.includes(second.question));
  assert.ok(main.innerHTML.includes("3 / 3"));
  enteredNumber = "99";
  page.handle(target({}, ["data-notebook-jump"]));
  assert.ok(main.innerHTML.includes("3 / 3"));
  page.handle(target({ notebookStep: "-1" }));
  assert.ok(main.innerHTML.includes("3 / 3"));
  page.handle(target({ notebookStep: "0" }));
  assert.ok(main.innerHTML.includes("정답!"));
  assert.ok(focusCount >= 4);
  page.handle(target({}, ["data-notebook-list"]));
  assert.ok(main.innerHTML.includes("오답 2문제 차례로 풀기"));
});
test("새 문제의 포커스는 번호판 대신 문제 영역으로 복구한다", () => {
  const events = [];
  const question = {
    setAttribute: (...args) => events.push(["attribute", ...args]),
    focus: (options) => events.push(["focus", options]),
    scrollIntoView: (options) => events.push(["scroll", options]),
  };
  UI.focusQuestion({
    querySelector: (selector) => {
      assert.ok(selector.includes(".question-box"));
      return question;
    },
  });
  assert.deepEqual(events[1], ["focus", { preventScroll: true }]);
  assert.equal(events[2][1].block, "start");
});
