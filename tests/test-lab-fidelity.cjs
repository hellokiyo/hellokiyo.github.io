const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm");
const E = require("../assets/network/domain/practical-lab.js"),
  UI = require("../assets/network/ui/page-ui.js"),
  Win = require("../assets/network/ui/lab-windows.js");
test("IOS 축약·모드·오타·미완성·모호한 명령과 미구현을 구별한다", () => {
  let state = E.initial();
  assert.equal(E.run(state, "conf t").errorKind, "invalid");
  state = E.run(state, "en").state;
  assert.equal(E.run(state, "conf").errorKind, "incomplete");
  assert.equal(E.run(state, "c").errorKind, "ambiguous");
  state = E.run(state, "conf t").state;
  assert.equal(E.run(state, "i").errorKind, "ambiguous");
  assert.ok(E.run(state, "hosname Wrong").output.includes("^"));
  state = E.run(state, "int f0/0").state;
  const invalid = E.run(state, "ip add 999.1.1.1 255.255.255.0");
  assert.equal(invalid.errorKind, "invalid-value");
  assert.deepEqual(invalid.state, state);
  state = E.run(state, "ip add 192.168.10.99 255.255.255.0").state;
  assert.equal(state.running.interfaces["FastEthernet0/0"].ip, "192.168.10.99");
  assert.equal(E.inspect(state, {}, {})[1].ok, false); // 잘못된 과제 값도 문법이 유효하면 저장된다.
  state = E.run(state, "no shut").state;
  state = E.run(state, "end").state;
  assert.equal(E.run(state, "sh ip int br").errorKind, null);
  assert.ok(E.run(state, "show ip ?").output.includes("route"));
  assert.equal(E.run(state, "ping 192.168.10.1").errorKind, "unsupported");
  const waiting = E.run(state, "copy run start");
  assert.equal(waiting.state.startup, null);
  assert.ok(waiting.output.includes("Destination filename"));
  state = E.run(waiting.state, "").state;
  assert.deepEqual(state.startup, state.running);
});
test("주소 형식이 맞아도 정적 경로의 호스트 비트가 있으면 변경하지 않는다", () => {
  let state = E.run(E.run(E.initial(), "enable").state, "conf t").state;
  const result = E.run(state, "ip route 192.168.20.1 255.255.255.0 192.168.10.2");
  assert.ok(result.output.includes("Inconsistent"));
  assert.deepEqual(result.state, state);
  state = E.run(state, "ip route 192.168.20.0 255.255.255.0 192.168.10.2").state;
  assert.equal(state.running.routes.length, 1);
  state = E.run(state, "no ip route 192.168.20.0 255.255.255.0 192.168.10.2").state;
  assert.equal(state.running.routes.length, 0);
});
test("드롭은 팔레트 복사·핀 교환·외부/오래된 입력 거부를 상태 불변으로 처리한다", () => {
  const original = { a: ["흰주", "주", ...Array(6).fill("")], b: Array(8).fill("") };
  const result = E.placeWire(original, { color: "흰주", source: { end: "a", pin: 0 } }, "a", 1);
  assert.deepEqual(result.cables.a.slice(0, 2), ["주", "흰주"]);
  assert.deepEqual(original.a.slice(0, 2), ["흰주", "주"]);
  const copied = E.placeWire(original, { color: "파", source: null }, "b", 0);
  assert.equal(copied.cables.b[0], "파");
  assert.equal(original.b[0], "");
  for (const payload of [
    { color: "<script>" },
    { color: "갈", source: { end: "a", pin: 0 } },
    { color: "파", source: { end: "unknown", pin: 0 } },
  ]) {
    const rejected = E.placeWire(original, payload, "a", 2);
    assert.equal(rejected.changed, false);
    assert.deepEqual(rejected.cables, original);
  }
});
test("dragstart→dragover→drop 실제 핸들러는 전용 DataTransfer 형식만 반영한다", () => {
  const window = { LabWindows: Win },
    main = { innerHTML: "" };
  vm.runInNewContext(fs.readFileSync("assets/network/pages/practical-lab-page.js", "utf8"), {
    window,
  });
  const page = window.PracticalLabPage.create({ main, engine: E, esc: UI.escapeHTML });
  page.handleClick({ dataset: { labTab: "cable" } });
  const store = new Map(),
    transfer = {
      get types() {
        return [...store.keys()];
      },
      setData: (key, value) => store.set(key, value),
      getData: (key) => store.get(key),
    };
  const color = { dataset: { labColor: "0" } },
    pin = { dataset: { labPin: "0" }, classList: { add() {}, remove() {} } };
  const source = { closest: (selector) => (selector.includes("color") ? color : null) };
  const destination = { closest: (selector) => (selector.includes("pin") ? pin : null) };
  let cancelled = false;
  page.handleDrag({ type: "dragstart", target: source, dataTransfer: transfer });
  page.handleDrag({
    type: "dragover",
    target: destination,
    dataTransfer: transfer,
    preventDefault() {
      cancelled = true;
    },
  });
  assert.equal(cancelled, true);
  page.handleDrag({
    type: "drop",
    target: destination,
    dataTransfer: transfer,
    preventDefault() {},
  });
  assert.ok(main.innerHTML.includes("A 1번 핀 흰주"));
  const before = main.innerHTML;
  assert.equal(
    page.handleDrag({
      type: "drop",
      target: destination,
      dataTransfer: { types: ["text/plain"] },
      preventDefault() {
        throw Error("must not accept external type");
      },
    }),
    false,
  );
  assert.equal(main.innerHTML, before);
});
test("Windows의 IPv4 초안·상위 적용·취소와 자동 할당을 구분한다", () => {
  const nodes = {},
    main = {
      querySelector: (id) =>
        nodes[id] || (nodes[id] = { value: "", checked: false, textContent: "" }),
    };
  let applied = null;
  const win = Win.create({
    engine: E,
    esc: UI.escapeHTML,
    onApply: (value) => {
      applied = value;
    },
  });
  const click = (action) => win.handleClick({ dataset: { winAction: action } });
  click("properties");
  click("ipv4");
  main.querySelector("#win-ip-manual").checked = true;
  main.querySelector("#win-dns-manual").checked = true;
  const fill = (field, value) =>
    value.split(".").forEach((octet, index) => {
      main.querySelector(`#lab-${field}-${index}`).value = octet;
    });
  fill("ip", "999.1.1.1");
  fill("mask", "255.255.255.0");
  fill("gateway", "192.168.10.1");
  fill("dns", "192.168.10.2");
  const submit = () =>
    win.handleSubmit({ target: { id: "lab-windows-form" }, preventDefault() {} }, main);
  assert.equal(submit(), "error");
  assert.equal(applied, null);
  fill("ip", "192.168.10.10");
  assert.equal(submit(), "render");
  assert.equal(applied, null);
  click("cancel");
  click("properties");
  click("apply");
  assert.equal(applied.ip, "");
  click("ipv4");
  assert.equal(submit(), "render");
  click("apply");
  assert.equal(applied.ip, "192.168.10.10");
  click("ipv4");
  main.querySelector("#win-ip-manual").checked = false;
  main.querySelector("#win-dns-manual").checked = false;
  submit();
  click("apply");
  assert.equal(E.inspect(E.initial(), applied, {})[0].ok, false);
});

test("실습 진단은 실제 값·저장 대기·잘못된 핀과 복귀 대상을 안내한다", () => {
  let state = E.initial();
  const wires = { a: [...E.colors], b: [...E.colors] };
  wires.b[3] = "주";
  const report = E.inspect(state, { ip: "192.168.10.99" }, wires);
  assert.match(report[0].detail, /192.168.10.99/);
  assert.equal(report[0].target, "windows");
  assert.match(report[5].detail, /B 4번/);
  assert.equal(report[5].target, "cable");
  state = E.run(state, "en").state;
  state = E.run(state, "copy run start").state;
  assert.match(E.inspect(state, {}, wires)[4].detail, /Enter/);
  state = E.run(state, "").state;
  const saved = E.inspect(state, {}, wires)[4];
  assert.equal(saved.ok, true);
  assert.equal(saved.detail, "예제 조건과 일치합니다.");
});
