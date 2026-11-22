const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm");
const E = require("../assets/network/domain/practical-lab.js"),
  D = require("../assets/network/data/practical-study.js"),
  C = require("../assets/network/domain/core.js"),
  UI = require("../assets/network/ui/page-ui.js");
const commands = [
  "enable",
  "configure terminal",
  "interface FastEthernet0/0",
  "ip address 192.168.10.1 255.255.255.0",
  "no shutdown",
  "end",
  "configure terminal",
  "ip route 192.168.20.0 255.255.255.0 192.168.10.2",
  "end",
];
test("가상 라우터의 모드·입력 오류·조회는 원본 상태를 변형하지 않는다", () => {
  const initial = E.initial();
  assert.deepEqual(E.run(initial, "configure terminal").state, initial);
  assert.deepEqual(E.run(initial, "end").state, initial);
  let state = commands.slice(0, 3).reduce((s, c) => E.run(s, c).state, initial);
  assert.equal(initial.mode, "user");
  assert.equal(state.mode, "interface");
  for (const command of [
    "ip address 999.1.1.1 255.255.255.0",
    "ip address 10.0.0.1 255.0.255.0",
    "<script>alert(1)</script>",
    "rm -rf /",
  ])
    assert.deepEqual(E.run(state, command).state, state);
  assert.equal(E.validMask("255.255.255.0"), true);
  assert.equal(E.validMask("255.0.255.0"), false);
});
test("현재·저장 구성과 가상 재시작을 구분하고 여섯 과제 조건을 검사한다", () => {
  let state = commands.reduce((s, c) => E.run(s, c).state, E.initial());
  const windows = {
    ip: "192.168.10.10",
    mask: "255.255.255.0",
    gateway: "192.168.10.1",
    dns: "192.168.10.2",
  };
  const cables = { a: [...E.colors], b: [...E.colors] };
  assert.equal(E.inspect(state, windows, cables).filter((r) => r.ok).length, 5);
  const before = JSON.stringify(state);
  assert.ok(E.run(state, "show ip interface brief").output.includes("192.168.10.1"));
  assert.equal(JSON.stringify(state), before);
  state = E.run(state, "write memory").state;
  assert.equal(E.inspect(state, windows, cables).filter((r) => r.ok).length, 6);
  state = E.run(state, "configure terminal").state;
  state = E.run(state, "hostname Changed").state;
  state = E.run(state, "end").state;
  assert.equal(E.inspect(state, windows, cables)[4].ok, false);
  state = E.run(state, "reload").state;
  assert.equal(state.running.hostname, "Router");
  assert.equal(state.mode, "user");
  assert.equal(E.inspect(state, windows, cables).filter((r) => r.ok).length, 6);
  const lost = E.run(
    E.run(E.run(E.initial(), "enable").state, "configure terminal").state,
    "hostname Unsaved",
  ).state;
  assert.equal(E.run(E.run(lost, "end").state, "reload").state.running.hostname, "Router");
  cables.b[0] = "갈";
  assert.equal(E.inspect(state, windows, cables)[5].ok, false);
});
test("실험실 UI는 적용 전후 값을 구분하고 입력을 이스케이프하며 초기화는 장비만 지운다", () => {
  const window = {},
    nodes = {};
  const node = (id) => nodes[id] || (nodes[id] = { value: "", textContent: "", focus() {} });
  const main = { innerHTML: "", querySelector: node };
  vm.runInNewContext(
    fs.readFileSync("assets/network/ui/lab-windows.js", "utf8") +
      "\n" +
      fs.readFileSync("assets/network/pages/practical-lab-page.js", "utf8"),
    {
      window,
    },
  );
  const page = window.PracticalLabPage.create({ main, engine: E, esc: UI.escapeHTML });
  const click = (id, dataset = {}) => page.handleClick({ id, dataset });
  const submit = (id) => page.handleSubmit({ target: { id }, preventDefault() {} });
  page.render();
  click("", { winAction: "properties" });
  click("", { winAction: "ipv4" });
  node("#win-ip-manual").checked = true;
  node("#win-dns-manual").checked = true;
  for (const [field, value] of Object.entries({
    ip: "192.168.10.10",
    mask: "255.255.255.0",
    gateway: "192.168.10.1",
    dns: "192.168.10.2",
  }))
    value.split(".").forEach((octet, index) => {
      node(`#lab-${field}-${index}`).value = octet;
    });
  click("lab-test");
  assert.ok(main.innerHTML.includes("0 / 6"));
  submit("lab-windows-form");
  click("", { winAction: "apply" });
  click("lab-test");
  assert.ok(main.innerHTML.includes("1 / 6"));
  click("", { labTab: "router" });
  node("#lab-command").value = "<img src=x onerror=alert(1)>";
  submit("lab-router-form");
  assert.ok(main.innerHTML.includes("&lt;img"));
  assert.ok(!main.innerHTML.includes("<img src=x"));
  click("lab-reset");
  click("lab-test");
  assert.ok(main.innerHTML.includes("0 / 6"));
});
test("실기 완료·응시일은 백업에서 정제되고 다른 시험의 필드로 섞이지 않는다", () => {
  const base = { keywords: [], sections: [], plan: [] };
  const state = C.cleanState(
    {
      practicalStudy: { examDate: "2026-12-19", completed: ["router-ip", "router-ip", "unknown"] },
    },
    base,
    [],
  );
  assert.deepEqual(Array.from(state.practicalStudy.completed), ["router-ip"]);
  assert.deepEqual(
    C.cleanState(JSON.parse(JSON.stringify(state)), base, []).practicalStudy,
    state.practicalStudy,
  );
  assert.equal(
    C.cleanState(state, { ...base, certificationId: "pc" }, []).practicalStudy,
    undefined,
  );
  assert.equal(D.clean({ examDate: "2026-02-30" }).examDate, D.examDate);
  assert.deepEqual(D.clean(null).completed, []);
});
test("따라하기는 올바른 명령을 입력해야 진행되고 마지막 단계에서만 완료한다", () => {
  const window = {},
    nodes = {},
    state = { practicalStudy: D.clean() };
  const node = (id) =>
    nodes[id] || (nodes[id] = { value: "", textContent: "", disabled: true, focus() {} });
  const main = { innerHTML: "", querySelector: node };
  let saves = 0;
  vm.runInNewContext(fs.readFileSync("assets/network/pages/practical-page.js", "utf8"), { window });
  const page = window.PracticalPage.create({
    data: D,
    main,
    getState: () => state,
    persist() {
      saves++;
    },
    esc: UI.escapeHTML,
    C,
  });
  page.handleClick({ dataset: { practicalTask: "router-ip" } });
  page.handleClick({ dataset: { practicalStep: "1" } });
  assert.ok(main.innerHTML.includes("1 / 8"));
  page.handleClick({ id: "practical-complete", dataset: {} });
  assert.equal(saves, 0);
  const task = D.tasks.find((t) => t.id === "router-ip");
  task.steps.forEach((step, index) => {
    node("#practical-command").value = step.command;
    page.handleSubmit({ target: { id: "practical-command-form" }, preventDefault() {} });
    assert.ok(node("#practical-feedback").textContent.includes("✓"));
    if (index < task.steps.length - 1)
      page.handleClick({ dataset: { practicalStep: String(index + 1) } });
  });
  page.handleClick({ id: "practical-complete", dataset: {} });
  assert.deepEqual(Array.from(state.practicalStudy.completed), ["router-ip"]);
  assert.equal(saves, 1);
});
