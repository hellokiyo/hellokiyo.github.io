/* 시험별 외부 기출 출처 화면. 기록/채점은 소유하지 않으며 원문을 자동 다운로드하지 않습니다.
   mount/unmount로 필터 리스너를 해제하고 시험 전환 시 다른 종목의 출처를 섞지 않습니다. */
(function (root) {
  "use strict";
  let dispose = null;
  const groups = {
    "before-current-boundary": "개정 전",
    "on-or-after-current-boundary": "개정 이후 후보",
    "before-announced-next-boundary": "다음 개정 이전",
    "revision-unconfirmed": "개정 경계 미확인",
  };
  function select(data, examId, year = "all", group = "all") {
    return data.records
      .filter(
        (row) =>
          row.certificationId === examId &&
          (year === "all" ||
            (year === "recent"
              ? Number(row.examDate.slice(0, 4)) >= 2024
              : row.examDate.startsWith(year + "-"))) &&
          (group === "all" || row.standardGroup === group),
      )
      .slice()
      .sort((a, b) => b.examDate.localeCompare(a.examDate));
  }
  function unmount() {
    dispose?.();
    dispose = null;
  }
  function mount({ main, exam }) {
    unmount();
    const data = root.EXAM_PAPER_SOURCES;
    const esc = root.PageUI.escapeHTML;
    const metadata = data.exams.find((item) => item.certificationId === exam.id);
    const revision = metadata?.revision;
    const all = select(data, exam.id);
    const yearOptions = ["2026", "2025", "2024", "2023", "2022"];
    const extras = [
      ...data.answerOnly
        .filter((item) => item.certificationId === exam.id)
        .map((item) => ({
          label: `${item.year}년 ${item.round}회 · 답안 게시 목록`,
          href: item.sourceUrl,
          note: "답안 목록 확인 · 시험지 전체 확보 아님",
        })),
      ...data.publisherCollections
        .filter((item) => item.certificationId === exam.id)
        .map((item) => ({
          label: `${item.year}년${item.rounds ? " " + item.rounds.join("·") + "회" : " 연도 묶음"} · 출판사 자료`,
          href: item.sourceUrl,
          note: "출판사 게시 목록 · 원문/정답/이용 조건 미검수",
        })),
    ];
    main.innerHTML = `<div class="page-heading"><div><h1>기출 자료</h1><p>${esc(exam.name)} · 최근 3~5개년 출처</p></div></div><section class="panel source-intro"><span class="label-tag">${all.length}회차 출처 · ${esc(data.checkedAt)} 확인 기준</span><h2>회차를 고르고 원문을 확인하세요</h2><p>아래 링크는 외부 자료실로 연결됩니다. 문제를 가져오거나 채점하는 버튼은 아니에요.</p>${exam.ready ? '<a class="button primary" href="#quiz">사이트에 수록된 문제 풀기 →</a>' : '<p class="inline-note">실제 회차 기출은 별도 준비 중이에요. 자체 제작 기초 문제는 지금 풀 수 있어요.</p><a class="button primary" href="#quiz">자체 기초 문제 풀기 →</a>'}<details><summary>개정 기준과 확인 범위</summary><p>${esc(revision?.note || "개정 경계를 확인하고 있어요.")}</p>${revision ? `<a class="text-button" href="${esc(revision.sourceUrl)}" target="_blank" rel="noopener">공식 안내·기준 확인 ↗</a>` : ""}<p class="fine-print">날짜 분류는 문항별 최신 범위 적합성이나 최종 정답 검수를 뜻하지 않습니다.</p></details></section><div class="source-filters"><label>연도<select id="source-year"><option value="all">최근 5년 · 전체</option><option value="recent">최근 3년 · 2024~2026</option>${yearOptions.map((year) => `<option value="${year}">${year}년</option>`).join("")}</select></label><label>개정 구분<select id="source-standard"><option value="all">전체 기준</option>${Object.entries(
      groups,
    )
      .map(([value, label]) => `<option value="${value}">${label}</option>`)
      .join(
        "",
      )}</select></label></div><p id="source-count" class="fine-print" role="status"></p><div id="source-rounds"></div>${extras.length ? `<section class="panel"><h2>답안·출판사 자료</h2><p>위 필터와 별도로 모은 전체 연도의 보조 자료예요. 회차 수에 합산하지 않았어요.</p><ul class="source-extras">${extras.map((item) => `<li><a href="${esc(item.href)}" target="_blank" rel="noopener">${esc(item.label)} ↗</a><p class="fine-print">${esc(item.note)}</p></li>`).join("")}</ul></section>` : ""}<a class="text-button" href="#dashboard">공부방 홈으로 →</a>`;
    function renderRows() {
      const rows = select(
        data,
        exam.id,
        main.querySelector("#source-year").value,
        main.querySelector("#source-standard").value,
      );
      main.querySelector("#source-count").textContent = `${rows.length}회차 출처 · 최신순`;
      main.querySelector("#source-rounds").innerHTML = rows.length
        ? rows
            .map((row) => {
              const limited = row.verification === "listing-confirmed-detail-fetch-failed";
              const status = row.reconstructionPending
                ? "복원 중 · 내용 확인 필요"
                : limited
                  ? "목록만 확인 · 상세 접근 미확인"
                  : row.verification === "existing-source-catalog"
                    ? "기존 출처 목록 · 수록 여부 별도"
                    : "게시물 확인 · 원문/정답 검수 전";
              return `<article class="panel source-round"><div><span class="label-tag">${esc(groups[row.standardGroup] || groups["revision-unconfirmed"])}</span><h2>${esc(row.examDate.slice(0, 4))}년 ${esc(row.round)}</h2><p>${esc(row.examDate)} · ${row.sourceKind === "official-past-paper" ? "공식기관 자료" : "CBT 게시자료"}</p><p class="fine-print">${esc(status)}</p></div><a class="button secondary" href="${esc(row.sourceUrl)}" target="_blank" rel="noopener" aria-label="${esc(row.examDate)} ${esc(row.round)} ${limited ? "자료 목록 확인" : "원문 자료실 열기"}">${limited ? "자료 목록 확인" : "원문 자료실 열기"} ↗</a></article>`;
            })
            .join("")
        : all.length
          ? '<section class="empty-state"><h2>이 조건에서 확인한 회차가 없어요</h2><p>연도나 개정 구분을 바꿔 보세요. 출처가 없는 연도에 임의의 문제를 넣지 않았어요.</p></section>'
          : `<section class="empty-state"><h2>${exam.id === "ccna" ? "공식 주제별 학습으로 준비해요" : "아직 회차별 원문을 확보하지 못했어요"}</h2><p>${exam.id === "ccna" ? "실제 시험 덤프는 제공하지 않습니다. 공식 출제범위와 연습 자료를 참고하세요." : "공식 안내와 아래 보조 자료를 확인해 주세요. 다른 시험의 기출로 채우지 않았어요."}</p><a class="button secondary" href="${esc(exam.sourceUrl)}" target="_blank" rel="noopener">공식 자료 확인 ↗</a></section>`;
    }
    function onChange(event) {
      if (["source-year", "source-standard"].includes(event.target.id)) renderRows();
    }
    main.addEventListener("change", onChange);
    dispose = () => main.removeEventListener("change", onChange);
    renderRows();
  }
  const api = { mount, unmount, select };
  root.PaperSourcesPage = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
