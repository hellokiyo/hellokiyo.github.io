const test = require("node:test"),
  assert = require("node:assert/strict");
const Lock = require("../assets/network/platform/screen-lock.js");
const fs = require("node:fs"),
  vm = require("node:vm");
test("한국 자정 경계와 월·연도·윤년 변경을 날짜 코드에 반영한다", () => {
  const cases = [
    ["2026-11-23T14:59:59Z", "261123"],
    ["2026-11-23T15:00:00Z", "261124"],
    ["2026-12-31T15:00:00Z", "270101"],
    ["2028-02-28T15:00:00Z", "280229"],
    ["2028-02-29T15:00:00Z", "280301"],
  ];
  for (const [stamp, code] of cases) {
    const date = new Date(stamp);
    assert.equal(Lock.dateCode(date), code);
    assert.ok(Lock.matchesCode(code, date));
  }
  assert.equal(Lock.dateCode(new Date("invalid")), "");
  for (const value of [null, 123456, "", "12345", "1234567", "１２３４５６"])
    assert.equal(Lock.matchesCode(value), false);
});
test("열어둔 탭도 한국 자정 타이머 또는 복귀 이벤트에서 다시 잠긴다", () => {
  for (const trigger of ["timer", "focus", "visibilitychange"]) {
    let clock = Date.parse("2026-11-23T14:59:59Z");
    class ClockDate extends Date {
      constructor(value) {
        super(value === undefined ? clock : value);
      }
      static now() {
        return clock;
      }
    }
    let marker = Lock.dateCode(new Date(clock)),
      scheduled;
    const attributes = new Set(),
      events = {};
    const document = {
      readyState: "loading",
      hidden: false,
      documentElement: { setAttribute: (name) => attributes.add(name) },
      addEventListener: (name, fn) => {
        events[name] = fn;
      },
    };
    const window = {
      document,
      sessionStorage: {
        getItem: () => marker,
        removeItem: () => {
          marker = null;
        },
      },
      setTimeout: (callback) => {
        scheduled = callback;
        return 1;
      },
      clearTimeout() {},
      addEventListener: (name, fn) => {
        events[name] = fn;
      },
    };
    vm.runInNewContext(fs.readFileSync("assets/network/platform/screen-lock.js", "utf8"), {
      window,
      Date: ClockDate,
    });
    assert.equal(attributes.has("data-screen-locked"), false);
    clock = Date.parse("2026-11-23T15:00:01Z");
    if (trigger === "timer") scheduled();
    else events[trigger]();
    assert.equal(attributes.has("data-screen-locked"), true);
    assert.equal(marker, null);
  }
});
test("어제 통과·구버전 표시·저장 실패는 통과가 아니며 자정 타이머는 다음 한국 자정이다", () => {
  const before = new Date("2026-11-23T14:59:59Z");
  const after = new Date("2026-11-23T15:00:00Z");
  const storage = { getItem: () => Lock.dateCode(before) };
  assert.equal(Lock.hasPass(storage, before), true);
  assert.equal(Lock.hasPass(storage, after), false);
  assert.equal(Lock.hasPass({ getItem: () => "true" }, before), false);
  assert.equal(
    Lock.hasPass(
      {
        getItem() {
          throw Error("blocked");
        },
      },
      before,
    ),
    false,
  );
  assert.equal(Lock.untilMidnight(before), 1000);
  assert.equal(Lock.untilMidnight(after), 86400000);
});
