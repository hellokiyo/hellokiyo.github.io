/* VM 테스트에서 브라우저 모듈의 실제 경로를 찾습니다. 중복 이름은 조용히 선택하지 않습니다. */
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
