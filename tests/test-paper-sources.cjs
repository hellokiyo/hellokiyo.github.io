const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const browserPath = require("./support/browser-path.cjs");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(browserPath("exam-paper-sources"), "utf8"), context);
const data = context.window.EXAM_PAPER_SOURCES;
const page = require(browserPath("paper-sources-page"));

test("종목·연도·개정 필터를 함께 적용하고 최신순으로 정렬한다", () => {
  assert.equal(page.select(data, "pc").length, 20);
  assert.equal(page.select(data, "pc", "recent").length, 12);
  assert.equal(page.select(data, "pc", "all", "on-or-after-current-boundary").length, 6);
  assert.equal(page.select(data, "pc", "2025", "before-current-boundary").length, 2);
  assert.equal(page.select(data, "pc", "2022", "on-or-after-current-boundary").length, 0);
  assert.equal(page.select(data, "unknown").length, 0);
  assert.ok(page.select(data, "pc").every((row) => row.certificationId === "pc"));
  assert.equal(page.select(data, "pc")[0].examDate, "2026-11-01");
});

test("출처74건은 답안/출판사 묶음과 구분하고 채점 데이터로 만들지 않는다", () => {
  assert.equal(data.records.length, 74);
  assert.equal(data.exams.length, 17);
  assert.equal(data.answerOnly.length, 4);
  assert.equal(data.publisherCollections.length, 8);
  assert.equal(
    data.records.filter((row) => row.verification === "listing-confirmed-detail-fetch-failed")
      .length,
    5,
  );
  assert.ok(data.records.every((row) => !("answer" in row) && !("question" in row)));
  assert.equal(page.select(data, "information-processing-industrial").length, 0);
});

test("필터 이벤트는 재마운트·이탈 시 해제하며 학습 저장소에 접근하지 않는다", () => {
  global.EXAM_PAPER_SOURCES = data;
  global.PageUI = require(browserPath("page-ui"));
  const nodes = {
    "#source-year": { value: "all" },
    "#source-standard": { value: "all" },
    "#source-count": {},
    "#source-rounds": {},
  };
  const listeners = new Set();
  const main = {
    innerHTML: "",
    querySelector: (key) => nodes[key],
    addEventListener: (_name, handler) => listeners.add(handler),
    removeEventListener: (_name, handler) => listeners.delete(handler),
  };
  const exam = { id: "pc", name: "PC정비사 2급", ready: false };
  page.mount({ main, exam });
  page.mount({ main, exam });
  assert.equal(listeners.size, 1);
  nodes["#source-year"].value = "2022";
  for (const handler of listeners) handler({ target: { id: "source-year" } });
  assert.match(nodes["#source-count"].textContent, /4회차/);
  assert.match(nodes["#source-rounds"].innerHTML, /상세 접근 미확인/);
  page.unmount();
  page.unmount();
  assert.equal(listeners.size, 0);
  delete global.EXAM_PAPER_SOURCES;
});
