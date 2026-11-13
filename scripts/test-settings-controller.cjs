const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm");
function setup() {
  const nodes = {},
    node = (s) =>
      (nodes[s] ??= {
        value: "",
        textContent: "",
        listeners: {},
        showModal() {
          this.open = true;
        },
        close() {
          this.open = false;
        },
        addEventListener(k, fn) {
          this.listeners[k] = fn;
        },
      });
  let state = { examDate: "2026-11-14", adaptive: {} },
    game = null,
    saves = 0;
  const window = {
    KeywordGame: {
      importProgress: (p) => {
        game = p;
        return true;
      },
    },
  };
  vm.runInNewContext(fs.readFileSync("assets/network/settings-controller.js", "utf8"), { window });
  const api = window.SettingsController.create({
    C: { cleanState: (raw) => ({ examDate: raw.examDate, adaptive: {} }) },
    D: {},
    Q: [],
    R: { reschedule() {} },
    $: node,
    getState: () => state,
    setState: (s) => {
      state = s;
    },
    getView: () => "commands",
    persist: () => saves++,
    route() {},
    toast() {},
    onReset() {},
  });
  return {
    api,
    node,
    get state() {
      return state;
    },
    get game() {
      return game;
    },
    get saves() {
      return saves;
    },
  };
}
test("가져오기는 확인 전 상태를 바꾸지 않고 확인 후 게임/학습 기록을 연결한다", async () => {
  const g = setup(),
    target = {
      files: [
        {
          size: 100,
          text: async () =>
            JSON.stringify({
              app: "network-notes",
              version: 1,
              examDate: "2026-12-01",
              gameProgress: { choice: 2500 },
            }),
        },
      ],
      value: "backup.json",
    };
  await g.node("#import-progress").listeners.change({ target });
  assert.equal(g.state.examDate, "2026-11-14");
  assert.equal(g.game, null);
  g.node("#confirm-ok").onclick();
  assert.equal(g.state.examDate, "2026-12-01");
  assert.equal(g.game.choice, 2500);
  assert.equal(g.saves, 1);
  assert.equal(target.value, "");
});
test("잘못된 앱 백업은 가져오기 확인조차 열지 않고 기존 기록을 보존한다", async () => {
  const g = setup();
  await g
    .node("#import-progress")
    .listeners.change({ target: { files: [{ size: 100, text: async () => "{}" }], value: "x" } });
  assert.equal(g.state.examDate, "2026-11-14");
  assert.equal(g.node("#confirm-ok").onclick, undefined);
  assert.equal(g.saves, 0);
});
