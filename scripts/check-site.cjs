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
for (const file of fs
  .readdirSync(path.join(root, "assets/network"))
  .filter((f) => f.endsWith(".js"))) {
  const result = spawnSync(process.execPath, ["--check", path.join(root, "assets/network", file)], {
    encoding: "utf8",
  });
  if (result.status !== 0) failures.push(file + ": " + result.stderr);
}
const tests = fs
  .readdirSync(path.join(root, "scripts"))
  .filter((f) => /^test-.*\.cjs$/.test(f))
  .map((f) => path.join(root, "scripts", f));
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
