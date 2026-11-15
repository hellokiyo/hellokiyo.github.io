from pathlib import Path
import re
root=Path.cwd()
# Resolve browser fixture files by unique basename instead of duplicating folder layout in VM tests.
(root/'tests/support').mkdir(exist_ok=True)
(root/'tests/support/browser-path.cjs').write_text('''/* VM 테스트에서 브라우저 모듈의 실제 경로를 찾습니다. 중복 이름은 조용히 선택하지 않습니다. */
const fs = require("node:fs");
const path = require("node:path");
const base = path.resolve(__dirname, "../../assets/network");
const paths = new Map();
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (entry.name.endsWith(".js")) {
      if (paths.has(entry.name)) throw new Error("중복 브라우저 모듈: " + entry.name);
      paths.set(entry.name, file);
    }
  }
}
visit(base);
module.exports = (name) => {
  const file = paths.get(name.endsWith(".js") ? name : name + ".js");
  if (!file) throw new Error("브라우저 모듈 누락: " + name);
  return file;
};
''',encoding='utf-8')
for p in (root/'tests').glob('test-*.cjs'):
 s=p.read_text(encoding='utf-8');old=s
 s=re.sub(r'`assets/network/\$\{(file|name|n)\}\.js`',r'browserPath(\1)',s)
 s=s.replace('"assets/network/" + name + ".js"','browserPath(name)').replace('"assets/network/" + file','browserPath(file)').replace("path.join(root,'assets/network',name)",'browserPath(name)')
 if s!=old:s='const browserPath = require("./support/browser-path.cjs");\n'+s
 p.write_text(s,encoding='utf-8')
# Shared view primitives leave app.js responsible for assembly.
p=root/'assets/network/app.js';s=p.read_text(encoding='utf-8')
a=s.index('  const esc =');b=s.index('  let storageOK',a);escape=s[a:b].replace('  const esc =','  const escapeHTML =',1)
a2=s.index('  function heading(');b2=s.index('  // 경로 전환',a2);views=s[a2:b2]
(root/'assets/network/ui/page-ui.js').write_text('''/* 공통 화면 출력: HTML 이스케이프·페이지 제목·빈 상태. 학습 상태/저장소를 소유하지 않습니다.
   heading/empty의 action 인자는 호출부가 만든 HTML만 받습니다. 사용자 문자열은 escapeHTML로 정제합니다. */
(function (root) {
  "use strict";
'''+escape+views+'''  const api = { escapeHTML, heading, empty };
  root.PageUI = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
''',encoding='utf-8')
s=s[:a2]+s[b2:];a=s.index('  const esc =');b=s.index('  let storageOK',a);s=s[:a]+'  const { escapeHTML: esc, heading, empty } = window.PageUI;\n'+s[b:];p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8').replace('  <script defer src="assets/network/app.js">','  <script defer src="assets/network/ui/page-ui.js"></script>\n  <script defer src="assets/network/app.js">').replace('v21','v22');p.write_text(s,encoding='utf-8')
p=root/'sw.js';s=p.read_text(encoding='utf-8').replace('v21','v22').replace("'README.md',","'README.md','docs/study/exam-guide.md',").replace("'assets/network/app.js'","'assets/network/ui/page-ui.js','assets/network/app.js'");p.write_text(s,encoding='utf-8')
