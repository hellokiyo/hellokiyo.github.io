/* 배포 전 로컬 무결성 검사. Git·네트워크·배포 작업은 하지 않습니다. */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const failures = [];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const assets = [...html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g)].map((m) => m[1]);
const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
for (const file of assets) {
  if (!fs.existsSync(path.join(root, file))) failures.push("누락: " + file);
  if (!worker.includes(file)) failures.push("오프라인 목록 누락: " + file);
}
// 하위 모듈도 검사해야 폴더 재배치 이후 구문 검사가 조용히 누락되지 않습니다.
function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}
for (const file of filesUnder(path.join(root, "assets/network"))) {
  if (file.endsWith(".js")) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) failures.push(path.relative(root, file) + ": " + result.stderr);
  }
  if (file.endsWith(".css")) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (/^(?:data:|https?:|#)/.test(match[1])) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), match[1])))
        failures.push("CSS 참조 누락: " + path.relative(root, file) + " → " + match[1]);
    }
  }
}
// 워커의 문서·아이콘을 포함해 설치 시 addAll을 실패시킬 누락 경로를 점검합니다.
for (const match of worker.matchAll(
  /["']((?:assets|materials|docs)\/[^"']+|README\.md|index\.html|manifest\.webmanifest)["']/g,
)) {
  if (!fs.existsSync(path.join(root, match[1]))) failures.push("캐시 파일 누락: " + match[1]);
}
const tests = fs
  .readdirSync(path.join(root, "tests"))
  .filter((f) => /^test-.*\.cjs$/.test(f))
  .map((f) => path.join(root, "tests", f));
const result = spawnSync(process.execPath, ["--test", ...tests], { encoding: "utf8", cwd: root });
process.stdout.write(result.stdout || "");
if (result.status !== 0) failures.push(result.stderr || "테스트 실패");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `정적 참조 ${assets.length}개·전체 JS 구문·테스트 통과. 실제 기기/PWA/공식 정답 대조는 운영 절차서대로 별도 확인하세요.`,
  );
