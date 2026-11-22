const test = require("node:test");
const assert = require("node:assert/strict");
const Stage = require("../assets/network/platform/study-stage.js");
function fixture(initial, enabled = true, fail = false) {
  const stored = new Map([["network-study-stage:v1", initial]]);
  const links = ["dashboard", "practical", "lab", "quiz", "wrong", "plan", "materials"].map(
    (view) => ({ dataset: { view }, hidden: false }),
  );
  const buttons = ["written", "practical"].map((value) => ({
    dataset: { studyStage: value },
    setAttribute(key, value) {
      this[key] = value;
    },
  }));
  const mobile = { innerHTML: "written navigation" },
    toggle = {},
    crumb = { lastChild: {} },
    guide = {};
  const doc = {
    body: { classList: { toggle() {} } },
    querySelector(selector) {
      return selector === ".mobile-nav"
        ? mobile
        : selector === "#study-stage-switch"
          ? toggle
          : selector === ".breadcrumb"
            ? crumb
            : guide;
    },
    querySelectorAll(selector) {
      return selector === "[data-study-stage]" ? buttons : links;
    },
  };
  const state = Stage.create({
    document: doc,
    enabled,
    storage: {
      getItem: (key) => {
        if (fail) throw Error();
        return stored.get(key);
      },
      setItem: (key, value) => {
        if (fail) throw Error();
        stored.set(key, value);
      },
    },
  });
  return { state, links, buttons, mobile, toggle, stored };
}
test("구분은 직접 링크/뒤로가기 화면을 따르고 홈에서는 마지막 선택을 유지한다", () => {
  const f = fixture("practical");
  f.state.sync("lab");
  assert.equal(f.state.get(), "practical");
  assert.equal(f.links.find((link) => link.dataset.view === "quiz").hidden, true);
  f.state.sync("quiz");
  assert.equal(f.state.get(), "written");
  assert.equal(f.mobile.innerHTML, "written navigation");
  assert.equal(f.links.find((link) => link.dataset.view === "lab").hidden, true);
  f.state.sync("dashboard");
  assert.equal(f.state.get(), "written");
  f.state.select("practical");
  f.state.sync("dashboard");
  assert.match(f.mobile.innerHTML, /#lab/);
  assert.doesNotMatch(f.mobile.innerHTML, /#quiz/);
  assert.equal(f.buttons[1]["aria-pressed"], "true");
  f.state.sync("exams");
  assert.equal(f.toggle.hidden, true);
});
test("저장소 실패·잘못된 값·다른 시험은 학습 기록에 영향을 주지 않는다", () => {
  const f = fixture("invalid", true, true);
  f.state.sync("lab");
  assert.equal(f.state.select("written"), true);
  assert.equal(f.state.get(), "written");
  assert.equal(f.state.select("invalid"), false);
  const other = fixture("practical", false);
  other.state.sync("quiz");
  assert.equal(other.toggle.hidden, true);
  assert.equal(other.state.get(), "written");
  assert.equal(other.state.select("practical"), false);
  assert.equal(other.mobile.innerHTML, "written navigation");
});
