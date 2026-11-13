const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function setup() {
  const nodes = {};
  const document = { querySelectorAll: () => [], querySelector: () => null };
  const window = {};
  const context = { window, document };
  for (const file of ["study-data.js", "reference-pages.js"]) {
    vm.runInNewContext(fs.readFileSync("assets/network/" + file, "utf8"), context);
  }
  let state = { mastered: [], read: [] };
  const ui = { filter: "전체", query: "", onlyUnlearned: false };
  const main = { innerHTML: "" };
  const page = window.ReferencePages.create({
    D: window.STUDY_DATA,
    getState: () => state,
    getUI: () => ui,
    main,
    heading: () => "",
    empty: (title) => title,
    $: (selector) => (nodes[selector] ??= { innerHTML: "" }),
    esc: (value) => String(value),
  });
  return {
    page,
    nodes,
    ui,
    main,
    swap: (next) => {
      state = next;
    },
  };
}

test("분리한 명령어 화면이 새 검색·분류 상태를 매번 읽는다", () => {
  const g = setup();
  g.ui.query = "ipconfig";
  g.page.commands();
  assert.match(g.nodes["#command-results"].innerHTML, /5개 명령/);
  g.ui.filter = "Linux";
  g.page.commandResults();
  assert.match(g.nodes["#command-results"].innerHTML, /0개 명령/);
});

test("키워드·이론 화면은 가져오기로 교체한 상태를 참조한다", () => {
  const g = setup();
  g.ui.onlyUnlearned = true;
  g.page.keywords();
  assert.match(g.nodes["#keyword-results"].innerHTML, /54개 카드/);
  g.swap({ mastered: ["k0"], read: ["0"] });
  g.page.keywords();
  assert.match(g.nodes["#keyword-results"].innerHTML, /53개 카드/);
  g.page.theory("0");
  assert.match(g.main.innerHTML, /읽기 완료 · 해제/);
});
