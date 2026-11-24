const test = require("node:test"),
  assert = require("node:assert/strict");
const E = require("../assets/network/domain/practical-lab.js");
const run = (commands, state = E.initial()) =>
  commands.reduce((value, command) => E.run(value, command).state, state);
test("round02 Ethernet 주소·브로드캐스트·겹침·지원 한계", () => {
  const state = run(["en", "conf t", "int f0/0"]);
  for (const ip of ["192.168.10.0", "192.168.10.255", "127.0.0.1", "224.0.0.1"]) {
    const result = E.run(state, `ip address ${ip} 255.255.255.0`);
    assert.equal(result.errorKind, "invalid-value");
    assert.deepEqual(result.state, state);
  }
  assert.equal(E.run(state, "ip address 10.0.0.1 255.255.255.254").errorKind, "unsupported");
  const valid = run(["ip add 192.168.10.1 255.255.255.0", "exit", "int f0/1"], state);
  assert.equal(E.run(valid, "ip add 192.168.10.2 255.255.255.0").errorKind, "invalid-value");
  assert.equal(E.run(valid, "ip add 192.168.20.1 255.255.255.0").errorKind, null);
});

test("round03 경로의 순서 대신 의미로 저장 비교·정확한 경로 삭제", () => {
  let state = run([
    "en",
    "conf t",
    "ip route 10.1.0.0 255.255.0.0 192.168.10.2",
    "ip route 10.2.0.0 255.255.0.0 192.168.10.3",
    "end",
    "wr",
  ]);
  state = run(["conf t", "no ip route 10.1.0.0 255.255.0.0 192.168.10.99"], state);
  assert.equal(state.running.routes.length, 2);
  state = run(
    ["no ip route 10.1.0.0 255.255.0.0 192.168.10.2", "ip route 10.1.0.0 255.255.0.0 192.168.10.2"],
    state,
  );
  assert.equal(E.sameConfig(state.running, state.startup), true);
  state = run(["hostname Changed"], state);
  assert.equal(E.sameConfig(state.running, state.startup), false);
  assert.equal(E.sameConfig(null, state.running), false);
});

test("round04 Windows는 주소 형식과 일반 호스트를 검사하고 취소 후 기존 값을 유지한다", () => {
  const Win = require("../assets/network/ui/lab-windows.js");
  const nodes = {};
  const main = {
    querySelector: (id) =>
      nodes[id] || (nodes[id] = { value: "", checked: false, textContent: "" }),
  };
  let applied = null;
  const win = Win.create({ engine: E, esc: String, onApply: (value) => (applied = value) });
  const click = (action) => win.handleClick({ dataset: { winAction: action } });
  click("properties");
  click("ipv4");
  main.querySelector("#win-ip-manual").checked = true;
  const fill = (name, value) =>
    value
      .split(".")
      .forEach((part, index) => (main.querySelector(`#lab-${name}-${index}`).value = part));
  fill("ip", "192.168.10.255");
  fill("mask", "255.255.255.0");
  const submit = () =>
    win.handleSubmit({ target: { id: "lab-windows-form" }, preventDefault() {} }, main);
  assert.equal(submit(), "error");
  assert.equal(applied, null);
  fill("ip", "192.168.10.10");
  assert.equal(submit(), "render");
  click("apply");
  assert.equal(applied.ip, "192.168.10.10");
  click("ipv4");
  fill("ip", "192.168.10.20");
  submit();
  click("cancel");
  click("properties");
  click("apply");
  assert.equal(applied.ip, "192.168.10.10");
});

test("round05 따라하기 재입력 오답은 이전 통과를 취소한다", () => {
  const fs = require("node:fs"),
    vm = require("node:vm"),
    D = require("../assets/network/data/practical-study.js");
  const window = {},
    nodes = {};
  const main = {
    innerHTML: "",
    querySelector: (id) =>
      nodes[id] || (nodes[id] = { value: "", textContent: "", disabled: true, focus() {} }),
  };
  vm.runInNewContext(fs.readFileSync("assets/network/pages/practical-page.js", "utf8"), { window });
  const page = window.PracticalPage.create({
    data: D,
    main,
    getState: () => ({}),
    persist() {},
    esc: String,
    C: {},
  });
  page.handleClick({ dataset: { practicalTask: "router-ip" } });
  const submit = (value) => {
    main.querySelector("#practical-command").value = value;
    page.handleSubmit({ target: { id: "practical-command-form" }, preventDefault() {} });
  };
  submit("en");
  assert.equal(main.querySelector("#practical-next, #practical-complete").disabled, false);
  submit("end");
  assert.equal(main.querySelector("#practical-next, #practical-complete").disabled, true);
  page.handleClick({ dataset: { practicalStep: "1" } });
  assert.match(main.innerHTML, /1 \/ 8/);
  assert.equal(
    D.commandMatches("int f0/0", D.tasks.find((t) => t.id === "router-ip").steps[2]),
    true,
  );
});

test("round06 직결 A-A/B-B와 교차 A-B/B-A를 구별한다", () => {
  for (const pattern of [
    [E.colors, E.colors],
    [E.colorsA, E.colorsA],
  ]) {
    assert.equal(E.cableCheck({ a: pattern[0], b: pattern[1] }, "straight"), true);
    assert.equal(E.cableCheck({ a: pattern[0], b: pattern[1] }, "cross"), false);
  }
  for (const pattern of [
    [E.colors, E.colorsA],
    [E.colorsA, E.colors],
  ])
    assert.equal(E.cableCheck({ a: pattern[0], b: pattern[1] }, "cross"), true);
  assert.equal(E.cableCheck({ a: [], b: [] }, "cross"), false);
});

test("round07 응시일 변경과 연도 경계에 맞춰 로드맵을 계산한다", () => {
  const D = require("../assets/network/data/practical-study.js");
  const original = JSON.stringify(D.roadmap);
  assert.equal(D.roadmapFor("2026-12-19")[0].from, "2026-11-23");
  const phases = D.roadmapFor("2027-01-10");
  assert.equal(phases[0].from, "2026-12-15");
  assert.equal(phases[3].to, "2027-01-09");
  assert.equal(D.roadmapFor("2026-02-30")[0].from, "2026-11-23");
  assert.equal(JSON.stringify(D.roadmap), original);
});

test("round08 NOS는 DNS 레코드·DHCP 옵션·IIS 바인딩 칸을 혼동하면 통과하지 않는다", () => {
  const D = require("../assets/network/data/practical-study.js");
  const get = (id) => D.tasks.find((task) => task.id === id).steps.at(-1).fields;
  const dns = get("dns");
  assert.equal(D.fieldMatches("a", dns[2]), true);
  assert.equal(D.fieldMatches("CNAME", dns[2]), false);
  const dhcp = get("dhcp");
  assert.equal(D.fieldMatches("192.168.10.2", dhcp[3]), false);
  assert.equal(D.fieldMatches("192.168.10.1", dhcp[3]), true);
  const iis = get("iis");
  assert.equal(D.fieldMatches("HTTP", iis[1]), true);
  assert.equal(D.fieldMatches("https://www.lab.example", iis[3]), false);
});

test("round09 단답은 네트워크/브로드캐스트/호스트와 대소문자를 구별한다", () => {
  const D = require("../assets/network/data/practical-study.js"),
    task = D.tasks.find((task) => task.id === "short-answer");
  const fields = task.steps.map((step) => step.fields[0]);
  assert.equal(D.fieldMatches("192.168.10.64", fields[0]), true);
  assert.equal(D.fieldMatches("192.168.10.70", fields[0]), false);
  assert.equal(D.fieldMatches("192.168.10.127", fields[1]), true);
  assert.equal(D.fieldMatches("62", fields[2]), true);
  assert.equal(D.fieldMatches("PWD", fields[3]), false);
  assert.equal(D.fieldMatches(" chmod   640 report.txt ", fields[4]), true);
  assert.equal(D.fieldMatches("chmod 644 report.txt", fields[4]), false);
});

test("round10 혼합 과제 수행·저장 누락·교차 선택·불완전 입력을 재검증한다", () => {
  const windows = {
    ip: "192.168.10.10",
    mask: "255.255.255.0",
    gateway: "192.168.10.1",
    dns: "192.168.10.2",
    ipMode: "manual",
    dnsMode: "manual",
  };
  const cables = { a: [...E.colors], b: [...E.colorsA] };
  let state = run([
    "en",
    "conf t",
    "int f0/0",
    "ip add 192.168.10.1 255.255.255.0",
    "no shut",
    "exit",
    "ip route 192.168.20.0 255.255.255.0 192.168.10.2",
    "end",
  ]);
  assert.equal(E.inspect(state, windows, cables, "cross").filter((item) => item.ok).length, 5);
  state = run(["copy run start", ""], state);
  assert.equal(E.inspect(state, windows, cables, "cross").filter((item) => item.ok).length, 6);
  assert.equal(E.inspect(state, windows, cables, "straight").filter((item) => item.ok).length, 5);
  state = run(["conf t", "int f0/0", "shutdown", "end"], state);
  assert.equal(E.inspect(state, windows, cables, "cross").filter((item) => item.ok).length, 4);
  assert.doesNotThrow(() => E.inspect(E.initial(), {}, {}));
});

test("epoch09 show users는 원격 접속을 꾸며내지 않고 조회만 한다", () => {
  const state = run(["en"]);
  const result = E.run(state, "sh users");
  assert.equal(result.errorKind, null);
  assert.match(result.output, /con 0/);
  assert.match(result.output, /학습 모형/);
  assert.deepEqual(result.state, state);
});

test("epoch10 직렬 보조 주소를 조회·저장·재시작 후 보존한다", () => {
  let state = run([
    "en",
    "conf t",
    "int s2/0",
    "ip add 192.0.2.81 255.255.255.0",
    "ip add 192.0.2.82 255.255.255.0 secondary",
    "no shut",
    "end",
  ]);
  assert.equal(state.running.interfaces["Serial2/0"].ip, "192.0.2.81");
  assert.equal(state.running.interfaces["Serial2/0"].secondary[0].ip, "192.0.2.82");
  assert.match(E.run(state, "sh run").output, /192.0.2.82 255.255.255.0 secondary/);
  state = run(["copy run start", "", "reload"], state);
  assert.equal(state.running.interfaces["Serial2/0"].secondary.length, 1);
});

test("epoch11 VTY login과 저장을 별도 상태로 검사하고 실제 연결은 하지 않는다", () => {
  let state = run([
    "en",
    "conf t",
    "line vty 0 4",
    "password PracticeOnly",
    "exit",
    "end",
    "copy run start",
    "",
  ]);
  assert.equal(state.running.lines["0 4"].login, false);
  state = run(["conf t", "line vty 0 4", "login", "end"], state);
  assert.equal(E.sameConfig(state.running, state.startup), false);
  assert.match(E.run(state, "show run").output, /line vty 0 4/);
  assert.doesNotMatch(E.run(state, "show run").output, /PracticeOnly/);
  state = run(["copy run start", "", "reload"], state);
  assert.equal(state.running.lines["0 4"].login, true);
});

test("후속 회차 DHCP 풀의 모드·이름·네트워크·저장과 삭제를 구별한다", () => {
  let state = run(["en", "conf t", "ip dhcp pool PracticePool"]);
  assert.equal(E.prompt(state), "Router(dhcp-config)#");
  const bad = E.run(state, "network 192.0.2.65 255.255.255.192");
  assert.equal(bad.errorKind, "invalid-value");
  assert.deepEqual(bad.state, state);
  state = run(
    ["network 192.0.2.64 255.255.255.192", "default-router 192.0.2.65", "dns-server 192.0.2.66"],
    state,
  );
  assert.match(E.run(state, "do show run").output, /ip dhcp pool PracticePool/);
  assert.equal(E.run(state, "do show run").state.mode, "dhcp");
  state = run(["exit"], state);
  assert.equal(state.mode, "config");
  state = run(["end", "copy run start", "", "reload"], state);
  assert.equal(state.running.dhcpPools.PracticePool.network, "192.0.2.64");
  assert.equal(state.running.dhcpPools.PracticePool.router, "192.0.2.65");
  state = run(["en", "conf t", "ip dhcp pool practicepool", "end"], state);
  assert.equal(Object.keys(state.running.dhcpPools).length, 2);
  assert.equal(E.sameConfig(state.running, state.startup), false);
  state = run(["conf t", "no ip dhcp pool practicepool", "end"], state);
  assert.equal(E.sameConfig(state.running, state.startup), true);
  assert.equal(
    E.run(run(["conf t"], state), "network 192.0.2.0 255.255.255.0").errorKind,
    "invalid",
  );
});
