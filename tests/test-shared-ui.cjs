const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const UI = require("../assets/network/ui/page-ui.js");
test("공통 HTML 출력은 특수 문자와 빈 입력을 안전하게 처리한다", () => {
  assert.equal(
    UI.escapeHTML("<img onerror=\"x\"> & 'test'"),
    "&lt;img onerror=&quot;x&quot;&gt; &amp; &#39;test&#39;",
  );
  assert.equal(UI.escapeHTML(null), "");
  assert.equal(UI.escapeHTML(0), "0");
  assert.match(UI.heading("CORE CONCEPTS", "fallback", "description"), /핵심정리/);
  assert.match(UI.empty("비어 있음", "설명"), /비어 있음/);
});
test("이동한 PWA 스크립트가 루트/하위 호스팅에서 같은 범위의 워커를 등록한다", () => {
  const source = fs.readFileSync("assets/network/platform/pwa.js", "utf8");
  const relative = source.match(/register\(new URL\("([^"]+)"/)[1];
  for (const base of ["https://example.com/", "https://example.com/study/"]) {
    assert.equal(new URL(relative, base + "assets/network/platform/pwa.js").href, base + "sw.js");
  }
});
