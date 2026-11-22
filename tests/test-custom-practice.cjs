const test = require("node:test"),
  assert = require("node:assert/strict");
const C = require("../assets/network/domain/core.js");
const P = require("../assets/network/data/exam-practice.js");
const pack = P.get({ id: "pc", name: "PC정비사 2급" });
const own = pack.questions;
const past = {
  ...own[0],
  id: "nw2-2026-01-01",
  paperId: "nw2-2026-01",
  question: "기출용 검증 문항",
};
const all = [...own, past];
test("맞춤 연습은 단원·출처·검색·북마크 조건을 교집합으로 적용한다", () => {
  const first = own[0];
  const state = { bookmarks: [first.id, past.id], adaptive: { entries: {} }, wrong: [] };
  const result = C.selectPractice(all, state, {
    source: "own",
    status: "bookmarked",
    category: first.category,
    query: first.question,
    count: 20,
    shuffle: false,
  });
  assert.equal(result.available, 1);
  assert.deepEqual(result.ids, [first.id]);
  assert.deepEqual(
    C.selectPractice(all, state, { source: "past", status: "bookmarked", shuffle: false }).ids,
    [past.id],
  );
  assert.deepEqual(C.selectPractice(all, { bookmarks: [] }, { status: "bookmarked" }).ids, []);
});
test("미학습 필터는 채점 이력을 사용하고 요구수보다 적은 풀을 중복 없이 반환한다", () => {
  const state = { adaptive: { entries: { [own[0].id]: { studyCount: 1 } } }, wrong: [own[1].id] };
  const before = JSON.stringify(own);
  const result = C.selectPractice([...own, own[0]], state, {
    status: "unseen",
    count: 50,
    shuffle: false,
  });
  assert.equal(result.ids.length, own.length - 1);
  assert.ok(!result.ids.includes(own[0].id));
  assert.equal(new Set(result.ids).size, result.ids.length);
  assert.equal(JSON.stringify(own), before);
  assert.deepEqual(
    C.selectPractice(own, state, { status: "wrong", count: 5, shuffle: false }).ids,
    [own[1].id],
  );
  assert.equal(C.selectPractice(own, state, { count: 999 }).ids.length, 10);
});
test("북마크·맞춤 연습·같은 문제 반복은 구버전과 백업 왕복에 호환된다", () => {
  const ids = own.slice(0, 5).map((q) => q.id);
  const state = C.cleanState(
    {
      bookmarks: [ids[0], ids[0], "unknown"],
      session: {
        mode: "quick",
        practiceKind: "custom",
        ids,
        answers: { [ids[0]]: 1 },
        checked: [],
        index: 0,
      },
    },
    pack.data,
    own,
  );
  assert.deepEqual(state.bookmarks, [ids[0]]);
  assert.equal(state.session.practiceKind, "custom");
  const restored = C.cleanState(JSON.parse(JSON.stringify(state)), pack.data, own);
  assert.deepEqual(restored.session.ids, ids);
  assert.equal(restored.session.answers[ids[0]], 1);
  assert.equal(restored.session.practiceKind, "custom");
  assert.deepEqual(C.cleanState({}, pack.data, own).bookmarks, []);
  assert.deepEqual(
    C.cleanState(
      state,
      P.get({ id: "ccna", name: "CCNA" }).data,
      P.get({ id: "ccna", name: "CCNA" }).questions,
    ).bookmarks,
    [],
  );
});
