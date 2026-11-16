const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("./support/browser-path.cjs");
const catalog = require(path("exam-catalog"));
const workspace = require(path("exam-workspace"));

test("기존 주소는 네트워크로 해석하고 허용된 시험만 선택한다", () => {
  assert.equal(workspace.resolve("").id, "network");
  assert.equal(workspace.resolve("?exam=pc").id, "pc");
  assert.equal(workspace.resolve("?exam=unknown").id, "network");
  const selected = new URL(workspace.entry("pc"), "https://example.com/study/index.html");
  assert.equal(selected.pathname, "/study/index.html");
  assert.equal(selected.searchParams.get("exam"), "pc");
  assert.equal(selected.hash, "#dashboard");
});

test("확장 시험의 문제·정답·저장 왕복과 시험 간 ID 분리", () => {
  const practice = require("../assets/network/data/exam-practice.js");
  const core = require(path("core"));
  const ids = new Set();
  assert.equal(practice.get(catalog.exams[0]), null);
  for (const exam of catalog.exams.slice(1)) {
    const { data, questions } = practice.get(exam);
    assert.ok(questions.length >= 20);
    assert.equal(data.keywords.length, questions.length);
    for (const [i, q] of questions.entries()) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.equal(q.options[q.answer], data.keywords[i].answer);
      assert.ok(q.explanation.length > 10);
      assert.equal(q.sourceKind, "self-authored");
    }
    const state = core.cleanState(
      { mastered: [data.keywords[0].id, "k-unknown"], wrong: [questions[0].id, "q-unknown"] },
      data,
      questions,
    );
    assert.deepEqual(state.mastered, [data.keywords[0].id]);
    assert.deepEqual(state.wrong, [questions[0].id]);
    assert.deepEqual(
      core.cleanState(JSON.parse(JSON.stringify(state)), data, questions).wrong,
      state.wrong,
    );
  }
});

test("시험 ID는 중복 없이 왕복하고 검색은 분야와 별칭을 함께 적용한다", () => {
  assert.equal(catalog.exams.length, 17);
  assert.equal(new Set(catalog.exams.map((exam) => exam.id)).size, 17);
  for (const exam of catalog.exams) {
    const url = new URL(workspace.entry(exam.id), "https://example.com/study/");
    assert.equal(workspace.resolve(url.search).id, exam.id);
    assert.equal(new URL(exam.sourceUrl).protocol, "https:");
  }
  assert.deepEqual(
    catalog.filter("전자계산기조직응용기사").map((exam) => exam.id),
    ["computer-systems-engineer"],
  );
  assert.deepEqual(
    catalog.filter("cIsCo").map((exam) => exam.id),
    ["ccna"],
  );
  assert.equal(catalog.filter("리눅스", "공간정보").length, 0);
  assert.equal(catalog.filter("없는시험").length, 0);
  assert.equal(catalog.exams.filter((exam) => exam.ready).length, 1);
});
