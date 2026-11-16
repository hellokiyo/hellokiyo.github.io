/* 시험 선택용 카탈로그. 문제/개인 취득 상태는 소유하지 않습니다.
   공식 경로와 준비 상태는 docs/research/exam-expansion-2026-11-15.md 기준이며 수록 허가를 뜻하지 않습니다. */
(function (root) {
  "use strict";
  const qnet = "https://www.q-net.or.kr/";
  const icqa = "https://www.icqa.or.kr/cn/board/dataroom";
  const kca = "https://www.cq.or.kr/qh_cusgm10_001.do";
  const definitions = [
    ["network", "네트워크관리사 2급", "네트워크", "https://www.icqa.or.kr/cn/board/dataroom/263"],
    ["pc", "PC정비사 2급", "PC·하드웨어", "https://www.icqa.or.kr/cn/board/dataroom/264"],
    [
      "linux-master-2",
      "리눅스마스터 2급",
      "리눅스·서버",
      "https://ihd.or.kr/guidequestion.do?exam_kind=LMS&pre_exam_kind=LMF&search_flag=1",
      "",
      "1·2차",
    ],
    [
      "information-processing-engineer",
      "정보처리기사",
      "개발",
      "https://www.q-net.or.kr/crf005.do?gId=&id=crf00503&jmCd=1320",
    ],
    [
      "geospatial-convergence-industrial",
      "공간정보융합산업기사",
      "공간정보",
      "https://www.q-net.or.kr/crf005.do?id=crf00503s02&jmCd=2331",
    ],
    [
      "information-equipment-craftsman",
      "정보기기운용기능사",
      "네트워크",
      "https://www.q-net.or.kr/cst006.do?artlSeq=5206296&brdId=Q006&code=1204&gSite=Q&id=cst00602",
    ],
    ["information-security-engineer", "정보보안기사", "보안·포렌식", kca],
    ["digital-forensics-2", "디지털포렌식전문가 2급", "보안·포렌식", "https://forensickorea.org/"],
    ["information-security-industrial", "정보보안산업기사", "보안·포렌식", kca],
    ["network-manager-1", "네트워크관리사 1급", "네트워크", icqa],
    [
      "internet-security-2",
      "인터넷보안전문가 2급",
      "보안·포렌식",
      "https://exam.icqa.or.kr/cn/board/dataroom/262",
    ],
    [
      "computer-systems-engineer",
      "컴퓨터시스템기사",
      "PC·하드웨어",
      qnet,
      "전자계산기조직응용기사 전자계산기기사",
    ],
    ["information-processing-industrial", "정보처리산업기사", "개발", qnet],
    [
      "geospatial-convergence-craftsman",
      "공간정보융합기능사",
      "공간정보",
      "https://www.q-net.or.kr/crf005.do?id=crf00503s02&jmCd=6981&jmInfoDivCcd=B0",
    ],
    [
      "surveying-geospatial-engineer",
      "측량및지형공간정보기사",
      "공간정보",
      "https://www.q-net.or.kr/crf005.do?gId=&id=crf00503&jmCd=1380",
    ],
    [
      "pc-master-kie",
      "PC Master(정비사)",
      "PC·하드웨어",
      "https://kie.or.kr/kiehomepage/fc/licencePCMasterG2?licence=PCMaster",
      "PC마스터 피씨마스터",
      "1·2차",
    ],
    [
      "ccna",
      "CCNA",
      "네트워크",
      "https://learningnetwork.cisco.com/s/ccna-exam-topics",
      "시스코 Cisco",
      "자격시험",
    ],
  ];
  const exams = definitions.map(
    ([id, name, category, sourceUrl, aliases = "", stage = "필기"]) => ({
      id,
      name,
      category,
      sourceUrl,
      aliases,
      stage,
      ready: id === "network", // 실제 회차 기출이 수록된 시험
      learningReady: true,
      status: id === "network" ? "기출 학습 가능" : "기초 연습 가능",
      description:
        id === "network"
          ? "기출 17회차 · 오늘의 학습 · 키워드 복습"
          : "자체 기초 연습 · 해설·오답·키워드·산성비 (실제 기출 별도 준비)",
    }),
  );
  const normalize = (value) => String(value).toLowerCase().replace(/\s+/g, "");
  function filter(query = "", category = "전체") {
    const term = normalize(query);
    return exams.filter(
      (exam) =>
        (category === "전체" || exam.category === category) &&
        normalize(`${exam.name} ${exam.aliases}`).includes(term),
    );
  }
  const api = { exams, categories: [...new Set(exams.map((exam) => exam.category))], filter };
  root.ExamCatalog = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
