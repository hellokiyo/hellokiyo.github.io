/* 조사 JSON을 공개 출처 인덱스로 생성. 문항/정답을 생성하거나 외부에 접속하지 않습니다. */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const source = JSON.parse(
  fs.readFileSync(path.join(root, "docs/research/paper-inventory-2022-2026.json"), "utf8"),
);
const catalog = require(path.join(root, "assets/network/data/exam-catalog.js"));
const ids = new Set(catalog.exams.map((exam) => exam.id));
const seen = new Set();
function url(value) {
  if (new URL(value).protocol !== "https:") throw new Error("HTTPS 출처가 아닙니다.");
  return value;
}
const records = source.records.map((row) => {
  if (!ids.has(row.certificationId) || !/^202[2-6]-\d{2}-\d{2}$/.test(row.examDate))
    throw new Error("종목/날짜 확인 필요");
  const key = `${row.certificationId}/${row.examDate}/${row.round}`;
  if (seen.has(key)) throw new Error("중복 회차: " + key);
  seen.add(key);
  return {
    certificationId: row.certificationId,
    examDate: row.examDate,
    round: row.round,
    sourceUrl: url(row.sourceUrl),
    sourceKind: row.sourceKind,
    verification: row.verification,
    reconstructionPending: !!row.reconstructionPending,
    standardGroup: row.standardGroup,
  };
});
const result = {
  checkedAt: source.checkedAt,
  records,
  exams: source.exams.map((exam) => ({
    certificationId: exam.certificationId,
    revision: { ...exam.revision, sourceUrl: url(exam.revision.sourceUrl) },
  })),
  answerOnly: source.answerOnly.map((row) => ({ ...row, sourceUrl: url(row.sourceUrl) })),
  publisherCollections: source.publisherCollections.map((row) => ({
    certificationId: row.certificationId,
    year: row.year,
    rounds: row.rounds,
    sourceUrl: url(row.sourceUrl),
  })),
};
fs.writeFileSync(
  path.join(root, "assets/network/data/exam-paper-sources.js"),
  "/* 생성 파일. scripts/build-exam-paper-sources.cjs 사용. 문항 데이터가 아닌 출처 목록입니다. */\nwindow.EXAM_PAPER_SOURCES = " +
    JSON.stringify(result, null, 2) +
    ";\n",
);
console.log(`시험 ${result.exams.length}개 · 회차 출처 ${records.length}건 생성`);
